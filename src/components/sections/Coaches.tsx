"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionWrapper from "@/components/shared/SectionWrapper";
import SectionHeading from "@/components/shared/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import { coaches } from "@/data/coaches";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export default function Coaches() {
  const { t, language } = useLanguage();

  return (
    <SectionWrapper id="coaches">
      <SectionHeading
        title={t.COACHES_HEADING.title}
        subtitle={t.COACHES_HEADING.subtitle}
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {coaches[language].map((coach, i) => (
          <motion.div
            key={coach.id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="group overflow-hidden rounded-2xl border border-medium-gray/30 bg-dark-gray transition-all duration-300 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10"
          >
            {/* Photo */}
            <div className="relative h-80 overflow-hidden sm:h-96">
              <Image
                src={coach.photo}
                alt={coach.name}
                fill
                className="object-cover object-[center_15%] transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-gray via-transparent to-transparent" />

              {/* Belt Badge */}
              <div className="absolute bottom-4 left-4">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md"
                  style={{
                    backgroundColor: `${coach.beltColor}CC`,
                    border: `1px solid ${coach.beltColor}`,
                  }}
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: coach.beltColor === "#1A1A1A" ? "#fff" : coach.beltColor }}
                  />
                  {coach.belt}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-white">
                {coach.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-light-gray">
                {coach.bio}
              </p>

              {/* Achievements */}
              <ul className="mt-4 space-y-1.5">
                {coach.achievements.map((ach, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm text-light-gray"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {ach}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
