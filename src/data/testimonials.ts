import type { Testimonial } from "@/types";

export const testimonials: Record<"en" | "uk", Testimonial[]> = {
  en: [
    {
      id: "review-1",
      name: "Roman",
      photo: "/images/testimonials/person-1.jpg",
      text: "Top coaches and a friendly atmosphere — that's Lions Jiu Jitsu Academy. Everyone can find the right intensity, whether in the adult or kids group. Coaches and their students always take part in fight days and competitions.",
      rating: 5,
      program: "Student",
    },
    {
      id: "review-2",
      name: "Artur",
      photo: "/images/testimonials/person-2.jpg",
      text: "Awesome club! Great coaches who give beginners a lot of attention, so you progress fast. The atmosphere is very friendly — everyone helps and supports each other. I'm glad I chose this place. The club exceeded even my most optimistic expectations. Don't hesitate — come train. It isn't easy, but every minute on the mats feels rewarding during and after class!",
      rating: 5,
      program: "Student",
    },
    {
      id: "review-3",
      name: "Kria",
      photo: "/images/testimonials/person-3.jpg",
      text: "The coach is top-tier! The vibe is unreal — nowhere else feels like Lions Team.",
      rating: 5,
      program: "Student",
    },
  ],
  uk: [
    {
      id: "review-1",
      name: "Роман",
      photo: "/images/testimonials/person-1.jpg",
      text: "Топові тренера, дружня атмосфера, це все є в клубі Lions jiu jitsu academy. Тут знайде кожен собі навантаження по душі як у дорослій групі так і в дитячій. Тренера та їх підопічні завжди приймають участі в днях боротьби та змаганнях.",
      rating: 5,
      program: "Учень",
    },
    {
      id: "review-2",
      name: "Артур",
      photo: "/images/testimonials/person-2.jpg",
      text: "Чудовий клуб! Класні тренери, які приділяють багато уваги новачкам, що дає можливість добре прогресувати. Взагалі атмосфера дуже дружня, всі один одному допомагають та підтримують. Дуже радий, що вирішив прийти саме сюди. Клуб перевершив всі очікування, які в мене були, навіть найбільш оптимістичні. Сміливо раджу відкинути сумніви, та приходити на тренування. Тренуватись не легко, але кожна хвилина в залі буде приносити задоволення як під час, так і після тренування!",
      rating: 5,
      program: "Учень",
    },
    {
      id: "review-3",
      name: "Кря",
      photo: "/images/testimonials/person-3.jpg",
      text: "Тренер топовий! Атмосфера бомба такої атмосфери як у Lions team немає ніде",
      rating: 5,
      program: "Учень",
    },
  ],
};
