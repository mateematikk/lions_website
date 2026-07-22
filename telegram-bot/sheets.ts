import { google, sheets_v4 } from "googleapis";
import { filterGroupsForTrainer } from "./access";
import { buildAttendanceRows } from "./attendance";
import { buildSessionId } from "./callback";
import {
  isActive,
  requireEnv,
  SHEET_HEADERS,
  SHEET_NAMES,
} from "./config";
import { rowToStudentStat } from "./stats";
import { getScheduledDates, getTimesForDate } from "./schedule";
import type {
  AttendanceMark,
  AttendanceSession,
  Student,
  StudentStat,
  Trainer,
  TrainingGroup,
} from "./types";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

let sheetsClient: sheets_v4.Sheets | null = null;
let initialization: Promise<void> | null = null;

function getSheetsClient(): sheets_v4.Sheets {
  if (sheetsClient) return sheetsClient;

  const auth = new google.auth.JWT({
    email: unwrapEnvValue(requireEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL")),
    key: normalizePrivateKey(requireEnv("GOOGLE_PRIVATE_KEY")),
    scopes: [SHEETS_SCOPE],
  });
  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

function spreadsheetId(): string {
  const value = unwrapEnvValue(requireEnv("GOOGLE_SHEET_ID"));
  const match = value.match(/\/spreadsheets\/d\/([^/]+)/);
  return match?.[1] ?? value;
}

export function unwrapEnvValue(value: string): string {
  const trimmed = value.trim();
  const hasMatchingQuotes =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"));
  return hasMatchingQuotes ? trimmed.slice(1, -1) : trimmed;
}

export function normalizePrivateKey(value: string): string {
  return unwrapEnvValue(value).replace(/\\n/g, "\n");
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
  const rows = await readRows(SHEET_NAMES.trainers, "A2:E");
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
    groupIds: (row[4] ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
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

/**
 * Returns distinct active groups the trainer can access across locations.
 */
export async function getAccessibleGroups(trainer: Trainer): Promise<TrainingGroup[]> {
  const rows = await readRows(SHEET_NAMES.groups, "A2:F");
  return filterGroupsForTrainer(trainer, rows.map(rowToGroup));
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

export async function getSessionTimes(groupId: string, date: string): Promise<string[]> {
  const rows = await readRows(SHEET_NAMES.groups, "A2:F");
  const groups = rows.map(rowToGroup).filter((group) => group.active && group.id === groupId);
  return getTimesForDate(groups, date);
}

/**
 * Returns recent calendar dates that match the group's schedule in Групи.
 */
export async function getGroupSessionDates(groupId: string): Promise<string[]> {
  const rows = await readRows(SHEET_NAMES.groups, "A2:F");
  const groups = rows.map(rowToGroup).filter((group) => group.active && group.id === groupId);
  return getScheduledDates(groups);
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

/**
 * Allocates the next s-NNN student id from the Учні sheet.
 */
export async function allocateStudentId(): Promise<string> {
  const rows = await readRows(SHEET_NAMES.students, "A2:A");
  let max = 0;
  for (const row of rows) {
    const match = /^s-(\d+)$/i.exec(String(row[0] ?? "").trim());
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `s-${String(max + 1).padStart(3, "0")}`;
}

/**
 * Appends a new active student to the Учні sheet.
 */
export async function addStudentToGroup(
  name: string,
  groupId: string
): Promise<Student> {
  await initializeWorkbook();
  const existing = await getStudentsForGroup(groupId);
  const duplicate = existing.find(
    (student) => student.name.localeCompare(name, "uk", { sensitivity: "accent" }) === 0
  );
  if (duplicate) {
    throw new Error(`STUDENT_EXISTS:${duplicate.id}`);
  }

  const id = await allocateStudentId();
  const student: Student = { id, name, groupId, active: true };
  await getSheetsClient().spreadsheets.values.append({
    spreadsheetId: spreadsheetId(),
    range: `${quoteSheet(SHEET_NAMES.students)}!A:D`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [[id, name, groupId, "TRUE"]] },
  });
  return student;
}

/**
 * Reads aggregated statistics for every student in a group.
 */
export async function getStatisticsForGroup(groupId: string): Promise<StudentStat[]> {
  const rows = await readRows(SHEET_NAMES.statistics, "A2:H");
  return rows
    .map(rowToStudentStat)
    .filter((item): item is StudentStat => item !== null && item.groupId === groupId)
    .sort((a, b) => a.name.localeCompare(b.name, "uk"));
}

/**
 * Reads aggregated statistics for one student.
 */
export async function getStatisticsForStudent(
  studentId: string
): Promise<StudentStat | null> {
  const rows = await readRows(SHEET_NAMES.statistics, "A2:H");
  for (const row of rows) {
    const item = rowToStudentStat(row);
    if (item?.studentId === studentId) return item;
  }
  return null;
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
