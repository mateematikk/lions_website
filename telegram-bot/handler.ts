import { canAccessLocation } from "./access";
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
  getGroup,
  getGroupsForLocation,
  getSessionTimes,
  getStatisticsForGroup,
  getStatisticsForStudent,
  getStudentsForGroup,
  getTrainer,
  initializeWorkbook,
  saveAttendance,
} from "./sheets";
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
  CallbackQuery,
  TelegramMessage,
  TelegramUpdate,
  Trainer,
} from "./types";
import {
  escapeHtml,
  formatFlowHeader,
  formatUiDate,
  locationAddressLabel,
  locationShortLabel,
} from "./ui";

const ATTENDANCE_STEPS = 4;

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
      message.text.startsWith("/attendance")
    ) {
      await sendMessage(
        message.chat.id,
        "Облік і статистика доступні лише в особистому чаті з ботом."
      );
    }
    return;
  }

  const isStart = message.text.startsWith("/start");
  const isAttendance = message.text.startsWith("/attendance");
  const isStats = message.text.startsWith("/stats");
  if (!isStart && !isAttendance && !isStats) return;

  await initializeWorkbook();
  const trainer = await getTrainer(message.from.id);
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

  if (isStats) {
    await sendMessage(
      message.chat.id,
      formatFlowHeader({
        title: "Статистика",
        hint: `Вітаю, ${escapeHtml(trainer.name)}. Оберіть локацію:`,
      }),
      statsLocationsKeyboard(trainer)
    );
    return;
  }

  if (isAttendance) {
    await sendMessage(
      message.chat.id,
      formatFlowHeader({
        title: "Облік відвідуваності",
        step: 1,
        steps: ATTENDANCE_STEPS,
        crumbs: [],
        hint: "Оберіть локацію:",
      }),
      locationsKeyboard(trainer)
    );
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
      await editMessageText(
        message.chat.id,
        message.message_id,
        formatFlowHeader({
          title: "Облік відвідуваності",
          step: 1,
          steps: ATTENDANCE_STEPS,
          crumbs: [],
          hint: "Оберіть локацію:",
        }),
        locationsKeyboard(trainer)
      );
      return;
    }

    if (action.type === "menu-stats") {
      await answerCallbackQuery(query.id);
      await editMessageText(
        message.chat.id,
        message.message_id,
        formatFlowHeader({
          title: "Статистика",
          hint: "Оберіть локацію:",
        }),
        statsLocationsKeyboard(trainer)
      );
      return;
    }

    if (action.type === "location") {
      assertLocationAccess(trainer, action.locationId);
      const groups = await getGroupsForLocation(action.locationId);
      await answerCallbackQuery(query.id);
      await editMessageText(
        message.chat.id,
        message.message_id,
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
            )}</b> ще не додано груп.`,
        groups.length ? groupsKeyboard(action.locationId, groups) : mainMenuKeyboard()
      );
      return;
    }

    if (action.type === "group") {
      await assertGroupAccess(trainer, action.locationId, action.groupId);
      const group = await getGroup(action.groupId);
      await answerCallbackQuery(query.id);
      await editMessageText(
        message.chat.id,
        message.message_id,
        formatFlowHeader({
          title: "Облік відвідуваності",
          step: 3,
          steps: ATTENDANCE_STEPS,
          crumbs: [
            locationShortLabel(action.locationId),
            group?.name ?? action.groupId,
          ],
          hint: "Оберіть дату заняття:",
        }),
        datesKeyboard(action.locationId, action.groupId)
      );
      return;
    }

    if (action.type === "date") {
      await assertGroupAccess(trainer, action.locationId, action.groupId);
      const group = await getGroup(action.groupId);
      const times = await getSessionTimes(action.groupId, action.date);
      await answerCallbackQuery(query.id);
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
      const [group, students] = await Promise.all([
        getGroup(action.session.groupId),
        getStudentsForGroup(action.session.groupId),
      ]);
      if (!students.length) {
        await answerCallbackQuery(query.id, "У цій групі ще немає учнів", true);
        return;
      }
      if (students.length > 90) {
        await answerCallbackQuery(
          query.id,
          "У групі понад 90 учнів. Розділіть її на менші групи.",
          true
        );
        return;
      }
      const keyboard = attendanceKeyboard(students, action.session);
      await answerCallbackQuery(query.id);
      await editMessageText(
        message.chat.id,
        message.message_id,
        attendanceText(
          action.session.locationId,
          group?.name ?? action.session.groupId,
          action.session.date,
          action.session.time,
          0,
          students.length
        ),
        keyboard
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
      const groups = await getGroupsForLocation(action.locationId);
      await answerCallbackQuery(query.id);
      await editMessageText(
        message.chat.id,
        message.message_id,
        groups.length
          ? formatFlowHeader({
              title: "Статистика",
              crumbs: [locationShortLabel(action.locationId)],
              address: locationAddressLabel(action.locationId),
              hint: "Оберіть групу:",
            })
          : `Для локації <b>${escapeHtml(
              locationAddressLabel(action.locationId)
            )}</b> ще не додано груп.`,
        groups.length
          ? statsGroupsKeyboard(action.locationId, groups)
          : mainMenuKeyboard()
      );
      return;
    }

    if (action.type === "stats-group") {
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
          { crumbs }
        ),
        statsGroupActionsKeyboard(action.locationId, action.groupId, {
          total: stats.length,
        })
      );
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
  assertLocationAccess(trainer, locationId);
  const group = await getGroup(groupId);
  if (!group || group.locationId !== locationId) {
    throw new Error(`Group ${groupId} does not belong to ${locationId}`);
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
