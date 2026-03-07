export async function notifyTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  }).catch(console.error);
}

/**
 * Отправляет заказ в Telegram с кнопками «Подтвердить» / «Отменить» и ссылкой на PDF.
 * @param {string} orderId - ID заказа
 * @param {string} text - текст сообщения (HTML)
 * @param {string} [paymentPdfUrl] - ссылка на чек (добавляется в сообщение)
 */
export async function sendOrderWithButtons(orderId, text, paymentPdfUrl) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  let fullText = text;
  if (paymentPdfUrl) {
    fullText += `\n\n📎 <a href="${paymentPdfUrl}">Открыть чек (PDF)</a>`;
  }

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: fullText,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✓ Подтвердить', callback_data: `confirm:${orderId}` },
            { text: '✗ Отменить', callback_data: `cancel:${orderId}` },
          ],
        ],
      },
    }),
  }).catch(console.error);
}

/**
 * Редактирует сообщение бота (убирает кнопки, меняет текст).
 */
export async function editTelegramMessage(chatId, messageId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [] },
    }),
  }).catch(console.error);
}

/**
 * Ответ на нажатие inline-кнопки (убирает «часики»).
 */
export async function answerCallbackQuery(callbackQueryId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text || undefined,
    }),
  }).catch(console.error);
}
