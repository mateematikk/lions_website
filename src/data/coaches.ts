import type { Coach } from "@/types";

export const coaches: Record<"en" | "uk", Coach[]> = {
  en: [
    {
      id: "coach-1",
      name: "Andrii Holubenko",
      belt: "Purple belt",
      beltColor: "#6B21A8",
      photo: "/images/coaches/andrii-holubenko.jpg",
      achievements: [
        "Vice-champion of the Ukraine Jiu-Jitsu Cup 2025",
        "Winner and medalist of many Jiu-Jitsu tournaments",
        "Teaching experience — 3 years",
      ],
      bio: "Coach for adult and kids groups. Active competitor.",
    },
    {
      id: "coach-2",
      name: "Yurii Pohrebnyi",
      belt: "Brown belt",
      beltColor: "#8B4513",
      photo: "/images/coaches/yurii-pohrebnyi.jpg",
      achievements: [
        "IBJJF brown belt",
        "Champion of national BJJ tournaments 2021",
        "Teaching experience — 7 years",
      ],
      bio: "Head coach of Lions Team. Started training BJJ in 2017.",
    },
    {
      id: "coach-3",
      name: "Serhii Sybiriakov",
      belt: "Purple belt",
      beltColor: "#6B21A8",
      photo: "/images/coaches/serhii-sybiriakov.jpg",
      achievements: [
        "IBJJF purple belt",
        "Specialization — kids groups",
        "Winner and medalist of many Jiu-Jitsu tournaments",
        "Pedagogical education",
        "Teaching experience — 12 years",
      ],
      bio: "Coach for kids, teens, and adult groups. Finds an approach to every student thanks to pedagogical education and a love for the sport.",
    },
  ],
  uk: [
    {
      id: "coach-1",
      name: "Андрій Голубенко",
      belt: "Пурпуровий пасок",
      beltColor: "#6B21A8",
      photo: "/images/coaches/andrii-holubenko.jpg",
      achievements: [
        "Віце-чемпіон кубку України з Jiu-Jistu 2025",
        "Призер і переможець багатьох турнірів з Jiu-Jistu",
        "Досвід викладання — 3 роки",
      ],
      bio: "Тренер дорослих груп та дитячих груп. Діючий спортсмен.",
    },
    {
      id: "coach-2",
      name: "Юрій Погребний",
      belt: "Коричневий пасок",
      beltColor: "#8B4513",
      photo: "/images/coaches/yurii-pohrebnyi.jpg",
      achievements: [
        "Коричневий пояс IBJJF",
        "Чемпіон національних турнірів з BJJ 2021",
        "Досвід викладання — 7 років",
      ],
      bio: "Головний тренер Lions Team. Почав займатися BJJ у 2017 році.",
    },
    {
      id: "coach-3",
      name: "Сергій Сибіряков",
      belt: "Пурпуровий пасок",
      beltColor: "#6B21A8",
      photo: "/images/coaches/serhii-sybiriakov.jpg",
      achievements: [
        "Пурпуровий пасок IBJJF",
        "Спеціалізація — дитячі групи",
        "Переможець і призер багатьох турнірів з Jiu-Jistu",
        "Педагогічна освіта",
        "Досвід викладання — 12 років",
      ],
      bio: "Тренер дитячих, підліткових та дорослих груп. Знаходить підхід до кожного учня завдяки педагогічній освіті та любові до спорту.",
    },
  ],
};
