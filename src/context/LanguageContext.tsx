"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/constants/content";

export type Language = "ru" | "uk";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.ru;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ru");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("preferred-language") as Language;
    if (saved === "ru" || saved === "uk") {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "uk" || browserLang === "ua") {
        setLanguageState("uk");
        document.documentElement.lang = "uk";
      } else {
        document.documentElement.lang = "ru";
      }
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred-language", lang);
    document.documentElement.lang = lang;
  };

  // Provide fallback translations if not mounted yet to avoid mismatch
  const t = mounted ? translations[language] : translations.ru;

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
