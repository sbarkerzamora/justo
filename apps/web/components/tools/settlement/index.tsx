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
  getCurrencySymbol,
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
  | "terminationCause"
  | "contractType"
  | "pensionSystem"
  | "adjustments"
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
  | {
      type: "setEditField"
      field: "editSalary" | "editVacations" | "editStartDate" | "editEndDate"
      value: string
    }
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
    terminationCause: "despido_injustificado",
    contractType: "indeterminado",
    pendingSalaryAmount: 0,
    pendingOvertimeAmount: 0,
    pendingBonusAmount: 0,
    benefitsAlreadyPaidAmount: 0,
    otherDeductionsAmount: 0,
  },
  result: null,
  editMode: null,
  editSalary: "",
  editVacations: "",
  editStartDate: "",
  editEndDate: "",
  error: null,
})

function reducer(
  state: SettlementToolState,
  action: Action
): SettlementToolState {
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
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() + 1 !== mo ||
    dt.getUTCDate() !== d
  )
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

const terminationCauseLabel = (value: string, locale: Locale) =>
  terminationCauseOptions.find((option) => option.value === value)?.[locale] ??
  value

const contractTypeLabel = (value: string, locale: Locale) =>
  contractTypeOptions.find((option) => option.value === value)?.[locale] ??
  value

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

  const askText = useCallback(
    (s: SettlementStep) => {
      const map: Record<string, string> = {
        employeeName: copy.employeeNameQuestion,
        employerName: copy.employerNameQuestion,
        monthlySalary: copy.monthlySalaryQuestion(currencyLabel),
        startDate: copy.startDateQuestion,
        endDate: copy.endDateQuestion,
        unusedVacationDays: copy.vacationDaysQuestion,
        frequency: copy.frequencyQuestion,
        terminationCause:
          locale === "en"
            ? "What is the termination cause?"
            : "¿Cuál es la causa de terminación?",
        contractType:
          locale === "en"
            ? "What type of contract is it?"
            : "¿Qué tipo de contrato es?",
        adjustments:
          locale === "en"
            ? "Any pending payments or authorized deductions?"
            : "¿Hay pagos pendientes o deducciones autorizadas?",
      }
      return map[s] ?? ""
    },
    [copy, currencyLabel, locale]
  )

  const applyField = (field: keyof SettlementForm, value: string): boolean => {
    if (field === "monthlySalary") {
      const n = parseCurrencyInput(value)
      if (Number.isNaN(n) || n <= 0) return false
      dispatch({
        type: "patchForm",
        patch: { [field]: n } as Partial<SettlementForm>,
      })
      return true
    }
    if (field === "unusedVacationDays") {
      const n = Number(value)
      if (Number.isNaN(n) || n < 0) return false
      dispatch({
        type: "patchForm",
        patch: { [field]: n } as Partial<SettlementForm>,
      })
      return true
    }
    if (field === "startDate" || field === "endDate") {
      const iso = toIsoDate(value.trim())
      if (!iso) return false
      dispatch({
        type: "patchForm",
        patch: { [field]: value.trim() } as Partial<SettlementForm>,
      })
      return true
    }
    if (field === "frequency") {
      const v = value.toLowerCase().trim()
      if (
        !(["mensual", "quincenal", "semanal"] as const).includes(
          v as SettlementForm["frequency"]
        )
      )
        return false
      dispatch({
        type: "patchForm",
        patch: { frequency: v as SettlementForm["frequency"] },
      })
      return true
    }
    const v = value.trim()
    if (v.length < 2) return false
    dispatch({
      type: "patchForm",
      patch: { [field]: v } as Partial<SettlementForm>,
    })
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
    if (step === "contractType" && countryCode === "pe") {
      dispatch({ type: "setStep", step: "pensionSystem" })
    } else {
      const ns = nextStep(step)
      dispatch({ type: "setStep", step: ns })
    }
    setInputValue("")
    return true
  }

  const handleSubmit = () => {
    if (
      step === "welcome" ||
      step === "frequency" ||
      step === "pensionSystem" ||
      step === "confirm" ||
      step === "done"
    )
      return
    advance()
  }

  const handleBack = () => {
    if (step === "pensionSystem") {
      dispatch({ type: "setStep", step: "contractType" })
      return
    }
    if (step === "adjustments" && countryCode === "pe") {
      dispatch({ type: "setStep", step: "pensionSystem" })
      return
    }
    const prev = prevStep(step)
    if (prev) {
      dispatch({ type: "setStep", step: prev })
      setInputValue("")
    }
  }

  const onFrequencySelect = (f: SettlementForm["frequency"]) => {
    dispatch({ type: "patchForm", patch: { frequency: f } })
    dispatch({ type: "setStep", step: nextStep("frequency") })
  }

  const runCalculation = () => {
    const start = toIsoDate(form.startDate)
    const end = toIsoDate(form.endDate)
    if (!start || !end || end < start) return
    const payload = {
      ...form,
      startDate: start,
      endDate: end,
      countryCode: countryCode as CountryCode,
      ...(countryCode === "pe" ? { pensionSystem: form.pensionSystem ?? "onp" } : {}),
    }
    try {
      const result = calculateSettlement(payload)
      dispatch({ type: "setResult", result })
      dispatch({ type: "setStep", step: "done" })
      dispatch({ type: "setError", error: null })
      fetch("/api/liquidation/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {})
    } catch (err) {
      dispatch({
        type: "setError",
        error: err instanceof Error ? err.message : copy.errorCalculating,
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
        value: String(form.unusedVacationDays || 0),
      })
  }

  const saveEdit = () => {
    if (editMode === "salary" && !applyField("monthlySalary", state.editSalary))
      return
    if (
      editMode === "vacations" &&
      !applyField("unusedVacationDays", state.editVacations)
    )
      return
    if (editMode === "dates") {
      if (
        !applyField("startDate", state.editStartDate) ||
        !applyField("endDate", state.editEndDate)
      )
        return
    }
    dispatch({ type: "setEditMode", editMode: null })
  }

  const onExportPdf = async () => {
    const start = toIsoDate(form.startDate)
    const end = toIsoDate(form.endDate)
    if (!start || !end) return
    const payload = {
      ...form,
      startDate: start,
      endDate: end,
      ...(countryCode === "pe" ? { pensionSystem: form.pensionSystem ?? "onp" } : {}),
    }
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
      {
        role: "assistant",
        text:
          locale === "en"
            ? "Termination cause, contract type, and final adjustments captured."
            : "Causa de terminación, tipo de contrato y ajustes finales capturados.",
      },
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
      <div className="mb-4 flex w-full items-center justify-between">
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
              { label: locale === "en" ? "Cause" : "Causa" },
              { label: locale === "en" ? "Contract" : "Contrato" },
              { label: locale === "en" ? "Adjustments" : "Ajustes" },
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
          <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto px-2">
            <div className="w-full max-w-xl space-y-4">
              {error ? (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <IconAlertCircle className="size-4 shrink-0" />
                  {error}
                </div>
              ) : null}
              <ConfirmPanelTool
                form={form}
                fmt={fmt}
                locale={locale}
                copy={copy}
                onConfirmAction={onConfirmAction}
              />
            </div>
          </div>
        ) : step === "frequency" ? (
          <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto px-2">
            <FrequencyPicker onSelect={onFrequencySelect} copy={copy} />
          </div>
        ) : step === "terminationCause" || step === "contractType" ? (
          <ChoicePanel
            step={step}
            form={form}
            locale={locale}
            onPatch={(patch) => dispatch({ type: "patchForm", patch })}
          />
        ) : step === "pensionSystem" ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-2">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
              <p className="text-base font-medium text-foreground">
                {locale === "en" ? "Pension system" : "Sistema de pensiones"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {locale === "en"
                  ? "Select your pension system"
                  : "Selecciona tu sistema de pensiones"}
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "patchForm", patch: { pensionSystem: "onp" } })}
                  className={`flex-1 rounded-xl border px-4 py-3 text-center text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none ${form.pensionSystem === "onp" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-accent"}`}
                >
                  <div className="font-medium">ONP</div>
                  <div className="mt-0.5 text-xs opacity-70">13%</div>
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "patchForm", patch: { pensionSystem: "afp" } })}
                  className={`flex-1 rounded-xl border px-4 py-3 text-center text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none ${form.pensionSystem === "afp" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-accent"}`}
                >
                  <div className="font-medium">AFP</div>
                  <div className="mt-0.5 text-xs opacity-70">11.2%</div>
                </button>
              </div>
            </div>
          </div>
        ) : step === "adjustments" ? (
          <SettlementAdjustmentsPanel
            cc={countryCode}
            form={form}
            locale={locale}
            onPatch={(patch) => dispatch({ type: "patchForm", patch })}
          />
        ) : result && step === "done" ? (
          <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto px-2">
            <div className="w-full max-w-xl space-y-4">
              <ResultPanelTool
                result={result}
                fmt={fmt}
                copy={copy}
                onExportPdf={onExportPdf}
                onRestart={() => dispatch({ type: "reset", countryCode })}
                onComplete={handleComplete}
              />
            </div>
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
                        : step === "unusedVacationDays"
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

        {step !== "welcome" &&
          step !== "confirm" &&
          step !== "frequency" &&
          step !== "terminationCause" &&
          step !== "contractType" &&
          step !== "pensionSystem" &&
          step !== "adjustments" &&
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
        {(step === "terminationCause" || step === "contractType") &&
          !editMode && (
            <StepNavigation
              onBack={handleBack}
              onContinue={() => {
                if (step === "contractType" && countryCode === "pe") {
                  dispatch({ type: "setStep", step: "pensionSystem" })
                } else {
                  dispatch({ type: "setStep", step: nextStep(step) })
                }
              }}
              canContinue
              showBack
              backLabel={copy.backToPrevious}
              continueLabel={copy.send}
            />
          )}
        {step === "pensionSystem" && !editMode && (
          <StepNavigation
            onBack={handleBack}
            onContinue={() =>
              dispatch({ type: "setStep", step: "adjustments" })
            }
            canContinue={!!form.pensionSystem}
            showBack
            backLabel={copy.backToPrevious}
            continueLabel={copy.send}
          />
        )}
        {step === "adjustments" && !editMode && (
          <StepNavigation
            onBack={handleBack}
            onContinue={() =>
              dispatch({ type: "setStep", step: nextStep(step) })
            }
            canContinue
            showBack
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

function ChoicePanel({
  step,
  form,
  locale,
  onPatch,
}: {
  step: "terminationCause" | "contractType"
  form: SettlementForm
  locale: Locale
  onPatch: (patch: Partial<SettlementForm>) => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-2">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
        <p className="text-base font-medium text-foreground">
          {step === "terminationCause"
            ? locale === "en"
              ? "What is the termination cause?"
              : "¿Cuál es la causa de terminación?"
            : locale === "en"
              ? "What type of contract is it?"
              : "¿Qué tipo de contrato es?"}
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {step === "terminationCause"
            ? terminationCauseOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onPatch({ terminationCause: option.value })}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none ${form.terminationCause === option.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-accent"}`}
                >
                  {option[locale]}
                </button>
              ))
            : contractTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onPatch({ contractType: option.value })}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none ${form.contractType === option.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-accent"}`}
                >
                  {option[locale]}
                </button>
              ))}
        </div>
      </div>
    </div>
  )
}

function SettlementAdjustmentsPanel({
  cc,
  form,
  locale,
  onPatch,
}: {
  cc: string
  form: SettlementForm
  locale: Locale
  onPatch: (patch: Partial<SettlementForm>) => void
}) {
  const fields: {
    key: keyof Pick<
      SettlementForm,
      | "pendingSalaryAmount"
      | "pendingOvertimeAmount"
      | "pendingBonusAmount"
      | "benefitsAlreadyPaidAmount"
      | "otherDeductionsAmount"
    >
    label: string
    shortLabel: string
    kind: "income" | "deduction"
  }[] = [
    {
      key: "pendingSalaryAmount",
      label:
        locale === "en"
          ? "Additional pending salary"
          : "Salario pendiente adicional",
      shortLabel: locale === "en" ? "Salary" : "Salario",
      kind: "income",
    },
    {
      key: "pendingOvertimeAmount",
      label:
        locale === "en"
          ? "Pending overtime/commissions"
          : "Horas extra/comisiones pendientes",
      shortLabel: locale === "en" ? "Overtime" : "Extras",
      kind: "income",
    },
    {
      key: "pendingBonusAmount",
      label:
        locale === "en"
          ? "Additional pending benefits"
          : "Prestaciones pendientes adicionales",
      shortLabel: locale === "en" ? "Benefits" : "Prestaciones",
      kind: "income",
    },
    {
      key: "benefitsAlreadyPaidAmount",
      label:
        locale === "en" ? "Benefits already paid" : "Prestaciones ya pagadas",
      shortLabel: locale === "en" ? "Already paid" : "Ya pagado",
      kind: "deduction",
    },
    {
      key: "otherDeductionsAmount",
      label:
        locale === "en"
          ? "Other authorized deductions"
          : "Otras deducciones autorizadas",
      shortLabel: locale === "en" ? "Deductions" : "Deducciones",
      kind: "deduction",
    },
  ]

  return (
    <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-2 pb-4 sm:pb-2">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-4 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1 sm:p-6">
        <div className="flex items-start gap-2.5">
          <div className="rounded-lg bg-primary/10 p-1.5 sm:rounded-xl sm:p-2">
            <IconReceipt className="size-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground sm:text-base">
              {locale === "en" ? "Final adjustments" : "Ajustes finales"}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-muted-foreground/80 sm:text-sm">
              {locale === "en"
                ? "Optional payroll-backed amounts. Leave zero if they do not apply."
                : "Montos opcionales con soporte de planilla. Deja cero si no aplican."}
            </p>
          </div>
        </div>
        <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-background/60 sm:mt-5">
          {fields.map((field) => (
            <label
              key={field.key}
              className="flex min-h-[54px] items-center gap-3 px-3 py-2 text-sm"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground sm:hidden">
                  {field.shortLabel}
                </span>
                <span className="max-sm:hidden font-medium text-foreground sm:block">
                  {field.label}
                </span>
                <span
                  className={`mt-0.5 inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium ${field.kind === "income" ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"}`}
                >
                  {field.kind === "income"
                    ? locale === "en"
                      ? "adds"
                      : "suma"
                    : locale === "en"
                      ? "deducts"
                      : "resta"}
                </span>
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {getCurrencySymbol(cc)}
                </span>
                <input
                  inputMode="decimal"
                  value={formatCurrencyInput(String(form[field.key] ?? 0))}
                  onChange={(event) => {
                    const amount = parseCurrencyInput(event.target.value)
                    onPatch({
                      [field.key]: Number.isNaN(amount) ? 0 : amount,
                    } as Partial<SettlementForm>)
                  }}
                  aria-label={field.label}
                  className="h-10 w-28 shrink-0 rounded-xl border border-border bg-background pl-7 pr-3 text-right text-sm text-foreground outline-none focus:border-foreground/30 sm:w-40 sm:text-left"
                />
              </div>
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs leading-snug text-muted-foreground">
          {locale === "en"
            ? "Positive rows add to income; deduction rows subtract from the net total."
            : "Las filas de suma aumentan ingresos; las de resta reducen el neto."}
        </p>
      </div>
    </div>
  )
}

function ConfirmPanelTool({
  form,
  fmt,
  locale,
  copy,
  onConfirmAction,
}: {
  form: SettlementForm
  fmt: (v: number) => string
  locale: Locale
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
          icon={<IconUser className="size-4 text-muted-foreground" />}
          label={copy.worker}
          value={form.employeeName}
        />
        <SummaryRow
          icon={<IconBuilding className="size-4 text-muted-foreground" />}
          label={copy.employer}
          value={form.employerName}
        />
        <SummaryRow
          icon={<IconCoin className="size-4 text-muted-foreground" />}
          label={copy.salary}
          value={fmt(form.monthlySalary)}
        />
        <SummaryRow
          icon={<IconCalendar className="size-4 text-muted-foreground" />}
          label={copy.dates}
          value={`${form.startDate} → ${form.endDate}`}
        />
        <SummaryRow
          icon={<IconBeach className="size-4 text-muted-foreground" />}
          label={copy.vacations}
          value={`${form.unusedVacationDays} días`}
        />
        <SummaryRow
          icon={<IconCalendar className="size-4 text-muted-foreground" />}
          label={copy.frequency}
          value={form.frequency}
        />
        <SummaryRow
          icon={<IconFileText className="size-4 text-muted-foreground" />}
          label={locale === "en" ? "Termination cause" : "Causa de terminación"}
          value={terminationCauseLabel(form.terminationCause, locale)}
        />
        <SummaryRow
          icon={<IconFileText className="size-4 text-muted-foreground" />}
          label={locale === "en" ? "Contract type" : "Tipo de contrato"}
          value={contractTypeLabel(form.contractType, locale)}
        />
        <SummaryRow
          icon={<IconReceipt className="size-4 text-muted-foreground" />}
          label={locale === "en" ? "Final adjustments" : "Ajustes finales"}
          value={fmt(
            (form.pendingSalaryAmount ?? 0) +
              (form.pendingOvertimeAmount ?? 0) +
              (form.pendingBonusAmount ?? 0) -
              (form.benefitsAlreadyPaidAmount ?? 0) -
              (form.otherDeductionsAmount ?? 0)
          )}
        />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onConfirmAction("confirm")}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          <IconCheck className="size-4" /> {copy.confirmAndCalculate}
        </button>
        <button
          type="button"
          onClick={() => onConfirmAction("salary")}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <IconEdit className="size-4" /> {copy.editSalary}
        </button>
        <button
          type="button"
          onClick={() => onConfirmAction("dates")}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <IconEdit className="size-4" /> {copy.editDates}
        </button>
        <button
          type="button"
          onClick={() => onConfirmAction("vacations")}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
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
  currencySymbol,
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
  currencySymbol: string
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
          onClick={() => saveEdit()}
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

function ResultPanelTool({
  result,
  fmt,
  copy,
  onExportPdf,
  onRestart,
  onComplete,
}: {
  result: ReturnType<typeof calculateSettlement>
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
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
            <h3 className="mt-2 text-sm font-semibold text-foreground">
              {copy.finalResult}
            </h3>
          </div>
          <div className="rounded-xl bg-primary/10 p-2.5">
            <IconCalculator className="size-5 text-primary" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {copy.net}
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {fmt(result.netTotal)}
          </p>
        </div>

        <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <IconTrendingUp className="size-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {copy.grossIncome}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {fmt(result.grossIncome)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
              <IconTrendingDown className="size-4 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{copy.deductions}</p>
              <p className="text-sm font-semibold text-foreground">
                {fmt(result.totalDeductions)}
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
              <p className="text-xs font-medium tracking-wider text-emerald-600 uppercase">
                {copy.incomesLabel}
              </p>
              {result.incomes.map(
                (l: {
                  label: string
                  amount: number
                  formula: string
                  legalReference: string
                }) => (
                  <div
                    key={l.label}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{l.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {l.formula}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-medium text-emerald-600">
                        {fmt(l.amount)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {l.legalReference}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="space-y-2 border-t border-dashed border-border pt-3">
              <p className="text-xs font-medium tracking-wider text-rose-600 uppercase">
                {copy.deductions}
              </p>
              {result.deductions.map(
                (l: {
                  label: string
                  amount: number
                  formula: string
                  legalReference: string
                }) => (
                  <div
                    key={l.label}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{l.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {l.formula}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-medium text-rose-600">
                        {fmt(l.amount)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {l.legalReference}
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
