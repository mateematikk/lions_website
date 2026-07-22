import assert from "node:assert/strict";
import test from "node:test";
import { canAccessLocation } from "../access";
import { buildAttendanceRows } from "../attendance";
import { buildSessionId, callbackData, parseCallbackData } from "../callback";
import {
  attendanceKeyboard,
  attendanceMarks,
  toggleAll,
  toggleStudent,
} from "../keyboards";
import { normalizePrivateKey, unwrapEnvValue } from "../sheets";
import {
  averageAttendanceRate,
  formatGroupStatsText,
  formatStudentStatsText,
  lowestAttendance,
  rowToStudentStat,
} from "../stats";
import type {
  AttendanceSession,
  Student,
  StudentStat,
  Trainer,
  TrainingGroup,
} from "../types";
import { canAccessGroup, filterGroupsForTrainer, locationsFromGroups } from "../access";

const session: AttendanceSession = {
  locationId: "pozniaky",
  groupId: "poz-adults",
  date: "2026-07-18",
  time: "20:00",
};

const trainer: Trainer = {
  telegramId: "123",
  name: "Тренер",
  locationIds: ["pozniaky"],
  groupIds: [],
  active: true,
};

const students: Student[] = [
  { id: "s-1", name: "Іван", groupId: "poz-adults", active: true },
  { id: "s-2", name: "Олена", groupId: "poz-adults", active: true },
];

test("callback data round-trips attendance session", () => {
  const action = parseCallbackData(callbackData.finish(session));
  assert.deepEqual(action, { type: "finish", session });
});

test("stats callback data round-trips", () => {
  assert.deepEqual(parseCallbackData(callbackData.statsLocation("pozniaky")), {
    type: "stats-location",
    locationId: "pozniaky",
  });
  assert.deepEqual(parseCallbackData(callbackData.statsGroup("pozniaky", "poz-kids")), {
    type: "stats-group",
    locationId: "pozniaky",
    groupId: "poz-kids",
  });
  assert.deepEqual(parseCallbackData(callbackData.statsAll("pozniaky", "poz-kids", 2)), {
    type: "stats-all",
    locationId: "pozniaky",
    groupId: "poz-kids",
    page: 2,
  });
  assert.deepEqual(
    parseCallbackData(callbackData.statsStudent("pozniaky", "poz-kids", "s-1")),
    {
      type: "stats-student",
      locationId: "pozniaky",
      groupId: "poz-kids",
      studentId: "s-1",
    }
  );
  assert.deepEqual(parseCallbackData(callbackData.menuAttendance()), {
    type: "menu-attendance",
  });
  assert.deepEqual(parseCallbackData(callbackData.menuStats()), {
    type: "menu-stats",
  });
  assert.deepEqual(parseCallbackData(callbackData.menuHome()), {
    type: "menu-home",
  });
});

test("callback parser rejects malformed data", () => {
  assert.deepEqual(parseCallbackData("D|only|two"), { type: "unknown" });
  assert.deepEqual(parseCallbackData("nope"), { type: "unknown" });
  assert.deepEqual(parseCallbackData("SA|pozniaky|poz-kids|-1"), { type: "unknown" });
});

test("session id is deterministic", () => {
  assert.equal(
    buildSessionId(session),
    "2026-07-18_20:00_pozniaky_poz-adults"
  );
});

test("location access supports explicit locations and wildcard", () => {
  assert.equal(canAccessLocation(trainer, "pozniaky"), true);
  assert.equal(canAccessLocation(trainer, "darnytsia"), false);
  assert.equal(
    canAccessLocation({ ...trainer, locationIds: ["*"] }, "darnytsia"),
    true
  );
  assert.equal(canAccessLocation({ ...trainer, active: false }, "pozniaky"), false);
});

test("group_ids restrict trainer groups and enable single-group shortcut", () => {
  const groups: TrainingGroup[] = [
    {
      id: "poz-adults",
      locationId: "pozniaky",
      name: "Дорослі",
      day: "Вівторок",
      time: "20:00",
      active: true,
    },
    {
      id: "poz-kids",
      locationId: "pozniaky",
      name: "Діти",
      day: "Вівторок",
      time: "18:00",
      active: true,
    },
  ];
  const yura: Trainer = {
    ...trainer,
    name: "Юра",
    groupIds: ["poz-adults"],
  };
  const accessible = filterGroupsForTrainer(yura, groups);
  assert.deepEqual(
    accessible.map((group) => group.id),
    ["poz-adults"]
  );
  assert.deepEqual(locationsFromGroups(accessible), ["pozniaky"]);
  assert.equal(canAccessGroup(yura, "pozniaky", "poz-kids"), false);
  assert.equal(canAccessGroup(yura, "pozniaky", "poz-adults"), true);
});

test("schedule helpers keep only training weekdays and times", async () => {
  const { getScheduledDates, getTimesForDate, matchesGroupDay } = await import(
    "../schedule"
  );
  assert.equal(matchesGroupDay("Вівторок", "2026-07-21"), true); // Tuesday
  assert.equal(matchesGroupDay("Вівторок", "2026-07-22"), false); // Wednesday

  const rows: TrainingGroup[] = [
    {
      id: "poz-adults",
      locationId: "pozniaky",
      name: "Дорослі",
      day: "Вівторок",
      time: "20:00",
      active: true,
    },
    {
      id: "poz-adults",
      locationId: "pozniaky",
      name: "Дорослі",
      day: "Четвер",
      time: "20:00",
      active: true,
    },
  ];

  assert.deepEqual(getTimesForDate(rows, "2026-07-21"), ["20:00"]);
  assert.deepEqual(getTimesForDate(rows, "2026-07-22"), []);

  const dates = getScheduledDates(rows, 7);
  for (const iso of dates) {
    const day = new Date(`${iso}T12:00:00`).getDay();
    assert.ok(day === 2 || day === 4, `unexpected weekday for ${iso}`);
  }
});

test("attendance keyboard toggles one student and all students", () => {
  const keyboard = attendanceKeyboard(students, session);
  const oneSelected = toggleStudent(keyboard, "s-1");
  assert.deepEqual(attendanceMarks(oneSelected), [
    { studentId: "s-1", present: true },
    { studentId: "s-2", present: false },
  ]);

  const allSelected = toggleAll(oneSelected, true);
  assert.deepEqual(attendanceMarks(allSelected), [
    { studentId: "s-1", present: true },
    { studentId: "s-2", present: true },
  ]);
});

test("attendance rows include present and absent statuses", () => {
  const rows = buildAttendanceRows(
    session,
    students,
    [
      { studentId: "s-1", present: true },
      { studentId: "s-2", present: false },
    ],
    trainer,
    "2026-07-18T12:00:00.000Z"
  );

  assert.equal(rows.length, 2);
  assert.equal(rows[0][7], "Присутній");
  assert.equal(rows[1][7], "Відсутній");
  assert.equal(rows[0][8], "123");
  assert.equal(rows[0][10], "2026-07-18T12:00:00.000Z");
});

test("Vercel environment values accept wrapping quotes and escaped newlines", () => {
  assert.equal(unwrapEnvValue('"service@example.com"'), "service@example.com");
  assert.equal(
    normalizePrivateKey('"-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n"'),
    "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n"
  );
});

const sampleStats: StudentStat[] = [
  {
    studentId: "s-1",
    name: "Іван",
    groupId: "poz-kids",
    present: 2,
    absent: 8,
    total: 10,
    rate: 20,
    lastDate: "2026-07-10",
  },
  {
    studentId: "s-2",
    name: "Олена",
    groupId: "poz-kids",
    present: 9,
    absent: 1,
    total: 10,
    rate: 90,
    lastDate: "2026-07-18",
  },
  {
    studentId: "s-3",
    name: "Марія",
    groupId: "poz-kids",
    present: 4,
    absent: 6,
    total: 10,
    rate: 40,
    lastDate: "2026-07-12",
  },
];

test("stats helpers sort lowest attendance and average rate", () => {
  assert.deepEqual(
    lowestAttendance(sampleStats, 2).map((item) => item.studentId),
    ["s-1", "s-3"]
  );
  assert.equal(averageAttendanceRate(sampleStats), 50);
});

test("stats row parser and text formatters", () => {
  const parsed = rowToStudentStat([
    "s-9",
    "Петро",
    "poz-kids",
    "3",
    "1",
    "4",
    "75",
    "2026-07-19",
  ]);
  assert.equal(parsed?.rate, 75);
  assert.match(
    formatGroupStatsText("Діти", "Позняки", sampleStats),
    /Середня відвідуваність: <b>50%<\/b>/
  );
  assert.match(
    formatGroupStatsText("Діти", "Позняки", sampleStats),
    /🔴 Іван/
  );
  assert.match(
    formatStudentStatsText(parsed, "Діти"),
    /Відвідуваність: <b>75%<\/b>/
  );
  assert.match(
    formatStudentStatsText(null, "Діти", "Новий учень"),
    /Немає даних/
  );
});

test("UI helpers shorten locations and decorate groups", async () => {
  const { groupButtonLabel, locationShortLabel, rateMarker } = await import("../ui");
  assert.equal(locationShortLabel("pozniaky"), "📍 Мишуги");
  assert.equal(groupButtonLabel("Діти · MMA"), "🥊 Діти · MMA");
  assert.equal(rateMarker(95), "🟢");
  assert.equal(rateMarker(75), "🟡");
  assert.equal(rateMarker(20), "🔴");
});
