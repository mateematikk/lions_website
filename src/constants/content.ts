import type { ContactInfo, NavItem, WhyUsItem } from "@/types";

export const translations = {
  en: {
    /* ─── Navigation ─── */
    NAV_ITEMS: [
      { id: "hero", label: "Home", href: "#hero" },
      { id: "why-us", label: "Why Us", href: "#why-us" },
      { id: "about", label: "About", href: "#about" },
      { id: "programs", label: "Programs", href: "#programs" },
      { id: "coaches", label: "Coaches", href: "#coaches" },
      { id: "schedule", label: "Schedule", href: "#schedule" },
      { id: "gallery", label: "Gallery", href: "#gallery" },
      { id: "testimonials", label: "Reviews", href: "#testimonials" },
      { id: "faq", label: "FAQ", href: "#faq" },
      { id: "contacts", label: "Contacts", href: "#contacts" },
    ] as NavItem[],

    /* ─── Hero ─── */
    HERO: {
      title: "LIONS TEAM",
      subtitle: "Brazilian Jiu-Jitsu",
      description: "Brazilian Jiu-Jitsu for kids and adults",
      ctaPrimary: "Book a class",
      ctaSecondary: "Schedule",
    },

    /* ─── Why Us ─── */
    WHY_US_HEADING: {
      title: "Why train with us",
      subtitle:
        "Lions Team is more than a gym — it's a community of strong-minded people",
    },
    WHY_US_ITEMS: [
      {
        icon: "GraduationCap",
        title: "Professional coaches",
        description:
          "Certified instructors with international experience and IBJJF belts",
      },
      {
        icon: "Trophy",
        title: "Competitions",
        description:
          "Regular participation in tournaments of every level — from local to international",
      },
      {
        icon: "Users",
        title: "Supportive team",
        description:
          "An atmosphere of mutual respect and support. We are a family on and off the mats",
      },
      {
        icon: "Shield",
        title: "Safe training",
        description:
          "Modern equipment, soft mats, and technique control at every session",
      },
      {
        icon: "Layers",
        title: "Groups for every level",
        description:
          "Programs for beginners and advanced athletes. Everyone finds their place",
      },
    ] as WhyUsItem[],

    /* ─── About ─── */
    ABOUT: {
      title: "About the school",
      subtitle: "The history and philosophy of Lions Team",
      paragraphs: [
        "Lions Team is a Brazilian Jiu-Jitsu school built on strength, discipline, and respect. We created a space where everyone can unlock their potential, regardless of age or experience.",
        "Our coaches are active athletes and certified instructors who regularly train at international seminars. We use proven teaching methods adapted to each student.",
        "Over the years we have developed dozens of medalists at city, national, and international tournaments. What matters most to us is watching our students grow not only as athletes, but as people.",
        "Join Lions Team and become part of a family where strength meets wisdom, and victories come with respect for your opponent.",
      ],
    },

    /* ─── Programs ─── */
    PROGRAMS_HEADING: {
      title: "Programs",
      subtitle: "Choose the program that fits you best",
    },

    /* ─── Coaches ─── */
    COACHES_HEADING: {
      title: "Our coaches",
      subtitle: "Professionals who will help you get results",
    },

    /* ─── Schedule ─── */
    SCHEDULE_HEADING: {
      title: "Schedule",
      subtitle: "Current training schedule for the week",
    },

    /* ─── Gallery ─── */
    GALLERY_HEADING: {
      title: "Gallery",
      subtitle: "Moments from our team's life",
    },

    /* ─── Instagram ─── */
    INSTAGRAM_HEADING: {
      title: "Instagram",
      subtitle: "Follow us — Lions Team life every day",
      follow: "Follow",
      message: "Message",
      posts: "posts",
      followers: "followers",
      following: "following",
    },

    /* ─── Testimonials ─── */
    TESTIMONIALS_HEADING: {
      title: "Reviews",
      subtitle: "What our students say",
    },

    /* ─── FAQ ─── */
    FAQ_HEADING: {
      title: "FAQ",
      subtitle: "Answers to the most common questions",
    },

    /* ─── Contacts ─── */
    CONTACTS_HEADING: {
      title: "Contacts",
      subtitle: "Gyms in Kyiv — Pozniaky, Darnytsia, and Pochaina",
    },
    CONTACT_INFO: {
      phone: "+380 (44) 123-45-67",
      email: "info@lionsteam-bjj.ua",
      telegram: "https://t.me/lionsteam_bjj",
      instagram: "https://www.instagram.com/lionsjiujitsu/",
      facebook: "https://facebook.com/lionsteam.bjj",
      workingHours: "Mon–Sat: 09:00 — 21:00 | Sun: 10:00 — 18:00",
    } as ContactInfo,

    /* ─── Enrollment Form ─── */
    ENROLLMENT_FORM: {
      title: "Book a training session",
      subtitle: "Leave a request and we will contact you within an hour",
      fields: {
        name: "Your name",
        phone: "Phone",
        age: "Age",
        program: "Program",
        location: "Location",
        comment: "Comment",
      },
      submit: "Send request",
      success: {
        title: "Request sent!",
        message: "We will contact you shortly",
      },
    },

    /* ─── Footer ─── */
    FOOTER: {
      copyright: `© ${new Date().getFullYear()} Lions Team BJJ. All rights reserved.`,
      slogan: "Strength. Discipline. Respect.",
    },

    /* ─── SEO ─── */
    SEO: {
      title: "Lions Team — Brazilian Jiu-Jitsu School",
      description:
        "Lions Team is a premium Brazilian Jiu-Jitsu school in Kyiv. Gyms in Pozniaky, Darnytsia, and Pochaina. Training for kids and adults.",
      keywords: [
        "Brazilian Jiu-Jitsu",
        "BJJ",
        "Lions Team",
        "BJJ Kyiv",
        "Jiu-Jitsu Kyiv",
        "Pozniaky",
        "Darnytsia",
        "Pochaina",
        "martial arts",
        "training",
        "kids jiu-jitsu",
        "adult jiu-jitsu",
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
        "За роки роботи ми виховали десятки призерів міських, національних та міжнародних турнірів. Але для нас найважливіше — бачити, як наші учні ростуть не лише як спортсмени, а й як особистості.",
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

    /* ─── Instagram ─── */
    INSTAGRAM_HEADING: {
      title: "Instagram",
      subtitle: "Підписуйтесь — життя Lions Team щодня",
      follow: "Підписатися",
      message: "Повідомлення",
      posts: "публікацій",
      followers: "підписників",
      following: "підписок",
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
      subtitle: "Зали в Києві — Позняки, Дарниця та Почайна",
    },
    CONTACT_INFO: {
      phone: "+380 (44) 123-45-67",
      email: "info@lionsteam-bjj.ua",
      telegram: "https://t.me/lionsteam_bjj",
      instagram: "https://www.instagram.com/lionsjiujitsu/",
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
        location: "Локація",
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
      slogan: "Сила. Дисципліна. Повага.",
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
export const NAV_ITEMS = translations.en.NAV_ITEMS;
export const HERO = translations.en.HERO;
export const WHY_US_HEADING = translations.en.WHY_US_HEADING;
export const WHY_US_ITEMS = translations.en.WHY_US_ITEMS;
export const ABOUT = translations.en.ABOUT;
export const PROGRAMS_HEADING = translations.en.PROGRAMS_HEADING;
export const COACHES_HEADING = translations.en.COACHES_HEADING;
export const SCHEDULE_HEADING = translations.en.SCHEDULE_HEADING;
export const GALLERY_HEADING = translations.en.GALLERY_HEADING;
export const INSTAGRAM_HEADING = translations.en.INSTAGRAM_HEADING;
export const TESTIMONIALS_HEADING = translations.en.TESTIMONIALS_HEADING;
export const FAQ_HEADING = translations.en.FAQ_HEADING;
export const CONTACTS_HEADING = translations.en.CONTACTS_HEADING;
export const CONTACT_INFO = translations.en.CONTACT_INFO;
export const ENROLLMENT_FORM = translations.en.ENROLLMENT_FORM;
export const FOOTER = translations.en.FOOTER;
export const SEO = translations.en.SEO;
