"use client"

import { useReducer, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  IconArrowLeft,
  IconArrowRight,
  IconBell,
  IconFileDescription,
  IconRefresh,
  IconMessageCircle,
  IconCheck,
  IconAlertCircle,
  IconDownload,
  IconReceipt,
} from "@tabler/icons-react"
import { calculatePreaviso } from "@justo/tools"
import type { CountryCode } from "@justo/core"
import type { PreavisoFormData } from "@/components/tools/tool-types"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"
import { StepNavigation } from "@/components/tools/step-navigation"

export type PreavisoStep = "welcome" | "salary" | "tenure" | "confirm" | "done"

interface PreavisoToolState {
  step: PreavisoStep
  form: PreavisoFormData
  result: ReturnType<typeof calculatePreaviso> | null
  error: string | null
}

type Action =
  | { type: "setStep"; step: PreavisoStep }
  | { type: "patchForm"; patch: Partial<PreavisoFormData> }
  | { type: "setResult"; result: ReturnType<typeof calculatePreaviso> | null }
  | { type: "setError"; error: string | null }

const initialState = (cc: string): PreavisoToolState => ({
  step: "welcome",
  form: { countryCode: cc, monthlySalary: 0, tenureYears: 0 },
  result: null,
  error: null,
})

function reducer(state: PreavisoToolState, action: Action): PreavisoToolState {
  switch (action.type) {
    case "setStep":
      return { ...state, step: action.step, error: null }
    case "patchForm":
      return { ...state, form: { ...state.form, ...action.patch } }
    case "setResult":
      return { ...state, result: action.result }
    case "setError":
      return { ...state, error: action.error }
  }
}

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
  const [state, dispatch] = useReducer(reducer, countryCode, initialState)
  const { step, form, result, error } = state
  const [salaryDisplay, setSalaryDisplay] = useState("")
  const [tenureDisplay, setTenureDisplay] = useState("")

  const preavisoSteps: PreavisoStep[] = ["welcome", "salary", "tenure", "confirm", "done"]
  const stepIndex = preavisoSteps.indexOf(step)
  const totalSteps = preavisoSteps.length

  const nextStep = (s: PreavisoStep): PreavisoStep => {
    const idx = preavisoSteps.indexOf(s)
    return idx < totalSteps - 1 ? preavisoSteps[idx + 1] : s
  }

  const prevStep = (s: PreavisoStep): PreavisoStep | null => {
    const idx = preavisoSteps.indexOf(s)
    return idx > 0 ? preavisoSteps[idx - 1] : null
  }

  const advance = useCallback(() => {
    const next = nextStep(step)
    dispatch({ type: "setStep", step: next })
  }, [step])

  const goBack = useCallback(() => {
    const prev = prevStep(step)
    if (prev) dispatch({ type: "setStep", step: prev })
  }, [step])

  const handleConfirm = useCallback(() => {
    const r = calculatePreaviso({
      countryCode: countryCode as CountryCode,
      monthlySalary: form.monthlySalary,
      startDate: "",
      endDate: "",
      tenureYears: form.tenureYears,
    })
    dispatch({ type: "setResult", result: r })
    dispatch({ type: "setStep", step: "done" })
  }, [form, countryCode])

  const handleComplete = useCallback(() => {
    onComplete([
      { role: "assistant", text: copy.guidedIntro },
      { role: "user", text: `${copy.send} preaviso` },
      {
        role: "assistant",
        text: `${locale === "en" ? "Notice period result" : "Resultado de preaviso"}: ${result!.noticeDays} ${locale === "en" ? "days" : "días"}, ${fmt(result!.noticeAmount)}. ${result!.legalReference}.`,
      },
    ])
  }, [onComplete, copy, result, fmt, locale])

  const isDataEntry = step === "salary" || step === "tenure"

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex w-full items-center justify-between">
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

      {step !== "welcome" && step !== "done" && (
        <div className="mb-3 w-full space-y-2 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-top-1 max-sm:mb-2">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>{copy.progressStep(stepIndex)}</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(stepIndex / (totalSteps - 1)) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Image
              src={`https://flagcdn.com/w40/${countryCode}.png`}
              alt={countryName}
              width={14}
              height={10}
              className="h-2.5 w-3.5 rounded-[1px] border border-border object-cover"
            />
            <span>{copy.calculatingUnder(countryName)}</span>
            <Link
              href="/docs"
              className="ml-auto underline underline-offset-2 hover:text-foreground"
            >
              {copy.legalDocs}
            </Link>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {step === "welcome" ? (
          <div className="flex h-full flex-col items-center justify-center gap-8 px-2">
            <div className="flex max-w-md flex-col items-center gap-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <IconBell className="size-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {copy.preavisoWelcomeTitle}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {copy.preavisoWelcomeDescription}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  locale === "en" ? "Salary" : "Salario mensual",
                  locale === "en" ? "Seniority" : "Antigüedad",
                  locale === "en" ? "Review" : "Revisar",
                  locale === "en" ? "Result" : "Resultado",
                ].map((label, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-medium text-primary">
                      {i + 1}
                    </span>
                    {label}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: "setStep", step: "salary" })}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                {copy.startButton}
                <IconArrowRight className="size-4" />
              </button>
            </div>
          </div>
        ) : step === "confirm" ? (
          <div className="mx-auto max-w-xl space-y-6 px-2">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <IconAlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}
            <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                <IconReceipt className="size-4 text-primary" />
                {copy.summaryTitle}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">
                    {locale === "en" ? "Monthly salary" : "Salario mensual"}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {fmt(form.monthlySalary)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">
                    {locale === "en" ? "Years of seniority" : "Años de antigüedad"}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {form.tenureYears} {locale === "en" ? "years" : "años"}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              <IconCheck className="size-4" />
              {locale === "en" ? "Calculate notice period" : "Calcular preaviso"}
            </button>
          </div>
        ) : step === "done" && result ? (
          <div className="mx-auto max-w-xl space-y-6 px-2">
            <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <IconFileDescription className="size-3" />
                    {copy.legalVersion}: {result.legalCorpusVersion}
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-foreground">
                    {locale === "en" ? "Notice Period Result" : "Resultado de Preaviso"}
                  </h3>
                </div>
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <IconBell className="size-5 text-primary" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <IconBell className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {locale === "en" ? "Notice days" : "Días de preaviso"}
                    </p>
                    <p className="text-sm font-semibold text-foreground">{result.noticeDays}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                    <IconDownload className="size-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {locale === "en" ? "Amount" : "Monto"}
                    </p>
                    <p className="text-sm font-semibold text-foreground">{fmt(result.noticeAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {locale === "en" ? "Substitute payment" : "Pago sustitutivo"}
                  </span>
                  <span className="font-medium text-foreground">
                    {result.hasSubstitutePayment
                      ? locale === "en" ? "Yes" : "Sí"
                      : locale === "en" ? "No" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {locale === "en" ? "Legal reference" : "Referencia legal"}
                  </span>
                  <span className="max-w-[50%] text-right font-medium text-foreground">
                    {result.legalReference}
                  </span>
                </div>
              </div>

              {result.calculationNote && (
                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                  {result.calculationNote}
                </div>
              )}
            </div>
          </div>
        ) : isDataEntry ? (
          <div className="flex h-full flex-col items-center justify-center gap-8 px-2">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
              <p className="text-base font-medium text-foreground">
                {step === "salary"
                  ? (locale === "en" ? "Enter the monthly salary" : "Ingresá el salario mensual")
                  : (locale === "en" ? "Years of seniority" : "Años de antigüedad")}
              </p>
              <input
                type="text"
                inputMode="decimal"
                value={step === "salary" ? salaryDisplay : tenureDisplay}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, "")
                  if (step === "salary") setSalaryDisplay(v)
                  else setTenureDisplay(v)
                }}
                placeholder={step === "salary"
                  ? copy.askPlaceholder
                  : (locale === "en" ? "E.g. 5" : "Ej. 5")
                }
                className="mt-3 h-12 w-full rounded-2xl border border-border bg-card pl-4 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground/30"
              />
              {step === "tenure" && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {locale === "en"
                    ? "Years of continuous service with the employer."
                    : "Años de servicio continuo con el empleador."}
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {step === "done" && result ? (
        <div className="flex flex-wrap gap-2 px-2 pb-4">
          <button
            type="button"
            onClick={() => dispatch({ type: "setStep", step: "welcome" })}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <IconRefresh className="size-4" /> {copy.calculateAgain}
          </button>
          <button
            type="button"
            onClick={handleComplete}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <IconMessageCircle className="size-4" /> {copy.backToChat}
          </button>
        </div>
      ) : isDataEntry ? (
        <div className="px-2 pb-4">
          <StepNavigation
            onBack={goBack}
            onContinue={() => {
              if (step === "salary") {
                const s = Number.parseFloat(salaryDisplay)
                if (!s || s <= 0) return
                dispatch({ type: "patchForm", patch: { monthlySalary: s } })
                advance()
              } else {
                const t = Number.parseFloat(tenureDisplay)
                if (!t || t <= 0) return
                dispatch({ type: "patchForm", patch: { tenureYears: t } })
                dispatch({ type: "setStep", step: "confirm" })
              }
            }}
            canContinue={
              step === "salary"
                ? !!salaryDisplay && Number.parseFloat(salaryDisplay) > 0
                : !!tenureDisplay && Number.parseFloat(tenureDisplay) > 0
            }
            showBack
            backLabel={copy.backToPrevious}
            continueLabel={copy.send}
          />
        </div>
      ) : null}
    </div>
  )
}
