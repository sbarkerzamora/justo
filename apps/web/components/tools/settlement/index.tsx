"use client"

import type { ReactNode } from "react"
import { useReducer, useState, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconDownload,
  IconEdit,
  IconCalculator,
  IconBuilding,
  IconUser,
  IconCoin,
  IconCalendar,
  IconBeach,
  IconRefresh,
  IconMessageCircle,
  IconReceipt,
  IconTrendingUp,
  IconTrendingDown,
  IconFileText,
  IconAlertCircle,
} from "@tabler/icons-react"
import { calculateSettlement } from "@justo/tools"
import type { CountryCode } from "@justo/core"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"
import type { SettlementForm } from "@/components/tools/tool-types"
import type { FlowStep } from "@/components/tools/tool-types"
import {
  FrequencyPicker,
  stepOrder,
} from "@/components/tools/settlement-panels"
import {
  formatCurrencyInput,
  formatDateInput,
  formatNumberInput,
  parseCurrencyInput,
} from "@/components/tools/input-formatters"
import { StepNavigation } from "@/components/tools/step-navigation"

export type SettlementStep =
  | "welcome"
  | "employeeName"
  | "employerName"
  | "monthlySalary"
  | "startDate"
  | "endDate"
  | "unusedVacationDays"
  | "frequency"
  | "confirm"
  | "done"

type EditMode = null | "salary" | "dates" | "vacations"

interface SettlementToolState {
  step: SettlementStep
  form: SettlementForm
  result: ReturnType<typeof calculateSettlement> | null
  editMode: EditMode
  editSalary: string
  editVacations: string
  editStartDate: string
  editEndDate: string
  error: string | null
}

type Action =
  | { type: "setStep"; step: SettlementStep }
  | { type: "patchForm"; patch: Partial<SettlementForm> }
  | { type: "setResult"; result: ReturnType<typeof calculateSettlement> | null }
  | { type: "setEditMode"; editMode: EditMode }
  | { type: "setEditField"; field: "editSalary" | "editVacations" | "editStartDate" | "editEndDate"; value: string }
  | { type: "setError"; error: string | null }
  | { type: "reset"; countryCode: string }

const initialState = (cc: string): SettlementToolState => ({
  step: "welcome",
  form: {
    countryCode: cc,
    employeeName: "",
    employerName: "",
    monthlySalary: 0,
    frequency: "mensual",
    unusedVacationDays: 0,
    startDate: "",
    endDate: "",
  },
  result: null,
  editMode: null,
  editSalary: "",
  editVacations: "",
  editStartDate: "",
  editEndDate: "",
  error: null,
})

function reducer(state: SettlementToolState, action: Action): SettlementToolState {
  switch (action.type) {
    case "setStep":
      return { ...state, step: action.step }
    case "patchForm":
      return { ...state, form: { ...state.form, ...action.patch } }
    case "setResult":
      return { ...state, result: action.result }
    case "setEditMode":
      return { ...state, editMode: action.editMode }
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
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() + 1 !== mo || dt.getUTCDate() !== d)
    return null
  return `${y.toString().padStart(4, "0")}-${mo.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`
}

const stepIndex = (step: SettlementStep) => {
  if (step === "welcome") return 0
  const idx = stepOrder.indexOf(step as FlowStep)
  if (idx === -1) return 8
  return idx + 1
}

const nextStep = (s: SettlementStep): SettlementStep => {
  if (s === "welcome") return "employeeName"
  const idx = stepOrder.indexOf(s as FlowStep)
  return (stepOrder[idx + 1] ?? "confirm") as SettlementStep
}

const prevStep = (s: SettlementStep): SettlementStep | null => {
  if (s === "welcome" || s === "done") return null
  const idx = stepOrder.indexOf(s as FlowStep)
  if (idx <= 0) return "welcome"
  return stepOrder[idx - 1] as SettlementStep
}

export function SettlementTool({
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

  const askText = useCallback((s: SettlementStep) => {
    const map: Record<string, string> = {
      employeeName: copy.employeeNameQuestion,
      employerName: copy.employerNameQuestion,
      monthlySalary: copy.monthlySalaryQuestion(currencyLabel),
      startDate: copy.startDateQuestion,
      endDate: copy.endDateQuestion,
      unusedVacationDays: copy.vacationDaysQuestion,
      frequency: copy.frequencyQuestion,
    }
    return map[s] ?? ""
  }, [copy, currencyLabel])

  const applyField = (field: keyof SettlementForm, value: string): boolean => {
    if (field === "monthlySalary") {
      const n = parseCurrencyInput(value)
      if (Number.isNaN(n) || n <= 0) return false
      dispatch({ type: "patchForm", patch: { [field]: n } as Partial<SettlementForm> })
      return true
    }
    if (field === "unusedVacationDays") {
      const n = Number(value)
      if (Number.isNaN(n) || n < 0) return false
      dispatch({ type: "patchForm", patch: { [field]: n } as Partial<SettlementForm> })
      return true
    }
    if (field === "startDate" || field === "endDate") {
      const iso = toIsoDate(value.trim())
      if (!iso) return false
      dispatch({ type: "patchForm", patch: { [field]: value.trim() } as Partial<SettlementForm> })
      return true
    }
    if (field === "frequency") {
      const v = value.toLowerCase().trim()
      if (!(["mensual", "quincenal", "semanal"] as const).includes(v as SettlementForm["frequency"])) return false
      dispatch({ type: "patchForm", patch: { frequency: v as SettlementForm["frequency"] } })
      return true
    }
    const v = value.trim()
    if (v.length < 2) return false
    dispatch({ type: "patchForm", patch: { [field]: v } as Partial<SettlementForm> })
    return true
  }

  const getFormattedInputValue = (s: SettlementStep, value: string): string => {
    if (s === "monthlySalary") return formatCurrencyInput(value)
    if (s === "startDate" || s === "endDate") return formatDateInput(value)
    if (s === "unusedVacationDays") return formatNumberInput(value)
    return value
  }

  const advance = () => {
    const fieldMap: Partial<Record<SettlementStep, keyof SettlementForm>> = {
      employeeName: "employeeName",
      employerName: "employerName",
      monthlySalary: "monthlySalary",
      startDate: "startDate",
      endDate: "endDate",
      unusedVacationDays: "unusedVacationDays",
    }
    const field = fieldMap[step]
    if (!field || !applyField(field, inputValue)) {
      return false
    }
    const ns = nextStep(step)
    dispatch({ type: "setStep", step: ns })
    setInputValue("")
    return true
  }

  const handleSubmit = () => {
    if (step === "welcome" || step === "frequency" || step === "confirm" || step === "done") return
    advance()
  }

  const handleBack = () => {
    const prev = prevStep(step)
    if (prev) {
      dispatch({ type: "setStep", step: prev })
      setInputValue("")
    }
  }

  const onFrequencySelect = (f: SettlementForm["frequency"]) => {
    dispatch({ type: "patchForm", patch: { frequency: f } })
    dispatch({ type: "setStep", step: "confirm" })
  }

  const runCalculation = () => {
    const start = toIsoDate(form.startDate)
    const end = toIsoDate(form.endDate)
    if (!start || !end || end < start) return
    const payload = { ...form, startDate: start, endDate: end, countryCode: countryCode as CountryCode }
    try {
      const result = calculateSettlement(payload)
      dispatch({ type: "setResult", result })
      dispatch({ type: "setStep", step: "done" })
      dispatch({ type: "setError", error: null })
    } catch (err) {
      dispatch({ type: "setError", error: err instanceof Error ? err.message : copy.errorCalculating })
    }
  }

  const onConfirmAction = (action: "confirm" | "salary" | "dates" | "vacations") => {
    if (action === "confirm") {
      runCalculation()
      return
    }
    dispatch({ type: "setEditMode", editMode: action })
    if (action === "salary") dispatch({ type: "setEditField", field: "editSalary", value: String(form.monthlySalary || "") })
    if (action === "dates") {
      dispatch({ type: "setEditField", field: "editStartDate", value: form.startDate })
      dispatch({ type: "setEditField", field: "editEndDate", value: form.endDate })
    }
    if (action === "vacations") dispatch({ type: "setEditField", field: "editVacations", value: String(form.unusedVacationDays || 0) })
  }

  const saveEdit = () => {
    if (editMode === "salary" && !applyField("monthlySalary", state.editSalary)) return
    if (editMode === "vacations" && !applyField("unusedVacationDays", state.editVacations)) return
    if (editMode === "dates") {
      if (!applyField("startDate", state.editStartDate) || !applyField("endDate", state.editEndDate)) return
    }
    dispatch({ type: "setEditMode", editMode: null })
  }

  const onExportPdf = async () => {
    const start = toIsoDate(form.startDate)
    const end = toIsoDate(form.endDate)
    if (!start || !end) return
    const payload = { ...form, startDate: start, endDate: end }
    const response = await fetch("/api/liquidation/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!response.ok) return
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `liquidacion-${countryCode}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleComplete = () => {
    const messages: { role: "user" | "assistant"; text: string }[] = [
      { role: "assistant", text: copy.guidedIntro },
      { role: "assistant", text: copy.employeeNameQuestion },
      { role: "user", text: form.employeeName },
      { role: "assistant", text: copy.employerNameQuestion },
      { role: "user", text: form.employerName },
      { role: "assistant", text: copy.monthlySalaryQuestion(currencyLabel) },
      { role: "user", text: String(form.monthlySalary) },
      { role: "assistant", text: copy.startDateQuestion },
      { role: "user", text: form.startDate },
      { role: "assistant", text: copy.endDateQuestion },
      { role: "user", text: form.endDate },
      { role: "assistant", text: copy.vacationDaysQuestion },
      { role: "user", text: String(form.unusedVacationDays) },
      { role: "assistant", text: copy.frequencyQuestion },
      { role: "user", text: form.frequency },
    ]
    if (result) {
      messages.push(
        { role: "assistant", text: copy.reviewSummary },
        { role: "user", text: copy.confirmAndCalculate },
        { role: "assistant", text: copy.estimatedNet(fmt(result.netTotal)) }
      )
    }
    onComplete(messages)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between w-full">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
          <IconCalculator className="size-3.5 text-primary" />
          {locale === "en" ? "Settlement" : "Liquidación"}
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
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(stepIndex(step) / stepOrder.length) * 100}%` }}
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
            title={copy.settlementWelcomeTitle}
            description={copy.settlementWelcomeDescription}
            icon={<IconCalculator className="size-8 text-primary" />}
            steps={[
              { label: copy.worker },
              { label: copy.employer },
              { label: copy.salary },
              { label: copy.dates },
              { label: copy.vacations },
              { label: copy.frequency },
              { label: copy.result },
            ]}
            startLabel={copy.startButton}
            onStart={() => dispatch({ type: "setStep", step: "employeeName" })}
          />
        ) : editMode ? (
          <div className="space-y-4 overflow-y-auto">
            <EditPanelTool
              editMode={editMode}
              editSalary={state.editSalary}
              editVacations={state.editVacations}
              editStartDate={state.editStartDate}
              editEndDate={state.editEndDate}
              onSetEditField={(field, value) => dispatch({ type: "setEditField", field: field as "editSalary" | "editVacations" | "editStartDate" | "editEndDate", value })}
              onSetEditMode={(mode) => dispatch({ type: "setEditMode", editMode: mode })}
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
            <ConfirmPanelTool
              form={form}
              fmt={fmt}
              copy={copy}
              onConfirmAction={onConfirmAction}
            />
          </div>
        ) : step === "frequency" ? (
          <div className="space-y-4 overflow-y-auto">
            <FrequencyPicker onSelect={onFrequencySelect} copy={copy} />
          </div>
        ) : result && step === "done" ? (
          <div className="space-y-4 overflow-y-auto">
            <ResultPanelTool
              result={result}
              fmt={fmt}
              copy={copy}
              locale={locale}
              onExportPdf={onExportPdf}
              onRestart={() => dispatch({ type: "reset", countryCode })}
              onComplete={handleComplete}
            />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-2">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
              <p className="text-base font-medium text-foreground">{askText(step)}</p>
            </div>
            <div className="w-full max-w-xl">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(getFormattedInputValue(step, e.target.value))}
                inputMode={
                  step === "monthlySalary"
                    ? "decimal"
                    : step === "startDate" || step === "endDate"
                      ? "numeric"
                      : step === "unusedVacationDays"
                        ? "numeric"
                        : "text"
                }
                placeholder={copy.askPlaceholder}
                className="h-12 w-full rounded-2xl border border-border bg-card pl-4 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground/30"
              />
            </div>
          </div>
        )}

        {step !== "welcome" &&
          step !== "confirm" &&
          step !== "frequency" &&
          step !== "done" &&
          !editMode && (
            <StepNavigation
              onBack={handleBack}
              onContinue={handleSubmit}
              canContinue={!!inputValue.trim()}
              showBack={step !== "employeeName"}
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
      <div className="flex flex-col items-center gap-5 text-center max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          {icon}
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {steps.map((step, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
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

function ConfirmPanelTool({
  form,
  fmt,
  copy,
  onConfirmAction,
}: {
  form: SettlementForm
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
  onConfirmAction: (action: "confirm" | "salary" | "dates" | "vacations") => void
}) {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <IconReceipt className="size-4 text-primary" />
        {copy.summaryTitle}
      </div>
      <div className="grid gap-2 text-sm">
        <SummaryRow icon={<IconUser className="size-4 text-muted-foreground" />} label={copy.worker} value={form.employeeName} />
        <SummaryRow icon={<IconBuilding className="size-4 text-muted-foreground" />} label={copy.employer} value={form.employerName} />
        <SummaryRow icon={<IconCoin className="size-4 text-muted-foreground" />} label={copy.salary} value={fmt(form.monthlySalary)} />
        <SummaryRow icon={<IconCalendar className="size-4 text-muted-foreground" />} label={copy.dates} value={`${form.startDate} → ${form.endDate}`} />
        <SummaryRow icon={<IconBeach className="size-4 text-muted-foreground" />} label={copy.vacations} value={`${form.unusedVacationDays} días`} />
        <SummaryRow icon={<IconCalendar className="size-4 text-muted-foreground" />} label={copy.frequency} value={form.frequency} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => onConfirmAction("confirm")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
          <IconCheck className="size-4" /> {copy.confirmAndCalculate}
        </button>
        <button type="button" onClick={() => onConfirmAction("salary")} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
          <IconEdit className="size-4" /> {copy.editSalary}
        </button>
        <button type="button" onClick={() => onConfirmAction("dates")} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
          <IconEdit className="size-4" /> {copy.editDates}
        </button>
        <button type="button" onClick={() => onConfirmAction("vacations")} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
          <IconEdit className="size-4" /> {copy.editVacations}
        </button>
      </div>
    </div>
  )
}

function EditPanelTool({
  editMode,
  editSalary,
  editVacations,
  editStartDate,
  editEndDate,
  onSetEditField,
  onSetEditMode,
  saveEdit,
  copy,
}: {
  editMode: EditMode
  editSalary: string
  editVacations: string
  editStartDate: string
  editEndDate: string
  onSetEditField: (field: string, value: string) => void
  onSetEditMode: (mode: EditMode) => void
  saveEdit: () => void
  copy: (typeof homeCopy)[Locale]
}) {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      {editMode === "salary" ? (
        <label className="grid gap-2 text-sm">
          <span className="text-foreground">{copy.newMonthlySalary}</span>
          <input inputMode="decimal" value={editSalary} onChange={(e) => onSetEditField("editSalary", formatCurrencyInput(e.target.value))} className="h-11 rounded-xl border border-border bg-background px-3 text-foreground outline-none focus:border-foreground/30" />
        </label>
      ) : editMode === "vacations" ? (
        <label className="grid gap-2 text-sm">
          <span className="text-foreground">{copy.newVacationDays}</span>
          <input inputMode="numeric" value={editVacations} onChange={(e) => onSetEditField("editVacations", formatNumberInput(e.target.value))} className="h-11 rounded-xl border border-border bg-background px-3 text-foreground outline-none focus:border-foreground/30" />
        </label>
      ) : editMode === "dates" ? (
        <div className="grid gap-3 text-sm">
          <label className="grid gap-1.5">
            <span className="text-foreground">{copy.startDate}</span>
            <input inputMode="numeric" pattern="[0-9/]*" value={editStartDate} onChange={(e) => onSetEditField("editStartDate", formatDateInput(e.target.value))} className="h-11 rounded-xl border border-border bg-background px-3 text-foreground outline-none focus:border-foreground/30" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-foreground">{copy.endDate}</span>
            <input inputMode="numeric" pattern="[0-9/]*" value={editEndDate} onChange={(e) => onSetEditField("editEndDate", formatDateInput(e.target.value))} className="h-11 rounded-xl border border-border bg-background px-3 text-foreground outline-none focus:border-foreground/30" />
          </label>
        </div>
      ) : null}
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => saveEdit()} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90">{copy.saveChanges}</button>
        <button type="button" onClick={() => onSetEditMode(null)} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">{copy.cancel}</button>
      </div>
    </div>
  )
}

function ResultPanelTool({
  result,
  fmt,
  copy,
  locale,
  onExportPdf,
  onRestart,
  onComplete,
}: {
  result: ReturnType<typeof calculateSettlement>
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
  locale: Locale
  onExportPdf: () => Promise<void>
  onRestart: () => void
  onComplete: () => void
}) {
  return (
    <div className="w-full space-y-4 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <IconFileText className="size-3" />
              {copy.legalVersion}: {result.legalCorpusVersion}
            </div>
            <h3 className="mt-2 text-sm font-semibold text-foreground">{copy.finalResult}</h3>
          </div>
          <div className="rounded-xl bg-primary/10 p-2.5">
            <IconCalculator className="size-5 text-primary" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{copy.net}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">{fmt(result.netTotal)}</p>
        </div>

        <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <IconTrendingUp className="size-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{copy.grossIncome}</p>
              <p className="text-sm font-semibold text-foreground">{fmt(result.grossIncome)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
              <IconTrendingDown className="size-4 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{copy.deductions}</p>
              <p className="text-sm font-semibold text-foreground">{fmt(result.totalDeductions)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/30 list-none">
            <span className="flex items-center gap-2">
              <IconReceipt className="size-4 text-muted-foreground" />
              {copy.fullBreakdown}
            </span>
            <span className="text-xs text-muted-foreground">{copy.expandLabel}</span>
          </summary>
          <div className="border-t border-border p-4 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">{copy.incomesLabel}</p>
              {result.incomes.map((l: { label: string; amount: number; formula: string; legalReference: string }) => (
                <div key={l.label} className="flex items-start justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{l.label}</p>
                    <p className="text-xs text-muted-foreground">{l.formula}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-medium text-emerald-600">{fmt(l.amount)}</p>
                    <p className="text-[11px] text-muted-foreground">{l.legalReference}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-border pt-3 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-rose-600">{copy.deductions}</p>
              {result.deductions.map((l: { label: string; amount: number; formula: string; legalReference: string }) => (
                <div key={l.label} className="flex items-start justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{l.label}</p>
                    <p className="text-xs text-muted-foreground">{l.formula}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-medium text-rose-600">{fmt(l.amount)}</p>
                    <p className="text-[11px] text-muted-foreground">{l.legalReference}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void onExportPdf()} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
          <IconDownload className="size-4" /> {copy.downloadPdf}
        </button>
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
