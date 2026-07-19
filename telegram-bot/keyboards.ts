import { callbackData, parseCallbackData } from "./callback";
import { LOCATION_LABELS } from "./config";
import type {
  AttendanceMark,
  AttendanceSession,
  InlineKeyboardMarkup,
  Student,
  Trainer,
  TrainingGroup,
} from "./types";

export function locationsKeyboard(trainer: Trainer): InlineKeyboardMarkup {
  const locationIds = trainer.locationIds.includes("*")
    ? Object.keys(LOCATION_LABELS)
    : trainer.locationIds;
  return {
    inline_keyboard: [
      ...locationIds
        .filter((id) => LOCATION_LABELS[id])
        .map((id) => [
          {
            text: LOCATION_LABELS[id],
            callback_data: callbackData.location(id),
          },
        ]),
      [{ text: "Скасувати", callback_data: callbackData.cancel() }],
    ],
  };
}

export function groupsKeyboard(
  locationId: string,
  groups: TrainingGroup[]
): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      ...groups.map((group) => [
        {
          text: group.name,
          callback_data: callbackData.group(locationId, group.id),
        },
      ]),
      [{ text: "Скасувати", callback_data: callbackData.cancel() }],
    ],
  };
}

export function datesKeyboard(locationId: string, groupId: string): InlineKeyboardMarkup {
  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - index);
    return date;
  });

  return {
    inline_keyboard: [
      ...dates.map((date, index) => [
        {
          text: `${index === 0 ? "Сьогодні · " : index === 1 ? "Учора · " : ""}${formatDateLabel(date)}`,
          callback_data: callbackData.date(locationId, groupId, toIsoDate(date)),
        },
      ]),
      [{ text: "Скасувати", callback_data: callbackData.cancel() }],
    ],
  };
}

export function timesKeyboard(
  locationId: string,
  groupId: string,
  date: string,
  times: string[]
): InlineKeyboardMarkup {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
  const uniqueTimes = [...new Set([...times, currentTime])];

  return {
    inline_keyboard: [
      ...uniqueTimes.map((time) => [
        {
          text: time === currentTime ? `Зараз · ${time}` : time,
          callback_data: callbackData.time({ locationId, groupId, date, time }),
        },
      ]),
      [{ text: "Скасувати", callback_data: callbackData.cancel() }],
    ],
  };
}

export function attendanceKeyboard(
  students: Student[],
  session: AttendanceSession
): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      ...students.map((student) => [
        {
          text: `○ ${student.name}`,
          callback_data: callbackData.student(student.id, false),
        },
      ]),
      [
        { text: "✓ Відмітити всіх", callback_data: callbackData.all(true) },
        { text: "○ Очистити", callback_data: callbackData.all(false) },
      ],
      [
        {
          text: "Зберегти відвідування",
          callback_data: callbackData.finish(session),
        },
      ],
      [{ text: "Скасувати", callback_data: callbackData.cancel() }],
    ],
  };
}

export function toggleStudent(
  keyboard: InlineKeyboardMarkup,
  studentId: string
): InlineKeyboardMarkup {
  return mapStudentButtons(keyboard, (button, action) => {
    if (action.studentId !== studentId) return button;
    const present = !action.present;
    return {
      ...button,
      text: `${present ? "✓" : "○"} ${button.text.slice(2)}`,
      callback_data: callbackData.student(studentId, present),
    };
  });
}

export function toggleAll(
  keyboard: InlineKeyboardMarkup,
  present: boolean
): InlineKeyboardMarkup {
  return mapStudentButtons(keyboard, (button, action) => ({
    ...button,
    text: `${present ? "✓" : "○"} ${button.text.slice(2)}`,
    callback_data: callbackData.student(action.studentId, present),
  }));
}

function mapStudentButtons(
  keyboard: InlineKeyboardMarkup,
  transform: (
    button: InlineKeyboardMarkup["inline_keyboard"][number][number],
    action: Extract<ReturnType<typeof parseCallbackData>, { type: "student" }>
  ) => InlineKeyboardMarkup["inline_keyboard"][number][number]
): InlineKeyboardMarkup {
  return {
    inline_keyboard: keyboard.inline_keyboard.map((row) =>
      row.map((button) => {
        const action = parseCallbackData(button.callback_data);
        return action.type === "student" ? transform(button, action) : button;
      })
    ),
  };
}

export function attendanceMarks(keyboard?: InlineKeyboardMarkup): AttendanceMark[] {
  if (!keyboard) return [];
  return keyboard.inline_keyboard.flatMap((row) =>
    row.flatMap((button) => {
      const action = parseCallbackData(button.callback_data);
      return action.type === "student"
        ? [{ studentId: action.studentId, present: action.present }]
        : [];
    })
  );
}

export function attendanceCount(keyboard: InlineKeyboardMarkup): {
  selected: number;
  total: number;
} {
  const marks = attendanceMarks(keyboard);
  return {
    selected: marks.filter((mark) => mark.present).length,
    total: marks.length,
  };
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(date: Date): string {
  return new Intl.DateTimeFormat("uk-UA", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}
