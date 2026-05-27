import {
  IconBook2,
  IconCalculator,
  IconCheck,
  IconFileText,
  IconInfoCircle,
  IconScale,
} from "@tabler/icons-react"
import { notFound } from "next/navigation"
import { getCountryInfo, isValidCountry } from "@/lib/countries"
import { CountryShell } from "@/components/country-shell"
import { type Locale, isValidLocale } from "@/lib/i18n"
import { getSiteUrl } from "@/lib/site-url"

const SITE_URL = getSiteUrl()

const seoByCountry: Record<
  string,
  {
    primaryKeyword: string
    h1: string
    intro: string
    benefits: string[]
    formulaSummary: string
    docs: { label: string; href: string }[]
    faqs: { question: string; answer: string }[]
  }
> = {
  ni: {
    primaryKeyword: "calculadora de liquidación laboral Nicaragua",
    h1: "Calculadora de liquidación laboral en Nicaragua",
    intro:
      "Calcula una liquidación laboral estimada en Nicaragua con desglose de indemnización, aguinaldo proporcional, vacaciones, INSS e IR cuando aplique. Justo usa reglas determinísticas y muestra las fórmulas para que puedas revisar cada monto antes de generar el PDF.",
    benefits: [
      "indemnización por antigüedad",
      "aguinaldo proporcional",
      "vacaciones pendientes",
      "deducciones de INSS e IR",
    ],
    formulaSummary:
      "El cálculo parte del salario mensual, las fechas de inicio y salida, los días trabajados y las vacaciones pendientes. Cada prestación se calcula por separado y luego se restan las deducciones legales documentadas.",
    docs: [
      { label: "Indemnización", href: "/docs/legal/nicaragua/indemnizacion" },
      { label: "Aguinaldo", href: "/docs/legal/nicaragua/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/nicaragua/vacaciones" },
      { label: "INSS", href: "/docs/legal/nicaragua/inss" },
    ],
    faqs: [
      {
        question: "¿Cómo calcular mi liquidación en Nicaragua?",
        answer:
          "Ingresa salario mensual, fecha de inicio, fecha de salida y vacaciones pendientes. El sistema calcula ingresos, deducciones y total neto con explicación de fórmulas.",
      },
      {
        question: "¿La calculadora reemplaza asesoría legal?",
        answer:
          "No. El resultado es informativo y debe revisarse con asesoría legal o contable en casos disputados, complejos o con pactos especiales.",
      },
    ],
  },
  cr: {
    primaryKeyword: "calculadora de liquidación Costa Rica",
    h1: "Calculadora de liquidación laboral en Costa Rica",
    intro:
      "Calcula una liquidación laboral estimada en Costa Rica con cesantía, preaviso, aguinaldo proporcional, vacaciones y deducciones de CCSS cuando correspondan. La herramienta prioriza transparencia: muestra rubros, fórmulas y referencias para revisar el resultado.",
    benefits: [
      "cesantía",
      "preaviso",
      "aguinaldo proporcional",
      "vacaciones",
      "deducciones CCSS",
    ],
    formulaSummary:
      "La liquidación se estima con salario mensual, tiempo laborado, causa de salida y vacaciones pendientes. El aguinaldo se prorratea sobre salarios del período y la cesantía depende de la antigüedad conforme a las reglas documentadas.",
    docs: [
      { label: "Cesantía", href: "/docs/legal/costarica/indemnizacion" },
      { label: "Aguinaldo", href: "/docs/legal/costarica/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/costarica/vacaciones" },
      { label: "CCSS", href: "/docs/legal/costarica/ccss" },
    ],
    faqs: [
      {
        question: "¿Cómo se calcula el aguinaldo en Costa Rica?",
        answer:
          "De forma general, el aguinaldo equivale a una doceava parte de los salarios devengados en el período correspondiente, proporcional al tiempo laborado.",
      },
      {
        question: "¿Qué datos necesito para calcular cesantía en Costa Rica?",
        answer:
          "Necesitas salario, fecha de inicio, fecha de salida, vacaciones pendientes y el contexto de terminación para estimar los rubros aplicables.",
      },
    ],
  },
  co: {
    primaryKeyword: "calculadora laboral Colombia",
    h1: "Calculadora laboral en Colombia",
    intro:
      "Estima prestaciones laborales en Colombia como cesantías, intereses a las cesantías, prima de servicios, vacaciones y deducciones de EPS y pensión. Justo separa cada rubro para facilitar revisión antes de usar el resultado.",
    benefits: [
      "cesantías",
      "intereses a las cesantías",
      "prima de servicios",
      "vacaciones",
      "EPS y pensión",
    ],
    formulaSummary:
      "El cálculo usa salario, días trabajados y reglas proporcionales por prestación. Las cesantías se calculan sobre el tiempo servido y los intereses se estiman sobre el valor de cesantías.",
    docs: [
      { label: "Cesantías", href: "/docs/legal/colombia/cesantia" },
      { label: "Prima", href: "/docs/legal/colombia/prima-servicios" },
      { label: "Vacaciones", href: "/docs/legal/colombia/vacaciones" },
      { label: "EPS y pensión", href: "/docs/legal/colombia/eps-pension" },
    ],
    faqs: [
      {
        question: "¿La calculadora incluye cesantías e intereses?",
        answer:
          "Sí. El desglose incluye cesantías e intereses cuando el país activo es Colombia, junto con otros rubros soportados.",
      },
      {
        question: "¿Puedo descargar un PDF?",
        answer:
          "Sí. Después de completar el cálculo guiado, Justo permite generar un PDF imprimible con resumen, ingresos, deducciones, firmas y aviso informativo.",
      },
    ],
  },
  pe: {
    primaryKeyword: "calcular liquidación Perú",
    h1: "Calculadora de liquidación laboral en Perú",
    intro:
      "Calcula una estimación de liquidación laboral en Perú con CTS, gratificaciones, vacaciones, indemnización cuando aplique y deducciones de ONP o AFP. El resultado se presenta con fórmulas y totales separados.",
    benefits: [
      "CTS",
      "gratificaciones",
      "vacaciones",
      "indemnización",
      "ONP o AFP",
    ],
    formulaSummary:
      "La liquidación se estima con salario mensual, fechas laborales, tiempo servido y vacaciones pendientes. Cada beneficio se calcula por separado para obtener el total bruto, deducciones y neto.",
    docs: [
      { label: "CTS", href: "/docs/legal/peru/cts" },
      { label: "Gratificaciones", href: "/docs/legal/peru/gratificaciones" },
      { label: "Vacaciones", href: "/docs/legal/peru/vacaciones" },
      { label: "ONP y AFP", href: "/docs/legal/peru/onp-afp" },
    ],
    faqs: [
      {
        question: "¿Qué incluye una liquidación laboral en Perú?",
        answer:
          "Puede incluir CTS, gratificaciones truncas, vacaciones, remuneración pendiente, indemnización si corresponde y deducciones previsionales.",
      },
      {
        question: "¿El cálculo es definitivo?",
        answer:
          "No. Es una estimación informativa basada en las reglas documentadas en el corpus legal del proyecto.",
      },
    ],
  },
  sv: {
    primaryKeyword: "calculadora de liquidación El Salvador",
    h1: "Calculadora de liquidación laboral en El Salvador",
    intro:
      "Calcula una liquidación laboral estimada en El Salvador con desglose de indemnización (cesantía), aguinaldo proporcional, vacaciones, ISSS y AFP. Justo usa reglas determinísticas y muestra las fórmulas para revisar cada monto.",
    benefits: [
      "cesantía (indemnización)",
      "aguinaldo proporcional",
      "vacaciones pendientes",
      "ISSS y AFP",
    ],
    formulaSummary:
      "El cálculo usa salario mensual, fechas de inicio y salida, tiempo laborado y vacaciones pendientes. Cada prestación se calcula según el Código de Trabajo y se restan las deducciones legales.",
    docs: [
      { label: "Indemnización", href: "/docs/legal/elsalvador/indemnizacion" },
      { label: "Aguinaldo", href: "/docs/legal/elsalvador/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/elsalvador/vacaciones" },
      { label: "ISSS y AFP", href: "/docs/legal/elsalvador/deducciones" },
    ],
    faqs: [
      {
        question: "¿Cómo se calcula la cesantía en El Salvador?",
        answer:
          "La cesantía o indemnización depende del tiempo laborado y el tipo de despido. Ingresa salario y fechas para una estimación con desglose.",
      },
      {
        question: "¿La calculadora incluye descuentos de ISSS y AFP?",
        answer:
          "Sí. El cálculo deduce los porcentajes legales de ISSS y AFP aplicables en El Salvador.",
      },
    ],
  },
  gt: {
    primaryKeyword: "calculadora de liquidación Guatemala",
    h1: "Calculadora de liquidación laboral en Guatemala",
    intro:
      "Calcula una liquidación laboral estimada en Guatemala con indemnización, bono 14, aguinaldo, vacaciones y deducciones de IGSS e ISR. Justo separa cada rubro para revisión transparente.",
    benefits: [
      "indemnización",
      "bono 14",
      "aguinaldo",
      "vacaciones",
      "IGSS e ISR",
    ],
    formulaSummary:
      "La liquidación se estima con salario mensual, fechas laborales, días trabajados y vacaciones pendientes. Bono 14 y aguinaldo se prorratean sobre el período conforme al Código de Trabajo.",
    docs: [
      { label: "Indemnización", href: "/docs/legal/guatemala/indemnizacion" },
      { label: "Bono 14", href: "/docs/legal/guatemala/deducciones" },
      { label: "Aguinaldo", href: "/docs/legal/guatemala/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/guatemala/vacaciones" },
    ],
    faqs: [
      {
        question: "¿Cómo se calcula el bono 14 en Guatemala?",
        answer:
          "El bono 14 equivale a un salario mensual prorrateado según los meses trabajados en el período. La calculadora lo estima automáticamente.",
      },
      {
        question: "¿Qué datos necesito para mi liquidación en Guatemala?",
        answer:
          "Necesitas salario mensual, fecha de inicio, fecha de salida y vacaciones pendientes para obtener el desglose completo.",
      },
    ],
  },
  hn: {
    primaryKeyword: "calculadora de liquidación Honduras",
    h1: "Calculadora de liquidación laboral en Honduras",
    intro:
      "Calcula una liquidación laboral estimada en Honduras con auxilio de cesantía, decimotercer mes, vacaciones y deducciones de IHSS y RAP. Justo muestra cada rubro con su fórmula.",
    benefits: [
      "auxilio de cesantía",
      "decimotercer mes",
      "vacaciones",
      "IHSS y RAP",
    ],
    formulaSummary:
      "El cálculo usa salario mensual, fechas laborales, tiempo de servicio y vacaciones pendientes. El auxilio de cesantía se calcula por años trabajados y el decimotercer mes se prorratea.",
    docs: [
      { label: "Cesantía", href: "/docs/legal/honduras/indemnizacion" },
      { label: "Aguinaldo", href: "/docs/legal/honduras/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/honduras/vacaciones" },
      { label: "IHSS", href: "/docs/legal/honduras/ihss" },
    ],
    faqs: [
      {
        question: "¿Cómo funciona el auxilio de cesantía en Honduras?",
        answer:
          "El auxilio de cesantía equivale a un salario por cada año trabajado, proporcional por fracciones. La calculadora lo estima según el Código de Trabajo.",
      },
      {
        question: "¿La calculadora descuenta IHSS y RAP?",
        answer:
          "Sí. Las deducciones legales de IHSS y RAP se aplican automáticamente según los porcentajes documentados.",
      },
    ],
  },
  pa: {
    primaryKeyword: "calculadora de liquidación Panamá",
    h1: "Calculadora de liquidación laboral en Panamá",
    intro:
      "Calcula una liquidación laboral estimada en Panamá con prima de antigüedad, decimotercer mes, vacaciones y deducciones de CSS. Justo presenta cada partida con su fórmula y referencias.",
    benefits: [
      "prima de antigüedad",
      "decimotercer mes",
      "vacaciones",
      "CSS",
    ],
    formulaSummary:
      "La liquidación se estima con salario mensual, fechas de inicio y salida, tiempo servido y vacaciones pendientes. La prima de antigüedad se calcula según los años laborados.",
    docs: [
      { label: "Indemnización", href: "/docs/legal/panama/indemnizacion" },
      { label: "Aguinaldo", href: "/docs/legal/panama/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/panama/vacaciones" },
      { label: "CSS", href: "/docs/legal/panama/css" },
    ],
    faqs: [
      {
        question: "¿Cómo se calcula la prima de antigüedad en Panamá?",
        answer:
          "La prima de antigüedad equivale a una semana de salario por cada año trabajado, hasta un máximo legal. La calculadora la estima automáticamente.",
      },
      {
        question: "¿Qué es la CSS y cómo afecta mi liquidación?",
        answer:
          "La CSS (Caja de Seguro Social) descuenta un porcentaje legal sobre el salario. La calculadora lo incluye en las deducciones.",
      },
    ],
  },
  mx: {
    primaryKeyword: "calculadora de liquidación México",
    h1: "Calculadora de liquidación laboral en México",
    intro:
      "Calcula una liquidación laboral estimada en México con indemnización constitucional, aguinaldo, vacaciones, prima de antigüedad y descuentos de IMSS, INFONAVIT y SAR según la LFT.",
    benefits: [
      "indemnización constitucional",
      "aguinaldo proporcional",
      "vacaciones y prima vacacional",
      "prima de antigüedad",
      "IMSS, INFONAVIT y SAR",
    ],
    formulaSummary:
      "El cálculo parte del salario mensual, la fecha de inicio y salida, los días trabajados y las vacaciones pendientes. La indemnización se calcula según la LFT y se restan las deducciones documentadas.",
    docs: [
      { label: "Indemnización", href: "/docs/legal/mexico/indemnizacion" },
      { label: "Aguinaldo", href: "/docs/legal/mexico/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/mexico/vacaciones" },
      { label: "IMSS", href: "/docs/legal/mexico/imss" },
    ],
    faqs: [
      {
        question: "¿Cómo calcular mi liquidación en México según la LFT?",
        answer:
          "Ingresa salario mensual, fecha de inicio, fecha de salida y vacaciones pendientes. La calculadora estima ingresos, deducciones y total neto conforme a la Ley Federal del Trabajo.",
      },
      {
        question: "¿La calculadora incluye descuentos de INFONAVIT y SAR?",
        answer:
          "Sí. Las deducciones legales de IMSS, INFONAVIT y SAR se aplican según los porcentajes documentados en el corpus legal.",
      },
    ],
  },
  ar: {
    primaryKeyword: "calculadora de liquidación Argentina",
    h1: "Calculadora de liquidación laboral en Argentina",
    intro:
      "Calcula una liquidación laboral estimada en Argentina con indemnización por antigüedad, preaviso, SAC (aguinaldo), vacaciones y deducciones de jubilación, PAMI y obra social según la LCT.",
    benefits: [
      "indemnización por antigüedad",
      "preaviso",
      "SAC (aguinaldo)",
      "vacaciones proporcionales",
      "jubilación, PAMI y obra social",
    ],
    formulaSummary:
      "La liquidación se estima con salario mensual, fechas laborales, antigüedad y vacaciones pendientes. La indemnización se calcula según la Ley de Contrato de Trabajo y se restan las deducciones legales.",
    docs: [
      { label: "Indemnización", href: "/docs/legal/argentina/indemnizacion" },
      { label: "Preaviso", href: "/docs/legal/argentina/preaviso" },
      { label: "SAC (Aguinaldo)", href: "/docs/legal/argentina/sac-aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/argentina/vacaciones" },
      { label: "Deducciones", href: "/docs/legal/argentina/deducciones" },
    ],
    faqs: [
      {
        question: "¿Cómo se calcula la indemnización por antigüedad en Argentina?",
        answer:
          "La indemnización equivale a un salario por cada año trabajado o fracción mayor a tres meses, según el artículo 245 de la LCT.",
      },
      {
        question: "¿La calculadora descuenta jubilación, PAMI y obra social?",
        answer:
          "Sí. Las deducciones legales sobre el salario se aplican automáticamente según los porcentajes documentados.",
      },
    ],
  },
  cl: {
    primaryKeyword: "calculadora de liquidación Chile",
    h1: "Calculadora de liquidación laboral en Chile",
    intro:
      "Calcula una liquidación laboral estimada en Chile con indemnización por años de servicio, aviso sustitutivo, vacaciones y descuentos de AFP, salud y AFC según el Código del Trabajo.",
    benefits: [
      "indemnización por años de servicio",
      "aviso sustitutivo",
      "vacaciones",
      "AFP, salud y AFC",
    ],
    formulaSummary:
      "El cálculo usa salario mensual, fechas laborales, años de servicio y vacaciones pendientes. La indemnización se calcula según el Código del Trabajo y se restan las cotizaciones legales.",
    docs: [
      { label: "Indemnización", href: "/docs/legal/chile/indemnizacion" },
      { label: "Vacaciones", href: "/docs/legal/chile/vacaciones" },
      { label: "AFP", href: "/docs/legal/chile/afp" },
      { label: "Salud", href: "/docs/legal/chile/salud" },
    ],
    faqs: [
      {
        question: "¿Cómo se calcula la indemnización por años de servicio en Chile?",
        answer:
          "Corresponde a un salario por cada año trabajado con tope de 330 UF, más un recargo del 20% si el empleador no tenía seguro de cesantía.",
      },
      {
        question: "¿Qué cotizaciones descuenta la calculadora?",
        answer:
          "La calculadora aplica los descuentos de AFP (10% más comisión), salud (7% Fonasa o Isapre) y AFC (seguro de cesantía).",
      },
    ],
  },
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>
}) {
  const { locale, country } = await params

  if (!isValidLocale(locale) || !isValidCountry(country)) {
    notFound()
  }

  const info = getCountryInfo(country)!
  const seo =
    locale === "en"
      ? buildDefaultSeoEn(info)
      : (seoByCountry[country] ?? buildDefaultSeo(info))
  const pageUrl = `${SITE_URL}/${locale}/${country}`
  const jsonLd = buildJsonLd({
    locale,
    country,
    countryName: info.name,
    pageUrl,
    seo,
  })

  return (
    <>
      <div className="fixed inset-0 overflow-y-auto">
        <CountryShell countryCode={country} locale={locale} />
        <CountrySeoContent countryName={info.name} seo={seo} locale={locale} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}

function buildDefaultSeo(info: { name: string }) {
  return {
    primaryKeyword: `calculadora laboral ${info.name}`,
    h1: `Calculadora laboral en ${info.name}`,
    intro: `Consulta derechos laborales y calcula una liquidación estimada para ${info.name}. Justo muestra rubros, fórmulas y referencias legales para revisar el resultado de forma transparente.`,
    benefits: [
      "indemnización",
      "aguinaldo o prestación equivalente",
      "vacaciones",
      "deducciones",
    ],
    formulaSummary:
      "El cálculo usa salario mensual, fechas laborales, vacaciones pendientes y reglas documentadas por país para estimar ingresos, deducciones y total neto.",
    docs: [{ label: `Marco legal de ${info.name}`, href: "/docs/legal" }],
    faqs: [
      {
        question: `¿Cómo usar la calculadora laboral de ${info.name}?`,
        answer:
          "Inicia el cálculo guiado, completa salario, fechas y vacaciones pendientes, confirma los datos y revisa el desglose final.",
      },
      {
        question: "¿El resultado es asesoría legal?",
        answer:
          "No. Es información general y debe validarse profesionalmente en casos complejos o disputados.",
      },
    ],
  }
}

function buildDefaultSeoEn(info: { name: string }) {
  return {
    primaryKeyword: `${info.name} labor settlement calculator`,
    h1: `${info.name} labor settlement calculator`,
    intro: `Ask labor questions and estimate a settlement for ${info.name}. Justo shows line items, formulas and legal references so you can review the result transparently.`,
    benefits: [
      "severance or equivalent benefits",
      "proportional bonuses",
      "pending vacation days",
      "legal deductions",
    ],
    formulaSummary:
      "The calculation uses monthly salary, employment dates, pending vacation days and country-specific documented rules to estimate income, deductions and net total.",
    docs: [{ label: `${info.name} legal framework`, href: "/docs/legal" }],
    faqs: [
      {
        question: `How do I use the ${info.name} labor calculator?`,
        answer:
          "Start the guided calculation, enter salary, dates and pending vacation days, confirm the information and review the final breakdown.",
      },
      {
        question: "Is the result legal advice?",
        answer:
          "No. It is general information and should be professionally reviewed for complex or disputed cases.",
      },
    ],
  }
}

function CountrySeoContent({
  countryName,
  seo,
  locale,
}: {
  countryName: string
  seo: ReturnType<typeof buildDefaultSeo>
  locale: Locale
}) {
  const steps =
    locale === "en"
      ? [
          "Enter salary, dates and pending vacation days.",
          "Confirm the information before calculating.",
          "Review income, deductions, net total and legal corpus.",
        ]
      : [
          "Completa salario, fechas y vacaciones pendientes.",
          "Confirma los datos antes de calcular.",
          "Revisa ingresos, deducciones, total neto y corpus legal.",
        ]
  const revealDelay = (index: number) => ({
    animationDelay: `${index * 80}ms`,
  })

  return (
    <section className="relative z-10 border-t border-border bg-background px-4 py-14 md:px-8 lg:flex lg:h-svh lg:min-h-svh lg:items-center lg:overflow-hidden lg:py-0">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-14">
        <div className="space-y-6 lg:col-span-5 xl:space-y-7">
          <div
            className="justo-reveal inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[0.7rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase"
            style={revealDelay(0)}
          >
            <IconScale className="size-4 text-foreground" />
            {seo.primaryKeyword}
          </div>

          <div className="space-y-5">
            <h1
              className="justo-reveal max-w-2xl text-4xl leading-none font-semibold tracking-[-0.045em] text-foreground md:text-5xl lg:text-6xl"
              style={revealDelay(1)}
            >
              {seo.h1}
            </h1>
            <p
              className="justo-reveal max-w-[62ch] text-base leading-7 text-muted-foreground md:text-lg md:leading-8 lg:text-[1.0625rem]"
              style={revealDelay(2)}
            >
              {seo.intro}
            </p>
          </div>

          <div
            className="justo-reveal border-y border-border py-5"
            style={revealDelay(3)}
          >
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <IconCalculator className="size-5" />
              {locale === "en" ? "What it calculates" : "Qué calcula"}
            </div>
            <ul className="grid gap-2.5 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {seo.benefits.map((benefit, index) => (
                <li
                  key={benefit}
                  className="justo-reveal flex items-start gap-3"
                  style={revealDelay(4 + index)}
                >
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-foreground">
                    <IconCheck className="size-3.5" />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-7">
          <article
            className="justo-reveal rounded-[2rem] border border-border bg-card p-5 shadow-sm md:p-6 lg:p-7 xl:p-8"
            style={revealDelay(6)}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-border bg-background text-foreground">
                <IconFileText className="size-5" />
              </span>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground lg:text-2xl">
                {locale === "en" ? "How it works" : "Cómo funciona"}
              </h2>
            </div>

            <p
              className="justo-reveal max-w-[72ch] text-sm leading-6 text-muted-foreground md:text-base md:leading-7"
              style={revealDelay(7)}
            >
              {seo.formulaSummary}
            </p>

            <ol className="mt-5 grid gap-3 border-y border-border py-4 md:grid-cols-3 lg:mt-6 lg:gap-4">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="justo-reveal grid gap-2"
                  style={revealDelay(8 + index)}
                >
                  <span className="font-mono text-sm text-muted-foreground tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-6 text-foreground">
                    {step}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-5 grid gap-5 md:grid-cols-[1.05fr_0.95fr] lg:mt-6">
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-background">
                    <IconBook2 className="size-5 text-foreground" />
                  </span>
                  <h2 className="text-base font-semibold tracking-tight text-foreground">
                    {locale === "en" ? "Legal sources" : "Fuentes legales"}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {seo.docs.map((doc, index) => (
                    <a
                      key={doc.href}
                      href={doc.href}
                      className="justo-reveal inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      style={revealDelay(11 + index)}
                    >
                      {doc.label}
                    </a>
                  ))}
                </div>
              </section>

              <aside className="justo-reveal" style={revealDelay(13)}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-background">
                    <IconInfoCircle className="size-5 text-foreground" />
                  </span>
                  <h2 className="text-base font-semibold tracking-tight text-foreground">
                    {locale === "en" ? "Notice" : "Aviso"}
                  </h2>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {locale === "en"
                    ? `The calculation for ${countryName} is informational. For disputed cases or special agreements, validate the result with professional legal or accounting advice.`
                    : `El cálculo para ${countryName} es informativo. Para casos disputados o con acuerdos especiales, valida el resultado con asesoría legal o contable profesional.`}
                </p>
              </aside>
            </div>

            <section className="mt-5 border-t border-border pt-5 lg:mt-6 lg:pt-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-background">
                  <IconInfoCircle className="size-5 text-foreground" />
                </span>
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  {locale === "en"
                    ? "Frequently asked questions"
                    : "Preguntas frecuentes"}
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {seo.faqs.map((faq, index) => (
                  <article
                    key={faq.question}
                    className="justo-reveal"
                    style={revealDelay(14 + index)}
                  >
                    <h3 className="text-base leading-6 font-semibold text-foreground">
                      {faq.question}
                    </h3>
                    <p className="mt-2 max-w-[64ch] text-sm leading-6 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </article>
        </div>
      </div>
    </section>
  )
}

function buildJsonLd({
  locale,
  country,
  countryName,
  pageUrl,
  seo,
}: {
  locale: Locale
  country: string
  countryName: string
  pageUrl: string
  seo: ReturnType<typeof buildDefaultSeo>
}) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: seo.h1,
      url: pageUrl,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: locale === "en" ? "en" : `es-${country.toUpperCase()}`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: seo.intro,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seo.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Justo", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: countryName, item: pageUrl },
      ],
    },
  ]
}
