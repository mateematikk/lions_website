import { callbackData, parseCallbackData } from "./callback";
import { LOCATION_LABELS } from "./config";
import { STATS_PAGE_SIZE } from "./stats";
import { groupButtonLabel, locationShortLabel } from "./ui";
import type {
  AttendanceMark,
  AttendanceSession,
  InlineKeyboardButton,
  InlineKeyboardMarkup,
  Student,
  Trainer,
  TrainingGroup,
} from "./types";

export const PRESENT_MARK = "✅";
export const ABSENT_MARK = "⬜️";

function cancelRow(): InlineKeyboardMarkup["inline_keyboard"][number] {
  return [{ text: "Скасувати", callback_data: callbackData.cancel() }];
}

function menuRow(): InlineKeyboardMarkup["inline_keyboard"][number] {
  return [{ text: "🏠 Меню", callback_data: callbackData.menuHome() }];
}

function chunkButtons(
  buttons: InlineKeyboardButton[],
  size: number
): InlineKeyboardMarkup["inline_keyboard"] {
  const rows: InlineKeyboardMarkup["inline_keyboard"] = [];
  for (let index = 0; index < buttons.length; index += size) {
    rows.push(buttons.slice(index, index + size));
  }
  return rows;
}

function trainerLocationIds(trainer: Trainer, allowedIds?: string[]): string[] {
  const ids = trainer.locationIds.includes("*")
    ? Object.keys(LOCATION_LABELS)
    : trainer.locationIds;
  const filtered = ids.filter((id) => LOCATION_LABELS[id]);
  if (!allowedIds?.length) return filtered;
  const allowed = new Set(allowedIds);
  return filtered.filter((id) => allowed.has(id));
}

/** Main hub shown after /start. */
export function mainMenuKeyboard(): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: "✅ Облік", callback_data: callbackData.menuAttendance() },
        { text: "📊 Статистика", callback_data: callbackData.menuStats() },
      ],
    ],
  };
}

export function locationsKeyboard(
  trainer: Trainer,
  allowedLocationIds?: string[]
): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      ...trainerLocationIds(trainer, allowedLocationIds).map((id) => [
        {
          text: locationShortLabel(id),
          callback_data: callbackData.location(id),
        },
      ]),
      menuRow(),
      cancelRow(),
    ],
  };
}

/** Location picker for the /stats flow. */
export function statsLocationsKeyboard(
  trainer: Trainer,
  allowedLocationIds?: string[]
): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      ...trainerLocationIds(trainer, allowedLocationIds).map((id) => [
        {
          text: locationShortLabel(id),
          callback_data: callbackData.statsLocation(id),
        },
      ]),
      menuRow(),
      cancelRow(),
    ],
  };
}

export function groupsKeyboard(
  locationId: string,
  groups: TrainingGroup[]
): InlineKeyboardMarkup {
  const buttons = groups.map((group) => ({
    text: groupButtonLabel(group.name),
    callback_data: callbackData.group(locationId, group.id),
  }));
  return {
    inline_keyboard: [...chunkButtons(buttons, 2), menuRow(), cancelRow()],
  };
}

/** Group picker for the /stats flow. */
export function statsGroupsKeyboard(
  locationId: string,
  groups: TrainingGroup[]
): InlineKeyboardMarkup {
  const buttons = groups.map((group) => ({
    text: groupButtonLabel(group.name),
    callback_data: callbackData.statsGroup(locationId, group.id),
  }));
  return {
    inline_keyboard: [...chunkButtons(buttons, 2), menuRow(), cancelRow()],
  };
}

/** Actions under a group statistics report. */
export function statsGroupActionsKeyboard(
  locationId: string,
  groupId: string,
  options?: { showAll?: boolean; page?: number; total?: number }
): InlineKeyboardMarkup {
  const showAll = options?.showAll ?? false;
  const page = options?.page ?? 0;
  const total = options?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / STATS_PAGE_SIZE));
  const rows: InlineKeyboardMarkup["inline_keyboard"] = [];

  if (showAll) {
    const nav: InlineKeyboardMarkup["inline_keyboard"][number] = [];
    if (page > 0) {
      nav.push({
        text: "← Назад",
        callback_data: callbackData.statsAll(locationId, groupId, page - 1),
      });
    }
    if (page + 1 < totalPages) {
      nav.push({
        text: "Далі →",
        callback_data: callbackData.statsAll(locationId, groupId, page + 1),
      });
    }
    if (nav.length) rows.push(nav);
    rows.push([
      {
        text: "Топ пропусків",
        callback_data: callbackData.statsGroup(locationId, groupId),
      },
    ]);
  } else {
    rows.push([
      {
        text: "Показати всіх",
        callback_data: callbackData.statsAll(locationId, groupId, 0),
      },
    ]);
  }

  rows.push([
    {
      text: "Знайти учня",
      callback_data: callbackData.statsPick(locationId, groupId, 0),
    },
  ]);
  rows.push([
    {
      text: "Інша група",
      callback_data: callbackData.statsLocation(locationId),
    },
  ]);
  rows.push([
    { text: "✅ Нове заняття", callback_data: callbackData.menuAttendance() },
  ]);
  rows.push(menuRow());
  rows.push(cancelRow());
  return { inline_keyboard: rows };
}

/** Paginated student picker for stats. */
export function statsStudentsKeyboard(
  locationId: string,
  groupId: string,
  students: Student[],
  page: number
): InlineKeyboardMarkup {
  const totalPages = Math.max(1, Math.ceil(students.length / STATS_PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 0), totalPages - 1);
  const slice = students.slice(
    safePage * STATS_PAGE_SIZE,
    safePage * STATS_PAGE_SIZE + STATS_PAGE_SIZE
  );
  const rows: InlineKeyboardMarkup["inline_keyboard"] = slice.map((student) => [
    {
      text: student.name,
      callback_data: callbackData.statsStudent(locationId, groupId, student.id),
    },
  ]);

  const nav: InlineKeyboardMarkup["inline_keyboard"][number] = [];
  if (safePage > 0) {
    nav.push({
      text: "← Назад",
      callback_data: callbackData.statsPick(locationId, groupId, safePage - 1),
    });
  }
  if (safePage + 1 < totalPages) {
    nav.push({
      text: "Далі →",
      callback_data: callbackData.statsPick(locationId, groupId, safePage + 1),
    });
  }
  if (nav.length) rows.push(nav);

  rows.push([
    {
      text: "До звіту групи",
      callback_data: callbackData.statsGroup(locationId, groupId),
    },
  ]);
  rows.push(menuRow());
  rows.push(cancelRow());
  return { inline_keyboard: rows };
}

/** Navigation under a single-student stats report. */
export function statsStudentActionsKeyboard(
  locationId: string,
  groupId: string
): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        {
          text: "Назад до групи",
          callback_data: callbackData.statsGroup(locationId, groupId),
        },
      ],
      menuRow(),
      cancelRow(),
    ],
  };
}

/** Actions after attendance is saved. */
export function savedSessionKeyboard(
  locationId: string,
  groupId: string
): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: "Ще заняття", callback_data: callbackData.menuAttendance() },
        {
          text: "📊 Статистика групи",
          callback_data: callbackData.statsGroup(locationId, groupId),
        },
      ],
      menuRow(),
    ],
  };
}

export function datesKeyboard(
  locationId: string,
  groupId: string,
  dates: string[]
): InlineKeyboardMarkup {
  const today = toIsoDate(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setHours(12, 0, 0, 0);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = toIsoDate(yesterdayDate);

  return {
    inline_keyboard: [
      ...dates.map((iso) => {
        const date = new Date(`${iso}T12:00:00`);
        const prefix =
          iso === today ? "Сьогодні · " : iso === yesterday ? "Учора · " : "";
        return [
          {
            text: `${prefix}${formatDateLabel(date)}`,
            callback_data: callbackData.date(locationId, groupId, iso),
          },
        ];
      }),
      menuRow(),
      cancelRow(),
    ],
  };
}

export function timesKeyboard(
  locationId: string,
  groupId: string,
  date: string,
  times: string[]
): InlineKeyboardMarkup {
  const uniqueTimes = [...new Set(times.filter(Boolean))].sort();

  return {
    inline_keyboard: [
      ...uniqueTimes.map((time) => [
        {
          text: time,
          callback_data: callbackData.time({ locationId, groupId, date, time }),
        },
      ]),
      menuRow(),
      cancelRow(),
    ],
  };
}

export function studentButtonText(name: string, present: boolean): string {
  return `${present ? PRESENT_MARK : ABSENT_MARK} ${name}`;
}

export function studentNameFromButton(text: string): string {
  return text.replace(/^(✅|⬜️|✓|○)\s+/u, "");
}

export function attendanceKeyboard(
  students: Student[],
  session: AttendanceSession
): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      ...students.map((student) => [
        {
          text: studentButtonText(student.name, false),
          callback_data: callbackData.student(student.id, false),
        },
      ]),
      [
        { text: "✅ Відмітити всіх", callback_data: callbackData.all(true) },
        { text: "⬜️ Очистити", callback_data: callbackData.all(false) },
      ],
      [
        {
          text: "💾 Зберегти",
          callback_data: callbackData.finish(session),
        },
      ],
      [
        {
          text: "➕ Додати учня",
          callback_data: callbackData.addStudent(session),
        },
      ],
      menuRow(),
      cancelRow(),
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
      text: studentButtonText(studentNameFromButton(button.text), present),
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
    text: studentButtonText(studentNameFromButton(button.text), present),
    callback_data: callbackData.student(action.studentId, present),
  }));
}

/** Reads the attendance session encoded in the finish button. */
export function sessionFromKeyboard(
  keyboard?: InlineKeyboardMarkup
): AttendanceSession | null {
  if (!keyboard) return null;
  for (const row of keyboard.inline_keyboard) {
    for (const button of row) {
      const action = parseCallbackData(button.callback_data);
      if (action.type === "finish") return action.session;
    }
  }
  return null;
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
