"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";
import SectionHeading from "@/components/shared/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import { schedule } from "@/data/schedule";

const programColors: Record<string, string> = {
  kids: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  teens: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  adults: "bg-gold/20 text-gold border-gold/30",
  women: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  competition: "bg-red-500/20 text-red-400 border-red-500/30",
  nogi: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function Schedule() {
  const [activeDay, setActiveDay] = useState(0);
  const { t, language } = useLanguage();

  return (
    <SectionWrapper id="schedule" dark={false}>
      <SectionHeading
        title={t.SCHEDULE_HEADING.title}
        subtitle={t.SCHEDULE_HEADING.subtitle}
      />

      {/* Day Tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {schedule[language].map((day, i) => (
          <button
            key={day.day}
            onClick={() => setActiveDay(i)}
            className={`rounded-xl px-4 py-2.5 font-heading text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              activeDay === i
                ? "bg-gradient-to-r from-gold-light to-gold-dark text-black-pure shadow-lg shadow-gold/20"
                : "border border-medium-gray/50 text-light-gray hover:border-gold/40 hover:text-white"
            }`}
          >
            <span className="hidden sm:inline">{day.day}</span>
            <span className="sm:hidden">{day.dayShort}</span>
          </button>
        ))}
      </div>

      {/* Schedule Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-3xl"
        >
          {schedule[language][activeDay]?.entries.length === 0 ? (
            <div className="rounded-2xl border border-medium-gray/30 bg-dark-gray p-12 text-center">
              <p className="text-light-gray">{language === "uk" ? "Вихідний" : "Выходной"}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {schedule[language][activeDay]?.entries.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="group flex flex-col gap-3 rounded-xl border border-medium-gray/30 bg-dark-gray p-4 transition-all duration-300 hover:border-gold/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Time */}
                  <div className="flex items-center gap-3 sm:w-40">
                    <div className="h-2 w-2 rounded-full bg-gold" />
                    <span className="font-heading text-sm font-bold tracking-wider text-white">
                      {entry.time}
                    </span>
                  </div>

                  {/* Group Badge */}
                  <div className="flex-1">
                    <span
                      className={`inline-block rounded-lg border px-3 py-1 text-xs font-semibold ${
                        programColors[entry.programId] || programColors.adults
                      }`}
                    >
                      {entry.group}
                    </span>
                  </div>

                  {/* Coach */}
                  <div className="text-sm text-light-gray sm:text-right">
                    {entry.coach}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
