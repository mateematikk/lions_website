"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import SectionHeading from "@/components/shared/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import { galleryImages } from "@/data/gallery";
import InstagramPhones from "@/components/sections/Instagram";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { t, language } = useLanguage();

  return (
    <SectionWrapper id="gallery">
      <SectionHeading
        title={t.GALLERY_HEADING.title}
        subtitle={t.GALLERY_HEADING.subtitle}
      />

      {/* Masonry Grid */}
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {galleryImages.map((image, i) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className="group relative mb-4 cursor-pointer overflow-hidden rounded-xl break-inside-avoid"
            onClick={() => setSelectedImage(image.src)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black-pure/0 transition-all duration-300 group-hover:bg-black-pure/50">
              <ZoomIn
                size={32}
                className="text-gold opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <InstagramPhones />

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black-pure/95 p-4 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-white transition-colors hover:text-gold"
              aria-label={language === "uk" ? "Закрити" : "Close"}
            >
              <X size={28} />
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt={language === "uk" ? "Перегляд фото" : "Photo preview"}
                width={1200}
                height={800}
                className="h-auto max-h-[85vh] w-auto rounded-2xl object-contain"
                sizes="90vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
