export interface Coach {
  id: string;
  name: string;
  belt: string;
  beltColor: string;
  photo: string;
  achievements: string[];
  bio: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  ageRange: string;
  image: string;
  icon: string;
}

export interface ScheduleEntry {
  time: string;
  group: string;
  coach: string;
  programId: string;
  location: string;
}

export interface DaySchedule {
  day: string;
  dayShort: string;
  entries: ScheduleEntry[];
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  text: string;
  rating: number;
  program: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Location {
  id: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  mapUrl: string;
  mapEmbed: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  telegram: string;
  instagram: string;
  facebook: string;
  workingHours: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface WhyUsItem {
  icon: string;
  title: string;
  description: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface InstagramProfile {
  id: string;
  handle: string;
  displayName: string;
  url: string;
  screenshot: string;
  locationLabel: Record<"en" | "uk", string>;
}
