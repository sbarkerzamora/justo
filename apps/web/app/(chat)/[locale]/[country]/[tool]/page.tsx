import type { CountryCode } from "@justo/core"
import { getAvailableTools, getToolForCountry } from "@justo/tools"
import type { JustoTool } from "@justo/tools"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCountryInfo, isValidCountry, countryList } from "@/lib/countries"
import { isValidLocale, locales, type Locale } from "@/lib/i18n"
import { getSiteUrl } from "@/lib/site-url"
import {
  buildToolJsonLd,
  getToolAppMode,
  getToolPageMetadata,
} from "@/lib/tool-seo"
import { getLegalDocsLink } from "@/lib/legal-docs-link"

const SITE_URL = getSiteUrl()

const toolTitles: Record<string, { es: string; en: string }> = {
  "liquidacion-laboral": {
    es: "Calculadora de liquidación laboral",
    en: "Labor settlement calculator",
  },
  vacaciones: {
    es: "Calculadora de vacaciones",
    en: "Vacation calculator",
  },
  "salario-neto": {
    es: "Calculadora de salario neto",
    en: "Net salary calculator",
  },
  "aguinaldo-decimo-bono": {
    es: "Calculadora de aguinaldo, décimo o bono",
    en: "Bonus and 13th salary calculator",
  },
  preaviso: {
    es: "Calculadora de preaviso laboral",
    en: "Notice period calculator",
  },
  "simulador-terminacion": {
    es: "Simulador de terminación laboral",
    en: "Employment termination simulator",
  },
  "generador-contratos": {
    es: "Generador de contratos de trabajo",
    en: "Employment contract generator",
  },
}

const countryIntentCopy: Partial<
  Record<CountryCode, Partial<Record<string, string>>>
> = {
  ni: {
    "liquidacion-laboral":
      "Incluye salario proporcional, indemnización cuando corresponde, aguinaldo, vacaciones, INSS e IR según el corpus de Nicaragua.",
    vacaciones:
      "Estima vacaciones acumuladas, gozadas y pendientes con base en salario, fechas y días ya disfrutados.",
    "salario-neto":
      "Convierte salario bruto a salario neto estimado después de deducciones laborales aplicables en Nicaragua.",
  },
  pe: {
    "liquidacion-laboral":
      "Incluye CTS, gratificaciones, vacaciones, indemnización cuando aplica y deducciones ONP o AFP según el corpus de Perú.",
    "salario-neto":
      "Estima salario neto en Perú considerando deducciones previsionales documentadas en el corpus.",
  },
  co: {
    "liquidacion-laboral":
      "Incluye cesantías, intereses, prima de servicios, vacaciones, deducciones de EPS y pensión cuando corresponden.",
    "aguinaldo-decimo-bono":
      "Calcula la prima de servicios proporcional según los datos capturados y las reglas documentadas para Colombia.",
  },
  cr: {
    "liquidacion-laboral":
      "Incluye cesantía, preaviso, aguinaldo proporcional, vacaciones y deducciones de CCSS cuando correspondan.",
  },
  pa: {
    "liquidacion-laboral":
      "Incluye prima de antigüedad, décimo tercer mes, vacaciones y CSS según el corpus de Panamá.",
  },
  gt: {
    "liquidacion-laboral":
      "Incluye indemnización, aguinaldo, Bono 14, vacaciones, IGSS e ISR según el corpus de Guatemala.",
  },
  sv: {
    "liquidacion-laboral":
      "Incluye indemnización, aguinaldo proporcional, vacaciones, ISSS, AFP e ISR según el corpus de El Salvador.",
  },
  hn: {
    "liquidacion-laboral":
      "Incluye auxilio de cesantía, decimotercer mes, vacaciones, IHSS y RAP según el corpus de Honduras.",
  },
  mx: {
    "liquidacion-laboral":
      "Incluye indemnización constitucional, aguinaldo, vacaciones, prima de antigüedad, IMSS e ISR según el corpus de México.",
  },
  ar: {
    "liquidacion-laboral":
      "Incluye liquidación final, indemnización por antigüedad, preaviso, SAC y vacaciones proporcionales según el corpus de Argentina.",
  },
  cl: {
    "liquidacion-laboral":
      "Incluye finiquito, vacaciones proporcionales, indemnización, AFP, salud y AFC según el corpus de Chile.",
  },
}

function getLandingTitle(slug: string, locale: Locale, countryName: string) {
  const label = toolTitles[slug]?.[locale] ?? slug
  return locale === "en" ? `${label} in ${countryName}` : `${label} en ${countryName}`
}

function getLandingIntro(tool: JustoTool, country: CountryCode, slug: string) {
  return countryIntentCopy[country]?.[slug] ?? tool.longDescription
}

export function generateStaticParams() {
  const tools = getAvailableTools()
  return locales.flatMap((locale) =>
    countryList.flatMap((country) =>
      tools
        .filter((tool) => tool.countrySupport.includes(country.code))
        .map((tool) => ({ locale, country: country.code, tool: tool.slug }))
    )
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string; tool: string }>
}): Promise<Metadata> {
  const { locale, country, tool: slug } = await params
  if (!isValidLocale(locale) || !isValidCountry(country)) return {}

  const appMode = getToolAppMode(slug)
  if (!appMode) return {}

  const item = getToolForCountry(slug, country)
  if (!item || !item.countrySupport.includes(country)) return {}

  const countryInfo = getCountryInfo(country)!
  const title = getLandingTitle(slug, locale, countryInfo.name)

  return getToolPageMetadata({
    slug,
    tool: item,
    country,
    title,
    pageLocale: locale,
  })
}

export default async function CountryToolLandingPage({
  params,
}: {
  params: Promise<{ locale: string; country: string; tool: string }>
}) {
  const { locale, country, tool: slug } = await params
  if (!isValidLocale(locale) || !isValidCountry(country)) notFound()

  const appMode = getToolAppMode(slug)
  if (!appMode) notFound()

  const tool = getToolForCountry(slug, country)
  if (!tool || !tool.countrySupport.includes(country)) notFound()

  const countryInfo = getCountryInfo(country)!
  const title = getLandingTitle(slug, locale, countryInfo.name)
  const intro = getLandingIntro(tool, country, slug)
  const legalHub = getLegalDocsLink(country)
  const appUrl = `/${locale}/${country}?tool=${appMode}`
  const toolsUrl = locale === "en" ? "/en/tools" : "/tools"
  const pageUrl = `${SITE_URL}/${locale}/${country}/${slug}`
  const faqs = [
    {
      question:
        locale === "en"
          ? `Is this ${countryInfo.name} calculator legal advice?`
          : `¿Esta calculadora para ${countryInfo.name} reemplaza asesoría legal?`,
      answer:
        locale === "en"
          ? "No. The result is informational and should be reviewed by a legal or accounting professional in disputed or complex cases."
          : "No. El resultado es informativo y debe revisarse con asesoría legal o contable profesional en casos disputados o complejos.",
    },
    {
      question:
        locale === "en"
          ? "What data do I need?"
          : "¿Qué datos necesito para calcular?",
      answer: tool.inputRequirements.slice(0, 5).join(", "),
    },
  ]
  const jsonLd = buildToolJsonLd({
    slug,
    tool,
    country,
    title,
    pageLocale: locale,
  })

  return (
    <>
      <main className="min-h-screen bg-background">
        <section className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-5xl content-center gap-10 px-6 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Link
              className="mb-8 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href={toolsUrl}
            >
              {locale === "en" ? "← Tools" : "← Herramientas"}
            </Link>
            <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
              {countryInfo.name} · {tool.availability === "available" ? "Disponible" : "Informativo"}
            </p>
            <h1 className="max-w-3xl text-4xl leading-none font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">
              {title} 2026
            </h1>
            <p className="mt-5 max-w-[62ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {intro} El resultado es informativo, gratuito y muestra fórmulas,
              referencias legales y versión del corpus usado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                href={appUrl}
              >
                {locale === "en" ? "Calculate now" : "Calcular ahora"}
              </Link>
              <Link
                className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                href={legalHub}
              >
                {locale === "en" ? "Legal framework" : "Marco legal"}
              </Link>
            </div>
          </div>

          <article className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <section>
              <h2 className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                {locale === "en" ? "What it calculates" : "Qué calcula"}
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-foreground">
                {tool.outputSummary.slice(0, 5).map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-2 block size-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8 border-t border-border pt-8">
              <h2 className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                {locale === "en" ? "Data needed" : "Datos necesarios"}
              </h2>
              <ul className="mt-5 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
                {tool.inputRequirements.slice(0, 8).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mt-8 border-t border-border pt-8">
              <h2 className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                {locale === "en" ? "References" : "Referencias"}
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {tool.legalReferences.slice(0, 3).join(" · ")}. Corpus {tool.corpusVersion}.
              </p>
              <p className="mt-4 text-xs leading-6 text-muted-foreground">
                {tool.disclaimer}
              </p>
            </section>

            <section className="mt-8 border-t border-border pt-8">
              <h2 className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                {locale === "en" ? "FAQ" : "Preguntas frecuentes"}
              </h2>
              <div className="mt-5 space-y-5">
                {faqs.map((faq) => (
                  <article key={faq.question}>
                    <h3 className="text-sm font-semibold text-foreground">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </article>
        </section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
            url: pageUrl,
          }),
        }}
      />
    </>
  )
}
