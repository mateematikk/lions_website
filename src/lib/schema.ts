import { SEO, CONTACT_INFO } from "@/constants/content";
import { locations } from "@/data/locations";

export function generateSchemaOrg() {
  const locs = locations.ru;

  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Lions Team BJJ",
    description: SEO.description,
    url: SEO.url,
    image: `${SEO.url}${SEO.ogImage}`,
    telephone: CONTACT_INFO.phone,
    email: CONTACT_INFO.email,
    address: locs.map((loc) => ({
      "@type": "PostalAddress",
      streetAddress: loc.address,
      addressLocality: "Киев",
      addressCountry: "UA",
      name: loc.district,
    })),
    geo: locs.map((loc) => ({
      "@type": "GeoCoordinates",
      latitude: loc.lat,
      longitude: loc.lng,
      name: loc.district,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "18:00",
      },
    ],
    sport: "Brazilian Jiu-Jitsu",
    sameAs: [
      CONTACT_INFO.instagram,
      CONTACT_INFO.facebook,
      CONTACT_INFO.telegram,
    ],
  };
}
