import { LOCATION_LABELS, LOCATION_SHORT_LABELS } from "./config";
import type { StudentStat } from "./types";

/** Short button label for a gym location. */
export function locationShortLabel(locationId: string): string {
  return LOCATION_SHORT_LABELS[locationId] ?? locationId;
}

/** Full address label for a gym location. */
export function locationAddressLabel(locationId: string): string {
  return LOCATION_LABELS[locationId] ?? locationId;
}

/** Adds a light emoji prefix to a group name for buttons. */
export function groupButtonLabel(name: string): string {
  const lower = name.toLowerCase();
  if (/\bmma\b/.test(lower)) return `🥊 ${name}`;
  if (/jiu|бжж|bjj|jiujitsu|джиу/.test(lower)) return `🥋 ${name}`;
  if (/підліт|teen/.test(lower)) return `🧑 ${name}`;
  if (/дит|kids|дитя/.test(lower)) return `🧒 ${name}`;
  if (/доросл|adult/.test(lower)) return `👤 ${name}`;
  return name;
}

/** Rate marker for statistics lists. */
export function rateMarker(rate: number): string {
  if (rate >= 90) return "🟢";
  if (rate >= 70) return "🟡";
  return "🔴";
}

/**
 * Builds a step + breadcrumb header for multi-step flows.
 */
export function formatFlowHeader(options: {
  title: string;
  step?: number;
  steps?: number;
  crumbs?: string[];
  address?: string;
  hint?: string;
}): string {
  const lines: string[] = [`<b>${escapeHtml(options.title)}</b>`];
  if (options.step && options.steps) {
    lines.push(`Крок ${options.step}/${options.steps}`);
  }
  if (options.crumbs?.length) {
    lines.push(escapeHtml(options.crumbs.join(" → ")));
  }
  if (options.address) {
    lines.push(escapeHtml(options.address));
  }
  if (options.hint) {
    lines.push("", options.hint);
  }
  return lines.join("\n");
}

/** Formats a date for Ukrainian display. */
export function formatUiDate(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

/** Escapes HTML special characters for Telegram HTML mode. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/** Formats one stats line with a traffic-light marker. */
export function formatStatLineWithMarker(stat: StudentStat, index?: number): string {
  const prefix = index === undefined ? "•" : `${index}.`;
  const marker = rateMarker(stat.rate);
  const last = stat.lastDate
    ? formatUiDate(stat.lastDate)
    : "—";
  return `${prefix} ${marker} ${stat.name} — ${stat.rate}% (${stat.present}/${stat.total}), останнє: ${last}`;
}
