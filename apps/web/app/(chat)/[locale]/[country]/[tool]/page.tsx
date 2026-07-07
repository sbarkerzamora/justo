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
  SEO_YEAR,
} from "@/lib/tool-seo"
import { getLegalDocsLink } from "@/lib/legal-docs-link"
import type { AppMode } from "@/components/chat/types"

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

const englishToolIntro: Record<string, string> = {
  "liquidacion-laboral":
    "Estimate labor settlement amounts with an informational calculation that separates income, deductions and net total.",
  vacaciones:
    "Estimate accrued, used and pending vacation days from salary, dates and days already taken.",
  "salario-neto":
    "Estimate net salary from gross pay and documented labor deductions for the selected country.",
  "aguinaldo-decimo-bono":
    "Estimate proportional bonus, 13th salary, service premium, SAC or gratification payments where the corpus supports them.",
  preaviso:
    "Estimate notice period days and substitute payment when applicable under the selected country's rules.",
  "simulador-terminacion":
    "Compare basic employment termination scenarios with informational amounts and legal references.",
  "generador-contratos":
    "Generate an informational employment contract draft with the data, clauses and signatures required by the selected country.",
}

const englishOutputItems: Record<string, string[]> = {
  "liquidacion-laboral": [
    "Income breakdown",
    "Deductions",
    "Gross total",
    "Net total",
    "Formulas and legal references",
  ],
  vacaciones: [
    "Accrued vacation days",
    "Used vacation days",
    "Pending days",
    "Estimated amount",
    "Formula and legal reference",
  ],
  "salario-neto": [
    "Gross salary",
    "Deductions",
    "Monthly net salary",
    "Payment frequency estimates",
    "Legal references",
  ],
  "aguinaldo-decimo-bono": [
    "Proportional amount",
    "Applicable lines",
    "Formula",
    "Legal references",
  ],
  preaviso: ["Notice days", "Notice amount", "Legal reference"],
  "simulador-terminacion": [
    "Scenario comparison",
    "Estimated severance",
    "Notice period",
    "Legal references",
  ],
  "generador-contratos": ["PDF contract", "Legal clauses", "Signature lines"],
}

const englishInputItems: Record<string, string[]> = {
  "liquidacion-laboral": [
    "Country",
    "Monthly salary",
    "Start date",
    "End date",
    "Pending vacation days",
    "Termination reason",
  ],
  vacaciones: [
    "Country",
    "Monthly salary",
    "Start date",
    "Cutoff date",
    "Vacation days already taken",
  ],
  "salario-neto": ["Country", "Gross salary", "Payment frequency"],
  "aguinaldo-decimo-bono": [
    "Country",
    "Monthly salary",
    "Start date",
    "Cutoff date",
  ],
  preaviso: [
    "Country",
    "Monthly salary",
    "Seniority",
    "Termination reason",
    "Contract type",
  ],
  "simulador-terminacion": [
    "Country",
    "Monthly salary",
    "Start date",
    "End date",
    "Termination reason",
  ],
  "generador-contratos": [
    "Country",
    "Worker details",
    "Employer details",
    "Position and duties",
    "Schedule",
    "Salary",
  ],
}

type LandingPageData = {
  locale: Locale
  country: CountryCode
  slug: string
  appMode: Exclude<AppMode, "chat">
  tool: JustoTool
  countryInfo: NonNullable<ReturnType<typeof getCountryInfo>>
  title: string
}

function getLandingTitle(slug: string, locale: Locale, countryName: string) {
  const label = toolTitles[slug]?.[locale] ?? slug
  return locale === "en" ? `${label} in ${countryName}` : `${label} en ${countryName}`
}

function getLandingIntro(
  tool: JustoTool,
  country: CountryCode,
  slug: string,
  locale: Locale,
  countryName: string
) {
  if (locale === "en") {
    const base = englishToolIntro[slug] ?? "Use this informational labor tool."
    return `${base} It uses the legal corpus for ${countryName} and shows formulas, references and corpus version.`
  }

  return countryIntentCopy[country]?.[slug] ?? tool.longDescription
}

function getOutputItems(tool: JustoTool, slug: string, locale: Locale) {
  return locale === "en"
    ? (englishOutputItems[slug] ?? ["Informational result", "Legal references"])
    : tool.outputSummary.slice(0, 5)
}

function getInputItems(tool: JustoTool, slug: string, locale: Locale) {
  return locale === "en"
    ? (englishInputItems[slug] ?? ["Country", "Case data"])
    : tool.inputRequirements.slice(0, 8)
}

function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/<\//g, "<\\/")
}

function resolveLandingPageData({
  locale,
  country,
  tool: slug,
}: {
  locale: string
  country: string
  tool: string
}): LandingPageData | null {
  if (!isValidLocale(locale) || !isValidCountry(country)) return null

  const appMode = getToolAppMode(slug)
  if (!appMode || appMode === "chat") return null

  const tool = getToolForCountry(slug, country)
  if (!tool || !tool.countrySupport.includes(country)) return null

  const countryInfo = getCountryInfo(country)
  if (!countryInfo) return null

  return {
    locale,
    country,
    slug,
    appMode,
    tool,
    countryInfo,
    title: getLandingTitle(slug, locale, countryInfo.name),
  }
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
  const data = resolveLandingPageData(await params)
  if (!data) return {}

  return getToolPageMetadata({
    slug: data.slug,
    tool: data.tool,
    country: data.country,
    title: data.title,
    pageLocale: data.locale,
  })
}

export default async function CountryToolLandingPage({
  params,
}: {
  params: Promise<{ locale: string; country: string; tool: string }>
}) {
  const data = resolveLandingPageData(await params)
  if (!data) notFound()

  const { locale, country, slug, appMode, tool, countryInfo, title } = data
  const intro = getLandingIntro(tool, country, slug, locale, countryInfo.name)
  const legalHub = getLegalDocsLink(country)
  const appUrl = `/${locale}/${country}?tool=${appMode}`
  const toolsUrl = locale === "en" ? "/en/tools" : "/tools"
  const pageUrl = `${SITE_URL}/${locale}/${country}/${slug}`
  const outputItems = getOutputItems(tool, slug, locale)
  const inputItems = getInputItems(tool, slug, locale)
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
      answer: inputItems.slice(0, 5).join(", "),
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
              {countryInfo.name} ·{" "}
              {tool.availability === "available"
                ? locale === "en"
                  ? "Available"
                  : "Disponible"
                : locale === "en"
                  ? "Informational"
                  : "Informativo"}
            </p>
            <h1 className="max-w-3xl text-4xl leading-none font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">
              {title} {SEO_YEAR}
            </h1>
            <p className="mt-5 max-w-[62ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {intro}{" "}
              {locale === "en"
                ? "The result is informational, free and shows formulas, legal references and the corpus version used."
                : "El resultado es informativo, gratuito y muestra fórmulas, referencias legales y versión del corpus usado."}
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
                {outputItems.map((item) => (
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
                {inputItems.map((item) => (
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
                {locale === "en"
                  ? "Informational result generated from deterministic rules and Justo's versioned legal corpus. It does not replace professional legal or accounting advice."
                  : tool.disclaimer}
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
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
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
