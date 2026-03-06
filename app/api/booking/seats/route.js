import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const showSlug = searchParams.get('showSlug');
  if (!showSlug) {
    return NextResponse.json({ error: 'showSlug required' }, { status: 400 });
  }

  try {
    await supabase.rpc('expire_old_orders');

    const { data: show, error: showError } = await supabase
      .from('shows')
      .select('id')
      .eq('slug', showSlug)
      .single();

    if (showError || !show) {
      return NextResponse.json({ error: 'Show not found' }, { status: 404 });
    }

    const showId = show.id;

    const [blockedRes, bookedRes] = await Promise.all([
      supabase.from('blocked_seats').select('row_number, seat_number, section').eq('show_id', showId),
      supabase.from('booked_seats').select('row_number, seat_number, section').eq('show_id', showId),
    ]);

    const blocked = (blockedRes.data || []).map((r) => ({
      row: r.row_number,
      seat: r.seat_number,
      section: r.section,
    }));
    const booked = (bookedRes.data || []).map((r) => ({
      row: r.row_number,
      seat: r.seat_number,
      section: r.section,
    }));

    return NextResponse.json({ showId, blocked, booked });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
