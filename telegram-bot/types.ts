export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface InlineKeyboardButton {
  text: string;
  callback_data: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

export interface TelegramMessage {
  message_id: number;
  chat: {
    id: number;
    type: string;
  };
  from?: TelegramUser;
  text?: string;
  reply_markup?: InlineKeyboardMarkup;
}

export interface CallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: CallbackQuery;
}

export interface Trainer {
  telegramId: string;
  name: string;
  locationIds: string[];
  /** Optional allow-list of group_id values. Empty = all groups in location_ids. */
  groupIds: string[];
  active: boolean;
}

export interface TrainingGroup {
  id: string;
  locationId: string;
  name: string;
  day: string;
  time: string;
  active: boolean;
}

export interface Student {
  id: string;
  name: string;
  groupId: string;
  active: boolean;
}

export interface AttendanceSession {
  locationId: string;
  groupId: string;
  date: string;
  time: string;
}

export interface AttendanceMark {
  studentId: string;
  present: boolean;
}

/** Aggregated attendance row from the Статистика sheet. */
export interface StudentStat {
  studentId: string;
  name: string;
  groupId: string;
  present: number;
  absent: number;
  total: number;
  rate: number;
  lastDate: string;
}
