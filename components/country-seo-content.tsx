import {
  IconBook2,
  IconCalculator,
  IconCheck,
  IconFileText,
  IconInfoCircle,
  IconScale,
} from "@tabler/icons-react"
import type { Locale } from "@/lib/i18n"

export type SeoData = {
  primaryKeyword: string
  h1: string
  intro: string
  benefits: string[]
  formulaSummary: string
  docs: { label: string; href: string }[]
  faqs: { question: string; answer: string }[]
}

export function CountrySeoContent({
  countryName,
  seo,
  locale,
}: {
  countryName: string
  seo: SeoData
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
