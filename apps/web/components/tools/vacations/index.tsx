"use client"

import type { ReactNode } from "react"
import { useReducer, useState, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
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
  IconDownload,
  IconEdit,
  IconAlertCircle,
} from "@tabler/icons-react"
import { calculateVacations } from "@justo/tools"
import type { CountryCode } from "@justo/core"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"
import type { VacationFormData } from "@/components/tools/tool-types"
import {
  formatCurrencyInput,
  formatDateInput,
  formatNumberInput,
  getCurrencySymbol,
  parseCurrencyInput,
} from "@/components/tools/input-formatters"
import { StepNavigation } from "@/components/tools/step-navigation"

export type VacationStep =
  | "welcome"
  | "monthlySalary"
  | "startDate"
  | "endDate"
  | "usedVacationDays"
  | "confirm"
  | "done"

type VacationEditMode = null | "salary" | "dates" | "vacations"

interface VacationToolState {
  step: VacationStep
  form: VacationFormData
  result: ReturnType<typeof calculateVacations> | null
  editMode: VacationEditMode
  editSalary: string
  editStartDate: string
  editEndDate: string
  editVacations: string
  error: string | null
}

type Action =
  | { type: "setStep"; step: VacationStep }
  | { type: "patchForm"; patch: Partial<VacationFormData> }
  | { type: "setResult"; result: ReturnType<typeof calculateVacations> | null }
  | { type: "setEditMode"; editMode: VacationEditMode }
  | {
      type: "setEditField"
      field: "editSalary" | "editStartDate" | "editEndDate" | "editVacations"
      value: string
    }
  | { type: "setError"; error: string | null }
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
  editMode: null,
  editSalary: "",
  editStartDate: "",
  editEndDate: "",
  editVacations: "",
  error: null,
})

function reducer(state: VacationToolState, action: Action): VacationToolState {
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
  return `${y.toString().padStart(4, "0")}-${mo.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`
}

const vacationSteps: VacationStep[] = [
  "monthlySalary",
  "startDate",
  "endDate",
  "usedVacationDays",
  "confirm",
  "done",
]

const stepIndex = (step: VacationStep) => {
  if (step === "welcome") return 0
  const idx = vacationSteps.indexOf(step)
  if (idx === -1) return 6
  return idx + 1
}

export function VacationsTool({
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
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const { step, form, result, editMode, error } = state

  const askText = useCallback(
    (s: VacationStep) => {
      const map: Record<string, string> = {
        monthlySalary: copy.monthlySalaryQuestion(currencyLabel),
        startDate: copy.startDateQuestion,
        endDate: copy.endDateQuestion,
        usedVacationDays: copy.vacationDaysQuestion,
      }
      return map[s] ?? ""
    },
    [copy, currencyLabel]
  )

  const nextStep = (s: VacationStep): VacationStep => {
    const idx = vacationSteps.indexOf(s)
    return vacationSteps[idx + 1] ?? "confirm"
  }

  const prevStep = (s: VacationStep): VacationStep | null => {
    if (s === "welcome" || s === "done") return null
    const idx = vacationSteps.indexOf(s)
    if (idx <= 0) return "welcome"
    return vacationSteps[idx - 1]
  }

  const applyField = (
    field: keyof VacationFormData,
    value: string
  ): boolean => {
    if (field === "monthlySalary") {
      const n = parseCurrencyInput(value)
      if (!Number.isFinite(n) || n <= 0) return false
      dispatch({
        type: "patchForm",
        patch: { [field]: n } as Partial<VacationFormData>,
      })
      return true
    }
    if (field === "usedVacationDays") {
      const n = Number(value)
      if (!Number.isFinite(n) || n < 0) return false
      dispatch({
        type: "patchForm",
        patch: { [field]: n } as Partial<VacationFormData>,
      })
      return true
    }
    if (field === "startDate" || field === "endDate") {
      const iso = toIsoDate(value.trim())
      if (!iso) return false
      dispatch({
        type: "patchForm",
        patch: { [field]: value.trim() } as Partial<VacationFormData>,
      })
      return true
    }
    return true
  }

  const getFormattedInputValue = (s: VacationStep, value: string): string => {
    if (s === "monthlySalary") return formatCurrencyInput(value)
    if (s === "startDate" || s === "endDate") return formatDateInput(value)
    if (s === "usedVacationDays") return formatNumberInput(value)
    return value
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

  const handleBack = () => {
    const prev = prevStep(step)
    if (prev) {
      dispatch({ type: "setStep", step: prev })
      setInputValue("")
    }
  }

  const runCalculation = () => {
    const startIso = toIsoDate(form.startDate)
    const endIso = toIsoDate(form.endDate)
    if (!startIso || !endIso) {
      dispatch({ type: "setError", error: copy.invalidDates })
      return
    }
    if (endIso < startIso) {
      dispatch({ type: "setError", error: copy.endBeforeStart })
      return
    }
    try {
      const result = calculateVacations({
        ...form,
        startDate: startIso,
        endDate: endIso,
        countryCode: countryCode as CountryCode,
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

  const onConfirmAction = (
    action: "confirm" | "salary" | "dates" | "vacations"
  ) => {
    if (action === "confirm") {
      runCalculation()
      return
    }
    dispatch({ type: "setEditMode", editMode: action })
    if (action === "salary")
      dispatch({
        type: "setEditField",
        field: "editSalary",
        value: formatCurrencyInput(String(form.monthlySalary || "")),
      })
    if (action === "dates") {
      dispatch({
        type: "setEditField",
        field: "editStartDate",
        value: form.startDate,
      })
      dispatch({
        type: "setEditField",
        field: "editEndDate",
        value: form.endDate,
      })
    }
    if (action === "vacations")
      dispatch({
        type: "setEditField",
        field: "editVacations",
        value: String(form.usedVacationDays || 0),
      })
  }

  const saveEdit = () => {
    if (
      editMode === "salary" &&
      !applyField("monthlySalary", state.editSalary)
    ) {
      dispatch({ type: "setError", error: copy.invalidData })
      return
    }
    if (
      editMode === "vacations" &&
      !applyField("usedVacationDays", state.editVacations)
    ) {
      dispatch({ type: "setError", error: copy.invalidData })
      return
    }
    if (editMode === "dates") {
      if (
        !applyField("startDate", state.editStartDate) ||
        !applyField("endDate", state.editEndDate)
      ) {
        dispatch({ type: "setError", error: copy.invalidDates })
        return
      }
    }
    dispatch({ type: "setEditMode", editMode: null })
    dispatch({ type: "setError", error: null })
  }

  const onExportPdf = async () => {
    const startIso = toIsoDate(form.startDate)
    const endIso = toIsoDate(form.endDate)
    if (!startIso || !endIso) return

    const response = await fetch("/api/vacations/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, startDate: startIso, endDate: endIso }),
    })
    if (!response.ok) return
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vacaciones-${countryCode}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleComplete = () => {
    const messages: { role: "user" | "assistant"; text: string }[] = [
      {
        role: "assistant",
        text: `Vamos a calcular tus vacaciones. ${copy.monthlySalaryQuestion(currencyLabel)}`,
      },
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
      <div className="mb-4 flex w-full items-center justify-between">
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
            style={{ width: `${(stepIndex(step) / 6) * 100}%` }}
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
              editVacations={state.editVacations}
              editStartDate={state.editStartDate}
              editEndDate={state.editEndDate}
              currencySymbol={getCurrencySymbol(countryCode)}
              onSetEditField={(field, value) =>
                dispatch({
                  type: "setEditField",
                  field: field as
                    | "editSalary"
                    | "editVacations"
                    | "editStartDate"
                    | "editEndDate",
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
          <div className="space-y-4">
            {error ? (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <IconAlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            ) : null}
            <ConfirmPanel
              form={form}
              fmt={fmt}
              copy={copy}
              onConfirmAction={onConfirmAction}
            />
          </div>
        ) : result && step === "done" ? (
          <div className="space-y-4">
            <ResultPanel
              result={result}
              fmt={fmt}
              copy={copy}
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
            <div className="w-full max-w-xl">
              <div className={step === "monthlySalary" ? "relative" : ""}>
                {step === "monthlySalary" && (
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {getCurrencySymbol(countryCode)}
                  </span>
                )}
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) =>
                    setInputValue(getFormattedInputValue(step, e.target.value))
                  }
                  inputMode={
                    step === "monthlySalary"
                      ? "decimal"
                      : step === "startDate" || step === "endDate"
                        ? "numeric"
                        : step === "usedVacationDays"
                          ? "numeric"
                          : "text"
                  }
                  placeholder={copy.askPlaceholder}
                  className={`h-12 w-full rounded-2xl border border-border bg-card text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:border-foreground/30 ${step === "monthlySalary" ? "pl-10 pr-4" : "pl-4 pr-4"}`}
                />
              </div>
            </div>
          </div>
        )}

        {step !== "welcome" && step !== "confirm" && step !== "done" && (
          <StepNavigation
            onBack={handleBack}
            onContinue={handleSubmit}
            canContinue={!!inputValue.trim()}
            showBack={step !== "monthlySalary"}
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

function ConfirmPanel({
  form,
  fmt,
  copy,
  onConfirmAction,
}: {
  form: VacationFormData
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
  onConfirmAction: (
    action: "confirm" | "salary" | "dates" | "vacations"
  ) => void
}) {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <IconReceipt className="size-4 text-primary" />
        {copy.summaryTitle}
      </div>
      <div className="grid gap-2 text-sm">
        <SummaryRow
          icon={<IconCoin className="size-4 text-muted-foreground" />}
          label={copy.salary}
          value={fmt(form.monthlySalary)}
        />
        <SummaryRow
          icon={<IconCalendar className="size-4 text-muted-foreground" />}
          label={copy.dates}
          value={`${form.startDate} -> ${form.endDate}`}
        />
        <SummaryRow
          icon={<IconBeach className="size-4 text-muted-foreground" />}
          label={copy.vacations}
          value={`${form.usedVacationDays} ${copy.daysLabel}`}
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
          <IconEdit className="size-4" />
          {copy.editSalary}
        </button>
        <button
          type="button"
          onClick={() => onConfirmAction("dates")}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <IconEdit className="size-4" />
          {copy.editDates}
        </button>
        <button
          type="button"
          onClick={() => onConfirmAction("vacations")}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <IconEdit className="size-4" />
          {copy.editVacations}
        </button>
      </div>
    </div>
  )
}

type VacationEditModeType = null | "salary" | "dates" | "vacations"

function EditPanel({
  editMode,
  editSalary,
  editVacations,
  editStartDate,
  editEndDate,
  currencySymbol,
  onSetEditField,
  onSetEditMode,
  saveEdit,
  copy,
}: {
  editMode: VacationEditModeType
  editSalary: string
  editVacations: string
  editStartDate: string
  editEndDate: string
  currencySymbol: string
  onSetEditField: (field: string, value: string) => void
  onSetEditMode: (mode: VacationEditModeType) => void
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
      ) : editMode === "vacations" ? (
        <label className="grid gap-2 text-sm">
          <span className="text-foreground">{copy.newVacationDays}</span>
          <input
            inputMode="numeric"
            value={editVacations}
            onChange={(e) =>
              onSetEditField("editVacations", formatNumberInput(e.target.value))
            }
            className="h-11 rounded-xl border border-border bg-background px-3 text-foreground outline-none focus:border-foreground/30"
          />
        </label>
      ) : editMode === "dates" ? (
        <div className="grid gap-3 text-sm">
          <label className="grid gap-1.5">
            <span className="text-foreground">{copy.startDate}</span>
            <input
              inputMode="numeric"
              pattern="[0-9/]*"
              value={editStartDate}
              onChange={(e) =>
                onSetEditField("editStartDate", formatDateInput(e.target.value))
              }
              className="h-11 rounded-xl border border-border bg-background px-3 text-foreground outline-none focus:border-foreground/30"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-foreground">{copy.endDate}</span>
            <input
              inputMode="numeric"
              pattern="[0-9/]*"
              value={editEndDate}
              onChange={(e) =>
                onSetEditField("editEndDate", formatDateInput(e.target.value))
              }
              className="h-11 rounded-xl border border-border bg-background px-3 text-foreground outline-none focus:border-foreground/30"
            />
          </label>
        </div>
      ) : null}
      <div className="mt-4 flex gap-2">
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
  result,
  fmt,
  copy,
  onRestart,
  onComplete,
  onExportPdf,
}: {
  result: ReturnType<typeof calculateVacations>
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
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
              {copy.vacationResultHeading}
            </h3>
          </div>
          <div className="rounded-xl bg-primary/10 p-2.5">
            <IconBeach className="size-5 text-primary" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {copy.amount}
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
              <p className="text-xs text-muted-foreground">
                {copy.accruedDays}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {result.accruedVacationDays} {copy.daysLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <IconBeach className="size-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{copy.usedDays}</p>
              <p className="text-sm font-semibold text-foreground">
                {result.usedVacationDays} {copy.daysLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <IconCalendar className="size-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {copy.pendingDays}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {result.pendingVacationDays} {copy.daysLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
              <IconCoin className="size-4 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {copy.dailySalary}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {fmt(result.dailySalary)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2 rounded-xl bg-muted/30 p-3">
          <div>
            <p className="text-xs text-muted-foreground">{copy.formulaLabel}</p>
            <p className="mt-0.5 font-mono text-sm text-foreground">
              {result.formula}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {copy.legalRefLabel}
            </p>
            <p className="mt-0.5 text-sm text-foreground">
              {result.legalReference}
            </p>
          </div>
        </div>
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
