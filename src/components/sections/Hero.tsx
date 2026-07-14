"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import EnrollmentForm from "@/components/shared/EnrollmentForm";

export default function Hero() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { t, language } = useLanguage();

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
      <section
        id="hero"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black-pure"
      >
        {/* Soft brand atmosphere */}
        <div className="absolute inset-0">
          {/* Photo layer */}
          <motion.div
            initial={{ scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Image
              src="/images/hero.jpg"
              alt={
                language === "uk"
                  ? "Тренування Lions Team"
                  : "Lions Team training"
              }
              fill
              priority
              quality={90}
              className="object-cover opacity-55 saturate-[0.75] contrast-[1.05]"
              sizes="100vw"
            />
          </motion.div>

          {/* Readable overlays — keep atmosphere, don't kill the image */}
          <div className="absolute inset-0 bg-black-pure/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-black-pure/70 via-black-pure/25 to-black-pure/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-black-pure/40 via-transparent to-black-pure/40" />

          {/* Soft gold glow behind logo */}
          <div className="pointer-events-none absolute left-1/2 top-[42%] h-[36vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.08] blur-[80px]" />

          {/* Bottom gold hairline */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
        </div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 flex justify-center md:mb-8"
          >
            <Image
              src="/images/logo-transparent.png"
              alt="Lions JiuJitsu"
              width={520}
              height={230}
              className="h-auto w-[min(88vw,440px)] drop-shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
              priority
            />
          </motion.div>

          <h1 className="sr-only">{t.HERO.title}</h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-2 max-w-xl text-base text-light-gray/90 sm:text-lg md:mt-4"
          >
            {t.HERO.description}
          </motion.p>

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
              className="group rounded-xl border border-white/25 px-8 py-4 font-heading text-base font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-gold hover:text-gold sm:px-10"
            >
              {t.HERO.ctaSecondary}
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-light-gray/55">
              Scroll
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-gold/55 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      <EnrollmentForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}
