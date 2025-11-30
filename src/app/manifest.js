import { SITE_NAME } from "@/lib/env";
import { strToUnderscore } from "@/lib/formater";

export default function manifest() {
   return {
      name: SITE_NAME,
      short_name: strToUnderscore(SITE_NAME),
      description: SITE_NAME,
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#ffffff",
      icons: [
         {
            src: "/images/logo.png",
            sizes: "192x192",
            type: "image/png",
         },
         {
            src: "/images/logo.png",
            sizes: "512x512",
            type: "image/png",
         },
      ],
   };
}
