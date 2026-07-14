import type { InstagramProfile } from "@/types";

export const instagramProfiles: InstagramProfile[] = [
  {
    id: "main",
    handle: "lionsjiujitsu",
    displayName: "Lions Team",
    url: "https://www.instagram.com/lionsjiujitsu/",
    screenshot: "/images/instagram/main.png",
    locationLabel: {
      en: "Main account",
      uk: "Основний акаунт",
    },
  },
  {
    id: "pochaina",
    handle: "lionsteam_pochaina",
    displayName: "LionsTeam",
    url: "https://www.instagram.com/lionsteam_pochaina/",
    screenshot: "/images/instagram/pochaina.png",
    locationLabel: {
      en: "Pochaina gym",
      uk: "Зал Почайна",
    },
  },
];
