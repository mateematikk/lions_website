import type { DaySchedule } from "@/types";

export const schedule: Record<"ru" | "uk", DaySchedule[]> = {
  ru: [
    {
      day: "Понедельник",
      dayShort: "Пн",
      entries: [
        { time: "10:00 — 11:30", group: "Взрослые (Gi)", coach: "Алексей Волков", programId: "adults" },
        { time: "16:00 — 17:00", group: "Дети (5-10)", coach: "Мария Соколова", programId: "kids" },
        { time: "17:00 — 18:00", group: "Подростки", coach: "Мария Соколова", programId: "teens" },
        { time: "18:30 — 20:00", group: "Взрослые (No-Gi)", coach: "Дмитрий Орлов", programId: "nogi" },
        { time: "20:00 — 21:00", group: "Соревновательная", coach: "Алексей Волков", programId: "competition" },
      ],
    },
    {
      day: "Вторник",
      dayShort: "Вт",
      entries: [
        { time: "10:00 — 11:00", group: "Женская группа", coach: "Мария Соколова", programId: "women" },
        { time: "16:00 — 17:00", group: "Дети (5-10)", coach: "Мария Соколова", programId: "kids" },
        { time: "18:30 — 20:00", group: "Взрослые (Gi)", coach: "Алексей Волков", programId: "adults" },
      ],
    },
    {
      day: "Среда",
      dayShort: "Ср",
      entries: [
        { time: "10:00 — 11:30", group: "Взрослые (Gi)", coach: "Алексей Волков", programId: "adults" },
        { time: "16:00 — 17:00", group: "Дети (5-10)", coach: "Мария Соколова", programId: "kids" },
        { time: "17:00 — 18:00", group: "Подростки", coach: "Дмитрий Орлов", programId: "teens" },
        { time: "18:30 — 20:00", group: "Взрослые (No-Gi)", coach: "Дмитрий Орлов", programId: "nogi" },
        { time: "20:00 — 21:00", group: "Соревновательная", coach: "Алексей Волков", programId: "competition" },
      ],
    },
    {
      day: "Четверг",
      dayShort: "Чт",
      entries: [
        { time: "10:00 — 11:00", group: "Женская группа", coach: "Мария Соколова", programId: "women" },
        { time: "16:00 — 17:00", group: "Дети (5-10)", coach: "Мария Соколова", programId: "kids" },
        { time: "18:30 — 20:00", group: "Взрослые (Gi)", coach: "Алексей Волков", programId: "adults" },
      ],
    },
    {
      day: "Пятница",
      dayShort: "Пт",
      entries: [
        { time: "10:00 — 11:30", group: "Взрослые (No-Gi)", coach: "Дмитрий Орлов", programId: "nogi" },
        { time: "16:00 — 17:00", group: "Дети (5-10)", coach: "Мария Соколова", programId: "kids" },
        { time: "17:00 — 18:00", group: "Подростки", coach: "Мария Соколова", programId: "teens" },
        { time: "18:30 — 20:00", group: "Взрослые (Gi)", coach: "Алексей Волков", programId: "adults" },
        { time: "20:00 — 21:00", group: "Соревновательная", coach: "Дмитрий Орлов", programId: "competition" },
      ],
    },
    {
      day: "Суббота",
      dayShort: "Сб",
      entries: [
        { time: "10:00 — 11:30", group: "Взрослые Open Mat", coach: "Алексей Волков", programId: "adults" },
        { time: "12:00 — 13:00", group: "Дети (5-10)", coach: "Мария Соколова", programId: "kids" },
        { time: "13:00 — 14:00", group: "Подростки", coach: "Дмитрий Орлов", programId: "teens" },
      ],
    },
    {
      day: "Воскресенье",
      dayShort: "Вс",
      entries: [
        { time: "11:00 — 12:30", group: "Open Mat (все уровни)", coach: "Алексей Волков", programId: "adults" },
      ],
    },
  ],
  uk: [
    {
      day: "Понеділок",
      dayShort: "Пн",
      entries: [
        { time: "10:00 — 11:30", group: "Дорослі (Gi)", coach: "Олексій Волков", programId: "adults" },
        { time: "16:00 — 17:00", group: "Діти (5-10)", coach: "Марія Соколова", programId: "kids" },
        { time: "17:00 — 18:00", group: "Підлітки", coach: "Марія Соколова", programId: "teens" },
        { time: "18:30 — 20:00", group: "Дорослі (No-Gi)", coach: "Дмитро Орлов", programId: "nogi" },
        { time: "20:00 — 21:00", group: "Змагальна", coach: "Олексій Волков", programId: "competition" },
      ],
    },
    {
      day: "Вівторок",
      dayShort: "Вт",
      entries: [
        { time: "10:00 — 11:00", group: "Жіноча група", coach: "Марія Соколова", programId: "women" },
        { time: "16:00 — 17:00", group: "Діти (5-10)", coach: "Марія Соколова", programId: "kids" },
        { time: "18:30 — 20:00", group: "Дорослі (Gi)", coach: "Олексій Волков", programId: "adults" },
      ],
    },
    {
      day: "Середа",
      dayShort: "Ср",
      entries: [
        { time: "10:00 — 11:30", group: "Дорослі (Gi)", coach: "Олексій Волков", programId: "adults" },
        { time: "16:00 — 17:00", group: "Діти (5-10)", coach: "Марія Соколова", programId: "kids" },
        { time: "17:00 — 18:00", group: "Підлітки", coach: "Дмитро Орлов", programId: "teens" },
        { time: "18:30 — 20:00", group: "Дорослі (No-Gi)", coach: "Дмитро Орлов", programId: "nogi" },
        { time: "20:00 — 21:00", group: "Змагальна", coach: "Олексій Волков", programId: "competition" },
      ],
    },
    {
      day: "Четвер",
      dayShort: "Чт",
      entries: [
        { time: "10:00 — 11:00", group: "Жіноча група", coach: "Марія Соколова", programId: "women" },
        { time: "16:00 — 17:00", group: "Діти (5-10)", coach: "Марія Соколова", programId: "kids" },
        { time: "18:30 — 20:00", group: "Дорослі (Gi)", coach: "Олексій Волков", programId: "adults" },
      ],
    },
    {
      day: "П'ятниця",
      dayShort: "Пт",
      entries: [
        { time: "10:00 — 11:30", group: "Дорослі (No-Gi)", coach: "Дмитро Орлов", programId: "nogi" },
        { time: "16:00 — 17:00", group: "Діти (5-10)", coach: "Марія Соколова", programId: "kids" },
        { time: "17:00 — 18:00", group: "Підлітки", coach: "Марія Соколова", programId: "teens" },
        { time: "18:30 — 20:00", group: "Дорослі (Gi)", coach: "Олексій Волков", programId: "adults" },
        { time: "20:00 — 21:00", group: "Змагальна", coach: "Дмитро Орлов", programId: "competition" },
      ],
    },
    {
      day: "Субота",
      dayShort: "Сб",
      entries: [
        { time: "10:00 — 11:30", group: "Дорослі Open Mat", coach: "Олексій Волков", programId: "adults" },
        { time: "12:00 — 13:00", group: "Діти (5-10)", coach: "Марія Соколова", programId: "kids" },
        { time: "13:00 — 14:00", group: "Підлітки", coach: "Дмитро Орлов", programId: "teens" },
      ],
    },
    {
      day: "Неділя",
      dayShort: "Нд",
      entries: [
        { time: "11:00 — 12:30", group: "Open Mat (всі рівні)", coach: "Олексій Волков", programId: "adults" },
      ],
    },
  ],
};
