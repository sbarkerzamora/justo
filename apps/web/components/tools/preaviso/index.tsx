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

export type PreavisoStep =
  | "welcome"
  | "salary"
  | "tenure"
  | "terminationCause"
  | "contractType"
  | "notice"
  | "confirm"
  | "done"

const PREAVISO_STEPS: PreavisoStep[] = [
  "welcome",
  "salary",
  "tenure",
  "terminationCause",
  "contractType",
  "notice",
  "confirm",
  "done",
]

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
  form: {
    countryCode: cc,
    monthlySalary: 0,
    tenureYears: 0,
    terminationCause: "despido_injustificado",
    contractType: "indeterminado",
    noticeGivenInWriting: false,
    replaceNoticeWithPayment: true,
  },
  result: null,
  error: null,
})

const terminationCauseOptions = [
  { value: "renuncia", es: "Renuncia", en: "Resignation" },
  {
    value: "despido_justificado",
    es: "Despido con causa",
    en: "Dismissal with cause",
  },
  {
    value: "despido_injustificado",
    es: "Despido sin causa",
    en: "Dismissal without cause",
  },
  { value: "mutuo_acuerdo", es: "Mutuo acuerdo", en: "Mutual agreement" },
  { value: "fin_plazo", es: "Fin de plazo", en: "End of fixed term" },
  { value: "obra_terminada", es: "Obra terminada", en: "Project completed" },
] as const

const contractTypeOptions = [
  { value: "indeterminado", es: "Indefinido", en: "Indefinite" },
  { value: "plazo_fijo", es: "Plazo fijo", en: "Fixed term" },
  { value: "obra_determinada", es: "Obra determinada", en: "Specific project" },
  { value: "temporada", es: "Temporada", en: "Seasonal" },
  { value: "periodo_prueba", es: "Periodo de prueba", en: "Trial period" },
] as const

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
  const [noticeDaysDisplay, setNoticeDaysDisplay] = useState("")

  const stepIndex = PREAVISO_STEPS.indexOf(step)
  const totalSteps = PREAVISO_STEPS.length

  const nextStep = useCallback((s: PreavisoStep): PreavisoStep => {
    const idx = PREAVISO_STEPS.indexOf(s)
    return idx < PREAVISO_STEPS.length - 1 ? PREAVISO_STEPS[idx + 1] : s
  }, [])

  const prevStep = useCallback((s: PreavisoStep): PreavisoStep | null => {
    const idx = PREAVISO_STEPS.indexOf(s)
    return idx > 0 ? PREAVISO_STEPS[idx - 1] : null
  }, [])

  const advance = useCallback(() => {
    dispatch({ type: "setStep", step: nextStep(step) })
  }, [nextStep, step])

  const goBack = useCallback(() => {
    const prev = prevStep(step)
    if (prev) dispatch({ type: "setStep", step: prev })
  }, [prevStep, step])

  const handleConfirm = useCallback(() => {
    const r = calculatePreaviso({
      countryCode: countryCode as CountryCode,
      monthlySalary: form.monthlySalary,
      tenureYears: form.tenureYears,
      terminationCause: form.terminationCause,
      contractType: form.contractType,
      noticeGivenInWriting: form.noticeGivenInWriting,
      noticeDaysGiven: form.noticeDaysGiven,
      replaceNoticeWithPayment: form.replaceNoticeWithPayment,
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
        text: `${copy.preavisoResultHeading}: ${result!.noticeDays} ${locale === "en" ? "days" : "días"}, ${fmt(result!.noticeAmount)}. ${result!.legalReference}.`,
      },
    ])
  }, [onComplete, copy, result, fmt, locale])

  const isDataEntry = step === "salary" || step === "tenure"
  const isChoiceStep =
    step === "terminationCause" || step === "contractType" || step === "notice"

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
          <IconBell className="size-3.5 text-primary" />
          {copy.preavisoBadge}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
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
              sizes="14px"
              loading="lazy"
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
                  copy.preavisoStepSalary,
                  copy.preavisoStepTenure,
                  locale === "en" ? "Cause" : "Causa",
                  locale === "en" ? "Contract" : "Contrato",
                  locale === "en" ? "Notice" : "Aviso",
                  locale === "en" ? "Review" : "Revisar",
                  locale === "en" ? "Result" : "Resultado",
                ].map((label, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground transition-transform hover:scale-105"
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
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none active:scale-[0.98] active:bg-primary/90 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copy.startButton}
                <IconArrowRight className="size-4" />
              </button>
            </div>
          </div>
        ) : step === "confirm" ? (
          <div className="mx-auto max-w-xl space-y-6 px-2">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-top-1">
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
                    {copy.preavisoStepSalary}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {fmt(form.monthlySalary)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">
                    {copy.preavisoStepTenure}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {form.tenureYears} {locale === "en" ? "years" : "años"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">
                    {locale === "en"
                      ? "Termination cause"
                      : "Causa de terminación"}
                  </span>
                  <span className="text-right text-sm font-medium text-foreground">
                    {
                      terminationCauseOptions.find(
                        (o) => o.value === form.terminationCause
                      )?.[locale]
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">
                    {locale === "en" ? "Contract type" : "Tipo de contrato"}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {
                      contractTypeOptions.find(
                        (o) => o.value === form.contractType
                      )?.[locale]
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">
                    {locale === "en" ? "Written notice" : "Preaviso escrito"}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {form.noticeGivenInWriting
                      ? `${locale === "en" ? "Yes" : "Sí"}, ${form.noticeDaysGiven ?? 0} ${locale === "en" ? "days" : "días"}`
                      : locale === "en"
                        ? "No"
                        : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">
                    {locale === "en"
                      ? "Replace with payment"
                      : "Sustituir en dinero"}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {form.replaceNoticeWithPayment
                      ? locale === "en"
                        ? "Yes"
                        : "Sí"
                      : "No"}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none active:scale-[0.98] active:bg-primary/90 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconCheck className="size-4" />
              {copy.confirmAndCalculate}
            </button>
          </div>
        ) : step === "done" && result ? (
          <div className="mx-auto max-w-xl space-y-6 px-2">
            <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition-transform hover:scale-105">
                    <IconFileDescription className="size-3" />
                    {copy.legalVersion}: {result.legalCorpusVersion}
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-foreground">
                    {copy.preavisoResultHeading}
                  </h3>
                </div>
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <IconBell className="size-5 text-primary" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-left">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <IconBell className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {copy.preavisoDaysLabel}
                    </p>
                    <p className="text-sm font-semibold text-foreground motion-safe:animate-in motion-safe:zoom-in-95">
                      {result.noticeDays}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-right">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                    <IconDownload className="size-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {copy.preavisoAmountLabel}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {fmt(result.noticeAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {copy.preavisoSubstitutePayment}
                  </span>
                  <span className="font-medium text-foreground">
                    {result.hasSubstitutePayment
                      ? locale === "en"
                        ? "Yes"
                        : "Sí"
                      : locale === "en"
                        ? "No"
                        : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {copy.preavisoLegalRef}
                  </span>
                  <span className="max-w-[50%] text-right font-medium text-foreground">
                    {result.legalReference}
                  </span>
                </div>
              </div>

              {result.calculationNote && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in">
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
                  ? copy.preavisoStepSalary
                  : copy.preavisoStepTenure}
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
                placeholder={
                  step === "salary"
                    ? copy.askPlaceholder
                    : locale === "en"
                      ? "E.g. 5"
                      : "Ej. 5"
                }
                className="mt-3 h-12 w-full rounded-2xl border border-border bg-card pr-4 pl-4 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:border-foreground/30 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1"
              />
              {step === "tenure" && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {copy.preavisoTenureHint}
                </p>
              )}
            </div>
          </div>
        ) : isChoiceStep ? (
          <div className="flex h-full flex-col items-center justify-center gap-8 px-2">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
              <p className="text-base font-medium text-foreground">
                {step === "terminationCause"
                  ? locale === "en"
                    ? "What is the termination cause?"
                    : "¿Cuál es la causa de terminación?"
                  : step === "contractType"
                    ? locale === "en"
                      ? "What type of contract is it?"
                      : "¿Qué tipo de contrato es?"
                    : locale === "en"
                      ? "Was written notice given?"
                      : "¿Se otorgó preaviso por escrito?"}
              </p>
              {step === "terminationCause" && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {terminationCauseOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "patchForm",
                          patch: { terminationCause: option.value },
                        })
                      }
                      className={`rounded-xl border px-3 py-2 text-left text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none ${form.terminationCause === option.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-accent"}`}
                    >
                      {option[locale]}
                    </button>
                  ))}
                </div>
              )}
              {step === "contractType" && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {contractTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "patchForm",
                          patch: { contractType: option.value },
                        })
                      }
                      className={`rounded-xl border px-3 py-2 text-left text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none ${form.contractType === option.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-accent"}`}
                    >
                      {option[locale]}
                    </button>
                  ))}
                </div>
              )}
              {step === "notice" && (
                <div className="mt-4 space-y-4">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { value: true, label: locale === "en" ? "Yes" : "Sí" },
                      { value: false, label: "No" },
                    ].map((option) => (
                      <button
                        key={String(option.value)}
                        type="button"
                        onClick={() =>
                          dispatch({
                            type: "patchForm",
                            patch: {
                              noticeGivenInWriting: option.value,
                              noticeDaysGiven: option.value
                                ? form.noticeDaysGiven
                                : undefined,
                            },
                          })
                        }
                        className={`rounded-xl border px-3 py-2 text-left text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none ${form.noticeGivenInWriting === option.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-accent"}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {form.noticeGivenInWriting && (
                    <input
                      type="text"
                      inputMode="numeric"
                      value={noticeDaysDisplay}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, "")
                        setNoticeDaysDisplay(v)
                        dispatch({
                          type: "patchForm",
                          patch: {
                            noticeDaysGiven: v
                              ? Number.parseInt(v, 10)
                              : undefined,
                          },
                        })
                      }}
                      placeholder={
                        locale === "en"
                          ? "Notice days given"
                          : "Días de preaviso otorgados"
                      }
                      className="h-12 w-full rounded-2xl border border-border bg-card pr-4 pl-4 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:border-foreground/30 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1"
                    />
                  )}
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="mb-2 text-xs text-muted-foreground">
                      {locale === "en"
                        ? "If notice is missing or incomplete, calculate replacement payment?"
                        : "Si el preaviso falta o está incompleto, ¿calcular sustitución en dinero?"}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        {
                          value: true,
                          label:
                            locale === "en"
                              ? "Calculate payment"
                              : "Calcular pago",
                        },
                        {
                          value: false,
                          label: locale === "en" ? "Only days" : "Solo días",
                        },
                      ].map((option) => (
                        <button
                          key={String(option.value)}
                          type="button"
                          onClick={() =>
                            dispatch({
                              type: "patchForm",
                              patch: { replaceNoticeWithPayment: option.value },
                            })
                          }
                          className={`rounded-xl border px-3 py-2 text-left text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none ${form.replaceNoticeWithPayment === option.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-accent"}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
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
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:scale-[1.02] hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconRefresh className="size-4" /> {copy.calculateAgain}
          </button>
          <button
            type="button"
            onClick={handleComplete}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:scale-[1.02] hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconMessageCircle className="size-4" /> {copy.backToChat}
          </button>
        </div>
      ) : isDataEntry || isChoiceStep ? (
        <div className="px-2 pb-4">
          <StepNavigation
            onBack={goBack}
            onContinue={() => {
              if (step === "salary") {
                const s = Number.parseFloat(salaryDisplay)
                if (!s || s <= 0) return
                dispatch({ type: "patchForm", patch: { monthlySalary: s } })
                advance()
              } else if (step === "tenure") {
                const t = Number.parseFloat(tenureDisplay)
                if (!t || t <= 0) return
                dispatch({ type: "patchForm", patch: { tenureYears: t } })
                advance()
              } else if (step === "notice") {
                dispatch({ type: "setStep", step: "confirm" })
              } else {
                advance()
              }
            }}
            canContinue={
              step === "salary"
                ? !!salaryDisplay && Number.parseFloat(salaryDisplay) > 0
                : step === "tenure"
                  ? !!tenureDisplay && Number.parseFloat(tenureDisplay) > 0
                  : step === "notice" && form.noticeGivenInWriting
                    ? !!noticeDaysDisplay &&
                      Number.parseInt(noticeDaysDisplay, 10) >= 0
                    : true
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
