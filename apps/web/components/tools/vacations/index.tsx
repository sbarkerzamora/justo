"use client"

import type { ReactNode } from "react"
import { useReducer, useState, useCallback, useRef } from "react"
import {
  IconArrowLeft,
  IconArrowRight,
  IconBeach,
  IconCheck,
  IconCoin,
  IconCalendar,
  IconMessageCircle,
  IconRefresh,
  IconFileText,
  IconReceipt,
  IconSun,
} from "@tabler/icons-react"
import { calculateVacations } from "@justo/tools"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"
import type { VacationFormData } from "@/components/tools/tool-types"

export type VacationStep = "welcome" | "monthlySalary" | "startDate" | "endDate" | "usedVacationDays" | "confirm" | "done"

interface VacationToolState {
  step: VacationStep
  form: VacationFormData
  result: ReturnType<typeof calculateVacations> | null
}

type Action =
  | { type: "setStep"; step: VacationStep }
  | { type: "patchForm"; patch: Partial<VacationFormData> }
  | { type: "setResult"; result: ReturnType<typeof calculateVacations> | null }
  | { type: "reset"; countryCode: string }

const initialState = (cc: string): VacationToolState => ({
  step: "welcome",
  form: {
    countryCode: cc,
    monthlySalary: 0,
    startDate: "",
    endDate: "",
    usedVacationDays: 0,
  },
  result: null,
})

function reducer(state: VacationToolState, action: Action): VacationToolState {
  switch (action.type) {
    case "setStep":
      return { ...state, step: action.step }
    case "patchForm":
      return { ...state, form: { ...state.form, ...action.patch } }
    case "setResult":
      return { ...state, result: action.result }
    case "reset":
      return initialState(action.countryCode)
    default:
      return state
  }
}

const toIsoDate = (displayDate: string) => {
  const m = displayDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  const d = Number(m[1])
  const mo = Number(m[2])
  const y = Number(m[3])
  const dt = new Date(Date.UTC(y, mo - 1, d))
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() + 1 !== mo || dt.getUTCDate() !== d)
    return null
  return `${y.toString().padStart(4, "0")}-${mo.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`
}

const vacationSteps: VacationStep[] = ["monthlySalary", "startDate", "endDate", "usedVacationDays", "confirm", "done"]

const stepIndex = (step: VacationStep) => {
  if (step === "welcome") return 0
  const idx = vacationSteps.indexOf(step)
  if (idx === -1) return 6
  return idx + 1
}

export function VacationsTool({
  countryCode,
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
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const { step, form, result } = state

  const askText = useCallback((s: VacationStep) => {
    const map: Record<string, string> = {
      monthlySalary: copy.monthlySalaryQuestion(currencyLabel),
      startDate: copy.startDateQuestion,
      endDate: copy.endDateQuestion,
      usedVacationDays: copy.vacationDaysQuestion,
    }
    return map[s] ?? ""
  }, [copy, currencyLabel])

  const nextStep = (s: VacationStep): VacationStep => {
    const idx = vacationSteps.indexOf(s)
    return vacationSteps[idx + 1] ?? "confirm"
  }

  const applyField = (field: keyof VacationFormData, value: string): boolean => {
    if (field === "monthlySalary" || field === "usedVacationDays") {
      const n = Number(value)
      if (!Number.isFinite(n) || n <= 0) return false
      dispatch({ type: "patchForm", patch: { [field]: n } as Partial<VacationFormData> })
      return true
    }
    if (field === "startDate" || field === "endDate") {
      const iso = toIsoDate(value)
      if (!iso) return false
      dispatch({ type: "patchForm", patch: { [field]: iso } as Partial<VacationFormData> })
      return true
    }
    return true
  }

  const advance = () => {
    const fieldMap: Partial<Record<VacationStep, keyof VacationFormData>> = {
      monthlySalary: "monthlySalary",
      startDate: "startDate",
      endDate: "endDate",
      usedVacationDays: "usedVacationDays",
    }
    const field = fieldMap[step]
    if (!field || !applyField(field, inputValue)) return false
    const ns = nextStep(step)
    dispatch({ type: "setStep", step: ns })
    setInputValue("")
    return true
  }

  const handleSubmit = () => {
    if (step === "welcome" || step === "confirm" || step === "done") return
    advance()
  }

  const runCalculation = () => {
    if (form.endDate < form.startDate) return
    try {
      const result = calculateVacations({ ...form, countryCode: countryCode as "ni" })
      dispatch({ type: "setResult", result })
      dispatch({ type: "setStep", step: "done" })
    } catch {
      // handle error
    }
  }

  const handleComplete = () => {
    const messages: { role: "user" | "assistant"; text: string }[] = [
      { role: "assistant", text: `Vamos a calcular tus vacaciones. ${copy.monthlySalaryQuestion(currencyLabel)}` },
      { role: "user", text: String(form.monthlySalary) },
      { role: "assistant", text: copy.startDateQuestion },
      { role: "user", text: form.startDate },
      { role: "assistant", text: copy.endDateQuestion },
      { role: "user", text: form.endDate },
      { role: "assistant", text: copy.vacationDaysQuestion },
      { role: "user", text: String(form.usedVacationDays) },
    ]
    if (result) {
      messages.push(
        { role: "assistant", text: copy.reviewSummary },
        { role: "user", text: copy.confirmAndCalculate },
        { role: "assistant", text: `Tus vacaciones: ${fmt(result.amount)}` }
      )
    }
    onComplete(messages)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between w-full">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
          <IconBeach className="size-3.5 text-primary" />
          {locale === "en" ? "Vacations" : "Vacaciones"}
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

      <div className="w-full mb-3 space-y-2 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-top-1 max-sm:mb-2">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{copy.progressStep(stepIndex(step))}</span>
          <span className="max-sm:hidden">{step === "done" ? copy.result : step === "confirm" ? copy.summaryTitle : askText(step)}</span>
          <span className="sm:hidden">{step === "done" ? "OK" : `P${stepIndex(step)}`}</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted">
          <div className="h-1.5 rounded-full bg-primary transition-all duration-300" style={{ width: `${(stepIndex(step) / 6) * 100}%` }} />
        </div>
      </div>

      <div className="min-h-0 flex-1 py-2">
        {step === "welcome" ? (
          <OnboardingPanel
            title={copy.vacationsWelcomeTitle}
            description={copy.vacationsWelcomeDescription}
            icon={<IconBeach className="size-8 text-primary" />}
            steps={[
              { label: copy.salary },
              { label: copy.dates },
              { label: copy.vacations },
              { label: copy.result },
            ]}
            startLabel={copy.startButton}
            onStart={() => dispatch({ type: "setStep", step: "monthlySalary" })}
          />
        ) : step === "confirm" ? (
          <div className="space-y-4 overflow-y-auto">
            <ConfirmPanel
              form={form}
              fmt={fmt}
              copy={copy}
              onConfirm={runCalculation}
            />
          </div>
        ) : result && step === "done" ? (
          <div className="space-y-4 overflow-y-auto">
            <ResultPanel
              result={result}
              fmt={fmt}
              copy={copy}
              locale={locale}
              onRestart={() => dispatch({ type: "reset", countryCode })}
              onComplete={handleComplete}
            />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-2">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
              <p className="text-base font-medium text-foreground">{askText(step)}</p>
            </div>
            <div className="relative w-full max-w-xl pb-4">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                placeholder={copy.askPlaceholder}
                className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground/30"
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 items-center justify-center rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-30"
              >
                {copy.send}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function OnboardingPanel({
  title,
  description,
  icon,
  steps,
  startLabel,
  onStart,
}: {
  title: string
  description: string
  icon: ReactNode
  steps: { label: string }[]
  startLabel: string
  onStart: () => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-2 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
      <div className="flex flex-col items-center gap-5 text-center max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          {icon}
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {steps.map((step, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[9px] font-medium text-primary">
                {i + 1}
              </span>
              {step.label}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          {startLabel}
          <IconArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function SummaryRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5">
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

function ConfirmPanel({
  form,
  fmt,
  copy,
  onConfirm,
}: {
  form: VacationFormData
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
  onConfirm: () => void
}) {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <IconReceipt className="size-4 text-primary" />
        {copy.summaryTitle}
      </div>
      <div className="grid gap-2 text-sm">
        <SummaryRow icon={<IconCoin className="size-4 text-muted-foreground" />} label={copy.salary} value={fmt(form.monthlySalary)} />
        <SummaryRow icon={<IconCalendar className="size-4 text-muted-foreground" />} label={copy.dates} value={`${form.startDate} → ${form.endDate}`} />
        <SummaryRow icon={<IconBeach className="size-4 text-muted-foreground" />} label={copy.vacations} value={`${form.usedVacationDays} días`} />
      </div>
      <div className="mt-5">
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          <IconCheck className="size-4" />
          {copy.confirmAndCalculate}
        </button>
      </div>
    </div>
  )
}

function ResultPanel({
  result,
  fmt,
  copy,
  locale,
  onRestart,
  onComplete,
}: {
  result: ReturnType<typeof calculateVacations>
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
  locale: Locale
  onRestart: () => void
  onComplete: () => void
}) {
  return (
    <div className="w-full space-y-4 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <IconFileText className="size-3" />
              {copy.legalVersion}: {result.legalCorpusVersion}
            </div>
            <h3 className="mt-2 text-sm font-semibold text-foreground">
              {locale === "en" ? "Vacation result" : "Resultado de vacaciones"}
            </h3>
          </div>
          <div className="rounded-xl bg-primary/10 p-2.5">
            <IconBeach className="size-5 text-primary" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {locale === "en" ? "Amount" : "Monto"}
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {fmt(result.amount)}
          </p>
        </div>

        <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <IconSun className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">{locale === "en" ? "Accrued days" : "Días acumulados"}</p>
              <p className="text-sm font-semibold text-foreground">{result.accruedVacationDays} días</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <IconBeach className="size-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">{locale === "en" ? "Used days" : "Días gozados"}</p>
              <p className="text-sm font-semibold text-foreground">{result.usedVacationDays} días</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <IconCalendar className="size-4 text-amber-600" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">{locale === "en" ? "Pending days" : "Días pendientes"}</p>
              <p className="text-sm font-semibold text-foreground">{result.pendingVacationDays} días</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
              <IconCoin className="size-4 text-violet-600" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">{locale === "en" ? "Daily salary" : "Salario diario"}</p>
              <p className="text-sm font-semibold text-foreground">{fmt(result.dailySalary)}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-muted/30 p-3 space-y-2">
          <div>
            <p className="text-[11px] text-muted-foreground">{locale === "en" ? "Formula" : "Fórmula"}</p>
            <p className="mt-0.5 text-sm font-mono text-foreground">{result.formula}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">{locale === "en" ? "Legal reference" : "Referencia legal"}</p>
            <p className="mt-0.5 text-sm text-foreground">{result.legalReference}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onRestart} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
          <IconRefresh className="size-4" /> {copy.calculateAgain}
        </button>
        <button type="button" onClick={onComplete} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
          <IconMessageCircle className="size-4" /> {copy.backToChat}
        </button>
      </div>
    </div>
  )
}
