"use client"

import type { ReactNode } from "react"
import { useReducer, useState, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  IconArrowLeft,
  IconArrowRight,
  IconCoins,
  IconCheck,
  IconReceipt,
  IconFileText,
  IconTrendingUp,
  IconTrendingDown,
  IconRefresh,
  IconMessageCircle,
  IconDownload,
  IconAlertCircle,
} from "@tabler/icons-react"
import { calculateSalaryNet } from "@justo/tools"
import type { CountryCode } from "@justo/core"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"
import {
  formatCurrencyInput,
  getCurrencySymbol,
  parseCurrencyInput,
} from "@/components/tools/input-formatters"
import { StepNavigation } from "@/components/tools/step-navigation"

export type SalaryNetStep =
  | "welcome"
  | "monthlySalary"
  | "frequency"
  | "pensionSystem"
  | "confirm"
  | "done"

type SalaryNetEditMode = null | "salary" | "frequency"

interface SalaryNetToolState {
  step: SalaryNetStep
  grossSalary: number
  frequency: "mensual" | "quincenal" | "semanal"
  pensionSystem: "afp" | "onp"
  result: ReturnType<typeof calculateSalaryNet> | null
  editMode: SalaryNetEditMode
  editSalary: string
  editFrequency: string
  error: string | null
}

type Action =
  | { type: "setStep"; step: SalaryNetStep }
  | { type: "setGrossSalary"; value: number }
  | { type: "setFrequency"; value: "mensual" | "quincenal" | "semanal" }
  | { type: "setPensionSystem"; value: "afp" | "onp" }
  | { type: "setResult"; result: ReturnType<typeof calculateSalaryNet> | null }
  | { type: "setEditMode"; editMode: SalaryNetEditMode }
  | {
      type: "setEditField"
      field: "editSalary" | "editFrequency"
      value: string
    }
  | { type: "setError"; error: string | null }
  | { type: "reset" }

const initialState: SalaryNetToolState = {
  step: "welcome",
  grossSalary: 0,
  frequency: "mensual",
  pensionSystem: "onp",
  result: null,
  editMode: null,
  editSalary: "",
  editFrequency: "",
  error: null,
}

function reducer(
  state: SalaryNetToolState,
  action: Action
): SalaryNetToolState {
  switch (action.type) {
    case "setStep":
      return { ...state, step: action.step, error: null }
    case "setGrossSalary":
      return { ...state, grossSalary: action.value }
    case "setFrequency":
      return { ...state, frequency: action.value }
    case "setPensionSystem":
      return { ...state, pensionSystem: action.value }
    case "setResult":
      return { ...state, result: action.result }
    case "setEditMode":
      return { ...state, editMode: action.editMode, error: null }
    case "setEditField":
      return { ...state, [action.field]: action.value }
    case "setError":
      return { ...state, error: action.error }
    case "reset":
      return { ...initialState }
    default:
      return state
  }
}

const salaryNetSteps: SalaryNetStep[] = [
  "monthlySalary",
  "frequency",
  "pensionSystem",
  "confirm",
  "done",
]

const stepIndex = (step: SalaryNetStep) => {
  if (step === "welcome") return 0
  const idx = salaryNetSteps.indexOf(step)
  if (idx === -1) return 4
  return idx + 1
}

const totalSteps = 4

export function SalaryNetTool({
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
  const [state, dispatch] = useReducer(reducer, initialState)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    step,
    grossSalary,
    frequency,
    pensionSystem,
    result,
    editMode,
    error,
  } = state

  const askText = useCallback(
    (s: SalaryNetStep) => {
      const map: Record<string, string> = {
        monthlySalary: copy.monthlySalaryQuestion(currencyLabel),
        frequency: copy.frequencyQuestion,
      }
      return map[s] ?? ""
    },
    [copy, currencyLabel]
  )

  const nextStep = (s: SalaryNetStep): SalaryNetStep => {
    const idx = salaryNetSteps.indexOf(s)
    return salaryNetSteps[idx + 1] ?? "confirm"
  }

  const prevStep = (s: SalaryNetStep): SalaryNetStep | null => {
    if (s === "welcome" || s === "done") return null
    if (s === "confirm") return "frequency"
    const idx = salaryNetSteps.indexOf(s)
    if (idx <= 0) return "welcome"
    return salaryNetSteps[idx - 1]
  }

  const applyField = (
    field: "salary" | "frequency",
    value: string
  ): boolean => {
    if (field === "salary") {
      const n = parseCurrencyInput(value)
      if (!Number.isFinite(n) || n <= 0) return false
      dispatch({ type: "setGrossSalary", value: n })
      return true
    }
    if (field === "frequency") {
      const v = value.toLowerCase().trim()
      if (
        !(["mensual", "quincenal", "semanal"] as const).includes(
          v as "mensual" | "quincenal" | "semanal"
        )
      )
        return false
      dispatch({
        type: "setFrequency",
        value: v as "mensual" | "quincenal" | "semanal",
      })
      return true
    }
    return true
  }

  const advance = () => {
    if (step === "monthlySalary") {
      if (!applyField("salary", inputValue)) return false
      const ns = nextStep(step)
      dispatch({ type: "setStep", step: ns })
      setInputValue("")
      return true
    }
    return false
  }

  const handleSubmit = () => {
    if (
      step === "welcome" ||
      step === "frequency" ||
      step === "confirm" ||
      step === "done"
    )
      return
    advance()
  }

  const handleBack = () => {
    const prev = prevStep(step)
    if (prev) {
      dispatch({ type: "setStep", step: prev })
      setInputValue("")
    }
  }

  const onFrequencySelect = (f: "mensual" | "quincenal" | "semanal") => {
    dispatch({ type: "setFrequency", value: f })
    dispatch({
      type: "setStep",
      step: countryCode === "pe" ? "pensionSystem" : "confirm",
    })
  }

  const runCalculation = () => {
    try {
      const result = calculateSalaryNet({
        countryCode: countryCode as CountryCode,
        grossSalary,
        frequency,
        ...(countryCode === "pe" ? { pensionSystem } : {}),
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

  const onConfirmAction = (action: "confirm" | "salary" | "frequency") => {
    if (action === "confirm") {
      runCalculation()
      return
    }
    dispatch({ type: "setEditMode", editMode: action })
    if (action === "salary")
      dispatch({
        type: "setEditField",
        field: "editSalary",
        value: formatCurrencyInput(String(grossSalary || "")),
      })
    if (action === "frequency")
      dispatch({
        type: "setEditField",
        field: "editFrequency",
        value: frequency,
      })
  }

  const saveEdit = () => {
    if (editMode === "salary" && !applyField("salary", state.editSalary)) {
      dispatch({ type: "setError", error: copy.invalidData })
      return
    }
    if (
      editMode === "frequency" &&
      !applyField("frequency", state.editFrequency)
    ) {
      dispatch({ type: "setError", error: copy.invalidData })
      return
    }
    dispatch({ type: "setEditMode", editMode: null })
    dispatch({ type: "setError", error: null })
  }

  const onExportPdf = async () => {
    const response = await fetch("/api/salary-net/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        countryCode,
        grossSalary,
        frequency,
        ...(countryCode === "pe" ? { pensionSystem } : {}),
      }),
    })
    if (!response.ok) return
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `salario-neto-${countryCode}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleComplete = () => {
    const messages: { role: "user" | "assistant"; text: string }[] = [
      {
        role: "assistant",
        text: `Vamos a calcular tu salario neto. ${copy.monthlySalaryQuestion(currencyLabel)}`,
      },
      { role: "user", text: String(grossSalary) },
      { role: "assistant", text: copy.frequencyQuestion },
      { role: "user", text: frequency },
    ]
    if (result) {
      messages.push(
        { role: "assistant", text: copy.reviewSummary },
        { role: "user", text: copy.confirmAndCalculate },
        {
          role: "assistant",
          text: `Salario neto mensual: ${fmt(result.netSalary)}`,
        }
      )
    }
    onComplete(messages)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
          <IconCoins className="size-3.5 text-primary" />
          {locale === "en" ? "Net salary" : "Salario neto"}
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

      <div className="flex min-h-0 flex-1 flex-col py-2">
        {step === "welcome" ? (
          <OnboardingPanel
            title={copy.salaryNetWelcomeTitle}
            description={copy.salaryNetWelcomeDescription}
            icon={<IconCoins className="size-8 text-primary" />}
            steps={[
              { label: copy.salary },
              { label: copy.frequency },
              { label: copy.result },
            ]}
            startLabel={copy.startButton}
            onStart={() => dispatch({ type: "setStep", step: "monthlySalary" })}
          />
        ) : editMode ? (
          <div className="space-y-4">
            {error ? (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <IconAlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            ) : null}
            <EditPanel
              editMode={editMode}
              editSalary={state.editSalary}
              editFrequency={state.editFrequency}
              currencySymbol={getCurrencySymbol(countryCode)}
              onSetEditField={(field, value) =>
                dispatch({
                  type: "setEditField",
                  field: field as "editSalary" | "editFrequency",
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
        ) : step === "frequency" ? (
          <div className="space-y-4">
            <FrequencyPicker onSelect={onFrequencySelect} copy={copy} />
          </div>
        ) : step === "pensionSystem" ? (
          <div className="space-y-4">
            <PensionSelector
              selected={pensionSystem}
              onSelect={(v) => {
                dispatch({ type: "setPensionSystem", value: v })
                dispatch({ type: "setStep", step: "confirm" })
              }}
              copy={copy}
            />
          </div>
        ) : step === "confirm" ? (
          <div className="space-y-4">
            {error ? (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <IconAlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            ) : null}
            <ConfirmPanel
              grossSalary={grossSalary}
              frequency={frequency}
              pensionSystem={pensionSystem}
              countryCode={countryCode}
              fmt={fmt}
              copy={copy}
              onConfirmAction={onConfirmAction}
            />
          </div>
        ) : result && step === "done" ? (
          <div className="space-y-4">
            <ResultPanel
              frequency={frequency}
              result={result}
              fmt={fmt}
              copy={copy}
              locale={locale}
              onRestart={() => dispatch({ type: "reset" })}
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
            <div className="w-full max-w-xl">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {getCurrencySymbol(countryCode)}
                </span>
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) =>
                    setInputValue(formatCurrencyInput(e.target.value))
                  }
                  inputMode="decimal"
                  placeholder={copy.askPlaceholder}
                  className="h-12 w-full rounded-2xl border border-border bg-card pl-10 pr-4 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:border-foreground/30"
                />
              </div>
            </div>
          </div>
        )}

        {step !== "welcome" &&
          step !== "frequency" &&
          step !== "pensionSystem" &&
          step !== "confirm" &&
          step !== "done" && (
            <StepNavigation
              onBack={handleBack}
              onContinue={handleSubmit}
              canContinue={!!inputValue.trim()}
              showBack={false}
              backLabel={copy.backToPrevious}
              continueLabel={copy.send}
            />
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

function FrequencyPicker({
  onSelect,
  copy,
}: {
  onSelect: (f: "mensual" | "quincenal" | "semanal") => void
  copy: (typeof homeCopy)[Locale]
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        {copy.frequencyOption}
      </p>
      <div className="flex flex-wrap gap-2">
        {(["mensual", "quincenal", "semanal"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onSelect(f)}
            className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground capitalize transition-colors duration-200 hover:bg-accent"
          >
            {
              copy[
                f === "mensual"
                  ? "monthly"
                  : f === "quincenal"
                    ? "biweekly"
                    : "weekly"
              ]
            }
          </button>
        ))}
      </div>
    </div>
  )
}

function PensionSelector({
  selected,
  onSelect,
  copy,
}: {
  selected: "afp" | "onp"
  onSelect: (v: "afp" | "onp") => void
  copy: (typeof homeCopy)["es" | "en"]
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        {copy.pensionSystem}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelect("onp")}
          className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            selected === "onp"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground hover:bg-accent"
          }`}
        >
          ONP (13%)
        </button>
        <button
          type="button"
          onClick={() => onSelect("afp")}
          className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            selected === "afp"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground hover:bg-accent"
          }`}
        >
          AFP (11.2%)
        </button>
      </div>
    </div>
  )
}

function ConfirmPanel({
  grossSalary,
  frequency,
  pensionSystem,
  countryCode,
  fmt,
  copy,
  onConfirmAction,
}: {
  grossSalary: number
  frequency: string
  pensionSystem: "afp" | "onp"
  countryCode: string
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
  onConfirmAction: (action: "confirm" | "salary" | "frequency") => void
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
          label={copy.grossSalary}
          value={fmt(grossSalary)}
        />
        <SummaryRow
          icon={<IconReceipt className="size-4 text-muted-foreground" />}
          label={copy.frequency}
          value={
            frequency === "mensual"
              ? copy.monthly
              : frequency === "quincenal"
                ? copy.biweekly
                : copy.weekly
          }
        />
        {countryCode === "pe" ? (
          <SummaryRow
            icon={<IconCoins className="size-4 text-muted-foreground" />}
            label={pensionSystem === "afp" ? "AFP" : "ONP"}
            value={pensionSystem === "afp" ? "AFP (11.2%)" : "ONP (13%)"}
          />
        ) : null}
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
          onClick={() => onConfirmAction("frequency")}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <IconReceipt className="size-4" />
          {copy.frequency}
        </button>
      </div>
    </div>
  )
}

function EditPanel({
  editMode,
  editSalary,
  editFrequency,
  currencySymbol,
  onSetEditField,
  onSetEditMode,
  saveEdit,
  copy,
}: {
  editMode: SalaryNetEditMode
  editSalary: string
  editFrequency: string
  currencySymbol: string
  onSetEditField: (field: string, value: string) => void
  onSetEditMode: (mode: SalaryNetEditMode) => void
  saveEdit: () => void
  copy: (typeof homeCopy)[Locale]
}) {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      {editMode === "salary" ? (
        <label className="grid gap-2 text-sm">
          <span className="text-foreground">{copy.newMonthlySalary}</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {currencySymbol}
            </span>
            <input
              inputMode="decimal"
              value={editSalary}
              onChange={(e) =>
                onSetEditField("editSalary", formatCurrencyInput(e.target.value))
              }
              className="h-11 w-full rounded-xl border border-border bg-background pl-8 pr-3 text-foreground outline-none focus:border-foreground/30"
            />
          </div>
        </label>
      ) : editMode === "frequency" ? (
        <label className="grid gap-2 text-sm">
          <span className="text-foreground">{copy.frequencyOption}</span>
          <div className="flex flex-wrap gap-2">
            {(["mensual", "quincenal", "semanal"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  onSetEditField("editFrequency", f)
                }}
                className={`rounded-xl border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  editFrequency === f
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground hover:bg-accent"
                }`}
              >
                {
                  copy[
                    f === "mensual"
                      ? "monthly"
                      : f === "quincenal"
                        ? "biweekly"
                        : "weekly"
                  ]
                }
              </button>
            ))}
          </div>
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

function ResultPanel({
  frequency,
  result,
  fmt,
  copy,
  locale,
  onRestart,
  onComplete,
  onExportPdf,
}: {
  frequency: string
  result: ReturnType<typeof calculateSalaryNet>
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
  locale: Locale
  onRestart: () => void
  onComplete: () => void
  onExportPdf: () => Promise<void>
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
              {locale === "en"
                ? "Net salary result"
                : "Resultado de salario neto"}
            </h3>
          </div>
          <div className="rounded-xl bg-primary/10 p-2.5">
            <IconCoins className="size-5 text-primary" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {copy.netSalaryHeading} (
            {frequency === "mensual"
              ? copy.monthly
              : frequency === "quincenal"
                ? copy.biweekly
                : copy.weekly}
            )
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {fmt(result.netSalary)}
          </p>
        </div>

        <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <IconTrendingUp className="size-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {copy.grossSalary}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {fmt(result.grossSalary)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
              <IconTrendingDown className="size-4 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {copy.deductions}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {fmt(result.totalDeductions)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <IconTrendingDown className="size-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {copy.deductionRate}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {((result.totalDeductions / result.grossSalary) * 100).toFixed(
                  1
                )}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-muted/30 p-4">
          <p className="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {copy.netPerPeriod}
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {copy.monthly}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {fmt(result.netSalaryPerPeriod.mensual)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {copy.biweekly}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {fmt(result.netSalaryPerPeriod.quincenal)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <p className="text-xs text-muted-foreground">{copy.weekly}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {fmt(result.netSalaryPerPeriod.semanal)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/30">
            <span className="flex items-center gap-2">
              <IconReceipt className="size-4 text-muted-foreground" />
              {copy.fullBreakdown}
            </span>
            <span className="text-xs text-muted-foreground">
              {copy.expandLabel}
            </span>
          </summary>
          <div className="space-y-4 border-t border-border p-4">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wider text-rose-600 uppercase">
                {copy.deductions}
              </p>
              {result.deductions.map(
                (d: {
                  label: string
                  amount: number
                  formula: string
                  legalReference: string
                }) => (
                  <div
                    key={d.label}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{d.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.formula}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-medium text-rose-600">
                        {fmt(d.amount)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {d.legalReference}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </details>
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
