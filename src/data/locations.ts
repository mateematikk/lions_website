import type { Location } from "@/types";

/**
 * Gym locations — edit here without touching UI components.
 * mapEmbed / mapUrl are derived from lat/lng.
 */
const locationCoords = {
  pozniaky: { lat: 50.398313, lng: 30.641273 },
  kniazhyiZaton: { lat: 50.4008, lng: 30.6216 },
  darnytsia: { lat: 50.44147, lng: 30.625823 },
  pochaina: { lat: 50.49295, lng: 30.506588 },
} as const;

function mapLinks(lat: number, lng: number, lang: "en" | "uk") {
  return {
    mapUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    mapEmbed: `https://maps.google.com/maps?q=${lat},${lng}&hl=${lang}&z=16&output=embed`,
  };
}

export const locations: Record<"en" | "uk", Location[]> = {
  en: [
    {
      id: "pozniaky",
      district: "Pozniaky",
      address: "Kyiv, Myshuhy St 2",
      lat: locationCoords.pozniaky.lat,
      lng: locationCoords.pozniaky.lng,
      ...mapLinks(locationCoords.pozniaky.lat, locationCoords.pozniaky.lng, "en"),
    },
    {
      id: "kniazhyi-zaton",
      district: "Pozniaky",
      address: "Kyiv, Knyazhyi Zaton St 17v",
      lat: locationCoords.kniazhyiZaton.lat,
      lng: locationCoords.kniazhyiZaton.lng,
      ...mapLinks(
        locationCoords.kniazhyiZaton.lat,
        locationCoords.kniazhyiZaton.lng,
        "en"
      ),
    },
    {
      id: "darnytsia",
      district: "Darnytsia",
      address: "Kyiv, Darnytska Square 1",
      lat: locationCoords.darnytsia.lat,
      lng: locationCoords.darnytsia.lng,
      ...mapLinks(
        locationCoords.darnytsia.lat,
        locationCoords.darnytsia.lng,
        "en"
      ),
    },
    {
      id: "pochaina",
      district: "Pochaina",
      address: "Kyiv, Yordanska St 4h",
      lat: locationCoords.pochaina.lat,
      lng: locationCoords.pochaina.lng,
      ...mapLinks(locationCoords.pochaina.lat, locationCoords.pochaina.lng, "en"),
    },
  ],
  uk: [
    {
      id: "pozniaky",
      district: "Позняки",
      address: "Київ, вул. Мишуги 2",
      lat: locationCoords.pozniaky.lat,
      lng: locationCoords.pozniaky.lng,
      ...mapLinks(locationCoords.pozniaky.lat, locationCoords.pozniaky.lng, "uk"),
    },
    {
      id: "kniazhyi-zaton",
      district: "Позняки",
      address: "Київ, вул. Княжий Затон 17в",
      lat: locationCoords.kniazhyiZaton.lat,
      lng: locationCoords.kniazhyiZaton.lng,
      ...mapLinks(
        locationCoords.kniazhyiZaton.lat,
        locationCoords.kniazhyiZaton.lng,
        "uk"
      ),
    },
    {
      id: "darnytsia",
      district: "Дарниця",
      address: "Київ, Дарницька площа 1",
      lat: locationCoords.darnytsia.lat,
      lng: locationCoords.darnytsia.lng,
      ...mapLinks(
        locationCoords.darnytsia.lat,
        locationCoords.darnytsia.lng,
        "uk"
      ),
    },
    {
      id: "pochaina",
      district: "Почайна",
      address: "Київ, вул. Йорданська 4г",
      lat: locationCoords.pochaina.lat,
      lng: locationCoords.pochaina.lng,
      ...mapLinks(locationCoords.pochaina.lat, locationCoords.pochaina.lng, "uk"),
    },
  ],
};
