import { programs } from "@/data/programs";
import { locations } from "@/data/locations";

interface EnrollPayload {
  name?: string;
  phone?: string;
  age?: string;
  program?: string;
  location?: string;
  comment?: string;
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram env vars are missing (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)");
    return Response.json({ ok: false, error: "Server is not configured" }, { status: 500 });
  }

  let payload: EnrollPayload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = payload.name?.trim();
  const phone = payload.phone?.trim();
  if (!name || !phone) {
    return Response.json({ ok: false, error: "Name and phone are required" }, { status: 400 });
  }

  const programTitle = payload.program
    ? programs.uk.find((p) => p.id === payload.program)?.title ?? payload.program
    : null;

  const location = payload.location
    ? locations.uk.find((l) => l.id === payload.location)
    : null;
  const locationLabel = location
    ? `${location.district} — ${location.address}`
    : payload.location || null;

  const lines = [
    "🥋 Нова заявка з сайту",
    "",
    `👤 Ім'я: ${name}`,
    `📞 Телефон: ${phone}`,
  ];
  if (payload.age?.trim()) lines.push(`🎂 Вік: ${payload.age.trim()}`);
  if (programTitle) lines.push(`📋 Програма: ${programTitle}`);
  if (locationLabel) lines.push(`📍 Локація: ${locationLabel}`);
  if (payload.comment?.trim()) lines.push(`💬 Коментар: ${payload.comment.trim()}`);

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: lines.join("\n") }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Telegram sendMessage failed:", res.status, body);
    return Response.json({ ok: false, error: "Failed to send" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
