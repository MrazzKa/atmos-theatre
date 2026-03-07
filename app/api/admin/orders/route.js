import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        customer_name,
        customer_phone,
        total_amount,
        status,
        created_at,
        confirmed_at,
        payment_pdf_url,
        shows(id, title, date, time, slug)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    const orderIds = (orders || []).map((o) => o.id);
    if (orderIds.length === 0) {
      return NextResponse.json({ orders: [], seatsByOrder: {} });
    }

    const { data: bookedSeats } = await supabase
      .from('booked_seats')
      .select('order_id, row_number, seat_number, section')
      .in('order_id', orderIds);

    const seatsByOrder = {};
    (bookedSeats || []).forEach((s) => {
      if (!seatsByOrder[s.order_id]) seatsByOrder[s.order_id] = [];
      seatsByOrder[s.order_id].push({
        row: s.row_number,
        seat: s.seat_number,
        section: s.section,
      });
    });

    return NextResponse.json({ orders, seatsByOrder });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
