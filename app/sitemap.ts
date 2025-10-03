import type { MetadataRoute } from "next";

import { locales } from "@/i18n/locales";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.map((locale) => ({
    url: absoluteUrl(`/${locale}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
  }));
}
