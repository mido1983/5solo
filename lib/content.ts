import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/i18n/locales";
import { CASES_DATA, type CaseData } from "@/lib/cases-data";

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const toArray = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? (value as Record<string, unknown>[]) : [];

const toString = (value: unknown, fallback = ""): string => (typeof value === "string" ? value : fallback);

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return (value as unknown[])
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter((entry): entry is string => entry.length > 0);
};

const mapStringPairs = <K1 extends string, K2 extends string>(
  value: unknown,
  keys: [K1, K2],
): Array<{ [K in K1 | K2]: string }> => {
  return toArray(value)
    .map((entry) => {
      const first = toString(entry[keys[0]], "");
      const second = toString(entry[keys[1]], "");
      if (!first || !second) {
        return null;
      }
      return {
        [keys[0]]: first,
        [keys[1]]: second,
      } as { [K in K1 | K2]: string };
    })
    .filter((item): item is { [K in K1 | K2]: string } => item !== null);
};

export type ServiceFaqItem = {
  question: string;
  answer: string;
};

export type ServiceItem = {
  slug: string;
  title: string;
  tldr: string;
  whatWeDo: string[];
  benefits: string[];
  faq: ServiceFaqItem[];
};

export type ServicesContent = {
  label: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  headings: {
    whatWeDo: string;
    benefits: string;
    faq: string;
  };
  items: ServiceItem[];
};

export const getServicesContent = (messages: Messages): ServicesContent => {
  const root = toRecord((messages as Record<string, unknown>).services);
  const headingsRecord = toRecord(root.headings);

  const items = toArray(root.items)
    .map((raw) => {
      const slug = toString(raw.slug);
      const title = toString(raw.title);
      const tldr = toString(raw.tldr);
      if (!slug || !title) {
        return null;
      }

      const whatWeDo = toStringArray(raw.whatWeDo);
      const benefits = toStringArray(raw.benefits);
      const faqPairs = mapStringPairs(raw.faq, ["question", "answer"]) as Array<{ question: string; answer: string }>;
      const faq = faqPairs.map((entry) => ({ question: entry.question, answer: entry.answer }));

      return {
        slug,
        title,
        tldr,
        whatWeDo,
        benefits,
        faq,
      };
    })
    .filter((item): item is ServiceItem => item !== null);

  return {
    label: toString(root.label),
    title: toString(root.title),
    subtitle: toString(root.subtitle),
    ctaLabel: toString(root.ctaLabel),
    headings: {
      whatWeDo: toString(headingsRecord.whatWeDo),
      benefits: toString(headingsRecord.benefits),
      faq: toString(headingsRecord.faq),
    },
    items,
  };
};

export type OfferContent = {
  label: string;
  title: string;
  subtitle: string;
  bullets: string[];
  cta: string;
  footnote?: string;
};

export const getOfferContent = (messages: Messages): OfferContent | null => {
  const root = toRecord((messages as Record<string, unknown>).offer);
  const title = toString(root.title);
  const subtitle = toString(root.subtitle);
  const cta = toString(root.cta);
  if (!title || !subtitle || !cta) {
    return null;
  }

  return {
    label: toString(root.label),
    title,
    subtitle,
    bullets: toStringArray(root.bullets),
    cta,
    footnote: toString(root.footnote),
  };
};

export type CaseSummary = {
  slug: string;
  name: string;
  summary: string;
  result: string;
  thumbnail: string;
};

export type CaseMetric = {
  label: string;
  value: string;
};

export type CaseGalleryItem = {
  src: string;
  alt: string;
};

export type CaseSection = {
  title: string;
  body: string[];
};

export type CaseDetail = {
  slug: string;
  name: string;
  hero: {
    title: string;
    subtitle: string;
    metrics: CaseMetric[];
  };
  gallery: CaseGalleryItem[];
  stack: string[];
  sections: CaseSection[];
  cta: string;
};

export type CasesContent = {
  label: string;
  title: string;
  subtitle: string;
  detailLink: string;
  cta: string;
  backLink: string;
  items: CaseSummary[];
};

const mapCaseSummary = (item: CaseData): CaseSummary | null => {
  const { slug, name, summary, result, thumbnail } = item;
  if (!slug || !name || !thumbnail) {
    return null;
  }

  return {
    slug,
    name,
    summary,
    result,
    thumbnail,
  };
};

const mapCaseDetail = (item: CaseData, fallbackCta: string): CaseDetail => {
  const { slug, name, detail, stack } = item;
  const hero = {
    title: detail.heroTitle || name,
    subtitle: detail.heroSubtitle || "",
    metrics: detail.metrics.map((metric) => ({ label: metric.label, value: metric.value })),
  };

  const gallery = detail.gallery.map((image) => ({
    src: image.src,
    alt: image.alt || name,
  }));

  const sections = detail.sections.map((section) => ({
    title: section.title,
    body: section.body,
  }));

  return {
    slug,
    name,
    hero,
    gallery,
    stack: detail.stack.length > 0 ? detail.stack : stack,
    sections,
    cta: detail.cta || fallbackCta,
  };
};

export const getCasesContent = (locale: Locale): CasesContent => {
  const dataset = CASES_DATA[locale];
  const items = dataset.cases.items
    .map((item) => mapCaseSummary(item))
    .filter((item): item is CaseSummary => item !== null);

  return {
    label: dataset.cases.label,
    title: dataset.cases.title,
    subtitle: dataset.cases.subtitle,
    detailLink: dataset.cases.detailLink,
    cta: dataset.cases.cta,
    backLink: dataset.cases.backLink,
    items,
  };
};

export const getCaseDetail = (locale: Locale, slug: string): CaseDetail | null => {
  const dataset = CASES_DATA[locale];
  const match = dataset.cases.items.find((item) => item.slug === slug);
  if (!match) {
    return null;
  }
  return mapCaseDetail(match, dataset.cases.cta);
};


export type LegalSection = {
  title: string;
  body: string[];
};

export type LegalPageContent = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const getLegalContent = (messages: Messages, page: "privacy" | "terms"): LegalPageContent | null => {
  const root = toRecord((messages as Record<string, unknown>).legal);
  const pageRecord = toRecord(root[page]);
  const title = toString(pageRecord.title);
  const intro = toString(pageRecord.intro);
  if (!title || !intro) {
    return null;
  }

  const sections = toArray(pageRecord.sections)
    .map((section) => {
      const sectionTitle = toString(section.title);
      const body = toStringArray(section.body);
      if (!sectionTitle || body.length === 0) {
        return null;
      }
      return { title: sectionTitle, body };
    })
    .filter((section): section is LegalSection => section !== null);

  return {
    title,
    updated: toString(pageRecord.updated),
    intro,
    sections,
  };
};

export const getLegalBackLink = (messages: Messages): string => {
  const root = toRecord((messages as Record<string, unknown>).legal);
  return toString(root.backLink);
};

export const getHeroMetrics = (messages: Messages): { label: string; value: string }[] => {
  const hero = toRecord((messages as Record<string, unknown>).hero);
  const pairs = mapStringPairs(hero.metrics, ["label", "value"]) as Array<{ label: string; value: string }>;
  return pairs.map((entry) => ({ label: entry.label, value: entry.value }));
};


