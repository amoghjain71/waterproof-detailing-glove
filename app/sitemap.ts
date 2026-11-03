import type { MetadataRoute } from "next";
import { SITE, SITEMAP_ROUTES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return SITEMAP_ROUTES.map((path) => ({
    url: `${SITE.url}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/glove" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/glove" ? 0.9 : 0.6,
  }));
}
