import { google, sheets_v4 } from "googleapis";
import { buildAttendanceRows } from "./attendance";
import { buildSessionId } from "./callback";
import {
  isActive,
  requireEnv,
  SHEET_HEADERS,
  SHEET_NAMES,
} from "./config";
import type {
  AttendanceMark,
  AttendanceSession,
  Student,
  Trainer,
  TrainingGroup,
} from "./types";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

let sheetsClient: sheets_v4.Sheets | null = null;
let initialization: Promise<void> | null = null;

function getSheetsClient(): sheets_v4.Sheets {
  if (sheetsClient) return sheetsClient;

  const auth = new google.auth.JWT({
    email: requireEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    key: requireEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    scopes: [SHEETS_SCOPE],
  });
  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

function spreadsheetId(): string {
  return requireEnv("GOOGLE_SHEET_ID");
}

function quoteSheet(name: string): string {
  return `'${name.replaceAll("'", "''")}'`;
}

async function readRows(sheetName: string, columns: string): Promise<string[][]> {
  await initializeWorkbook();
  const response = await getSheetsClient().spreadsheets.values.get({
    spreadsheetId: spreadsheetId(),
    range: `${quoteSheet(sheetName)}!${columns}`,
  });
  return (response.data.values as string[][] | undefined) ?? [];
}

export async function initializeWorkbook(): Promise<void> {
  if (initialization) return initialization;

  initialization = (async () => {
    const client = getSheetsClient();
    const id = spreadsheetId();
    const metadata = await client.spreadsheets.get({
      spreadsheetId: id,
      fields: "sheets.properties",
    });
    const existing = new Set(
      metadata.data.sheets?.map((sheet) => sheet.properties?.title).filter(Boolean) as string[]
    );

    for (const title of Object.values(SHEET_NAMES)) {
      if (!existing.has(title)) {
        try {
          await client.spreadsheets.batchUpdate({
            spreadsheetId: id,
            requestBody: {
              requests: [
                {
                  addSheet: {
                    properties: {
                      title,
                      gridProperties: { frozenRowCount: 1 },
                    },
                  },
                },
              ],
            },
          });
        } catch (error) {
          // Another concurrent webhook may have created it first.
          const message = error instanceof Error ? error.message : String(error);
          if (!message.toLowerCase().includes("already exists")) throw error;
        }
      }

      const headers = SHEET_HEADERS[title];
      await client.spreadsheets.values.update({
        spreadsheetId: id,
        range: `${quoteSheet(title)}!A1:${columnLetter(headers.length)}1`,
        valueInputOption: "RAW",
        requestBody: { values: [headers] },
      });
    }
  })().catch((error) => {
    initialization = null;
    throw error;
  });

  return initialization;
}

function columnLetter(column: number): string {
  let result = "";
  let value = column;
  while (value > 0) {
    value -= 1;
    result = String.fromCharCode(65 + (value % 26)) + result;
    value = Math.floor(value / 26);
  }
  return result;
}

export async function getTrainer(telegramId: number | string): Promise<Trainer | null> {
  const rows = await readRows(SHEET_NAMES.trainers, "A2:D");
  const id = String(telegramId);
  const row = rows.find((item) => String(item[0] ?? "").trim() === id);
  if (!row) return null;

  return {
    telegramId: id,
    name: row[1]?.trim() || id,
    locationIds: (row[2] ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    active: isActive(row[3]),
  };
}

export async function getGroupsForLocation(locationId: string): Promise<TrainingGroup[]> {
  const rows = await readRows(SHEET_NAMES.groups, "A2:F");
  const groups = rows
    .map(rowToGroup)
    .filter((group) => group.active && group.locationId === locationId);

  const unique = new Map<string, TrainingGroup>();
  for (const group of groups) {
    if (!unique.has(group.id)) unique.set(group.id, group);
  }
  return [...unique.values()];
}

export async function getGroup(groupId: string): Promise<TrainingGroup | null> {
  const rows = await readRows(SHEET_NAMES.groups, "A2:F");
  return rows.map(rowToGroup).find((group) => group.active && group.id === groupId) ?? null;
}

function rowToGroup(row: string[]): TrainingGroup {
  return {
    id: row[0]?.trim() ?? "",
    locationId: row[1]?.trim() ?? "",
    name: row[2]?.trim() ?? "",
    day: row[3]?.trim() ?? "",
    time: row[4]?.trim() ?? "",
    active: isActive(row[5]),
  };
}

const DAY_ALIASES: Record<number, string[]> = {
  0: ["0", "7", "sun", "sunday", "нд", "неділя"],
  1: ["1", "mon", "monday", "пн", "понеділок"],
  2: ["2", "tue", "tuesday", "вт", "вівторок"],
  3: ["3", "wed", "wednesday", "ср", "середа"],
  4: ["4", "thu", "thursday", "чт", "четвер"],
  5: ["5", "fri", "friday", "пт", "п'ятниця", "пятниця"],
  6: ["6", "sat", "saturday", "сб", "субота"],
};

export async function getSessionTimes(groupId: string, date: string): Promise<string[]> {
  const rows = await readRows(SHEET_NAMES.groups, "A2:F");
  const groups = rows.map(rowToGroup).filter((group) => group.active && group.id === groupId);
  const day = new Date(`${date}T12:00:00`).getDay();
  const aliases = DAY_ALIASES[day];
  const matching = groups.filter(
    (group) => !group.day || aliases.includes(group.day.toLowerCase())
  );
  const source = matching.length ? matching : groups;
  return [...new Set(source.map((group) => group.time).filter(Boolean))].sort();
}

export async function getStudentsForGroup(groupId: string): Promise<Student[]> {
  const rows = await readRows(SHEET_NAMES.students, "A2:D");
  return rows
    .map((row) => ({
      id: row[0]?.trim() ?? "",
      name: row[1]?.trim() ?? "",
      groupId: row[2]?.trim() ?? "",
      active: isActive(row[3]),
    }))
    .filter((student) => student.active && student.groupId === groupId && student.id && student.name)
    .sort((a, b) => a.name.localeCompare(b.name, "uk"));
}

export async function saveAttendance(
  session: AttendanceSession,
  marks: AttendanceMark[],
  trainer: Trainer
): Promise<{ present: number; absent: number }> {
  await initializeWorkbook();
  const client = getSheetsClient();
  const id = spreadsheetId();
  const students = await getStudentsForGroup(session.groupId);
  const studentsById = new Map(students.map((student) => [student.id, student]));
  const sessionId = buildSessionId(session);
  const rows = buildAttendanceRows(session, students, marks, trainer);

  // Ignore stale/malformed buttons that no longer belong to this group.
  const validMarks = marks.filter((mark) => studentsById.has(mark.studentId));
  const existing = await readRows(SHEET_NAMES.attendance, "A2:K");
  const rowByStudent = new Map<string, number>();
  existing.forEach((row, index) => {
    if (row[0] === sessionId && row[5]) rowByStudent.set(row[5], index + 2);
  });

  const updates: sheets_v4.Schema$ValueRange[] = [];
  const appends: string[][] = [];
  for (const row of rows) {
    const rowNumber = rowByStudent.get(row[5]);
    if (rowNumber) {
      updates.push({
        range: `${quoteSheet(SHEET_NAMES.attendance)}!A${rowNumber}:K${rowNumber}`,
        values: [row],
      });
    } else {
      appends.push(row);
    }
  }

  if (updates.length) {
    await client.spreadsheets.values.batchUpdate({
      spreadsheetId: id,
      requestBody: { valueInputOption: "RAW", data: updates },
    });
  }
  if (appends.length) {
    await client.spreadsheets.values.append({
      spreadsheetId: id,
      range: `${quoteSheet(SHEET_NAMES.attendance)}!A:K`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: appends },
    });
  }

  await refreshStatistics();
  const present = validMarks.filter((mark) => mark.present).length;
  return { present, absent: students.length - present };
}

export async function refreshStatistics(): Promise<void> {
  const attendance = await readRows(SHEET_NAMES.attendance, "A2:K");
  const latestBySessionStudent = new Map<string, string[]>();
  for (const row of attendance) {
    if (!row[0] || !row[5]) continue;
    latestBySessionStudent.set(`${row[0]}::${row[5]}`, row);
  }

  const stats = new Map<
    string,
    {
      name: string;
      groupId: string;
      present: number;
      absent: number;
      lastDate: string;
    }
  >();
  for (const row of latestBySessionStudent.values()) {
    const studentId = row[5];
    const item = stats.get(studentId) ?? {
      name: row[6] || studentId,
      groupId: row[4] || "",
      present: 0,
      absent: 0,
      lastDate: "",
    };
    if (row[7] === "Присутній") item.present += 1;
    else item.absent += 1;
    if ((row[1] || "") > item.lastDate) item.lastDate = row[1];
    stats.set(studentId, item);
  }

  const values = [...stats.entries()]
    .sort(([, a], [, b]) => a.name.localeCompare(b.name, "uk"))
    .map(([studentId, item]) => {
      const total = item.present + item.absent;
      return [
        studentId,
        item.name,
        item.groupId,
        item.present,
        item.absent,
        total,
        total ? Math.round((item.present / total) * 1000) / 10 : 0,
        item.lastDate,
      ];
    });

  const client = getSheetsClient();
  const range = `${quoteSheet(SHEET_NAMES.statistics)}!A2:H`;
  await client.spreadsheets.values.clear({
    spreadsheetId: spreadsheetId(),
    range,
  });
  if (values.length) {
    await client.spreadsheets.values.update({
      spreadsheetId: spreadsheetId(),
      range: `${quoteSheet(SHEET_NAMES.statistics)}!A2:H${values.length + 1}`,
      valueInputOption: "RAW",
      requestBody: { values },
    });
  }
}
