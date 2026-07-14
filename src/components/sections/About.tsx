"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionWrapper from "@/components/shared/SectionWrapper";
import SectionHeading from "@/components/shared/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { t, language } = useLanguage();

  return (
    <SectionWrapper id="about">
      <SectionHeading title={t.ABOUT.title} subtitle={t.ABOUT.subtitle} />

      <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
        {/* Text Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-5 lg:col-span-3"
        >
          {t.ABOUT.paragraphs.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="text-base leading-relaxed text-light-gray sm:text-lg"
            >
              {paragraph}
            </motion.p>
          ))}

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-3 gap-4 pt-6"
          >
            {[
              { value: "12+", label: language === "uk" ? "років досвіду" : "years of experience" },
              { value: "200+", label: language === "uk" ? "учнів" : "students" },
              { value: "100+", label: language === "uk" ? "медалей" : "medals" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-heading text-3xl font-bold text-gradient-gold sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-light-gray">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Image Column */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative lg:col-span-2"
        >
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/images/about.jpg"
              alt="Тренировка в Lions Team BJJ"
              width={600}
              height={750}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {/* Decorative Gold Corner */}
            <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-tl-3xl border-l-2 border-t-2 border-gold/40" />
            <div className="absolute -left-2 -top-2 h-24 w-24 rounded-br-3xl border-b-2 border-r-2 border-gold/40" />
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
