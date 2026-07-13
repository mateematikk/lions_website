"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Trophy,
  Users,
  Shield,
  Layers,
  type LucideIcon,
} from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import SectionHeading from "@/components/shared/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Trophy,
  Users,
  Shield,
  Layers,
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export default function WhyUs() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="why-us" dark={false}>
      <SectionHeading title={t.WHY_US_HEADING.title} subtitle={t.WHY_US_HEADING.subtitle} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {t.WHY_US_ITEMS.map((item, i) => {
          const Icon = iconMap[item.icon] || Shield;
          return (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group glass-light rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/10 ${
                i >= 3 ? "lg:col-span-1 lg:mx-auto lg:w-full lg:max-w-md" : ""
              }`}
            >
              {/* Icon */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 text-gold transition-colors group-hover:from-gold/30 group-hover:to-gold/10">
                <Icon size={28} strokeWidth={1.5} />
              </div>

              {/* Text */}
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-light-gray">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
