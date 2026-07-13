import type { Location } from "@/types";

/**
 * Gym locations — edit here without touching UI components.
 * mapEmbed / mapUrl are derived from lat/lng.
 */
const locationCoords = {
  pozniaky: { lat: 50.398313, lng: 30.641273 },
  darnytsia: { lat: 50.44147, lng: 30.625823 },
  pochaina: { lat: 50.49295, lng: 30.506588 },
} as const;

function mapLinks(lat: number, lng: number, lang: "ru" | "uk") {
  return {
    mapUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    mapEmbed: `https://maps.google.com/maps?q=${lat},${lng}&hl=${lang}&z=16&output=embed`,
  };
}

export const locations: Record<"ru" | "uk", Location[]> = {
  ru: [
    {
      id: "pozniaky",
      district: "Позняки",
      address: "Киев, ул. Мишуги 2",
      lat: locationCoords.pozniaky.lat,
      lng: locationCoords.pozniaky.lng,
      ...mapLinks(locationCoords.pozniaky.lat, locationCoords.pozniaky.lng, "ru"),
    },
    {
      id: "darnytsia",
      district: "Дарница",
      address: "Киев, Дарницкая площадь 1",
      lat: locationCoords.darnytsia.lat,
      lng: locationCoords.darnytsia.lng,
      ...mapLinks(
        locationCoords.darnytsia.lat,
        locationCoords.darnytsia.lng,
        "ru"
      ),
    },
    {
      id: "pochaina",
      district: "Почайна",
      address: "Киев, ул. Йорданская 3в",
      lat: locationCoords.pochaina.lat,
      lng: locationCoords.pochaina.lng,
      ...mapLinks(locationCoords.pochaina.lat, locationCoords.pochaina.lng, "ru"),
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
      address: "Київ, вул. Йорданська 3в",
      lat: locationCoords.pochaina.lat,
      lng: locationCoords.pochaina.lng,
      ...mapLinks(locationCoords.pochaina.lat, locationCoords.pochaina.lng, "uk"),
    },
  ],
};
