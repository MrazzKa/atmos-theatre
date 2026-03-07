import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { editTelegramMessage, answerCallbackQuery } from '@/lib/telegram';

export async function POST(request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const allowedChatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !allowedChatId) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  try {
    const body = await request.json();
    const callbackQuery = body?.callback_query;
    if (!callbackQuery) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(callbackQuery.message?.chat?.id);
    const messageId = callbackQuery.message?.message_id;
    const callbackId = callbackQuery.id;
    const data = callbackQuery.data || '';

    if (chatId !== String(allowedChatId)) {
      await answerCallbackQuery(callbackId, 'Доступ запрещён');
      return NextResponse.json({ ok: true });
    }

    const [action, orderId] = data.split(':');
    if (!orderId || !['confirm', 'cancel'].includes(action)) {
      await answerCallbackQuery(callbackId);
      return NextResponse.json({ ok: true });
    }

    if (action === 'confirm') {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid', confirmed_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        await answerCallbackQuery(callbackId, 'Ошибка подтверждения');
        return NextResponse.json({ ok: true });
      }
      await answerCallbackQuery(callbackId, 'Заказ подтверждён');
      await editTelegramMessage(
        chatId,
        messageId,
        callbackQuery.message.text + '\n\n✅ Подтверждено в боте. Билеты выданы.',
      );
    } else {
      await supabase.from('booked_seats').delete().eq('order_id', orderId);
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) {
        await answerCallbackQuery(callbackId, 'Ошибка отмены');
        return NextResponse.json({ ok: true });
      }
      await answerCallbackQuery(callbackId, 'Заказ отменён');
      await editTelegramMessage(
        chatId,
        messageId,
        callbackQuery.message.text + '\n\n❌ Отменено в боте.',
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Telegram webhook error:', err);
    return NextResponse.json({ ok: true });
  }
}
