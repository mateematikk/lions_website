"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import EnrollmentForm from "@/components/shared/EnrollmentForm";

export default function Hero() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  const handleScheduleClick = () => {
    const el = document.getElementById("schedule");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Тренировка бразильского джиу-джитсу в Lions Team"
            fill
            preload
            quality={90}
            className="object-cover"
            sizes="100vw"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black-pure/70 via-black-pure/50 to-black-pure/90" />
          {/* Gold Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6"
        >
          {/* Logo Badge */}
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black-pure/40 px-5 py-2 backdrop-blur-sm"
          >
            <div className="h-2 w-2 rounded-full bg-gold animate-pulse-gold" />
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
              Est. 2018
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="font-heading text-5xl font-bold uppercase leading-none tracking-wider sm:text-7xl md:text-8xl lg:text-9xl"
          >
            <span className="text-gradient-gold">{t.HERO.title}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-2 font-heading text-xl font-light uppercase tracking-[0.4em] text-white/80 sm:text-2xl md:text-3xl"
          >
            {t.HERO.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-xl text-base text-light-gray sm:text-lg md:mt-8"
          >
            {t.HERO.description}
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-10"
          >
            <button
              onClick={() => setIsFormOpen(true)}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-gold-light via-gold to-gold-dark px-8 py-4 font-heading text-base font-bold uppercase tracking-wider text-black-pure transition-all duration-300 hover:shadow-xl hover:shadow-gold/25 sm:px-10"
            >
              <span className="relative z-10">{t.HERO.ctaPrimary}</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
            <button
              onClick={handleScheduleClick}
              className="group rounded-xl border border-white/30 px-8 py-4 font-heading text-base font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-gold hover:text-gold sm:px-10"
            >
              {t.HERO.ctaSecondary}
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-light-gray/60">
              Scroll
            </span>
            <div className="h-8 w-[1px] bg-gradient-to-b from-gold/60 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      <EnrollmentForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}
