import Image from "next/image"
import Link from "next/link"
import { type ReactNode } from "react"
import {
  IconCheck,
  IconDownload,
  IconEdit,
} from "@tabler/icons-react"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"
import { stepOrder } from "./tool-types"
import type { SettlementForm, SettlementApiResponse, EditMode, FlowStep } from "./tool-types"

export { stepOrder }

export const stepLabels: Record<Locale, Record<string, string>> = {
  es: {
    employeeName: "Nombre del trabajador",
    employerName: "Nombre del empleador",
    monthlySalary: "Salario mensual",
    startDate: "Fecha de inicio",
    endDate: "Fecha de salida",
    unusedVacationDays: "Vacaciones pendientes",
    frequency: "Frecuencia de pago",
    confirm: "Confirmar datos",
  },
  en: {
    employeeName: "Worker name",
    employerName: "Employer name",
    monthlySalary: "Monthly salary",
    startDate: "Start date",
    endDate: "Exit date",
    unusedVacationDays: "Pending vacation days",
    frequency: "Payment frequency",
    confirm: "Confirm information",
  },
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground capitalize">{value}</span>
    </div>
  )
}

function ActionButton({
  onClick,
  label,
  icon,
  primary = false,
}: {
  onClick: () => void
  label: string
  icon?: ReactNode
  primary?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        primary
          ? "inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground min-h-[44px]"
          : "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground min-h-[44px]"
      }
    >
      {icon}
      {label}
    </button>
  )
}

export function FrequencyPicker({
  onSelect,
  copy,
}: {
  onSelect: (f: SettlementForm["frequency"]) => void
  copy: (typeof homeCopy)[Locale]
}) {
  const freqLabels: Record<string, string> = {
    mensual: copy.monthly,
    quincenal: copy.biweekly,
    semanal: copy.weekly,
  }
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
            className="rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-accent min-h-[44px] min-w-[44px]"
          >
            {freqLabels[f]}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ConfirmPanel({
  form,
  fmt,
  copy,
  onConfirmAction,
}: {
  form: SettlementForm
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
  onConfirmAction: (
    action: "confirm" | "salary" | "dates" | "vacations"
  ) => Promise<void>
}) {
  const freqLabel = (v: string) => {
    const map: Record<string, string> = { mensual: copy.monthly, quincenal: copy.biweekly, semanal: copy.weekly }
    return map[v] ?? v
  }
  return (
    <div className="rounded-2xl border border-border bg-card p-4 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <p className="mb-3 text-sm font-semibold text-foreground">
        {copy.summaryTitle}
      </p>
      <div className="grid gap-2 text-sm">
        <Row label={copy.worker} value={form.employeeName} />
        <Row label={copy.employer} value={form.employerName} />
        <Row label={copy.salary} value={fmt(form.monthlySalary)} />
        <Row
          label={copy.dates}
          value={`${form.startDate} -> ${form.endDate}`}
        />
        <Row label={copy.vacations} value={`${form.unusedVacationDays} ${copy.daysLabel}`} />
        <Row label={copy.frequency} value={freqLabel(form.frequency)} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton
          onClick={() => void onConfirmAction("confirm")}
          icon={<IconCheck className="size-4" />}
          label={copy.confirmAndCalculate}
          primary
        />
        <ActionButton
          onClick={() => void onConfirmAction("salary")}
          icon={<IconEdit className="size-4" />}
          label={copy.editSalary}
        />
        <ActionButton
          onClick={() => void onConfirmAction("dates")}
          icon={<IconEdit className="size-4" />}
          label={copy.editDates}
        />
        <ActionButton
          onClick={() => void onConfirmAction("vacations")}
          icon={<IconEdit className="size-4" />}
          label={copy.editVacations}
        />
      </div>
    </div>
  )
}

export function EditPanel({
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
  saveEdit: () => Promise<void>
  copy: (typeof homeCopy)[Locale]
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      {editMode === "salary" ? (
        <label className="grid gap-2 text-sm">
          <span className="text-foreground">{copy.newMonthlySalary}</span>
          <input
            inputMode="decimal"
            value={editSalary}
            onChange={(e) => onSetEditField("editSalary", e.target.value)}
            className="h-11 rounded-xl border border-border bg-background px-3 text-foreground"
          />
        </label>
      ) : null}
      {editMode === "vacations" ? (
        <label className="grid gap-2 text-sm">
          <span className="text-foreground">{copy.newVacationDays}</span>
          <input
            inputMode="numeric"
            value={editVacations}
            onChange={(e) => onSetEditField("editVacations", e.target.value)}
            className="h-11 rounded-xl border border-border bg-background px-3 text-foreground"
          />
        </label>
      ) : null}
      {editMode === "dates" ? (
        <div className="grid gap-2 text-sm">
          <label className="grid gap-1">
            <span className="text-foreground">{copy.startDate}</span>
            <input
              inputMode="numeric"
              pattern="[0-9/]*"
              enterKeyHint="next"
              autoComplete="off"
              value={editStartDate}
              onChange={(e) => onSetEditField("editStartDate", e.target.value)}
              className="h-11 rounded-xl border border-border bg-background px-3 text-foreground"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-foreground">{copy.endDate}</span>
            <input
              inputMode="numeric"
              pattern="[0-9/]*"
              enterKeyHint="done"
              autoComplete="off"
              value={editEndDate}
              onChange={(e) => onSetEditField("editEndDate", e.target.value)}
              className="h-11 rounded-xl border border-border bg-background px-3 text-foreground"
            />
          </label>
        </div>
      ) : null}
      <div className="mt-3 flex gap-2">
        <ActionButton
          onClick={() => void saveEdit()}
          label={copy.saveChanges}
          primary
        />
        <ActionButton
          onClick={() => onSetEditMode(null)}
          label={copy.cancel}
        />
      </div>
    </div>
  )
}

export function ResultPanel({
  result,
  fmt,
  copy,
  onExportPdf,
  startFlow,
  backToLegalChat,
}: {
  result: SettlementApiResponse
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
  onExportPdf: (payloadOverride?: SettlementForm) => Promise<void>
  startFlow: () => void
  backToLegalChat: () => Promise<void>
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <p className="text-sm font-semibold text-foreground">
        {copy.finalResult}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {copy.legalVersion}: {result.result.legalCorpusVersion}
      </p>
      <p className="mt-3 text-3xl font-bold text-primary">
        {copy.net}: {fmt(result.result.netTotal)}
      </p>
      <div className="mt-3 grid gap-2 text-sm">
        <Row label={copy.grossIncome} value={fmt(result.result.grossIncome)} />
        <Row
          label={copy.deductions}
          value={fmt(result.result.totalDeductions)}
        />
      </div>
      <details className="mt-3 rounded-xl border border-border p-3 text-sm text-foreground">
        <summary className="cursor-pointer font-medium">
          {copy.fullBreakdown}
        </summary>
        <div className="mt-2 space-y-2">
          {result.result.incomes.map((l) => (
            <p key={l.label}>
              + {l.label}: {fmt(l.amount)} | {l.formula} | {l.legalReference}
            </p>
          ))}
          {result.result.deductions.map((l) => (
            <p key={l.label}>
              - {l.label}: {fmt(l.amount)} | {l.formula} | {l.legalReference}
            </p>
          ))}
        </div>
      </details>
      <button
        type="button"
        onClick={() => void onExportPdf()}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent min-h-[44px]"
      >
        <IconDownload className="size-4" />
        {copy.downloadPdf}
      </button>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={startFlow}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity duration-200 hover:opacity-90 min-h-[44px]"
        >
          {copy.calculateAgain}
        </button>
        <button
          type="button"
          onClick={() => void backToLegalChat()}
          className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent min-h-[44px]"
        >
          {copy.writeQuestion}
        </button>
      </div>
    </div>
  )
}

export function LastCalculationPanel({
  lastCalculation,
  fmt,
  onExportPdf,
  copy,
}: {
  lastCalculation: SettlementApiResponse
  fmt: (v: number) => string
  onExportPdf: (payloadOverride?: SettlementForm) => Promise<void>
  copy: (typeof homeCopy)[Locale]
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <p className="text-sm font-semibold text-foreground">
        {copy.lastCalculation}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {copy.legalVersion}: {lastCalculation.result.legalCorpusVersion}
      </p>
      <p className="mt-2 text-xl font-semibold text-primary">
        {copy.net}: {fmt(lastCalculation.result.netTotal)}
      </p>
      <button
        type="button"
        onClick={() => void onExportPdf(lastCalculation.input)}
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent min-h-[44px]"
      >
        <IconDownload className="size-4" />
        {copy.downloadPdf}
      </button>
    </div>
  )
}
