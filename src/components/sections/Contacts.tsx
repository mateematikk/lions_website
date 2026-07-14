"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, ExternalLink, Clock } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import SectionHeading from "@/components/shared/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import EnrollmentForm from "@/components/shared/EnrollmentForm";
import { locations } from "@/data/locations";

export default function Contacts() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeLocationId, setActiveLocationId] = useState("pozniaky");
  const { t, language } = useLanguage();

  const locs = locations[language];
  const active = locs.find((l) => l.id === activeLocationId) ?? locs[0];

  return (
    <SectionWrapper id="contacts" dark={false}>
      <SectionHeading
        title={t.CONTACTS_HEADING.title}
        subtitle={t.CONTACTS_HEADING.subtitle}
      />

      {/* Location tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {locs.map((loc) => {
          const isActive = loc.id === active.id;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => setActiveLocationId(loc.id)}
              className={`rounded-xl border px-5 py-3 font-heading text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? "border-gold bg-gold/10 text-gold shadow-lg shadow-gold/10"
                  : "border-medium-gray/40 text-light-gray hover:border-gold/40 hover:text-white"
              }`}
            >
              {loc.district}
            </button>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-2xl border border-medium-gray/30"
        >
          <AnimatePresence mode="wait">
            <motion.iframe
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              src={active.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={
                language === "uk"
                  ? `Розташування Lions Team — ${active.district}`
                  : `Lions Team location — ${active.district}`
              }
              className="grayscale-[0.8] contrast-[1.2] invert-[0.9] transition-all duration-500 hover:grayscale-0 hover:contrast-100 hover:invert-0"
            />
          </AnimatePresence>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col justify-center space-y-6"
        >
          {/* Address */}
          <div className="group flex items-start gap-4 rounded-xl border border-medium-gray/30 bg-dark-gray p-5 transition-all duration-300 hover:border-gold/30">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gold">
                {language === "uk" ? "Адреса" : "Address"}
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="mt-1 text-sm font-medium text-white">
                    {active.district}
                  </p>
                  <p className="mt-0.5 text-sm text-light-gray">
                    {active.address}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Phone */}
          <div className="group flex items-start gap-4 rounded-xl border border-medium-gray/30 bg-dark-gray p-5 transition-all duration-300 hover:border-gold/30">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Phone size={22} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gold">
                {language === "uk" ? "Телефон" : "Phone"}
              </p>
              <a
                href={`tel:${t.CONTACT_INFO.phone.replace(/[^\d+]/g, "")}`}
                className="mt-1 block text-sm text-light-gray transition-colors hover:text-white"
              >
                {t.CONTACT_INFO.phone}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="group flex items-start gap-4 rounded-xl border border-medium-gray/30 bg-dark-gray p-5 transition-all duration-300 hover:border-gold/30">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Mail size={22} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gold">
                Email
              </p>
              <a
                href={`mailto:${t.CONTACT_INFO.email}`}
                className="mt-1 block text-sm text-light-gray transition-colors hover:text-white"
              >
                {t.CONTACT_INFO.email}
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="group flex items-start gap-4 rounded-xl border border-medium-gray/30 bg-dark-gray p-5 transition-all duration-300 hover:border-gold/30">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gold">
                {language === "uk" ? "Час роботи" : "Working hours"}
              </p>
              <p className="mt-1 text-sm text-light-gray">
                {t.CONTACT_INFO.workingHours}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <a
              href={active.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-gold/40 px-6 py-3 font-heading text-sm font-bold uppercase tracking-wider text-gold transition-all duration-300 hover:bg-gold/10 hover:shadow-lg hover:shadow-gold/10"
            >
              <ExternalLink size={16} />
              {language === "uk" ? "Прокласти маршрут" : "Get directions"}
            </a>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-light via-gold to-gold-dark px-6 py-3 font-heading text-sm font-bold uppercase tracking-wider text-black-pure transition-all duration-300 hover:shadow-lg hover:shadow-gold/25"
            >
              {language === "uk"
                ? "Записатися на тренування"
                : "Book a training session"}
            </button>
          </div>
        </motion.div>
      </div>

      <EnrollmentForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </SectionWrapper>
  );
}
