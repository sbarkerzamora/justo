"use client"

import type { ReactNode } from "react"
import { useReducer, useState, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCoins,
  IconCalendar,
  IconMessageCircle,
  IconRefresh,
  IconFileText,
  IconReceipt,
  IconDoorExit,
  IconAlertTriangle,
  IconAlertCircle,
  IconDownload,
} from "@tabler/icons-react"
import { calculateTermination } from "@justo/tools"
import type { CountryCode } from "@justo/core"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"
import type { TerminationFormData } from "@/components/tools/tool-types"
import type { TerminationScenario } from "@justo/core"
import {
  formatCurrencyInput,
  formatDateInput,
  parseCurrencyInput,
} from "@/components/tools/input-formatters"

export type TerminationStep =
  | "welcome"
  | "monthlySalary"
  | "startDate"
  | "endDate"
  | "confirm"
  | "done"

type TerminationEditMode = null | "salary" | "dates"

interface TerminationToolState {
  step: TerminationStep
  form: TerminationFormData
  result: ReturnType<typeof calculateTermination> | null
  editMode: TerminationEditMode
  editSalary: string
  editStartDate: string
  editEndDate: string
  error: string | null
}

type Action =
  | { type: "setStep"; step: TerminationStep }
  | { type: "patchForm"; patch: Partial<TerminationFormData> }
  | {
      type: "setResult"
      result: ReturnType<typeof calculateTermination> | null
    }
  | { type: "setEditMode"; editMode: TerminationEditMode }
  | {
      type: "setEditField"
      field: "editSalary" | "editStartDate" | "editEndDate"
      value: string
    }
  | { type: "setError"; error: string | null }
  | { type: "reset"; countryCode: string }

const initialState = (cc: string): TerminationToolState => ({
  step: "welcome",
  form: {
    countryCode: cc,
    monthlySalary: 0,
    startDate: "",
    endDate: "",
  },
  result: null,
  editMode: null,
  editSalary: "",
  editStartDate: "",
  editEndDate: "",
  error: null,
})

function reducer(
  state: TerminationToolState,
  action: Action,
): TerminationToolState {
  switch (action.type) {
    case "setStep":
      return { ...state, step: action.step, error: null }
    case "patchForm":
      return { ...state, form: { ...state.form, ...action.patch } }
    case "setResult":
      return { ...state, result: action.result }
    case "setEditMode":
      return { ...state, editMode: action.editMode, error: null }
    case "setEditField":
      return { ...state, [action.field]: action.value }
    case "setError":
      return { ...state, error: action.error }
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
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() + 1 !== mo ||
    dt.getUTCDate() !== d
  )
    return null
  return dt.toISOString().slice(0, 10)
}

const displayDate = (iso: string) => {
  if (!iso) return ""
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return iso
  return `${m[3]}/${m[2]}/${m[1]}`
}

const terminationSteps: TerminationStep[] = [
  "monthlySalary",
  "startDate",
  "endDate",
  "confirm",
  "done",
]

const stepIndex = (step: TerminationStep) => {
  if (step === "welcome") return 0
  const idx = terminationSteps.indexOf(step)
  if (idx === -1) return 5
  return idx + 1
}

const totalSteps = 4

const scenarioIcons: Record<string, ReactNode> = {
  renuncia: <IconDoorExit className="size-4 text-amber-500" />,
  despido_justificado: <IconAlertTriangle className="size-4 text-red-500" />,
  despido_injustificado: <IconAlertCircle className="size-4 text-rose-500" />,
  mutuo_acuerdo: <IconHandshake className="size-4 text-blue-500" />,
}

function IconHandshake({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 6L6 16" />
      <path d="M20 10L10 20" />
      <path d="M22 8l-4-4-8 8 4 4z" />
      <path d="M2 16l4 4 8-8-4-4z" />
    </svg>
  )
}

const scenarioColors: Record<
  string,
  { border: string; bg: string; badge: string }
> = {
  renuncia: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
  },
  despido_justificado: {
    border: "border-red-200",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
  },
  despido_injustificado: {
    border: "border-rose-200",
    bg: "bg-rose-50",
    badge: "bg-rose-100 text-rose-700",
  },
  mutuo_acuerdo: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
  },
}

export function TerminationTool({
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
  onComplete: (
    messages: { role: "user" | "assistant"; text: string }[],
  ) => void
  onCancel: () => void
}) {
  const copy = homeCopy[locale]
  const [state, dispatch] = useReducer(reducer, countryCode, initialState)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const { step, form, result, editMode, error } = state

  const askText = useCallback(
    (s: TerminationStep) => {
      const map: Record<string, string> = {
        monthlySalary: copy.monthlySalaryQuestion(currencyLabel),
        startDate: copy.startDateQuestion,
        endDate: copy.endDateQuestion,
      }
      return map[s] ?? ""
    },
    [copy, currencyLabel],
  )

  const nextStep = (s: TerminationStep): TerminationStep => {
    const idx = terminationSteps.indexOf(s)
    return terminationSteps[idx + 1] ?? "confirm"
  }

  const prevStep = (s: TerminationStep): TerminationStep | null => {
    if (s === "welcome" || s === "done") return null
    const idx = terminationSteps.indexOf(s)
    if (idx <= 0) return "welcome"
    return terminationSteps[idx - 1]
  }

  const advance = () => {
    if (step === "monthlySalary") {
      const n = parseCurrencyInput(inputValue)
      if (!Number.isFinite(n) || n <= 0) return false
      dispatch({ type: "patchForm", patch: { monthlySalary: n } })
      dispatch({ type: "setStep", step: nextStep(step) })
      setInputValue("")
      return true
    }
    if (step === "startDate") {
      const iso = toIsoDate(inputValue)
      if (!iso) {
        dispatch({ type: "setError", error: copy.invalidDates })
        return false
      }
      dispatch({ type: "patchForm", patch: { startDate: iso } })
      dispatch({ type: "setStep", step: nextStep(step) })
      setInputValue("")
      return true
    }
    if (step === "endDate") {
      const iso = toIsoDate(inputValue)
      if (!iso) {
        dispatch({ type: "setError", error: copy.invalidDates })
        return false
      }
      if (form.startDate && iso < form.startDate) {
        dispatch({ type: "setError", error: copy.endBeforeStart })
        return false
      }
      dispatch({ type: "patchForm", patch: { endDate: iso } })
      dispatch({ type: "setStep", step: nextStep(step) })
      setInputValue("")
      return true
    }
    return false
  }

  const handleSubmit = () => {
    if (step === "welcome" || step === "confirm" || step === "done") return
    advance()
  }

  const handleBack = () => {
    const prev = prevStep(step)
    if (prev) { dispatch({ type: "setStep", step: prev }); setInputValue("") }
  }

  const runCalculation = () => {
    try {
      const result = calculateTermination({
        countryCode: countryCode as CountryCode,
        monthlySalary: form.monthlySalary,
        startDate: form.startDate,
        endDate: form.endDate,
      })
      dispatch({ type: "setResult", result })
      dispatch({ type: "setStep", step: "done" })
      dispatch({ type: "setError", error: null })
    } catch (err) {
      dispatch({
        type: "setError",
        error: err instanceof Error ? err.message : copy.calculationFailed,
      })
    }
  }

  const onConfirmAction = (action: "confirm" | "salary" | "dates") => {
    if (action === "confirm") {
      runCalculation()
      return
    }
    dispatch({ type: "setEditMode", editMode: action })
    if (action === "salary")
      dispatch({
        type: "setEditField",
        field: "editSalary",
        value: String(form.monthlySalary || ""),
      })
    if (action === "dates")
      dispatch({
        type: "setEditField",
        field: "editStartDate",
        value: displayDate(form.startDate),
      })
  }

  const saveEdit = () => {
    if (editMode === "salary") {
      const n = parseCurrencyInput(state.editSalary)
      if (!Number.isFinite(n) || n <= 0) {
        dispatch({ type: "setError", error: copy.invalidData })
        return
      }
      dispatch({ type: "patchForm", patch: { monthlySalary: n } })
    }
    if (editMode === "dates") {
      const isoStart = toIsoDate(state.editStartDate)
      if (!isoStart) {
        dispatch({ type: "setError", error: copy.invalidDates })
        return
      }
      dispatch({ type: "patchForm", patch: { startDate: isoStart } })
    }
    dispatch({ type: "setEditMode", editMode: null })
    dispatch({ type: "setError", error: null })
  }

  const onExportPdf = async () => {
    const response = await fetch("/api/termination/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        countryCode,
        monthlySalary: form.monthlySalary,
        startDate: form.startDate,
        endDate: form.endDate,
      }),
    })
    if (!response.ok) return
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `simulador-terminacion-${countryCode}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleComplete = () => {
    const messages: { role: "user" | "assistant"; text: string }[] = [
      {
        role: "assistant",
        text: `Vamos a comparar escenarios de terminación. ${copy.monthlySalaryQuestion(currencyLabel)}`,
      },
      { role: "user", text: String(form.monthlySalary) },
      { role: "assistant", text: copy.startDateQuestion },
      { role: "user", text: displayDate(form.startDate) },
      { role: "assistant", text: copy.endDateQuestion },
      { role: "user", text: displayDate(form.endDate) },
    ]
    if (result) {
      const scenariosText = result.scenarios
        .filter((s) => s.applicable)
        .map((s) => {
          const label = scenarioLabel(s.type, locale)
          return `${label}: ${fmt(s.total)}`
        })
        .join("\n")
      messages.push(
        { role: "assistant", text: copy.reviewSummary },
        { role: "user", text: copy.confirmAndCalculate },
        {
          role: "assistant",
          text: `Comparación de escenarios de terminación (${result.tenureYears} años de antigüedad):\n${scenariosText}`,
        },
      )
    }
    onComplete(messages)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
          <IconDoorExit className="size-3.5 text-primary" />
          {locale === "en"
            ? "Termination simulator"
            : "Simulador de terminación"}
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

      <div className="mb-3 w-full space-y-2 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-top-1 max-sm:mb-2">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{copy.progressStep(stepIndex(step))}</span>
          <span className="max-sm:hidden">
            {step === "done"
              ? copy.result
              : step === "confirm"
                ? copy.summaryTitle
                : askText(step)}
          </span>
          <span className="sm:hidden">
            {step === "done" ? "OK" : `P${stepIndex(step)}`}
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(stepIndex(step) / totalSteps) * 100}%` }}
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

      <div className="min-h-0 flex-1 py-2">
        {step === "welcome" ? (
          <OnboardingPanel
            title={copy.terminationWelcomeTitle}
            description={copy.terminationWelcomeDescription}
            icon={<IconDoorExit className="size-8 text-primary" />}
            steps={[
              { label: copy.salary },
              { label: copy.startDate },
              { label: copy.endDate },
            ]}
            startLabel={copy.startButton}
            onStart={() => dispatch({ type: "setStep", step: "monthlySalary" })}
          />
        ) : editMode ? (
          <div className="space-y-4 overflow-y-auto">
            {error ? (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <IconAlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            ) : null}
            <EditPanel
              editMode={editMode}
              editSalary={state.editSalary}
              editStartDate={state.editStartDate}
              onSetEditField={(field, value) =>
                dispatch({
                  type: "setEditField",
                  field: field as "editSalary" | "editStartDate" | "editEndDate",
                  value,
                })
              }
              onSetEditMode={(mode) =>
                dispatch({ type: "setEditMode", editMode: mode })
              }
              saveEdit={saveEdit}
              copy={copy}
            />
          </div>
        ) : step === "confirm" ? (
          <div className="space-y-4 overflow-y-auto">
            {error ? (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <IconAlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            ) : null}
            <ConfirmPanel
              monthlySalary={form.monthlySalary}
              startDate={form.startDate}
              endDate={form.endDate}
              fmt={fmt}
              copy={copy}
              onConfirmAction={onConfirmAction}
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
              onExportPdf={onExportPdf}
            />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-2">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
              <p className="text-base font-medium text-foreground">
                {askText(step)}
              </p>
            </div>
            <div className="relative w-full max-w-xl pb-4">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) =>
                  setInputValue(
                    step === "monthlySalary"
                      ? formatCurrencyInput(e.target.value)
                      : formatDateInput(e.target.value),
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                inputMode={step === "monthlySalary" ? "decimal" : "text"}
                placeholder={
                  step === "monthlySalary"
                    ? copy.askPlaceholder
                    : copy.endDate
                }
                className="h-12 w-full rounded-2xl border border-border bg-card pl-4 pr-14 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:border-foreground/30"
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className="absolute top-1/2 right-2 inline-flex h-10 min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-30"
              >
                {copy.send}
              </button>
            </div>
            {step !== "monthlySalary" ? (
              <button type="button" onClick={handleBack} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">{copy.backToPrevious}</button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

const scenarioLabel = (type: string, locale: Locale): string => {
  const labels: Record<string, Record<Locale, string>> = {
    renuncia: { es: "Renuncia voluntaria", en: "Voluntary resignation" },
    despido_justificado: {
      es: "Despido justificado",
      en: "Justified dismissal",
    },
    despido_injustificado: {
      es: "Despido injustificado",
      en: "Unjustified dismissal",
    },
    mutuo_acuerdo: { es: "Mutuo acuerdo", en: "Mutual agreement" },
  }
  return labels[type]?.[locale] ?? type
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
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          {icon}
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {steps.map((step, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-medium text-primary">
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

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
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
  monthlySalary,
  startDate,
  endDate,
  fmt,
  copy,
  onConfirmAction,
}: {
  monthlySalary: number
  startDate: string
  endDate: string
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
  onConfirmAction: (action: "confirm" | "salary" | "dates") => void
}) {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <IconReceipt className="size-4 text-primary" />
        {copy.summaryTitle}
      </div>
      <div className="grid gap-2 text-sm">
        <SummaryRow
          icon={<IconCoins className="size-4 text-muted-foreground" />}
          label={copy.salary}
          value={fmt(monthlySalary)}
        />
        <SummaryRow
          icon={<IconCalendar className="size-4 text-muted-foreground" />}
          label={copy.startDate}
          value={displayDate(startDate)}
        />
        <SummaryRow
          icon={<IconCalendar className="size-4 text-muted-foreground" />}
          label={copy.endDate}
          value={displayDate(endDate)}
        />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onConfirmAction("confirm")}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          <IconCheck className="size-4" />
          {copy.confirmAndCalculate}
        </button>
        <button
          type="button"
          onClick={() => onConfirmAction("salary")}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <IconCoins className="size-4" />
          {copy.editSalary}
        </button>
        <button
          type="button"
          onClick={() => onConfirmAction("dates")}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <IconCalendar className="size-4" />
          {copy.editDates}
        </button>
      </div>
    </div>
  )
}

function EditPanel({
  editMode,
  editSalary,
  editStartDate,
  onSetEditField,
  onSetEditMode,
  saveEdit,
  copy,
}: {
  editMode: TerminationEditMode
  editSalary: string
  editStartDate: string
  onSetEditField: (field: string, value: string) => void
  onSetEditMode: (mode: TerminationEditMode) => void
  saveEdit: () => void
  copy: (typeof homeCopy)[Locale]
}) {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      {editMode === "salary" ? (
        <label className="grid gap-2 text-sm">
          <span className="text-foreground">{copy.newMonthlySalary}</span>
          <input
            inputMode="decimal"
            value={editSalary}
            onChange={(e) =>
              onSetEditField("editSalary", formatCurrencyInput(e.target.value))
            }
            className="h-11 rounded-xl border border-border bg-background px-3 text-foreground outline-none focus:border-foreground/30"
          />
        </label>
      ) : editMode === "dates" ? (
        <label className="grid gap-2 text-sm">
          <span className="text-foreground">{copy.startDate}</span>
          <input
            value={editStartDate}
            onChange={(e) =>
              onSetEditField("editStartDate", formatDateInput(e.target.value))
            }
            className="h-11 rounded-xl border border-border bg-background px-3 text-foreground outline-none focus:border-foreground/30"
          />
        </label>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={saveEdit}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          {copy.saveChanges}
        </button>
        <button
          type="button"
          onClick={() => onSetEditMode(null)}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          {copy.cancel}
        </button>
      </div>
    </div>
  )
}

function ScenarioCard({
  scenario,
  fmt,
  locale,
}: {
  scenario: TerminationScenario
  fmt: (v: number) => string
  locale: Locale
}) {
  const colors = scenarioColors[scenario.type] ?? {
    border: "border-border",
    bg: "bg-card",
    badge: "bg-muted text-muted-foreground",
  }
  const icon = scenarioIcons[scenario.type] ?? <IconDoorExit className="size-4" />

  return (
    <div
      className={`rounded-2xl border p-4 ${colors.border} ${colors.bg} shadow-sm`}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="text-sm font-semibold text-foreground">
            {scenarioLabel(scenario.type, locale)}
          </h4>
        </div>
        {scenario.applicable ? (
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${colors.badge}`}
          >
            {fmt(scenario.total)}
          </span>
        ) : (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            N/A
          </span>
        )}
      </div>

      {!scenario.applicable ? (
        <p className="text-xs text-muted-foreground mt-2">
          {scenario.note ?? (locale === "en" ? "Not applicable for this case." : "No aplica para este caso.")}
        </p>
      ) : (
        <>
          <div className="mt-3">
            <p className="text-xl font-semibold tracking-tight text-foreground">
              {fmt(scenario.total)}
            </p>
          </div>

          {scenario.lines.length > 0 && (
            <div className="mt-3 space-y-1.5 border-t border-border pt-3">
              {scenario.lines.map((line) => (
                <div key={line.label} className="text-xs text-muted-foreground">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{line.label}</span>
                    <span className="shrink-0 font-medium text-foreground">
                      {fmt(line.amount)}
                    </span>
                  </div>
                  <p className="text-[11px]">{line.formula}</p>
                  <p className="text-[11px] text-muted-foreground/60">
                    {line.legalReference}
                  </p>
                </div>
              ))}
            </div>
          )}

          {scenario.note && (
            <p className="mt-2 text-[11px] text-muted-foreground">
              {scenario.note}
            </p>
          )}
        </>
      )}
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
  onExportPdf,
}: {
  result: ReturnType<typeof calculateTermination>
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
  locale: Locale
  onRestart: () => void
  onComplete: () => void
  onExportPdf: () => Promise<void>
}) {
  const scenarioOrder = [
    "renuncia",
    "despido_justificado",
    "despido_injustificado",
    "mutuo_acuerdo",
  ]

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
              {locale === "en"
                ? "Termination scenarios comparison"
                : "Comparación de escenarios de terminación"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {locale === "en"
                ? `Based on ${result.tenureYears} years of seniority`
                : `Basado en ${result.tenureYears} años de antigüedad`}
            </p>
          </div>
          <div className="rounded-xl bg-primary/10 p-2.5">
            <IconDoorExit className="size-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {scenarioOrder.map((type) => {
          const scenario = result.scenarios.find((s) => s.type === type)
          if (!scenario) return null
          return (
            <ScenarioCard
              key={type}
              scenario={scenario}
              fmt={fmt}
              locale={locale}
            />
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void onExportPdf()}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <IconDownload className="size-4" /> {copy.downloadPdf}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          <IconRefresh className="size-4" /> {copy.calculateAgain}
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <IconMessageCircle className="size-4" /> {copy.backToChat}
        </button>
      </div>
    </div>
  )
}
