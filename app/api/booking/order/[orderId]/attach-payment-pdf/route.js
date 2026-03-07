import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendOrderWithButtons } from '@/lib/telegram';

const BUCKET = 'payment-pdfs';
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request, { params }) {
  try {
    const orderId = params?.orderId;
    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Файл не выбран' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Файл не более 10 МБ' }, { status: 400 });
    }
    const type = file.type?.toLowerCase() || '';
    if (type !== 'application/pdf' && !file.name?.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Только PDF' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Загрузка не настроена (SUPABASE_SERVICE_ROLE_KEY)' },
        { status: 503 }
      );
    }

    const ext = file.name?.toLowerCase().endsWith('.pdf') ? '.pdf' : '.pdf';
    const path = `order-${orderId}-${Date.now()}${ext}`;
    const buf = await file.arrayBuffer();

    const { data: uploadData, error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(path, buf, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      if (uploadError.message?.includes('Bucket not found')) {
        return NextResponse.json(
          { error: 'Создайте в Supabase Storage бакет «payment-pdfs» (публичный)' },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
    }

    const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(uploadData.path);
    const paymentPdfUrl = urlData.publicUrl;

    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({ payment_pdf_url: paymentPdfUrl, status: 'pending' })
      .eq('id', orderId)
      .select('id, customer_name, customer_phone, total_amount, show_id')
      .single();

    if (updateError || !order) {
      console.error('Order update error:', updateError);
      return NextResponse.json({ error: 'Не удалось сохранить ссылку на PDF' }, { status: 500 });
    }

    const { data: show } = await supabase
      .from('shows')
      .select('id, title, date, time, price')
      .eq('id', order.show_id)
      .single();

    const { data: bookedSeats } = await supabase
      .from('booked_seats')
      .select('row_number, seat_number, section')
      .eq('order_id', orderId);

    const seats = bookedSeats || [];
    const placesList = seats
      .reduce((acc, s) => {
        const key = `Ряд ${s.row_number}`;
        const existing = acc.find((a) => a.row === key);
        if (existing) existing.seats.push(s.seat_number);
        else acc.push({ row: key, seats: [s.seat_number] });
        return acc;
      }, [])
      .map((a) => `  ${a.row} — места ${a.seats.join(', ')}`)
      .join('\n');

    const dateStr = show?.date ? new Date(show.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) : '';
    const timeStr = show?.time || '19:00';
    const price = show?.price || 3000;
    const msg = `🎭 <b>Новый заказ!</b>

📍 ${show?.title || 'Спектакль'}
📅 ${dateStr}, ${timeStr}
💰 ${price.toLocaleString('ru')}₸ × ${seats.length} = ${(order.total_amount || 0).toLocaleString('ru')}₸

👤 ${order.customer_name}
📱 ${order.customer_phone}

💺 Места:
${placesList}

⏳ Подтвердите или отмените — в боте или в админке`;

    await sendOrderWithButtons(orderId, msg, paymentPdfUrl);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
