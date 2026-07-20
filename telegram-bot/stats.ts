import type { StudentStat } from "./types";

const LOW_ATTENDANCE_TOP = 5;
export const STATS_PAGE_SIZE = 12;

/**
 * Parses a numeric cell from Sheets (number or localized string).
 */
export function parseStatNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = String(value ?? "")
    .trim()
    .replace(",", ".")
    .replace("%", "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Builds a StudentStat from a Статистика sheet row.
 */
export function rowToStudentStat(row: string[]): StudentStat | null {
  const studentId = row[0]?.trim() ?? "";
  const name = row[1]?.trim() ?? "";
  const groupId = row[2]?.trim() ?? "";
  if (!studentId || !name || !groupId) return null;

  const present = parseStatNumber(row[3]);
  const absent = parseStatNumber(row[4]);
  const total = parseStatNumber(row[5]) || present + absent;
  const rate =
    row[6] !== undefined && String(row[6]).trim() !== ""
      ? parseStatNumber(row[6])
      : total
        ? Math.round((present / total) * 1000) / 10
        : 0;

  return {
    studentId,
    name,
    groupId,
    present,
    absent,
    total,
    rate,
    lastDate: row[7]?.trim() ?? "",
  };
}

/**
 * Returns students with the lowest attendance rate.
 */
export function lowestAttendance(stats: StudentStat[], limit = LOW_ATTENDANCE_TOP): StudentStat[] {
  return [...stats]
    .filter((item) => item.total >= 1)
    .sort((a, b) => {
      if (a.rate !== b.rate) return a.rate - b.rate;
      if (a.absent !== b.absent) return b.absent - a.absent;
      return a.name.localeCompare(b.name, "uk");
    })
    .slice(0, limit);
}

/**
 * Computes weighted average attendance for a group.
 */
export function averageAttendanceRate(stats: StudentStat[]): number | null {
  const totals = stats.reduce(
    (acc, item) => {
      acc.present += item.present;
      acc.total += item.total;
      return acc;
    },
    { present: 0, total: 0 }
  );
  if (!totals.total) return null;
  return Math.round((totals.present / totals.total) * 1000) / 10;
}

/**
 * Formats an ISO date for Ukrainian display.
 */
export function formatStatDate(date: string): string {
  if (!date) return "—";
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(`${date}T12:00:00`));
  }
  return date;
}

/**
 * Formats a compact one-line student stats summary.
 */
export function formatStatLine(stat: StudentStat, index?: number): string {
  const prefix = index === undefined ? "•" : `${index}.`;
  const last = formatStatDate(stat.lastDate);
  return `${prefix} ${stat.name} — ${stat.rate}% (${stat.present}/${stat.total}), останнє: ${last}`;
}

/**
 * Builds the group statistics message body.
 */
export function formatGroupStatsText(
  groupName: string,
  locationLabel: string,
  stats: StudentStat[],
  options?: { showAll?: boolean; page?: number }
): string {
  const showAll = options?.showAll ?? false;
  const page = options?.page ?? 0;
  const average = averageAttendanceRate(stats);
  const header = [
    `<b>📊 ${escapeHtml(groupName)}</b>`,
    escapeHtml(locationLabel),
    "",
  ];

  if (!stats.length) {
    return [
      ...header,
      "Немає даних. Збережіть хоча б одне заняття через /start.",
    ].join("\n");
  }

  const summary = [
    `Середня відвідуваність: <b>${average ?? 0}%</b>`,
    `Учнів у статистиці: <b>${stats.length}</b>`,
    "",
  ];

  if (showAll) {
    const sorted = [...stats].sort((a, b) => a.name.localeCompare(b.name, "uk"));
    const start = page * STATS_PAGE_SIZE;
    const pageItems = sorted.slice(start, start + STATS_PAGE_SIZE);
    const totalPages = Math.max(1, Math.ceil(sorted.length / STATS_PAGE_SIZE));
    return [
      ...header,
      ...summary,
      `<b>Усі учні</b> (стор. ${page + 1}/${totalPages}):`,
      ...pageItems.map((item) => escapeHtml(formatStatLine(item))),
    ].join("\n");
  }

  const lowest = lowestAttendance(stats);
  return [
    ...header,
    ...summary,
    "<b>Топ пропусків:</b>",
    ...lowest.map((item, index) => escapeHtml(formatStatLine(item, index + 1))),
  ].join("\n");
}

/**
 * Builds the student statistics message body.
 */
export function formatStudentStatsText(
  stat: StudentStat | null,
  groupName: string,
  studentNameFallback?: string
): string {
  if (!stat) {
    const name = studentNameFallback ?? "Учень";
    return [
      `<b>👤 ${escapeHtml(name)}</b>`,
      `Група: ${escapeHtml(groupName)}`,
      "",
      "Немає даних. Збережіть хоча б одне заняття через /start.",
    ].join("\n");
  }

  return [
    `<b>👤 ${escapeHtml(stat.name)}</b>`,
    `Група: ${escapeHtml(groupName)}`,
    "",
    `Присутній: <b>${stat.present}</b>`,
    `Відсутній: <b>${stat.absent}</b>`,
    `Всього: <b>${stat.total}</b>`,
    `Відвідуваність: <b>${stat.rate}%</b>`,
    `Останнє заняття: <b>${escapeHtml(formatStatDate(stat.lastDate))}</b>`,
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
