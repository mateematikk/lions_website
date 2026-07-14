import type { Program } from "@/types";

export const programs: Record<"en" | "uk", Program[]> = {
  en: [
    {
      id: "kids",
      title: "Kids",
      description:
        "Program for kids ages 5–10. Coordination, flexibility, and confidence through playful Jiu-Jitsu classes. A safe environment with attentive coaches.",
      shortDescription: "Ages 5–10 · Learning through play",
      ageRange: "Ages 5–10",
      image: "/images/programs/kids.jpg",
      icon: "Baby",
    },
    {
      id: "teens",
      title: "Teens",
      description:
        "Group for teens ages 11–16. Basic and advanced BJJ technique, competition prep, discipline, and character building.",
      shortDescription: "Ages 11–16 · Technique & character",
      ageRange: "Ages 11–16",
      image: "/images/programs/teens.jpg",
      icon: "Flame",
    },
    {
      id: "adults",
      title: "Adults",
      description:
        "Main program for adults 16+. Gi and No-Gi training, technique, sparring, and conditioning. Suitable for beginners and experienced practitioners.",
      shortDescription: "Ages 16+ · All levels",
      ageRange: "Ages 16+",
      image: "/images/programs/adults.jpg",
      icon: "Swords",
    },
    {
      id: "competition",
      title: "Competition prep",
      description:
        "Intensive program for athletes preparing for tournaments. Harder training, tactics, match analysis, and mental preparation.",
      shortDescription: "Intense · Path to victory",
      ageRange: "Ages 14+",
      image: "/images/programs/competition.jpg",
      icon: "Trophy",
    },
    {
      id: "nogi",
      title: "No-Gi",
      description:
        "Training without the gi (rash guard). Focus on stand-up, control, and submissions. Modern techniques from competitive grappling.",
      shortDescription: "No gi · Modern grappling",
      ageRange: "Ages 14+",
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
        "Основна програма для дорослих від 16 років. Gi та No-Gi тренування, техніка, спаринги, фізпідготовка. Підходить як для початківців, так і для досвідчених практиків.",
      shortDescription: "16+ років · Всі рівні",
      ageRange: "16+ років",
      image: "/images/programs/adults.jpg",
      icon: "Swords",
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
