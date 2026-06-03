import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/site-url"

export type LegalPageLocale = "es" | "en"

export type LegalPageSlug =
  | "terminos"
  | "privacidad"
  | "cookies"
  | "terms"
  | "privacy"

export type LegalPageInfo = {
  locale: LegalPageLocale
  slug: LegalPageSlug
  title: string
  description: string
  path: string
  linkLabel: string
}

const SITE_URL = getSiteUrl()
const OG_IMAGE = `${SITE_URL}/images/og-image.png`

export const legalPages = {
  es: {
    terminos: {
      locale: "es",
      slug: "terminos",
      title: "Términos y condiciones | Justo",
      description:
        "Términos de uso de Justo, asistente laboral open source con cálculos determinísticos y corpus legal versionado.",
      path: "/es/terminos",
      linkLabel: "Términos",
    },
    privacidad: {
      locale: "es",
      slug: "privacidad",
      title: "Política de privacidad | Justo",
      description:
        "Cómo Justo maneja preferencias locales, analítica anónima y datos procesados en herramientas laborales.",
      path: "/es/privacidad",
      linkLabel: "Privacidad",
    },
    cookies: {
      locale: "es",
      slug: "cookies",
      title: "Política de cookies | Justo",
      description:
        "Justo no usa cookies de rastreo. Conoce cómo utiliza almacenamiento local y analítica anónima.",
      path: "/es/cookies",
      linkLabel: "Cookies",
    },
  },
  en: {
    terms: {
      locale: "en",
      slug: "terms",
      title: "Terms and conditions | Justo",
      description:
        "Terms of use for Justo, an open-source labor assistant with deterministic calculations and versioned legal corpus.",
      path: "/en/terms",
      linkLabel: "Terms",
    },
    privacy: {
      locale: "en",
      slug: "privacy",
      title: "Privacy policy | Justo",
      description:
        "How Justo handles local preferences, anonymous analytics, and data processed by labor calculation tools.",
      path: "/en/privacy",
      linkLabel: "Privacy",
    },
    cookies: {
      locale: "en",
      slug: "cookies",
      title: "Cookies policy | Justo",
      description:
        "Justo does not use tracking cookies. Learn how local storage and anonymous analytics are handled.",
      path: "/en/cookies",
      linkLabel: "Cookies",
    },
  },
} as const satisfies Record<LegalPageLocale, Record<string, LegalPageInfo>>

export function getLegalLinks(locale: string): LegalPageInfo[] {
  return locale === "en"
    ? [legalPages.en.terms, legalPages.en.privacy, legalPages.en.cookies]
    : [legalPages.es.terminos, legalPages.es.privacidad, legalPages.es.cookies]
}

export function getLegalPageMetadata(page: LegalPageInfo): Metadata {
  const canonical = `${SITE_URL}${page.path}`

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: "Justo",
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
      locale: page.locale === "en" ? "en" : "es_419",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [OG_IMAGE],
    },
  }
}

export function getLegalSitemapEntries(): LegalPageInfo[] {
  return [
    legalPages.es.terminos,
    legalPages.es.privacidad,
    legalPages.es.cookies,
    legalPages.en.terms,
    legalPages.en.privacy,
    legalPages.en.cookies,
  ]
}
