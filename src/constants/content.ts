import type { ContactInfo, NavItem, WhyUsItem } from "@/types";

export const translations = {
  ru: {
    /* ─── Navigation ─── */
    NAV_ITEMS: [
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
    ] as NavItem[],

    /* ─── Hero ─── */
    HERO: {
      title: "LIONS TEAM",
      subtitle: "Brazilian Jiu-Jitsu",
      description: "Бразильское джиу-джитсу для детей и взрослых",
      ctaPrimary: "Записаться",
      ctaSecondary: "Расписание",
    },

    /* ─── Why Us ─── */
    WHY_US_HEADING: {
      title: "Почему именно мы",
      subtitle: "Lions Team — это не просто зал, это сообщество сильных духом людей",
    },
    WHY_US_ITEMS: [
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
    ] as WhyUsItem[],

    /* ─── About ─── */
    ABOUT: {
      title: "О школе",
      subtitle: "История и философия Lions Team",
      paragraphs: [
        "Lions Team — это школа бразильского джиу-джитсу, основанная на принципах силы, дисциплины и уважения. Мы создали пространство, где каждый может раскрыть свой потенциал, независимо от возраста и уровня подготовки.",
        "Наши тренеры — действующие спортсмены и сертифицированные инструкторы, которые регулярно повышают квалификацию на международных семинарах. Мы используем проверенные методики обучения, адаптированные под каждого ученика.",
        "За годы работы мы воспитали десятки призёров городских, национальных и международных турниров. Но для нас важнее всего — видеть, как наши ученики растут не только как спортсмены, но и как личности.",
        "Присоединяйтесь к Lions Team и станьте частью семьи, где сила сочетается с мудростью, а победы — с уважением к сопернику.",
      ],
    },

    /* ─── Programs ─── */
    PROGRAMS_HEADING: {
      title: "Направления",
      subtitle: "Выберите программу, которая подходит именно вам",
    },

    /* ─── Coaches ─── */
    COACHES_HEADING: {
      title: "Наши тренеры",
      subtitle: "Профессионалы, которые приведут вас к результату",
    },

    /* ─── Schedule ─── */
    SCHEDULE_HEADING: {
      title: "Расписание",
      subtitle: "Актуальное расписание тренировок на неделю",
    },

    /* ─── Gallery ─── */
    GALLERY_HEADING: {
      title: "Галерея",
      subtitle: "Моменты из жизни нашей команды",
    },

    /* ─── Testimonials ─── */
    TESTIMONIALS_HEADING: {
      title: "Отзывы",
      subtitle: "Что говорят наши ученики",
    },

    /* ─── FAQ ─── */
    FAQ_HEADING: {
      title: "Часто задаваемые вопросы",
      subtitle: "Ответы на самые популярные вопросы",
    },

    /* ─── Contacts ─── */
    CONTACTS_HEADING: {
      title: "Контакты",
      subtitle: "Три зала в Киеве — Позняки, Дарница и Почайна",
    },
    CONTACT_INFO: {
      phone: "+380 (44) 123-45-67",
      email: "info@lionsteam-bjj.ua",
      telegram: "https://t.me/lionsteam_bjj",
      instagram: "https://instagram.com/lionsteam_bjj",
      facebook: "https://facebook.com/lionsteam.bjj",
      workingHours: "Пн-Сб: 09:00 — 21:00 | Вс: 10:00 — 18:00",
    } as ContactInfo,

    /* ─── Enrollment Form ─── */
    ENROLLMENT_FORM: {
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
    },

    /* ─── Footer ─── */
    FOOTER: {
      copyright: `© ${new Date().getFullYear()} Lions Team BJJ. Все права защищены.`,
      slogan: "Сила. Дисциплина. Уважение.",
    },

    /* ─── SEO ─── */
    SEO: {
      title: "Lions Team — Школа бразильского джиу-джитсу",
      description:
        "Lions Team — премиальная школа бразильского джиу-джитсу в Киеве. Залы на Позняках, Дарнице и Почайне. Тренировки для детей и взрослых.",
      keywords: [
        "бразильское джиу-джитсу",
        "BJJ",
        "Lions Team",
        "BJJ Киев",
        "джиу-джитсу Киев",
        "Позняки",
        "Дарница",
        "Почайна",
        "единоборства",
        "тренировки",
        "джиу-джитсу для детей",
        "джиу-джитсу для взрослых",
      ],
      ogImage: "/images/og-image.jpg",
      url: "https://lionsteam-bjj.ua",
    },
  },
  uk: {
    /* ─── Navigation ─── */
    NAV_ITEMS: [
      { id: "hero", label: "Головна", href: "#hero" },
      { id: "why-us", label: "Переваги", href: "#why-us" },
      { id: "about", label: "Про школу", href: "#about" },
      { id: "programs", label: "Напрямки", href: "#programs" },
      { id: "coaches", label: "Тренери", href: "#coaches" },
      { id: "schedule", label: "Розклад", href: "#schedule" },
      { id: "gallery", label: "Галерея", href: "#gallery" },
      { id: "testimonials", label: "Відгуки", href: "#testimonials" },
      { id: "faq", label: "FAQ", href: "#faq" },
      { id: "contacts", label: "Контакти", href: "#contacts" },
    ] as NavItem[],

    /* ─── Hero ─── */
    HERO: {
      title: "LIONS TEAM",
      subtitle: "Brazilian Jiu-Jitsu",
      description: "Бразильське джиу-джитсу для дітей та дорослих",
      ctaPrimary: "Записатись",
      ctaSecondary: "Розклад",
    },

    /* ─── Why Us ─── */
    WHY_US_HEADING: {
      title: "Чому саме ми",
      subtitle: "Lions Team — це не просто зал, це спільнота сильних духом людей",
    },
    WHY_US_ITEMS: [
      {
        icon: "GraduationCap",
        title: "Професійні тренери",
        description:
          "Сертифіковані інструктори з міжнародним досвідом та поясами IBJJF",
      },
      {
        icon: "Trophy",
        title: "Змагання",
        description:
          "Регулярна участь у турнірах усіх рівнів — від міських до міжнародних",
      },
      {
        icon: "Users",
        title: "Дружня команда",
        description:
          "Атмосфера взаємоповаги та підтримки. Ми — сім'я на татамі та поза ним",
      },
      {
        icon: "Shield",
        title: "Безпечні тренування",
        description:
          "Сучасне обладнання, м'яке покриття та контроль техніки на кожному занятті",
      },
      {
        icon: "Layers",
        title: "Групи будь-якого рівня",
        description:
          "Програми для початківців та просунутих. Кожен знайде свою групу",
      },
    ] as WhyUsItem[],

    /* ─── About ─── */
    ABOUT: {
      title: "Про школу",
      subtitle: "Історія та філософія Lions Team",
      paragraphs: [
        "Lions Team — це школа бразильського джиу-джитсу, заснована на принципах сили, дисципліни та поваги. Ми створили простір, де кожен може розкрити свій потенціал, незалежно від віку та рівня підготовки.",
        "Наші тренери — діючі спортсмени та сертифіковані інструктори, які регулярно підвищують кваліфікацію на міжнародних семінарах. Ми використовуємо перевірені методики навчання, адаптовані під кожного учня.",
        "За роки роботи ми виховали десятки призерів міських, національних та міжнародних турнірів. Але для нас найважливіше — бачити, как наші учні ростуть не лише як спортсмени, а й як особистості.",
        "Приєднуйтесь до Lions Team і станьте частиною сім'ї, де сила поєднується з мудрістю, а перемоги — з повагою до суперника.",
      ],
    },

    /* ─── Programs ─── */
    PROGRAMS_HEADING: {
      title: "Напрямки",
      subtitle: "Оберіть програму, яка підходить саме вам",
    },

    /* ─── Coaches ─── */
    COACHES_HEADING: {
      title: "Наші тренери",
      subtitle: "Професіонали, які приведуть вас до результату",
    },

    /* ─── Schedule ─── */
    SCHEDULE_HEADING: {
      title: "Розклад",
      subtitle: "Актуальний розклад тренувань на тиждень",
    },

    /* ─── Gallery ─── */
    GALLERY_HEADING: {
      title: "Галерея",
      subtitle: "Моменти з життя нашої команди",
    },

    /* ─── Testimonials ─── */
    TESTIMONIALS_HEADING: {
      title: "Відгуки",
      subtitle: "Що говорять наші учні",
    },

    /* ─── FAQ ─── */
    FAQ_HEADING: {
      title: "Часті питання",
      subtitle: "Відповіді на найпопулярніші запитання",
    },

    /* ─── Contacts ─── */
    CONTACTS_HEADING: {
      title: "Контакти",
      subtitle: "Три зали в Києві — Позняки, Дарниця та Почайна",
    },
    CONTACT_INFO: {
      phone: "+380 (44) 123-45-67",
      email: "info@lionsteam-bjj.ua",
      telegram: "https://t.me/lionsteam_bjj",
      instagram: "https://instagram.com/lionsteam_bjj",
      facebook: "https://facebook.com/lionsteam.bjj",
      workingHours: "Пн-Сб: 09:00 — 21:00 | Нд: 10:00 — 18:00",
    } as ContactInfo,

    /* ─── Enrollment Form ─── */
    ENROLLMENT_FORM: {
      title: "Записатися на тренування",
      subtitle: "Залиште заявку і ми зв'яжемося з вами протягом години",
      fields: {
        name: "Ваше ім'я",
        phone: "Телефон",
        age: "Вік",
        program: "Напрямок",
        comment: "Коментар",
      },
      submit: "Надіслати заявку",
      success: {
        title: "Заявка надіслана!",
        message: "Ми зв'яжемося з вами найближчим часом",
      },
    },

    /* ─── Footer ─── */
    FOOTER: {
      copyright: `© ${new Date().getFullYear()} Lions Team BJJ. Всі права захищені.`,
      slogan: "Сила. Дисциплина. Уважение.", // Keeping slogan BJJ general or translate to "Сила. Дисципліна. Повага."
    },

    /* ─── SEO ─── */
    SEO: {
      title: "Lions Team — Школа бразильського джиу-джитсу",
      description:
        "Lions Team — преміальна школа бразильського джиу-джитсу в Києві. Зали на Позняках, Дарниці та Почайні. Тренування для дітей та дорослих.",
      keywords: [
        "бразильське джиу-джитсу",
        "BJJ",
        "Lions Team",
        "BJJ Київ",
        "джиу-джитсу Київ",
        "Позняки",
        "Дарниця",
        "Почайна",
        "єдиноборства",
        "тренування",
        "джиу-джитсу для дітей",
        "джиу-джитсу для дорослих",
      ],
      ogImage: "/images/og-image.jpg",
      url: "https://lionsteam-bjj.ua",
    },
  },
};

// Backwards compatibility / defaults
export const NAV_ITEMS = translations.ru.NAV_ITEMS;
export const HERO = translations.ru.HERO;
export const WHY_US_HEADING = translations.ru.WHY_US_HEADING;
export const WHY_US_ITEMS = translations.ru.WHY_US_ITEMS;
export const ABOUT = translations.ru.ABOUT;
export const PROGRAMS_HEADING = translations.ru.PROGRAMS_HEADING;
export const COACHES_HEADING = translations.ru.COACHES_HEADING;
export const SCHEDULE_HEADING = translations.ru.SCHEDULE_HEADING;
export const GALLERY_HEADING = translations.ru.GALLERY_HEADING;
export const TESTIMONIALS_HEADING = translations.ru.TESTIMONIALS_HEADING;
export const FAQ_HEADING = translations.ru.FAQ_HEADING;
export const CONTACTS_HEADING = translations.ru.CONTACTS_HEADING;
export const CONTACT_INFO = translations.ru.CONTACT_INFO;
export const ENROLLMENT_FORM = translations.ru.ENROLLMENT_FORM;
export const FOOTER = translations.ru.FOOTER;
export const SEO = translations.ru.SEO;
