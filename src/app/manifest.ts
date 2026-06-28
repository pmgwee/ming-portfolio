import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

// Served at /manifest.webmanifest. Icons reference the file-convention icons
// (src/app/icon.png, apple-icon.png) — add the logo files to populate them.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#07080c",
    theme_color: "#07080c",
    icons: [
      { src: "/icon.png", sizes: "500x500", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
