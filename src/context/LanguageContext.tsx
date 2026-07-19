"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/constants/content";

export type Language = "en" | "uk";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("preferred-language");
    let initialLanguage: Language = "en";

    // Migrate legacy "ru" preference to English
    if (saved === "ru") {
      localStorage.setItem("preferred-language", "en");
    } else if (saved === "en" || saved === "uk") {
      initialLanguage = saved;
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "uk" || browserLang === "ua") {
        initialLanguage = "uk";
      }
    }

    document.documentElement.lang = initialLanguage;
    const timeoutId = window.setTimeout(() => {
      setLanguageState(initialLanguage);
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred-language", lang);
    document.documentElement.lang = lang;
  };

  const t = mounted ? translations[language] : translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
