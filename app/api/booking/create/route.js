import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function isTaken(booked, row, seat, section) {
  return booked.some(
    (b) => b.row_number === row && b.seat_number === seat && b.section === section
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { showSlug, customerName, customerPhone, seats } = body;
    if (!showSlug || !customerName || !customerPhone || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json(
        { error: 'showSlug, customerName, customerPhone, seats required' },
        { status: 400 }
      );
    }

    const { data: show, error: showError } = await supabase
      .from('shows')
      .select('id, title, date, time, price')
      .eq('slug', showSlug)
      .single();

    if (showError || !show) {
      return NextResponse.json({ error: 'Show not found' }, { status: 404 });
    }

    const { data: existingBooked } = await supabase
      .from('booked_seats')
      .select('row_number, seat_number, section')
      .eq('show_id', show.id);

    const conflicting = seats.filter((s) =>
      isTaken(existingBooked || [], s.row, s.seat, s.section)
    );
    if (conflicting.length > 0) {
      return NextResponse.json(
        { error: 'Некоторые места уже заняты', conflicting },
        { status: 409 }
      );
    }

    const totalAmount = seats.length * (show.price || 3000);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        show_id: show.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        total_amount: totalAmount,
        status: 'draft',
      })
      .select('id')
      .single();

    if (orderError) {
      console.error(orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const bookedRows = seats.map((s) => ({
      order_id: order.id,
      show_id: show.id,
      row_number: s.row,
      seat_number: s.seat,
      section: s.section,
    }));

    const { error: bookedError } = await supabase.from('booked_seats').insert(bookedRows);
    if (bookedError) {
      await supabase.from('orders').delete().eq('id', order.id);
      console.error(bookedError);
      return NextResponse.json({ error: 'Failed to book seats' }, { status: 500 });
    }

    return NextResponse.json({ orderId: order.id, totalAmount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
