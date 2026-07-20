import { canAccessLocation } from "./access";
import { parseCallbackData } from "./callback";
import { LOCATION_LABELS } from "./config";
import {
  attendanceCount,
  attendanceKeyboard,
  attendanceMarks,
  datesKeyboard,
  groupsKeyboard,
  locationsKeyboard,
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
  editMessageReplyMarkup,
  editMessageText,
  sendMessage,
} from "./telegram";
import type {
  CallbackQuery,
  TelegramMessage,
  TelegramUpdate,
  Trainer,
} from "./types";

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

  const isAttendance =
    message.text.startsWith("/start") || message.text.startsWith("/attendance");
  const isStats = message.text.startsWith("/stats");
  if (!isAttendance && !isStats) return;

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
      `<b>Статистика відвідуваності</b>\n\nВітаю, ${escapeHtml(
        trainer.name
      )}. Оберіть локацію:`,
      statsLocationsKeyboard(trainer)
    );
    return;
  }

  await sendMessage(
    message.chat.id,
    `<b>Облік відвідуваності</b>\n\nВітаю, ${escapeHtml(trainer.name)}. Оберіть локацію:`,
    locationsKeyboard(trainer)
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
        "Дію скасовано. Надішліть /start або /stats, щоб почати знову."
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
          ? `<b>${escapeHtml(locationLabel(action.locationId))}</b>\n\nОберіть групу:`
          : `Для локації <b>${escapeHtml(locationLabel(action.locationId))}</b> ще не додано груп.`,
        groups.length ? groupsKeyboard(action.locationId, groups) : undefined
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
        `<b>${escapeHtml(group?.name ?? action.groupId)}</b>\n${escapeHtml(
          locationLabel(action.locationId)
        )}\n\nОберіть дату заняття:`,
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
        `<b>${escapeHtml(group?.name ?? action.groupId)}</b>\nДата: ${formatDate(
          action.date
        )}\n\nОберіть час заняття:`,
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

    if (action.type === "student") {
      if (!message.reply_markup) {
        await answerCallbackQuery(query.id, "Список застарів. Почніть з /start", true);
        return;
      }
      const keyboard = toggleStudent(message.reply_markup, action.studentId);
      const count = attendanceCount(keyboard);
      await editMessageReplyMarkup(message.chat.id, message.message_id, keyboard);
      await answerCallbackQuery(query.id, `Відмічено: ${count.selected}/${count.total}`);
      return;
    }

    if (action.type === "all") {
      if (!message.reply_markup) {
        await answerCallbackQuery(query.id, "Список застарів. Почніть з /start", true);
        return;
      }
      const keyboard = toggleAll(message.reply_markup, action.present);
      const count = attendanceCount(keyboard);
      await editMessageReplyMarkup(message.chat.id, message.message_id, keyboard);
      await answerCallbackQuery(query.id, `Відмічено: ${count.selected}/${count.total}`);
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
      await answerCallbackQuery(query.id, "Зберігаю відвідування...");
      const result = await saveAttendance(action.session, marks, trainer);
      await editMessageText(
        message.chat.id,
        message.message_id,
        [
          "<b>Відвідування збережено</b>",
          "",
          `${escapeHtml(group?.name ?? action.session.groupId)}`,
          `${formatDate(action.session.date)} · ${action.session.time}`,
          `${escapeHtml(locationLabel(action.session.locationId))}`,
          "",
          `Присутні: <b>${result.present}</b>`,
          `Відсутні: <b>${result.absent}</b>`,
          "",
          "Надішліть /start для нового заняття або /stats для статистики.",
        ].join("\n")
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
          ? `<b>Статистика</b>\n${escapeHtml(
              locationLabel(action.locationId)
            )}\n\nОберіть групу:`
          : `Для локації <b>${escapeHtml(
              locationLabel(action.locationId)
            )}</b> ще не додано груп.`,
        groups.length ? statsGroupsKeyboard(action.locationId, groups) : undefined
      );
      return;
    }

    if (action.type === "stats-group") {
      await assertGroupAccess(trainer, action.locationId, action.groupId);
      const [group, stats] = await Promise.all([
        getGroup(action.groupId),
        getStatisticsForGroup(action.groupId),
      ]);
      await answerCallbackQuery(query.id);
      await editMessageText(
        message.chat.id,
        message.message_id,
        formatGroupStatsText(
          group?.name ?? action.groupId,
          locationLabel(action.locationId),
          stats
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
      await answerCallbackQuery(query.id);
      await editMessageText(
        message.chat.id,
        message.message_id,
        formatGroupStatsText(
          group?.name ?? action.groupId,
          locationLabel(action.locationId),
          stats,
          { showAll: true, page: action.page }
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
        `<b>${escapeHtml(group?.name ?? action.groupId)}</b>\n\nОберіть учня:`,
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
      "Не вдалося виконати дію. Спробуйте /start або /stats ще раз або зверніться до адміністратора."
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

function locationLabel(locationId: string): string {
  return LOCATION_LABELS[locationId] ?? locationId;
}

function attendanceText(
  groupName: string,
  date: string,
  time: string,
  selected: number,
  total: number
): string {
  return [
    `<b>${escapeHtml(groupName)}</b>`,
    `${formatDate(date)} · ${time}`,
    "",
    "Натисніть на учнів, які були присутні.",
    `Відмічено: <b>${selected}/${total}</b>`,
  ].join("\n");
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
