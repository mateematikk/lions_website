import type { Program } from "@/types";

export const programs: Record<"ru" | "uk", Program[]> = {
  ru: [
    {
      id: "kids",
      title: "Дети",
      description:
        "Программа для детей 5-10 лет. Развитие координации, гибкости и уверенности в себе через игровую форму обучения джиу-джитсу. Безопасная среда и внимательные тренеры.",
      shortDescription: "5-10 лет · Развитие через игру",
      ageRange: "5-10 лет",
      image: "/images/programs/kids.jpg",
      icon: "Baby",
    },
    {
      id: "teens",
      title: "Подростки",
      description:
        "Группа для подростков 11-16 лет. Изучение базовой и продвинутой техники BJJ, подготовка к соревнованиям, развитие дисциплины и характера.",
      shortDescription: "11-16 лет · Техника и характер",
      ageRange: "11-16 лет",
      image: "/images/programs/teens.jpg",
      icon: "Flame",
    },
    {
      id: "adults",
      title: "Взрослые",
      description:
        "Основная программа для взрослых от 16 лет. Gi и No-Gi тренировки, техника, спарринги, физподготовка. Подходит как для начинающих, так и для опытных практиков.",
      shortDescription: "16+ лет · Все уровни",
      ageRange: "16+ лет",
      image: "/images/programs/adults.jpg",
      icon: "Swords",
    },
    {
      id: "women",
      title: "Женская группа",
      description:
        "Специальная программа для женщин. Комфортная атмосфера, адаптированные тренировки, развитие навыков самозащиты, общая физическая подготовка.",
      shortDescription: "Для женщин · Комфорт и сила",
      ageRange: "16+ лет",
      image: "/images/programs/women.jpg",
      icon: "Heart",
    },
    {
      id: "competition",
      title: "Подготовка к соревнованиям",
      description:
        "Интенсивная программа для спортсменов, готовящихся к турнирам. Усиленные тренировки, тактическая подготовка, анализ поединков и психологическая подготовка.",
      shortDescription: "Интенсив · Путь к победе",
      ageRange: "14+ лет",
      image: "/images/programs/competition.jpg",
      icon: "Trophy",
    },
    {
      id: "nogi",
      title: "No-Gi",
      description:
        "Тренировки без кимоно (в рашгарде). Акцент на борьбу в стойке, контроль, сабмишены. Современные техники из мира соревновательного грэпплинга.",
      shortDescription: "Без кимоно · Современный грэпплинг",
      ageRange: "14+ лет",
      image: "/images/programs/nogi.jpg",
      icon: "Zap",
    },
  ],
  uk: [
    {
      id: "kids",
      title: "Діти",
      description:
        "Програма для дітей 5-10 років. Розвиток координації, гнучкості та впевненості в собі через ігрову форму навчання джиу-джитсу. Безпечне середовище та уважні тренери.",
      shortDescription: "5-10 років · Розвиток через гру",
      ageRange: "5-10 років",
      image: "/images/programs/kids.jpg",
      icon: "Baby",
    },
    {
      id: "teens",
      title: "Підлітки",
      description:
        "Група для підлітків 11-16 років. Вивчення базової та просунутої техніки BJJ, підготовка до змагань, розвиток дисципліни та характеру.",
      shortDescription: "11-16 років · Техніка та характер",
      ageRange: "11-16 років",
      image: "/images/programs/teens.jpg",
      icon: "Flame",
    },
    {
      id: "adults",
      title: "Дорослі",
      description:
        "Основная програма для дорослих від 16 років. Gi та No-Gi тренування, техніка, спаринги, фізпідготовка. Підходить як для початківців, так і для досвідчених практиків.",
      shortDescription: "16+ років · Всі рівні",
      ageRange: "16+ років",
      image: "/images/programs/adults.jpg",
      icon: "Swords",
    },
    {
      id: "women",
      title: "Жіноча група",
      description:
        "Спеціальна програма для жінок. Комфортна атмосфера, адаптоване тренування, розвиток навичок самозахисту, загальна фізична підготовка.",
      shortDescription: "Для жінок · Комфорт та сила",
      ageRange: "16+ років",
      image: "/images/programs/women.jpg",
      icon: "Heart",
    },
    {
      id: "competition",
      title: "Підготовка до змагань",
      description:
        "Інтенсивна програма для спортсменів, які готуються до турнірів. Посилені тренування, тактична підготовка, аналіз поєдинків та психологічна підготовка.",
      shortDescription: "Інтенсив · Шлях до перемоги",
      ageRange: "14+ років",
      image: "/images/programs/competition.jpg",
      icon: "Trophy",
    },
    {
      id: "nogi",
      title: "No-Gi",
      description:
        "Тренування без кимоно (в рашгарді). Акцент на боротьбу в стійці, контроль, сабмішени. Сучасні техніки зі світу змагального грепплінгу.",
      shortDescription: "Без кимоно · Сучасний грепплінг",
      ageRange: "14+ років",
      image: "/images/programs/nogi.jpg",
      icon: "Zap",
    },
  ],
};
