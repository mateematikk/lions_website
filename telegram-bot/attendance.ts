import { buildSessionId } from "./callback";
import type {
  AttendanceMark,
  AttendanceSession,
  Student,
  Trainer,
} from "./types";

export function buildAttendanceRows(
  session: AttendanceSession,
  students: Student[],
  marks: AttendanceMark[],
  trainer: Trainer,
  markedAt = new Date().toISOString()
): string[][] {
  const markByStudent = new Map(marks.map((mark) => [mark.studentId, mark.present]));
  const sessionId = buildSessionId(session);

  return students.map((student) => [
    sessionId,
    session.date,
    session.time,
    session.locationId,
    session.groupId,
    student.id,
    student.name,
    markByStudent.get(student.id) ? "Присутній" : "Відсутній",
    trainer.telegramId,
    trainer.name,
    markedAt,
  ]);
}
