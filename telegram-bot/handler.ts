import {
  canAccessGroup,
  canAccessLocation,
  filterGroupsForTrainer,
  locationsFromGroups,
} from "./access";
import { parseCallbackData } from "./callback";
import {
  attendanceCount,
  attendanceKeyboard,
  attendanceMarks,
  datesKeyboard,
  groupsKeyboard,
  locationsKeyboard,
  mainMenuKeyboard,
  savedSessionKeyboard,
  sessionFromKeyboard,
  statsGroupActionsKeyboard,
  statsGroupsKeyboard,
  statsLocationsKeyboard,
  statsStudentActionsKeyboard,
  statsStudentsKeyboard,
  timesKeyboard,
  toggleAll,
  toggleStudent,
} from "./keyboards";
import {
  getAccessibleGroups,
  getGroup,
  getGroupSessionDates,
  getGroupsForLocation,
  getSessionTimes,
  getStatisticsForGroup,
  getStatisticsForStudent,
  getStudentsForGroup,
  getTrainer,
  initializeWorkbook,
  saveAttendance,
  addStudentToGroup,
} from "./sheets";
import {
  buildAddStudentPrompt,
  normalizeStudentName,
  parseAddStudentContext,
} from "./students";
import {
  formatGroupStatsText,
  formatStudentStatsText,
} from "./stats";
import {
  answerCallbackQuery,
  editMessageText,
  sendMessage,
} from "./telegram";
import type {
  AttendanceSession,
  CallbackQuery,
  InlineKeyboardMarkup,
  TelegramMessage,
  TelegramUpdate,
  Trainer,
  TrainingGroup,
} from "./types";
import {
  escapeHtml,
  formatFlowHeader,
  formatUiDate,
  locationAddressLabel,
  locationShortLabel,
} from "./ui";

const ATTENDANCE_STEPS = 4;

type MessageTarget = {
  chatId: number;
  messageId?: number;
};

export async function handleTelegramUpdate(update: TelegramUpdate): Promise<void> {
  if (update.message) {
    await handleMessage(update.message);
    return;
  }
  if (update.callback_query) {
    await handleCallback(update.callback_query);
  }
}

async function handleMessage(message: TelegramMessage): Promise<void> {
  if (!message.from || !message.text) return;

  if (message.chat.type !== "private") {
    if (
      message.text.startsWith("/start") ||
      message.text.startsWith("/stats") ||
      message.text.startsWith("/attendance") ||
      message.text.startsWith("/add")
    ) {
      await sendMessage(
        message.chat.id,
        "Облік і статистика доступні лише в особистому чаті з ботом."
      );
    }
    return;
  }

  await initializeWorkbook();
  const trainer = await getTrainer(message.from.id);

  const addSession = parseAddStudentContext(message.reply_to_message?.text);
  if (addSession) {
    if (!trainer?.active) {
      await sendMessage(
        message.chat.id,
        [
          "<b>Доступ не налаштовано.</b>",
          "",
          "Передайте адміністратору ваш Telegram ID:",
          `<code>${message.from.id}</code>`,
        ].join("\n")
      );
      return;
    }
    await handleAddStudentName(message, trainer, addSession);
    return;
  }

  const isStart = message.text.startsWith("/start");
  const isAttendance = message.text.startsWith("/attendance");
  const isStats = message.text.startsWith("/stats");
  const isAdd = message.text.startsWith("/add");
  if (!isStart && !isAttendance && !isStats && !isAdd) return;

  if (!trainer?.active) {
    await sendMessage(
      message.chat.id,
      [
        "<b>Доступ не налаштовано.</b>",
        "",
        "Передайте адміністратору ваш Telegram ID:",
        `<code>${message.from.id}</code>`,
      ].join("\n")
    );
    return;
  }

  if (!trainer.locationIds.length) {
    await sendMessage(
      message.chat.id,
      "Для вашого профілю не вказано жодної локації. Зверніться до адміністратора."
    );
    return;
  }

  if (isAdd) {
    await handleAddCommand(message, trainer);
    return;
  }

  if (isStats) {
    await presentStatsStart({ chatId: message.chat.id }, trainer);
    return;
  }

  if (isAttendance) {
    await presentAttendanceStart({ chatId: message.chat.id }, trainer);
    return;
  }

  await sendMessage(
    message.chat.id,
    [
      `<b>Lions BJJ</b>`,
      `Вітаю, ${escapeHtml(trainer.name)}.`,
      "",
      "Оберіть дію:",
    ].join("\n"),
    mainMenuKeyboard()
  );
}

async function handleCallback(query: CallbackQuery): Promise<void> {
  const message = query.message;
  if (!message || !query.data) {
    await answerCallbackQuery(query.id);
    return;
  }

  try {
    const trainer = await getTrainer(query.from.id);
    if (!trainer?.active) {
      await answerCallbackQuery(query.id, "У вас немає доступу до обліку", true);
      return;
    }

    const action = parseCallbackData(query.data);
    const target: MessageTarget = {
      chatId: message.chat.id,
      messageId: message.message_id,
    };

    if (action.type === "cancel") {
      await answerCallbackQuery(query.id);
      await editMessageText(
        message.chat.id,
        message.message_id,
        "Дію скасовано. Оберіть, що зробити далі:",
        mainMenuKeyboard()
      );
      return;
    }

    if (action.type === "menu-home") {
      await answerCallbackQuery(query.id);
      await editMessageText(
        message.chat.id,
        message.message_id,
        [
          `<b>Lions BJJ</b>`,
          `Вітаю, ${escapeHtml(trainer.name)}.`,
          "",
          "Оберіть дію:",
        ].join("\n"),
        mainMenuKeyboard()
      );
      return;
    }

    if (action.type === "menu-attendance") {
      await answerCallbackQuery(query.id);
      await presentAttendanceStart(target, trainer);
      return;
    }

    if (action.type === "menu-stats") {
      await answerCallbackQuery(query.id);
      await presentStatsStart(target, trainer);
      return;
    }

    if (action.type === "location") {
      assertLocationAccess(trainer, action.locationId);
      const groups = filterGroupsForTrainer(
        trainer,
        await getGroupsForLocation(action.locationId)
      );
      await answerCallbackQuery(query.id);
      if (groups.length === 1) {
        await presentDatePicker(target, groups[0]);
        return;
      }
      await respond(
        target,
        groups.length
          ? formatFlowHeader({
              title: "Облік відвідуваності",
              step: 2,
              steps: ATTENDANCE_STEPS,
              crumbs: [locationShortLabel(action.locationId)],
              address: locationAddressLabel(action.locationId),
              hint: "Оберіть групу:",
            })
          : `Для локації <b>${escapeHtml(
              locationAddressLabel(action.locationId)
            )}</b> ще не додано доступних груп.`,
        groups.length ? groupsKeyboard(action.locationId, groups) : mainMenuKeyboard()
      );
      return;
    }

    if (action.type === "group") {
      await assertGroupAccess(trainer, action.locationId, action.groupId);
      const group = await getGroup(action.groupId);
      await answerCallbackQuery(query.id);
      if (!group) {
        await respond(target, "Групу не знайдено.", mainMenuKeyboard());
        return;
      }
      await presentDatePicker(target, group);
      return;
    }

    if (action.type === "date") {
      await assertGroupAccess(trainer, action.locationId, action.groupId);
      const [group, times] = await Promise.all([
        getGroup(action.groupId),
        getSessionTimes(action.groupId, action.date),
      ]);
      await answerCallbackQuery(query.id);
      if (!times.length) {
        await respond(
          target,
          [
            formatFlowHeader({
              title: "Облік відвідуваності",
              crumbs: [
                locationShortLabel(action.locationId),
                group?.name ?? action.groupId,
                formatUiDate(action.date),
              ],
              hint: "На цю дату в розкладі немає часу заняття.",
            }),
          ].join("\n"),
          mainMenuKeyboard()
        );
        return;
      }
      if (times.length === 1) {
        await presentAttendanceMarking(target, {
          locationId: action.locationId,
          groupId: action.groupId,
          date: action.date,
          time: times[0],
        });
        return;
      }
      await editMessageText(
        message.chat.id,
        message.message_id,
        formatFlowHeader({
          title: "Облік відвідуваності",
          step: 4,
          steps: ATTENDANCE_STEPS,
          crumbs: [
            locationShortLabel(action.locationId),
            group?.name ?? action.groupId,
            formatUiDate(action.date),
          ],
          hint: "Оберіть час заняття:",
        }),
        timesKeyboard(action.locationId, action.groupId, action.date, times)
      );
      return;
    }

    if (action.type === "time") {
      await assertGroupAccess(
        trainer,
        action.session.locationId,
        action.session.groupId
      );
      await answerCallbackQuery(query.id);
      await presentAttendanceMarking(target, action.session);
      return;
    }

    if (action.type === "add-student") {
      await assertGroupAccess(
        trainer,
        action.session.locationId,
        action.session.groupId
      );
      const group = await getGroup(action.session.groupId);
      await answerCallbackQuery(query.id);
      await sendMessage(
        message.chat.id,
        buildAddStudentPrompt(action.session, group?.name ?? action.session.groupId),
        {
          force_reply: true,
          selective: true,
          input_field_placeholder: "ПІБ учня",
        }
      );
      return;
    }

    if (action.type === "student" || action.type === "all") {
      if (!message.reply_markup) {
        await answerCallbackQuery(query.id, "Список застарів. Відкрийте меню знову", true);
        return;
      }
      const session = sessionFromKeyboard(message.reply_markup);
      if (!session) {
        await answerCallbackQuery(query.id, "Список застарів. Відкрийте меню знову", true);
        return;
      }
      const keyboard =
        action.type === "student"
          ? toggleStudent(message.reply_markup, action.studentId)
          : toggleAll(message.reply_markup, action.present);
      const count = attendanceCount(keyboard);
      const group = await getGroup(session.groupId);
      await answerCallbackQuery(query.id, `Присутні: ${count.selected}/${count.total}`);
      await editMessageText(
        message.chat.id,
        message.message_id,
        attendanceText(
          session.locationId,
          group?.name ?? session.groupId,
          session.date,
          session.time,
          count.selected,
          count.total
        ),
        keyboard
      );
      return;
    }

    if (action.type === "finish") {
      await assertGroupAccess(
        trainer,
        action.session.locationId,
        action.session.groupId
      );
      const marks = attendanceMarks(message.reply_markup);
      if (!marks.length) {
        await answerCallbackQuery(query.id, "Не вдалося прочитати список учнів", true);
        return;
      }
      const group = await getGroup(action.session.groupId);
      await answerCallbackQuery(query.id, "Зберігаю...");
      const result = await saveAttendance(action.session, marks, trainer);
      const crumbs = [
        locationShortLabel(action.session.locationId),
        group?.name ?? action.session.groupId,
        `${formatUiDate(action.session.date)} · ${action.session.time}`,
      ];
      await editMessageText(
        message.chat.id,
        message.message_id,
        [
          "<b>✅ Відвідування збережено</b>",
          escapeHtml(crumbs.join(" → ")),
          escapeHtml(locationAddressLabel(action.session.locationId)),
          "",
          `Присутні: <b>${result.present}</b>`,
          `Відсутні: <b>${result.absent}</b>`,
        ].join("\n"),
        savedSessionKeyboard(action.session.locationId, action.session.groupId)
      );
      return;
    }

    if (action.type === "stats-location") {
      assertLocationAccess(trainer, action.locationId);
      const groups = filterGroupsForTrainer(
        trainer,
        await getGroupsForLocation(action.locationId)
      );
      await answerCallbackQuery(query.id);
      if (groups.length === 1) {
        await presentGroupStats(target, groups[0]);
        return;
      }
      await respond(
        target,
        groups.length
          ? formatFlowHeader({
              title: "Статистика",
              crumbs: [locationShortLabel(action.locationId)],
              address: locationAddressLabel(action.locationId),
              hint: "Оберіть групу:",
            })
          : `Для локації <b>${escapeHtml(
              locationAddressLabel(action.locationId)
            )}</b> ще не додано доступних груп.`,
        groups.length
          ? statsGroupsKeyboard(action.locationId, groups)
          : mainMenuKeyboard()
      );
      return;
    }

    if (action.type === "stats-group") {
      await assertGroupAccess(trainer, action.locationId, action.groupId);
      const group = await getGroup(action.groupId);
      await answerCallbackQuery(query.id);
      if (!group) {
        await respond(target, "Групу не знайдено.", mainMenuKeyboard());
        return;
      }
      await presentGroupStats(target, group);
      return;
    }

    if (action.type === "stats-all") {
      await assertGroupAccess(trainer, action.locationId, action.groupId);
      const [group, stats] = await Promise.all([
        getGroup(action.groupId),
        getStatisticsForGroup(action.groupId),
      ]);
      const crumbs = [
        locationShortLabel(action.locationId),
        group?.name ?? action.groupId,
      ].join(" → ");
      await answerCallbackQuery(query.id);
      await editMessageText(
        message.chat.id,
        message.message_id,
        formatGroupStatsText(
          group?.name ?? action.groupId,
          locationAddressLabel(action.locationId),
          stats,
          { showAll: true, page: action.page, crumbs }
        ),
        statsGroupActionsKeyboard(action.locationId, action.groupId, {
          showAll: true,
          page: action.page,
          total: stats.length,
        })
      );
      return;
    }

    if (action.type === "stats-pick") {
      await assertGroupAccess(trainer, action.locationId, action.groupId);
      const [group, students] = await Promise.all([
        getGroup(action.groupId),
        getStudentsForGroup(action.groupId),
      ]);
      if (!students.length) {
        await answerCallbackQuery(query.id, "У цій групі ще немає учнів", true);
        return;
      }
      await answerCallbackQuery(query.id);
      await editMessageText(
        message.chat.id,
        message.message_id,
        formatFlowHeader({
          title: "Статистика",
          crumbs: [
            locationShortLabel(action.locationId),
            group?.name ?? action.groupId,
          ],
          hint: "Оберіть учня:",
        }),
        statsStudentsKeyboard(action.locationId, action.groupId, students, action.page)
      );
      return;
    }

    if (action.type === "stats-student") {
      await assertGroupAccess(trainer, action.locationId, action.groupId);
      const [group, students, stat] = await Promise.all([
        getGroup(action.groupId),
        getStudentsForGroup(action.groupId),
        getStatisticsForStudent(action.studentId),
      ]);
      const student = students.find((item) => item.id === action.studentId);
      if (stat && stat.groupId !== action.groupId) {
        await answerCallbackQuery(query.id, "Учень не з цієї групи", true);
        return;
      }
      if (!student && !stat) {
        await answerCallbackQuery(query.id, "Учня не знайдено", true);
        return;
      }
      await answerCallbackQuery(query.id);
      await editMessageText(
        message.chat.id,
        message.message_id,
        formatStudentStatsText(
          stat,
          group?.name ?? action.groupId,
          student?.name ?? stat?.name
        ),
        statsStudentActionsKeyboard(action.locationId, action.groupId)
      );
      return;
    }

    await answerCallbackQuery(query.id, "Невідома або застаріла дія", true);
  } catch (error) {
    console.error("Attendance bot callback failed:", error);
    await answerCallbackQuery(
      query.id,
      "Сталася помилка. Спробуйте /start ще раз.",
      true
    ).catch(() => undefined);
    await sendMessage(
      message.chat.id,
      "Не вдалося виконати дію. Надішліть /start або зверніться до адміністратора."
    ).catch(() => undefined);
  }
}

async function handleAddCommand(
  message: TelegramMessage,
  trainer: Trainer
): Promise<void> {
  const rawName = message.text?.replace(/^\/add(?:@\w+)?\s*/i, "") ?? "";
  const groups = await getAccessibleGroups(trainer);
  if (!groups.length) {
    await sendMessage(
      message.chat.id,
      "Немає доступних груп для вашого профілю.",
      mainMenuKeyboard()
    );
    return;
  }
  if (groups.length !== 1) {
    await sendMessage(
      message.chat.id,
      [
        "Команда <code>/add ПІБ</code> працює, коли у вас одна група.",
        "Або відкрийте облік заняття і натисніть <b>➕ Додати учня</b>.",
      ].join("\n"),
      mainMenuKeyboard()
    );
    return;
  }

  const group = groups[0];
  const name = normalizeStudentName(rawName);
  if (!name) {
    const session: AttendanceSession = {
      locationId: group.locationId,
      groupId: group.id,
      date: todayIsoKyiv(),
      time: group.time || "00:00",
    };
    await sendMessage(
      message.chat.id,
      buildAddStudentPrompt(session, group.name),
      {
        force_reply: true,
        selective: true,
        input_field_placeholder: "ПІБ учня",
      }
    );
    return;
  }

  await addStudentAndConfirm(message.chat.id, trainer, {
    locationId: group.locationId,
    groupId: group.id,
    date: todayIsoKyiv(),
    time: group.time || "00:00",
  }, name);
}

async function handleAddStudentName(
  message: TelegramMessage,
  trainer: Trainer,
  session: AttendanceSession
): Promise<void> {
  await assertGroupAccess(trainer, session.locationId, session.groupId);
  const name = normalizeStudentName(message.text ?? "");
  if (!name) {
    await sendMessage(
      message.chat.id,
      "Надішліть коректне ПІБ (2–80 символів) у відповідь на запит додавання."
    );
    return;
  }
  await addStudentAndConfirm(message.chat.id, trainer, session, name);
}

async function addStudentAndConfirm(
  chatId: number,
  trainer: Trainer,
  session: AttendanceSession,
  name: string
): Promise<void> {
  try {
    const student = await addStudentToGroup(name, session.groupId);
    const group = await getGroup(session.groupId);
    await sendMessage(
      chatId,
      [
        "<b>✅ Учня додано</b>",
        `${escapeHtml(student.name)} · <code>${escapeHtml(student.id)}</code>`,
        `Група: ${escapeHtml(group?.name ?? session.groupId)}`,
      ].join("\n")
    );
    await presentAttendanceMarking({ chatId }, session);
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error);
    if (text.startsWith("STUDENT_EXISTS:")) {
      await sendMessage(
        chatId,
        `Учень <b>${escapeHtml(name)}</b> уже є в цій групі.`
      );
      await presentAttendanceMarking({ chatId }, session);
      return;
    }
    console.error("Add student failed:", error);
    await sendMessage(
      chatId,
      "Не вдалося додати учня. Спробуйте ще раз або зверніться до адміністратора."
    );
  }
}

async function presentAttendanceStart(
  target: MessageTarget,
  trainer: Trainer
): Promise<void> {
  const groups = await getAccessibleGroups(trainer);
  if (!groups.length) {
    await respond(
      target,
      "Немає доступних груп для вашого профілю. Зверніться до адміністратора.",
      mainMenuKeyboard()
    );
    return;
  }

  if (groups.length === 1) {
    await presentDatePicker(target, groups[0]);
    return;
  }

  const locationIds = locationsFromGroups(groups);
  if (locationIds.length === 1) {
    const locationId = locationIds[0];
    const locationGroups = groups.filter((group) => group.locationId === locationId);
    await respond(
      target,
      formatFlowHeader({
        title: "Облік відвідуваності",
        step: 2,
        steps: ATTENDANCE_STEPS,
        crumbs: [locationShortLabel(locationId)],
        address: locationAddressLabel(locationId),
        hint: "Оберіть групу:",
      }),
      groupsKeyboard(locationId, locationGroups)
    );
    return;
  }

  await respond(
    target,
    formatFlowHeader({
      title: "Облік відвідуваності",
      step: 1,
      steps: ATTENDANCE_STEPS,
      hint: "Оберіть локацію:",
    }),
    locationsKeyboard(trainer, locationIds)
  );
}

async function presentStatsStart(target: MessageTarget, trainer: Trainer): Promise<void> {
  const groups = await getAccessibleGroups(trainer);
  if (!groups.length) {
    await respond(
      target,
      "Немає доступних груп для вашого профілю. Зверніться до адміністратора.",
      mainMenuKeyboard()
    );
    return;
  }

  if (groups.length === 1) {
    await presentGroupStats(target, groups[0]);
    return;
  }

  const locationIds = locationsFromGroups(groups);
  if (locationIds.length === 1) {
    const locationId = locationIds[0];
    const locationGroups = groups.filter((group) => group.locationId === locationId);
    await respond(
      target,
      formatFlowHeader({
        title: "Статистика",
        crumbs: [locationShortLabel(locationId)],
        address: locationAddressLabel(locationId),
        hint: "Оберіть групу:",
      }),
      statsGroupsKeyboard(locationId, locationGroups)
    );
    return;
  }

  await respond(
    target,
    formatFlowHeader({
      title: "Статистика",
      hint: "Оберіть локацію:",
    }),
    statsLocationsKeyboard(trainer, locationIds)
  );
}

async function presentDatePicker(
  target: MessageTarget,
  group: TrainingGroup
): Promise<void> {
  const dates = await getGroupSessionDates(group.id);
  if (!dates.length) {
    await respond(
      target,
      [
        formatFlowHeader({
          title: "Облік відвідуваності",
          crumbs: [locationShortLabel(group.locationId), group.name],
          address: locationAddressLabel(group.locationId),
          hint:
            "За розкладом у таблиці «Групи» немає днів занять за останні 14 днів. Перевірте колонку «день».",
        }),
      ].join("\n"),
      mainMenuKeyboard()
    );
    return;
  }

  await respond(
    target,
    formatFlowHeader({
      title: "Облік відвідуваності",
      step: 3,
      steps: ATTENDANCE_STEPS,
      crumbs: [locationShortLabel(group.locationId), group.name],
      address: locationAddressLabel(group.locationId),
      hint: "Оберіть дату заняття (лише дні з розкладу):",
    }),
    datesKeyboard(group.locationId, group.id, dates)
  );
}

async function presentAttendanceMarking(
  target: MessageTarget,
  session: {
    locationId: string;
    groupId: string;
    date: string;
    time: string;
  }
): Promise<void> {
  const [group, students] = await Promise.all([
    getGroup(session.groupId),
    getStudentsForGroup(session.groupId),
  ]);
  if (!students.length) {
    await respond(
      target,
      "У цій групі ще немає учнів.",
      mainMenuKeyboard()
    );
    return;
  }
  if (students.length > 90) {
    await respond(
      target,
      "У групі понад 90 учнів. Розділіть її на менші групи.",
      mainMenuKeyboard()
    );
    return;
  }

  await respond(
    target,
    attendanceText(
      session.locationId,
      group?.name ?? session.groupId,
      session.date,
      session.time,
      0,
      students.length
    ),
    attendanceKeyboard(students, session)
  );
}

async function presentGroupStats(
  target: MessageTarget,
  group: TrainingGroup
): Promise<void> {
  const stats = await getStatisticsForGroup(group.id);
  const crumbs = [locationShortLabel(group.locationId), group.name].join(" → ");
  await respond(
    target,
    formatGroupStatsText(group.name, locationAddressLabel(group.locationId), stats, {
      crumbs,
    }),
    statsGroupActionsKeyboard(group.locationId, group.id, { total: stats.length })
  );
}

async function respond(
  target: MessageTarget,
  text: string,
  keyboard?: InlineKeyboardMarkup
): Promise<void> {
  if (target.messageId !== undefined) {
    await editMessageText(target.chatId, target.messageId, text, keyboard);
    return;
  }
  await sendMessage(target.chatId, text, keyboard);
}

function assertLocationAccess(trainer: Trainer, locationId: string): void {
  if (!canAccessLocation(trainer, locationId)) {
    throw new Error(`Trainer ${trainer.telegramId} has no access to ${locationId}`);
  }
}

async function assertGroupAccess(
  trainer: Trainer,
  locationId: string,
  groupId: string
): Promise<void> {
  const group = await getGroup(groupId);
  if (!group || group.locationId !== locationId) {
    throw new Error(`Group ${groupId} does not belong to ${locationId}`);
  }
  if (!canAccessGroup(trainer, locationId, groupId)) {
    throw new Error(`Trainer ${trainer.telegramId} has no access to group ${groupId}`);
  }
}

function attendanceText(
  locationId: string,
  groupName: string,
  date: string,
  time: string,
  selected: number,
  total: number
): string {
  return [
    formatFlowHeader({
      title: "Відмітка присутності",
      crumbs: [
        locationShortLabel(locationId),
        groupName,
        `${formatUiDate(date)} · ${time}`,
      ],
    }),
    "",
    `<b>Присутні: ${selected}/${total}</b>`,
    "Натисніть на учнів, які були присутні.",
  ].join("\n");
}

function todayIsoKyiv(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
