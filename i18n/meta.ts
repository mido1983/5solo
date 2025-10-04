export type SupportedLocale = "en" | "ru" | "he";

export const metaByLocale: Record<SupportedLocale, { title: string; description: string }> = {
  en: {
    title: "5SOLO - Five disciplines. One outcome.",
    description: "Development, design, SEO, media and care that drive measurable growth. MVP in 10 days.",
  },
  ru: {
    title: "5SOLO - Пять экспертиз. Один результат.",
    description: "Разработка, дизайн, SEO, медиа и поддержка — запустим MVP за 10 дней и растим трафик.",
  },
  he: {
    title: "5SOLO - חמש דיסציפלינות. תוצאה אחת.",
    description: "פיתוח, עיצוב, SEO, מדיה ותמיכה – MVP ב-10 ימים וצמיחה מדידה.",
  },
};
