import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  const orderId = params?.orderId;
  if (!orderId) {
    return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
  }

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        customer_phone,
        total_amount,
        shows(title, date, time)
      `)
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const { data: seats } = await supabase
      .from('booked_seats')
      .select('row_number, seat_number, section')
      .eq('order_id', orderId);

    const show = order.shows || {};
    const dateStr = show.date
      ? new Date(show.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    const timeStr = show.time ? String(show.time).slice(0, 5) : '19:00';

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      customerPhone: order.customer_phone,
      totalAmount: order.total_amount,
      showTitle: show.title || '',
      showDateLabel: dateStr,
      showTimeLabel: timeStr,
      seats: (seats || []).map((s) => ({ row: s.row_number, seat: s.seat_number, section: s.section })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
