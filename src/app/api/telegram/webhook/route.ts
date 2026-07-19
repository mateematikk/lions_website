import { timingSafeEqual } from "node:crypto";
import { handleTelegramUpdate } from "@bot/handler";
import type { TelegramUpdate } from "@bot/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const receivedSecret = request.headers.get("x-telegram-bot-api-secret-token");

  if (!expectedSecret) {
    console.error("TELEGRAM_WEBHOOK_SECRET is not configured");
    return Response.json({ ok: false }, { status: 503 });
  }
  if (!receivedSecret || !secretsMatch(receivedSecret, expectedSecret)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  try {
    await handleTelegramUpdate(update);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook failed:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}

function secretsMatch(received: string, expected: string): boolean {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  if (receivedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(receivedBuffer, expectedBuffer);
}
