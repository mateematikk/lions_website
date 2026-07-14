"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import SectionHeading from "@/components/shared/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { t, language } = useLanguage();

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <SectionWrapper id="testimonials" dark={false}>
      <SectionHeading
        title={t.TESTIMONIALS_HEADING.title}
        subtitle={t.TESTIMONIALS_HEADING.subtitle}
      />

      <div className="relative">
        {/* Arrow Buttons */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-medium-gray bg-dark-gray/90 text-white shadow-lg backdrop-blur transition-all hover:border-gold hover:text-gold md:-left-5"
            aria-label={language === "uk" ? "Попередній відгук" : "Previous review"}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-medium-gray bg-dark-gray/90 text-white shadow-lg backdrop-blur transition-all hover:border-gold hover:text-gold md:-right-5"
            aria-label={language === "uk" ? "Наступний відгук" : "Next review"}
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Slider */}
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials[language].map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="w-[85vw] max-w-md flex-shrink-0 snap-center rounded-2xl border border-medium-gray/30 bg-dark-gray p-6 sm:p-8"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    className="fill-gold text-gold"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="mt-4 text-sm leading-relaxed text-light-gray sm:text-base">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-gold/40">
                  <Image
                    src={review.photo}
                    alt={review.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-white">
                    {review.name}
                  </p>
                  <p className="text-xs text-gold">{review.program}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
