"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import SectionHeading from "@/components/shared/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import { faqItems } from "@/data/faq";

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { t, language } = useLanguage();

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <SectionWrapper id="faq">
      <SectionHeading title={t.FAQ_HEADING.title} subtitle={t.FAQ_HEADING.subtitle} />

      <div className="mx-auto max-w-3xl space-y-3">
        {faqItems[language].map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <div
              className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                openId === item.id
                  ? "border-gold/40 bg-dark-gray"
                  : "border-medium-gray/30 bg-dark-gray/60 hover:border-gold/20"
              }`}
            >
              {/* Question */}
              <button
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
              >
                <span
                  className={`font-heading text-sm font-bold uppercase tracking-wide transition-colors sm:text-base ${
                    openId === item.id ? "text-gold" : "text-white"
                  }`}
                >
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openId === item.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 text-gold"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-medium-gray/30 px-5 py-4 sm:px-6">
                      <p className="text-sm leading-relaxed text-light-gray">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
