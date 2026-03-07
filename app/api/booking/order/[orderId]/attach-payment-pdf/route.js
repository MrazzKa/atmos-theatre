import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabase';

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

    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_pdf_url: paymentPdfUrl })
      .eq('id', orderId);

    if (updateError) {
      console.error('Order update error:', updateError);
      return NextResponse.json({ error: 'Не удалось сохранить ссылку на PDF' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
