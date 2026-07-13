"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  align?: "center" | "left";
}

export default function SectionHeading({
  title,
  subtitle,
  light = false,
  align = "center",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      <h2
        className={`font-heading text-3xl font-bold uppercase tracking-wider sm:text-4xl lg:text-5xl ${
          light ? "text-white" : "text-gradient-gold"
        }`}
      >
        {title}
      </h2>
      <div
        className={`mt-4 h-[3px] w-16 rounded-full bg-gradient-to-r from-gold-light to-gold-dark ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
      {subtitle && (
        <p className="mx-auto mt-6 max-w-2xl text-base text-light-gray sm:text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
