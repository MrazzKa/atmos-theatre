import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, password } = body;
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || password !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    await supabase.from('booked_seats').delete().eq('order_id', orderId);
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to cancel' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
