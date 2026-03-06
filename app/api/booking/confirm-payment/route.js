import { NextResponse } from 'next/server';
import { notifyTelegram } from '@/lib/telegram';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId } = body;
    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    const shortId = String(orderId).slice(0, 8);
    await notifyTelegram(
      `💳 Покупатель подтвердил оплату заказа #${shortId}. Проверьте в Kaspi Pay.`
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
