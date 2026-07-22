import type { TrainingGroup } from "./types";

const DAY_ALIASES: Record<number, string[]> = {
  0: ["0", "7", "sun", "sunday", "нд", "неділя"],
  1: ["1", "mon", "monday", "пн", "понеділок"],
  2: ["2", "tue", "tuesday", "вт", "вівторок"],
  3: ["3", "wed", "wednesday", "ср", "середа"],
  4: ["4", "thu", "thursday", "чт", "четвер"],
  5: ["5", "fri", "friday", "пт", "п'ятниця", "пятниця"],
  6: ["6", "sat", "saturday", "сб", "субота"],
};

/** Default lookback window for picking a past session date. */
export const SCHEDULE_LOOKBACK_DAYS = 14;

/**
 * Returns whether a schedule day label matches the given calendar date.
 * Empty day means the row applies to any weekday.
 */
export function matchesGroupDay(groupDay: string, date: string | Date): boolean {
  const normalized = groupDay.trim().toLowerCase();
  if (!normalized) return true;
  const value =
    typeof date === "string" ? new Date(`${date}T12:00:00`) : new Date(date);
  value.setHours(12, 0, 0, 0);
  const aliases = DAY_ALIASES[value.getDay()] ?? [];
  return aliases.includes(normalized);
}

/**
 * Builds ISO dates (newest first) that match the group's schedule rows.
 */
export function getScheduledDates(
  groupRows: TrainingGroup[],
  lookbackDays = SCHEDULE_LOOKBACK_DAYS
): string[] {
  const active = groupRows.filter((group) => group.active && group.id);
  if (!active.length) return [];

  const hasExplicitDays = active.some((group) => group.day.trim());
  const dates: string[] = [];

  for (let index = 0; index < lookbackDays; index += 1) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - index);
    const iso = toIsoDate(date);
    const matches = !hasExplicitDays
      ? true
      : active.some((group) => matchesGroupDay(group.day, date));
    if (matches) dates.push(iso);
  }

  return dates;
}

/**
 * Returns session times for a group on a concrete date from schedule rows.
 */
export function getTimesForDate(groupRows: TrainingGroup[], date: string): string[] {
  const active = groupRows.filter((group) => group.active && group.id);
  if (!active.length) return [];

  const hasExplicitDays = active.some((group) => group.day.trim());
  const matching = active.filter((group) => {
    if (!hasExplicitDays) return true;
    return matchesGroupDay(group.day, date);
  });

  return [...new Set(matching.map((group) => group.time.trim()).filter(Boolean))].sort();
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
