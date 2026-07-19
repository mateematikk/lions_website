export const SHEET_NAMES = {
  trainers: "Тренери",
  groups: "Групи",
  students: "Учні",
  attendance: "Відвідування",
  statistics: "Статистика",
} as const;

export const SHEET_HEADERS: Record<(typeof SHEET_NAMES)[keyof typeof SHEET_NAMES], string[]> = {
  [SHEET_NAMES.trainers]: ["telegram_id", "ім'я", "location_ids", "active"],
  [SHEET_NAMES.groups]: ["group_id", "location_id", "назва", "день", "час", "active"],
  [SHEET_NAMES.students]: ["student_id", "ПІБ", "group_id", "active"],
  [SHEET_NAMES.attendance]: [
    "session_id",
    "дата",
    "час",
    "location_id",
    "group_id",
    "student_id",
    "ПІБ",
    "статус",
    "trainer_id",
    "тренер",
    "marked_at",
  ],
  [SHEET_NAMES.statistics]: [
    "student_id",
    "ПІБ",
    "group_id",
    "присутній",
    "відсутній",
    "всього",
    "відвідуваність_%",
    "останнє_заняття",
  ],
};

export const LOCATION_LABELS: Record<string, string> = {
  pozniaky: "Позняки — вул. Мишуги, 2",
  "kniazhyi-zaton": "Позняки — вул. Княжий Затон, 17в",
  darnytsia: "Дарниця — Дарницька площа, 1",
  pochaina: "Почайна — вул. Йорданська, 4г",
};

export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function isActive(value: unknown): boolean {
  return ["1", "true", "yes", "так", "active"].includes(String(value ?? "").trim().toLowerCase());
}
