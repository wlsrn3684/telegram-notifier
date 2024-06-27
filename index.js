import core from "@actions/core";
import fetch from "node-fetch";

const TELEGRAM_API_BASE_URL = "https://api.telegram.org";

const send = async ({ token, chatId, threadId, text, parseMode }) => {
  const apiUrl = `${TELEGRAM_API_BASE_URL}/bot${token}/sendMessage`;
  const payload = {
    chat_id: chatId,
    message_thread_id: threadId,
    text: text,
    parse_mode: parseMode,
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Telegram API responded with ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

const main = async () => {
  try {
    const token = core.getInput("BOT_TOKEN", { required: true });
    const chatId = core.getInput("CHAT_ID", { required: true });
    const text = core.getInput("TEXT", { required: true });
    const threadId = core.getInput("MESSAGE_THREAD_ID") || undefined;
    const parseMode = core.getInput("PARSE_MODE") || undefined;

    const result = await send({ token, chatId, threadId, text, parseMode });
    console.log("Message sent successfully:", result);
  } catch (error) {
    core.setFailed(`Failed to send message: ${error.message}`);
  }
};

try {
  main();
} catch (error) {
  core.setFailed(error.message);
}
