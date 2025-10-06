import type { MetadataRoute } from "next";

import { locales, type Locale } from "@/i18n/locales";
import { getCasesContent } from "@/lib/content";
import { absoluteUrl, localePath } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    routes.push({
      url: absoluteUrl(localePath(locale)),
      lastModified: now,
      changeFrequency: "monthly",
      priority: locale === "en" ? 1 : 0.9,
    });

    routes.push({
      url: absoluteUrl(localePath(locale, "cases")),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    });

    routes.push({
      url: absoluteUrl(localePath(locale, "legal/privacy")),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    });

    routes.push({
      url: absoluteUrl(localePath(locale, "legal/terms")),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    });

    const cases = getCasesContent(locale as Locale);

    for (const item of cases.items) {
      routes.push({
        url: absoluteUrl(localePath(locale, `cases/${item.slug}`)),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return routes;
}


