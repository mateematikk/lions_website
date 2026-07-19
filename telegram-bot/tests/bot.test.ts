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
import type {
  AttendanceSession,
  Student,
  Trainer,
} from "../types";

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

test("callback parser rejects malformed data", () => {
  assert.deepEqual(parseCallbackData("D|only|two"), { type: "unknown" });
  assert.deepEqual(parseCallbackData("nope"), { type: "unknown" });
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
