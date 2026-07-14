"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { programs } from "@/data/programs";

interface EnrollmentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  phone: string;
  age: string;
  program: string;
  comment: string;
}

export default function EnrollmentForm({ isOpen, onClose }: EnrollmentFormProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    age: "",
    program: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    /* ── API-Ready: Replace this with your Telegram Bot / CRM integration ── */
    // Example:
    // await fetch("/api/enroll", { method: "POST", body: JSON.stringify(formData) });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: "", phone: "", age: "", program: "", comment: "" });
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black-pure/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative w-full max-w-lg rounded-2xl p-6 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-light-gray transition-colors hover:text-gold"
              aria-label={language === "uk" ? "Закрити" : "Close"}
            >
              <X size={24} />
            </button>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                /* ── Success State ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <CheckCircle2 size={72} className="text-gold" />
                  </motion.div>
                  <h3 className="mt-6 font-heading text-2xl font-bold text-white">
                    {t.ENROLLMENT_FORM.success.title}
                  </h3>
                  <p className="mt-2 text-light-gray">
                    {t.ENROLLMENT_FORM.success.message}
                  </p>
                </motion.div>
              ) : (
                /* ── Form State ── */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="font-heading text-2xl font-bold text-gradient-gold">
                    {t.ENROLLMENT_FORM.title}
                  </h3>
                  <p className="mt-1 text-sm text-light-gray">
                    {t.ENROLLMENT_FORM.subtitle}
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Name */}
                    <div>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder={t.ENROLLMENT_FORM.fields.name}
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-medium-gray bg-dark-gray-2 px-4 py-3 text-white placeholder:text-light-gray/60 transition-colors focus:border-gold focus:outline-none"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder={t.ENROLLMENT_FORM.fields.phone}
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-medium-gray bg-dark-gray-2 px-4 py-3 text-white placeholder:text-light-gray/60 transition-colors focus:border-gold focus:outline-none"
                      />
                    </div>

                    {/* Age + Program row */}
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        name="age"
                        min="4"
                        max="99"
                        placeholder={t.ENROLLMENT_FORM.fields.age}
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-medium-gray bg-dark-gray-2 px-4 py-3 text-white placeholder:text-light-gray/60 transition-colors focus:border-gold focus:outline-none"
                      />
                      <select
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-medium-gray bg-dark-gray-2 px-4 py-3 text-white transition-colors focus:border-gold focus:outline-none appearance-none"
                      >
                        <option value="">{t.ENROLLMENT_FORM.fields.program}</option>
                        {programs[language].map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Comment */}
                    <div>
                      <textarea
                        name="comment"
                        rows={3}
                        placeholder={t.ENROLLMENT_FORM.fields.comment}
                        value={formData.comment}
                        onChange={handleChange}
                        className="w-full resize-none rounded-xl border border-medium-gray bg-dark-gray-2 px-4 py-3 text-white placeholder:text-light-gray/60 transition-colors focus:border-gold focus:outline-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-light via-gold to-gold-dark py-3.5 font-heading text-lg font-bold uppercase tracking-wider text-black-pure transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                      {isSubmitting ? (language === "uk" ? "Надсилання..." : "Sending...") : t.ENROLLMENT_FORM.submit}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
