"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { instagramProfiles } from "@/data/instagram";
import type { InstagramProfile } from "@/types";

function PhoneMockup({
  profile,
  language,
  followLabel,
  index,
}: {
  profile: InstagramProfile;
  language: "en" | "uk";
  followLabel: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="flex flex-col items-center gap-4"
    >
      <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-gold">
        {profile.locationLabel[language]}
      </p>

      <div className="relative w-[280px] sm:w-[300px]">
        <div className="absolute -inset-3 rounded-[2.9rem] bg-gradient-to-b from-white/10 via-transparent to-white/5 blur-2xl" />

        <div className="relative rounded-[2.6rem] bg-[#1c1c1e] p-[9px] shadow-[0_30px_70px_rgba(0,0,0,0.65)] ring-1 ring-white/15">
          <div className="relative overflow-hidden rounded-[2.15rem] bg-[#fafafa]">
            <div className="pointer-events-none absolute left-1/2 top-3 z-20 h-[26px] w-[96px] -translate-x-1/2 rounded-full bg-black" />

            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block"
              aria-label={`Instagram @${profile.handle}`}
            >
              {/* Native img avoids Next/Image optimizer blank frames */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.screenshot}
                alt={`Instagram @${profile.handle}`}
                width={472}
                height={849}
                className="block h-auto w-full"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </a>
          </div>
        </div>
      </div>

      <a
        href={profile.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-full max-w-[280px] items-center justify-center rounded-xl bg-[#0095f6] text-sm font-semibold text-white shadow-lg shadow-[#0095f6]/25 transition-all hover:bg-[#1877f2] hover:shadow-[#1877f2]/30 active:scale-[0.98] sm:max-w-[300px]"
      >
        {followLabel}
      </a>
    </motion.div>
  );
}

/** Instagram phones without a separate page section / nav item. */
export default function InstagramPhones() {
  const { t, language } = useLanguage();

  return (
    <div className="mt-16 flex flex-col items-center justify-center gap-12 lg:mt-20 lg:flex-row lg:items-start lg:gap-16">
      {instagramProfiles.map((profile, i) => (
        <PhoneMockup
          key={profile.id}
          profile={profile}
          language={language}
          followLabel={t.INSTAGRAM_HEADING.follow}
          index={i}
        />
      ))}
    </div>
  );
}
