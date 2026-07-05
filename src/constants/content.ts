import type { ContactInfo, NavItem, WhyUsItem } from "@/types";

/* ─── Navigation ─── */
export const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Главная", href: "#hero" },
  { id: "why-us", label: "Преимущества", href: "#why-us" },
  { id: "about", label: "О школе", href: "#about" },
  { id: "programs", label: "Направления", href: "#programs" },
  { id: "coaches", label: "Тренеры", href: "#coaches" },
  { id: "schedule", label: "Расписание", href: "#schedule" },
  { id: "gallery", label: "Галерея", href: "#gallery" },
  { id: "testimonials", label: "Отзывы", href: "#testimonials" },
  { id: "faq", label: "FAQ", href: "#faq" },
  { id: "contacts", label: "Контакты", href: "#contacts" },
];

/* ─── Hero ─── */
export const HERO = {
  title: "LIONS TEAM",
  subtitle: "Brazilian Jiu-Jitsu",
  description: "Бразильское джиу-джитсу для детей и взрослых",
  ctaPrimary: "Записаться",
  ctaSecondary: "Расписание",
};

/* ─── Why Us ─── */
export const WHY_US_HEADING = {
  title: "Почему именно мы",
  subtitle: "Lions Team — это не просто зал, это сообщество сильных духом людей",
};

export const WHY_US_ITEMS: WhyUsItem[] = [
  {
    icon: "GraduationCap",
    title: "Профессиональные тренеры",
    description:
      "Сертифицированные инструкторы с международным опытом и поясами IBJJF",
  },
  {
    icon: "Trophy",
    title: "Соревнования",
    description:
      "Регулярное участие в турнирах всех уровней — от городских до международных",
  },
  {
    icon: "Users",
    title: "Дружная команда",
    description:
      "Атмосфера взаимоуважения и поддержки. Мы — семья на татами и за его пределами",
  },
  {
    icon: "Shield",
    title: "Безопасные тренировки",
    description:
      "Современное оборудование, мягкое покрытие и контроль техники на каждом занятии",
  },
  {
    icon: "Layers",
    title: "Группы любого уровня",
    description:
      "Программы для начинающих и продвинутых. Каждый найдёт свою группу",
  },
];

/* ─── About ─── */
export const ABOUT = {
  title: "О школе",
  subtitle: "История и философия Lions Team",
  paragraphs: [
    "Lions Team — это школа бразильского джиу-джитсу, основанная на принципах силы, дисциплины и уважения. Мы создали пространство, где каждый может раскрыть свой потенциал, независимо от возраста и уровня подготовки.",
    "Наши тренеры — действующие спортсмены и сертифицированные инструкторы, которые регулярно повышают квалификацию на международных семинарах. Мы используем проверенные методики обучения, адаптированные под каждого ученика.",
    "За годы работы мы воспитали десятки призёров городских, национальных и международных турниров. Но для нас важнее всего — видеть, как наши ученики растут не только как спортсмены, но и как личности.",
    "Присоединяйтесь к Lions Team и станьте частью семьи, где сила сочетается с мудростью, а победы — с уважением к сопернику.",
  ],
};

/* ─── Programs ─── */
export const PROGRAMS_HEADING = {
  title: "Направления",
  subtitle: "Выберите программу, которая подходит именно вам",
};

/* ─── Coaches ─── */
export const COACHES_HEADING = {
  title: "Наши тренеры",
  subtitle: "Профессионалы, которые приведут вас к результату",
};

/* ─── Schedule ─── */
export const SCHEDULE_HEADING = {
  title: "Расписание",
  subtitle: "Актуальное расписание тренировок на неделю",
};

/* ─── Gallery ─── */
export const GALLERY_HEADING = {
  title: "Галерея",
  subtitle: "Моменты из жизни нашей команды",
};

/* ─── Testimonials ─── */
export const TESTIMONIALS_HEADING = {
  title: "Отзывы",
  subtitle: "Что говорят наши ученики",
};

/* ─── FAQ ─── */
export const FAQ_HEADING = {
  title: "Часто задаваемые вопросы",
  subtitle: "Ответы на самые популярные вопросы",
};

/* ─── Contacts ─── */
export const CONTACTS_HEADING = {
  title: "Контакты",
  subtitle: "Свяжитесь с нами или приходите на пробную тренировку",
};

export const CONTACT_INFO: ContactInfo = {
  address: "г. Москва, ул. Спортивная, д. 10, зал 3",
  phone: "+7 (999) 123-45-67",
  email: "info@lionsteam-bjj.ru",
  telegram: "https://t.me/lionsteam_bjj",
  instagram: "https://instagram.com/lionsteam_bjj",
  facebook: "https://facebook.com/lionsteam.bjj",
  mapUrl:
    "https://www.google.com/maps/dir/?api=1&destination=55.7558,37.6173",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.2079503067566!2d37.61524937693868!3d55.75579997986658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54a5050531f2d%3A0xbfa5f67b5eb5e3c5!2z0JzQvtGB0LrQvtCy0YHQutC40Lkg0JrRgNC10LzQu9GM!5e0!3m2!1sru!2sru!4v1700000000000!5m2!1sru!2sru",
  workingHours: "Пн-Сб: 09:00 — 21:00 | Вс: 10:00 — 18:00",
};

/* ─── Enrollment Form ─── */
export const ENROLLMENT_FORM = {
  title: "Записаться на тренировку",
  subtitle: "Оставьте заявку и мы свяжемся с вами в течение часа",
  fields: {
    name: "Ваше имя",
    phone: "Телефон",
    age: "Возраст",
    program: "Направление",
    comment: "Комментарий",
  },
  submit: "Отправить заявку",
  success: {
    title: "Заявка отправлена!",
    message: "Мы свяжемся с вами в ближайшее время",
  },
};

/* ─── Footer ─── */
export const FOOTER = {
  copyright: `© ${new Date().getFullYear()} Lions Team BJJ. Все права защищены.`,
  slogan: "Сила. Дисциплина. Уважение.",
};

/* ─── SEO ─── */
export const SEO = {
  title: "Lions Team — Школа бразильского джиу-джитсу",
  description:
    "Lions Team — премиальная школа бразильского джиу-джитсу. Тренировки для детей и взрослых. Профессиональные тренеры, современный зал, дружная команда.",
  keywords: [
    "бразильское джиу-джитсу",
    "BJJ",
    "Lions Team",
    "единоборства",
    "тренировки",
    "джиу-джитсу для детей",
    "джиу-джитсу для взрослых",
  ],
  ogImage: "/images/og-image.jpg",
  url: "https://lionsteam-bjj.ru",
};
