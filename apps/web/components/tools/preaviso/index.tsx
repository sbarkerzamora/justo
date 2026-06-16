"use client"

import { useState, useCallback } from "react"
import {
  IconArrowLeft,
  IconArrowRight,
  IconBell,
  IconFileDescription,
  IconRefresh,
  IconMessageCircle,
} from "@tabler/icons-react"
import { calculatePreaviso } from "@justo/tools"
import type { CountryCode } from "@justo/core"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"

export function PreavisoTool({
  countryCode,
  countryName,
  locale,
  currencyLabel,
  fmt,
  onComplete,
  onCancel,
}: {
  countryCode: string
  countryName: string
  locale: Locale
  currencyLabel: string
  fmt: (v: number) => string
  onComplete: (messages: { role: "user" | "assistant"; text: string }[]) => void
  onCancel: () => void
}) {
  const copy = homeCopy[locale]
  const [salary, setSalary] = useState("")
  const [tenure, setTenure] = useState("")
  const [result, setResult] = useState<ReturnType<typeof calculatePreaviso> | null>(null)
  const [started, setStarted] = useState(false)

  const handleCalculate = useCallback(() => {
    const s = Number.parseFloat(salary)
    const t = Number.parseFloat(tenure)
    if (!s || !t || s <= 0 || t <= 0) return

    const r = calculatePreaviso({
      countryCode: countryCode as CountryCode,
      monthlySalary: s,
      startDate: "",
      endDate: "",
      tenureYears: t,
    })
    setResult(r)
  }, [salary, tenure, countryCode])

  if (!started) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 px-2">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <IconBell className="size-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {locale === "en" ? "Notice Period Calculator" : "Calculadora de Preaviso"}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {locale === "en"
              ? "Calculate the notice period and substitute payment based on the worker's tenure and applicable legislation."
              : "Calculá los días de preaviso y la indemnización sustitutiva según la antigüedad del trabajador y la legislación aplicable."}
          </p>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            {locale === "en" ? "Start calculation" : "Comenzar cálculo"}
            <IconArrowRight className="size-4" />
          </button>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 px-2">
          <div className="w-full max-w-xl mx-auto rounded-2xl border border-border bg-card p-6 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <IconFileDescription className="size-3" />
              {copy.legalVersion}: {result.legalCorpusVersion}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-foreground">
              {locale === "en" ? "Notice Period Result" : "Resultado de Preaviso"}
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-primary/10 p-4 text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {locale === "en" ? "Notice Days" : "Días de preaviso"}
                </p>
                <p className="mt-1 text-3xl font-bold text-primary">{result.noticeDays}</p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-4 text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {locale === "en" ? "Amount" : "Monto"}
                </p>
                <p className="mt-1 text-3xl font-bold text-emerald-600">
                  {fmt(result.noticeAmount)}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">{locale === "en" ? "Substitute payment" : "Pago sustitutivo"}</span>
                <span className="font-medium">{result.hasSubstitutePayment ? (locale === "en" ? "Yes" : "Sí") : (locale === "en" ? "No" : "No")}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">{locale === "en" ? "Legal reference" : "Referencia legal"}</span>
                <span className="font-medium text-xs text-right">{result.legalReference}</span>
              </div>
            </div>

            {result.calculationNote && (
              <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                {result.calculationNote}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 z-10 border-t border-border bg-background px-4 py-3">
          <div className="mx-auto flex w-full max-w-xl items-center gap-3">
            <button
              type="button"
              onClick={() => setResult(null)}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <IconRefresh className="size-4" /> {locale === "en" ? "Recalculate" : "Recalcular"}
            </button>
            <button
              type="button"
              onClick={() => onComplete([])}
              className="flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              <IconMessageCircle className="size-4" /> {locale === "en" ? "Ask a question" : "Hacer una pregunta"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex w-full items-center justify-between px-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
          <IconBell className="size-3.5 text-primary" />
          {locale === "en" ? "Notice Period" : "Preaviso"}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          {locale === "en" ? "Back" : "Volver"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="mx-auto max-w-xl space-y-4">
          <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
            <p className="text-base font-medium text-foreground">
              {locale === "en" ? "Enter the monthly salary" : "Ingresá el salario mensual"}
            </p>
            <input
              type="text"
              inputMode="decimal"
              value={salary}
              onChange={(e) => setSalary(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder={locale === "en" ? "E.g. 1500" : "Ej. 1500"}
              className="mt-3 h-12 w-full rounded-2xl border border-border bg-card pl-4 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground/30"
            />
          </div>
          <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-base font-medium text-foreground">
              {locale === "en" ? "Years of seniority" : "Años de antigüedad"}
            </p>
            <input
              type="text"
              inputMode="decimal"
              value={tenure}
              onChange={(e) => setTenure(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder={locale === "en" ? "E.g. 5" : "Ej. 5"}
              className="mt-3 h-12 w-full rounded-2xl border border-border bg-card pl-4 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground/30"
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 border-t border-border bg-background px-4 py-3">
        <div className="mx-auto flex w-full max-w-xl">
          <button
            type="button"
            onClick={handleCalculate}
            disabled={!salary || !tenure}
            className="flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity disabled:opacity-40 hover:opacity-90"
          >
            {locale === "en" ? "Calculate" : "Calcular"}
            <IconArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
