"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Baby,
  Flame,
  Swords,
  Heart,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import SectionHeading from "@/components/shared/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import { programs } from "@/data/programs";

const iconMap: Record<string, LucideIcon> = {
  Baby,
  Flame,
  Swords,
  Heart,
  Trophy,
  Zap,
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export default function Programs() {
  const { t, language } = useLanguage();

  return (
    <SectionWrapper id="programs" dark={false}>
      <SectionHeading
        title={t.PROGRAMS_HEADING.title}
        subtitle={t.PROGRAMS_HEADING.subtitle}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {programs[language].map((program, i) => {
          const Icon = iconMap[program.icon] || Swords;
          return (
            <motion.div
              key={program.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-2xl border border-medium-gray/30 bg-dark-gray transition-all duration-300 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-gray via-dark-gray/30 to-transparent" />

                {/* Icon Badge */}
                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold/90 text-black-pure shadow-lg">
                  <Icon size={20} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-white">
                  {program.title}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gold">
                  {program.shortDescription}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-light-gray line-clamp-3">
                  {program.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
