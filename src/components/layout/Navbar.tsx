"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";
import EnrollmentForm from "@/components/shared/EnrollmentForm";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const activeSection = useScrollSpy();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed left-0 right-0 top-0 z-40 transition-all duration-500",
          isScrolled
            ? "glass border-b border-gold/10 shadow-lg shadow-black/50"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("#hero")}
            className="flex items-center gap-2"
          >
            <span className="font-heading text-xl font-bold tracking-widest text-gradient-gold sm:text-2xl">
              LIONS TEAM
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {t.NAV_ITEMS.filter((item) => item.id !== "hero").map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  activeSection === item.id
                    ? "text-gold"
                    : "text-light-gray hover:text-white"
                )}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-gold"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* CTA + Language Switcher + Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Desktop Language Switcher */}
            <div className="relative hidden items-center gap-0.5 rounded-lg border border-gold/10 bg-black-pure/45 p-0.5 backdrop-blur-sm sm:flex">
              {(["ru", "uk"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "relative rounded-md px-2 py-0.5 text-xs font-bold uppercase transition-colors z-10",
                    language === lang ? "text-black-pure font-black" : "text-light-gray hover:text-white"
                  )}
                >
                  <span className="relative z-10">{lang === "uk" ? "UA" : "RU"}</span>
                  {language === lang && (
                    <motion.div
                      layoutId="active-lang-desktop"
                      className="absolute inset-0 rounded-md bg-gold"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsFormOpen(true)}
              className="hidden rounded-xl bg-gradient-to-r from-gold-light via-gold to-gold-dark px-5 py-2.5 font-heading text-sm font-bold uppercase tracking-wider text-black-pure transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 sm:block"
            >
              {t.HERO.ctaPrimary}
            </button>

            {/* Mobile Language Switcher (visible when mobile toggle is shown) */}
            <div className="relative flex items-center gap-0.5 rounded-lg border border-gold/10 bg-black-pure/45 p-0.5 backdrop-blur-sm sm:hidden">
              {(["ru", "uk"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "relative rounded-md px-2 py-0.5 text-xs font-bold uppercase transition-colors z-10",
                    language === lang ? "text-black-pure font-black" : "text-light-gray hover:text-white"
                  )}
                >
                  <span className="relative z-10">{lang === "uk" ? "UA" : "RU"}</span>
                  {language === lang && (
                    <motion.div
                      layoutId="active-lang-mobile-navbar"
                      className="absolute inset-0 rounded-md bg-gold"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="rounded-lg p-2 text-white transition-colors hover:text-gold lg:hidden"
              aria-label={language === "uk" ? "Меню" : "Меню"}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black-pure/95 backdrop-blur-md lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="flex h-full flex-col items-center justify-center gap-6"
            >
              {t.NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    "font-heading text-2xl font-bold uppercase tracking-widest transition-colors",
                    activeSection === item.id
                      ? "text-gradient-gold"
                      : "text-light-gray hover:text-white"
                  )}
                >
                  {item.label}
                </motion.button>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => {
                  setIsMobileOpen(false);
                  setIsFormOpen(true);
                }}
                className="mt-4 rounded-xl bg-gradient-to-r from-gold-light via-gold to-gold-dark px-8 py-3 font-heading text-lg font-bold uppercase tracking-wider text-black-pure"
              >
                {t.HERO.ctaPrimary}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enrollment Form Modal */}
      <EnrollmentForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}
