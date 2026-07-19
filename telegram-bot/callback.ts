import type { AttendanceSession } from "./types";

const SEPARATOR = "|";

export type BotAction =
  | { type: "location"; locationId: string }
  | { type: "group"; locationId: string; groupId: string }
  | { type: "date"; locationId: string; groupId: string; date: string }
  | { type: "time"; session: AttendanceSession }
  | { type: "student"; studentId: string; present: boolean }
  | { type: "all"; present: boolean }
  | { type: "finish"; session: AttendanceSession }
  | { type: "cancel" }
  | { type: "unknown" };

function safePart(value: string): string {
  if (!value || value.includes(SEPARATOR)) {
    throw new Error(`Invalid callback value: ${value}`);
  }
  return value;
}

function compactDate(date: string): string {
  return date.replaceAll("-", "").slice(2);
}

function expandDate(date: string): string {
  if (!/^\d{6}$/.test(date)) return "";
  return `20${date.slice(0, 2)}-${date.slice(2, 4)}-${date.slice(4, 6)}`;
}

function compactTime(time: string): string {
  return time.replace(":", "");
}

function expandTime(time: string): string {
  if (!/^\d{4}$/.test(time)) return "";
  return `${time.slice(0, 2)}:${time.slice(2, 4)}`;
}

function assertTelegramLimit(value: string): string {
  if (Buffer.byteLength(value, "utf8") > 64) {
    throw new Error("Telegram callback_data exceeds 64 bytes");
  }
  return value;
}

export const callbackData = {
  location: (locationId: string) =>
    assertTelegramLimit(["L", safePart(locationId)].join(SEPARATOR)),
  group: (locationId: string, groupId: string) =>
    assertTelegramLimit(["G", safePart(locationId), safePart(groupId)].join(SEPARATOR)),
  date: (locationId: string, groupId: string, date: string) =>
    assertTelegramLimit(
      ["D", safePart(locationId), safePart(groupId), compactDate(date)].join(SEPARATOR)
    ),
  time: (session: AttendanceSession) =>
    assertTelegramLimit(
      [
        "T",
        safePart(session.locationId),
        safePart(session.groupId),
        compactDate(session.date),
        compactTime(session.time),
      ].join(SEPARATOR)
    ),
  student: (studentId: string, present: boolean) =>
    assertTelegramLimit(["S", safePart(studentId), present ? "1" : "0"].join(SEPARATOR)),
  all: (present: boolean) => ["A", present ? "1" : "0"].join(SEPARATOR),
  finish: (session: AttendanceSession) =>
    assertTelegramLimit(
      [
        "F",
        safePart(session.locationId),
        safePart(session.groupId),
        compactDate(session.date),
        compactTime(session.time),
      ].join(SEPARATOR)
    ),
  cancel: () => "C",
};

export function parseCallbackData(data: string): BotAction {
  const parts = data.split(SEPARATOR);
  const [action] = parts;

  if (action === "L" && parts.length === 2) {
    return { type: "location", locationId: parts[1] };
  }
  if (action === "G" && parts.length === 3) {
    return { type: "group", locationId: parts[1], groupId: parts[2] };
  }
  if (action === "D" && parts.length === 4) {
    const date = expandDate(parts[3]);
    return date
      ? { type: "date", locationId: parts[1], groupId: parts[2], date }
      : { type: "unknown" };
  }
  if ((action === "T" || action === "F") && parts.length === 5) {
    const date = expandDate(parts[3]);
    const time = expandTime(parts[4]);
    if (!date || !time) return { type: "unknown" };
    const session = {
      locationId: parts[1],
      groupId: parts[2],
      date,
      time,
    };
    return action === "T" ? { type: "time", session } : { type: "finish", session };
  }
  if (action === "S" && parts.length === 3) {
    return { type: "student", studentId: parts[1], present: parts[2] === "1" };
  }
  if (action === "A" && parts.length === 2) {
    return { type: "all", present: parts[1] === "1" };
  }
  if (action === "C") return { type: "cancel" };

  return { type: "unknown" };
}

export function buildSessionId(session: AttendanceSession): string {
  return [session.date, session.time, session.locationId, session.groupId]
    .map((part) => part.replaceAll(/[^a-zA-Z0-9А-Яа-яІіЇїЄє:-]/g, "-"))
    .join("_");
}
