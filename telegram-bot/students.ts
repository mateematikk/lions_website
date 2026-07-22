import type { AttendanceSession } from "./types";

const ADD_MARKER_PREFIX = "#add";

/**
 * Builds a prompt that encodes the attendance session for a reply-based add flow.
 */
export function buildAddStudentPrompt(
  session: AttendanceSession,
  groupName: string
): string {
  const marker = [
    ADD_MARKER_PREFIX,
    session.locationId,
    session.groupId,
    session.date.replaceAll("-", "").slice(2),
    session.time.replace(":", ""),
  ].join("|");

  return [
    "<b>➕ Новий учень</b>",
    `Група: ${escapeHtml(groupName)}`,
    `<code>${marker}</code>`,
    "",
    "Надішліть <b>ПІБ</b> одним повідомленням у відповідь на це.",
    "Щоб скасувати — /start",
  ].join("\n");
}

/**
 * Parses an add-student session marker from a bot prompt message.
 */
export function parseAddStudentContext(text?: string): AttendanceSession | null {
  if (!text) return null;
  const match = text.match(/#add\|([^|\s]+)\|([^|\s]+)\|(\d{6})\|(\d{4})/);
  if (!match) return null;
  const date = `20${match[3].slice(0, 2)}-${match[3].slice(2, 4)}-${match[3].slice(4, 6)}`;
  const time = `${match[4].slice(0, 2)}:${match[4].slice(2, 4)}`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return {
    locationId: match[1],
    groupId: match[2],
    date,
    time,
  };
}

/**
 * Builds the multi-group picker text for /add.
 */
export function buildAddGroupPickerText(pendingName?: string | null): string {
  const lines = ["<b>➕ Новий учень</b>"];
  if (pendingName) {
    lines.push(`ПІБ: <b>${escapeHtml(pendingName)}</b>`);
  }
  lines.push("", "Оберіть групу:");
  return lines.join("\n");
}

/**
 * Reads a pending name from an /add group-picker message.
 */
export function parsePendingAddName(text?: string): string | null {
  if (!text) return null;
  const match = text.match(/ПІБ:\s*(.+)/i);
  if (!match) return null;
  const raw = (match[1].split("\n")[0] ?? "").replace(/<[^>]+>/g, "");
  return normalizeStudentName(raw);
}

/**
 * Normalizes a student display name from free text.
 */
export function normalizeStudentName(raw: string): string | null {
  const name = raw.replace(/\s+/g, " ").trim();
  if (name.length < 2 || name.length > 80) return null;
  if (name.startsWith("/")) return null;
  if (name.includes("|")) return null;
  return name;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
