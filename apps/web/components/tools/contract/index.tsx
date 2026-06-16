"use client"

import type { ReactNode } from "react"
import { useReducer, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  IconArrowLeft,
  IconArrowRight,
  IconCoins,
  IconMessageCircle,
  IconRefresh,
  IconFileDescription,
  IconReceipt,
  IconUser,
  IconBuilding,
  IconBriefcase,
  IconClock,
  IconCalendarEvent,
  IconMapPin,
  IconDownload,
  IconAlertCircle,
  IconFileText,
} from "@tabler/icons-react"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"
import { contractCopy } from "@/components/tools/contract/contract-copy"
import type { ContractFormData } from "@/components/tools/tool-types"
import {
  formatCurrencyInput,
  formatDateInput,
  parseCurrencyInput,
} from "@/components/tools/input-formatters"

export type ContractStep =
  | "welcome"
  | "workerInfo"
  | "employerInfo"
  | "jobInfo"
  | "contractType"
  | "salary"
  | "confirm"
  | "done"

interface ContractToolState {
  step: ContractStep
  form: ContractFormData
  error: string | null
}

type Action =
  | { type: "setStep"; step: ContractStep }
  | { type: "patchForm"; patch: Partial<ContractFormData> }
  | { type: "setError"; error: string | null }
  | { type: "reset"; countryCode: string }

const initialState = (cc: string): ContractToolState => ({
  step: "welcome",
  form: {
    countryCode: cc,
    celebrationPlace: "",
    workerName: "",
    workerId: "",
    workerAddress: "",
    employerName: "",
    employerId: "",
    employerRepresentative: "",
    employerAddress: "",
    jobTitle: "",
    jobDescription: "",
    workLocation: "",
    jornada: "diurna",
    contractType: "indeterminado",
    startDate: "",
    endDate: "",
    monthlySalary: 0,
    paymentFrequency: "mensual",
    paymentMethod: "unidad_tiempo",
  },
  error: null,
})

function reducer(
  state: ContractToolState,
  action: Action,
): ContractToolState {
  switch (action.type) {
    case "setStep":
      return { ...state, step: action.step, error: null }
    case "patchForm":
      return { ...state, form: { ...state.form, ...action.patch } }
    case "setError":
      return { ...state, error: action.error }
    case "reset":
      return initialState(action.countryCode)
    default:
      return state
  }
}

const toIsoDate = (d: string) => {
  const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  const dt = new Date(Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1])))
  if (
    dt.getUTCFullYear() !== Number(m[3]) ||
    dt.getUTCMonth() + 1 !== Number(m[2]) ||
    dt.getUTCDate() !== Number(m[1])
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

const stepOrder: ContractStep[] = [
  "welcome",
  "workerInfo",
  "employerInfo",
  "jobInfo",
  "contractType",
  "salary",
  "confirm",
  "done",
]

const prevStep = (s: ContractStep): ContractStep | null => {
  const idx = stepOrder.indexOf(s)
  return idx > 1 ? stepOrder[idx - 1] : null
}

const nextStep = (s: ContractStep): ContractStep | null => {
  const idx = stepOrder.indexOf(s)
  return idx >= 0 && idx < stepOrder.length - 1 ? stepOrder[idx + 1] : null
}

const inputSteps: ContractStep[] = [
  "workerInfo",
  "employerInfo",
  "jobInfo",
  "contractType",
  "salary",
]

const validInputSteps = new Set(inputSteps)

const stepIndex = (s: ContractStep) => {
  if (s === "welcome") return 0
  const idx = inputSteps.indexOf(s)
  return idx >= 0 ? idx + 1 : inputSteps.length + 1
}

const totalSteps = inputSteps.length

type Dispatch = React.Dispatch<Action>

const jornadaOptions = [
  { value: "diurna" as const, label: "Diurna" },
  { value: "mixta" as const, label: "Mixta" },
  { value: "nocturna" as const, label: "Nocturna" },
]

const contractTypeOptions = [
  { value: "indeterminado" as const, label: "Tiempo indeterminado" },
  { value: "plazo_fijo" as const, label: "Plazo fijo" },
  { value: "obra_determinada" as const, label: "Obra determinada" },
]

const paymentFreqOptions = [
  { value: "mensual" as const, label: "Mensual" },
  { value: "quincenal" as const, label: "Quincenal" },
  { value: "semanal" as const, label: "Semanal" },
]

const paymentMethodOptions = [
  { value: "unidad_tiempo" as const, label: "Por unidad de tiempo" },
  { value: "destajo" as const, label: "Por destajo" },
  { value: "comision" as const, label: "Por comisión" },
  { value: "otro" as const, label: "Otra forma" },
]

const normalizeContractPayload = (form: ContractFormData) => {
  const payload: ContractFormData = {
    ...form,
    celebrationPlace: form.celebrationPlace.trim(),
    workerName: form.workerName.trim(),
    workerId: form.workerId.trim(),
    workerAddress: form.workerAddress.trim(),
    employerName: form.employerName.trim(),
    employerId: form.employerId.trim(),
    employerRepresentative: form.employerRepresentative.trim(),
    employerAddress: form.employerAddress.trim(),
    jobTitle: form.jobTitle.trim(),
    jobDescription: form.jobDescription.trim(),
    workLocation: form.workLocation.trim(),
    monthlySalary: Number(form.monthlySalary),
  }

  if (payload.contractType !== "plazo_fijo" || !payload.endDate?.trim()) {
    delete payload.endDate
  }

  if (!Number.isInteger(payload.trialPeriodDays)) {
    delete payload.trialPeriodDays
  }

  return payload
}

export function ContractTool({
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
  const c = contractCopy[locale === "en" ? "en" : "es"]
  const [state, dispatch] = useReducer(reducer, countryCode, initialState)
  const { step, form, error } = state

  const setField = (
    key: keyof ContractFormData,
    value: string | number | undefined,
  ) => {
    dispatch({
      type: "patchForm",
      patch: { [key]: value } as Partial<ContractFormData>,
    })
  }

  const advance = () => {
    const next = nextStep(step)
    if (next) dispatch({ type: "setStep", step: next })
  }

  const goBack = () => {
    const prev = prevStep(step)
    if (prev) dispatch({ type: "setStep", step: prev })
  }

  const generateContract = () => {
    dispatch({ type: "setStep", step: "done" })
  }

  const onExportPdf = async () => {
    dispatch({ type: "setError", error: null })
    const response = await fetch("/api/contract/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizeContractPayload(form)),
    })
    if (!response.ok) {
      const data = await response.json().catch(() => null)
      const details = Array.isArray(data?.issues)
        ? data.issues.map((issue: { path?: string }) => issue.path).filter(Boolean).join(", ")
        : ""
      dispatch({
        type: "setError",
        error: details
          ? c.errorPdfDetail(details)
          : data?.error ?? c.errorPdf,
      })
      return
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contrato-laboral-${countryCode}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleComplete = () => {
    onComplete([
      {
        role: "assistant",
        text: c.welcomeMessage,
      },
      { role: "user", text: c.welcomeStart },
    ])
  }

  const stepTitle = () => c.stepTitle[step] ?? ""

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
          <IconFileDescription className="size-3.5 text-primary" />
          {c.badge}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          {c.back}
        </button>
      </div>

      <div className="mb-3 w-full space-y-2 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-top-1 max-sm:mb-2">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {step === "done"
              ? ""
              : step === "confirm"
                ? copy.summaryTitle
                : `${copy.progressStep(stepIndex(step))}`}
          </span>
          <span className="max-sm:hidden">{stepTitle()}</span>
        </div>
        {step !== "welcome" && step !== "done" && (
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${
                  (stepIndex(step) / totalSteps) * 100
                }%`,
              }}
            />
          </div>
        )}
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
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
        {error && validInputSteps.has(step) && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in">
            <IconAlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}

        {step === "welcome" ? (
          <OnboardingPanel
            title={copy.contractWelcomeTitle}
            description={copy.contractWelcomeDescription}
            icon={<IconFileDescription className="size-8 text-primary" />}
            steps={[
              { label: "Trabajador" },
              { label: "Empleador" },
              { label: "Puesto" },
              { label: "Contrato" },
              { label: "Salario" },
            ]}
            startLabel={copy.startButton}
            onStart={() => dispatch({ type: "setStep", step: "workerInfo" })}
          />
        ) : step === "workerInfo" ? (
          <MultiFieldInput
            title={c.stepTitle.workerInfo}
            fields={[
              { key: "workerName", label: c.field.workerName, placeholder: c.placeholder.workerName },
              { key: "workerId", label: c.field.workerId, placeholder: c.placeholder.workerId },
              { key: "workerAddress", label: c.field.workerAddress, placeholder: c.placeholder.workerAddress },
            ]}
            form={form}
            onFieldChange={setField}
            onNext={advance}
            onBack={goBack}
            c={c}
          />
        ) : step === "employerInfo" ? (
          <MultiFieldInput
            title={c.stepTitle.employerInfo}
            fields={[
              { key: "employerName", label: c.field.employerName, placeholder: c.placeholder.employerName },
              { key: "employerId", label: c.field.employerRuc, placeholder: c.placeholder.employerRuc },
              { key: "employerRepresentative", label: c.field.employerRep, placeholder: c.placeholder.employerRep },
              { key: "employerAddress", label: c.field.employerAddress, placeholder: c.placeholder.employerAddress },
            ]}
            form={form}
            onFieldChange={setField}
            onNext={advance}
            onBack={goBack}
            c={c}
          />
        ) : step === "jobInfo" ? (
          <JobInfoStep
            form={form}
            onFieldChange={setField}
            onNext={advance}
            onBack={goBack}
            c={c}
          />
        ) : step === "contractType" ? (
          <ContractTypeStep
            form={form}
            onFieldChange={setField}
            onNext={advance}
            onBack={goBack}
            dispatch={dispatch}
            c={c}
          />
        ) : step === "salary" ? (
          <SalaryStep
            form={form}
            onFieldChange={setField}
            onNext={advance}
            onBack={goBack}
            currencyLabel={currencyLabel}
            dispatch={dispatch}
            c={c}
          />
        ) : step === "confirm" ? (
          <div className="max-w-xl mx-auto space-y-4 overflow-y-auto motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
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
                <SectionBlock icon={<IconUser />} label={c.confirm.workerSection}>
                  <DetailRow label={c.confirm.name} value={form.workerName} />
                  <DetailRow label={c.confirm.id} value={form.workerId} />
                  <DetailRow label={c.confirm.address} value={form.workerAddress} />
                </SectionBlock>
                <SectionBlock icon={<IconBuilding />} label={c.confirm.employerSection}>
                  <DetailRow label={c.confirm.legalName} value={form.employerName} />
                  <DetailRow label={c.confirm.ruc} value={form.employerId} />
                  <DetailRow
                    label={c.confirm.representative}
                    value={form.employerRepresentative}
                  />
                  <DetailRow label={c.confirm.address} value={form.employerAddress} />
                </SectionBlock>
                <SectionBlock icon={<IconBriefcase />} label={c.confirm.jobSection}>
                  <DetailRow label={c.confirm.title} value={form.jobTitle} />
                  <DetailRow label={c.confirm.functions} value={form.jobDescription} />
                  <DetailRow label={c.confirm.place} value={form.workLocation} />
                  <DetailRow
                    label={c.confirm.schedule}
                    value={
                      jornadaOptions.find((o) => o.value === form.jornada)
                        ?.label ?? form.jornada
                    }
                  />
                </SectionBlock>
                <SectionBlock icon={<IconCalendarEvent />} label={c.confirm.contractSection}>
                  <DetailRow
                    label={c.confirm.type}
                    value={
                      contractTypeOptions.find(
                        (o) => o.value === form.contractType,
                      )?.label ?? form.contractType
                    }
                  />
                  <DetailRow
                    label={c.confirm.start}
                    value={displayDate(form.startDate)}
                  />
                  {form.contractType === "plazo_fijo" && (
                    <DetailRow
                      label={c.confirm.end}
                      value={displayDate(form.endDate ?? "")}
                    />
                  )}
                </SectionBlock>
                <SectionBlock icon={<IconCoins />} label={c.confirm.salarySection}>
                  <DetailRow
                    label={c.confirm.monthlyAmount}
                    value={fmt(form.monthlySalary)}
                  />
                  <DetailRow
                    label={c.confirm.frequency}
                    value={
                      paymentFreqOptions.find(
                        (o) => o.value === form.paymentFrequency,
                      )?.label ?? form.paymentFrequency
                    }
                  />
                  <DetailRow
                    label={c.confirm.method}
                    value={
                      paymentMethodOptions.find(
                        (o) => o.value === form.paymentMethod,
                      )?.label ?? form.paymentMethod
                    }
                  />
                </SectionBlock>
                {form.celebrationPlace && (
                  <SectionBlock icon={<IconMapPin />} label={c.confirm.celebration}>
                    <DetailRow
                      label={c.confirm.place}
                      value={form.celebrationPlace}
                    />
                  </SectionBlock>
                )}
                {form.trialPeriodDays && (
                  <SectionBlock icon={<IconClock />} label={c.confirm.trialPeriod}>
                    <DetailRow
                      label={c.confirm.days}
                      value={`${form.trialPeriodDays} ${c.confirm.days.toLowerCase()}`}
                    />
                  </SectionBlock>
                )}
              </div>
              <button
                type="button"
                onClick={generateContract}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                <IconFileDescription className="size-4" />
                {c.done.generate}
                <IconArrowRight className="size-4" />
              </button>
            </div>
          </div>
        ) : step === "done" ? (
          <div className="w-full max-w-xl mx-auto space-y-4 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <IconAlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <IconFileText className="size-3" />
                    {copy.legalVersion}: ni-v0.3.0
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-foreground">
                    {c.done.heading}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {c.done.subtitle}{" "}
                    {form.workerName} - {form.employerName}
                  </p>
                </div>
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <IconFileDescription className="size-5 text-primary" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void onExportPdf()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                <IconDownload className="size-4" /> {copy.downloadPdf}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "reset", countryCode })}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <IconRefresh className="size-4" /> {copy.calculateAgain}
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <IconMessageCircle className="size-4" /> {copy.backToChat}
              </button>
            </div>
          </div>
        ) : null}
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
    <div className="flex h-full flex-col items-center justify-center gap-6 px-2 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
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
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground"
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
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          {startLabel}
          <IconArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function SectionBlock({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground">
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  )
}

function MultiFieldInput({
  title,
  fields,
  form,
  onFieldChange,
  onNext,
  onBack,
  c,
}: {
  title: string
  fields: { key: keyof ContractFormData; label: string; placeholder: string }[]
  form: ContractFormData
  onFieldChange: (key: keyof ContractFormData, value: string) => void
  onNext: () => void
  onBack: () => void
  c: typeof contractCopy["es"] | typeof contractCopy["en"]
}) {
  const allFilled = fields.every((f) => (form[f.key] as string)?.trim())

  return (
    <div className="max-w-xl mx-auto space-y-4 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-foreground">{title}</p>
        <div className="space-y-3">
          {fields.map((f) => (
            <LabelledInput
              key={f.key}
              label={f.label}
              value={form[f.key] as string}
              onChange={(v) => onFieldChange(f.key, v)}
              placeholder={f.placeholder}
            />
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 z-10 flex items-center gap-3 border-t border-border bg-background p-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <IconArrowLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!allFilled}
          className="flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity disabled:opacity-40 hover:opacity-90"
        >
          {c.continue}
          <IconArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function LabelledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30"
      />
    </div>
  )
}

function ChipGroup<T extends string>({
  options,
  selected,
  onChange,
  label,
}: {
  options: { value: T; label: string }[]
  selected: T
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`min-h-[44px] min-w-[44px] rounded-xl px-3.5 py-2 text-xs font-medium transition-colors ${
              selected === opt.value
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:border-foreground/20"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function JobInfoStep({
  form,
  onFieldChange,
  onNext,
  onBack,
  c,
}: {
  form: ContractFormData
  onFieldChange: (k: keyof ContractFormData, v: string) => void
  onNext: () => void
  onBack: () => void
  c: typeof contractCopy["es"]
}) {
  const canContinue = form.jobTitle && form.jobDescription && form.workLocation

  return (
    <div className="max-w-xl mx-auto space-y-4 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-foreground">
          {c.stepTitle.jobInfo}
        </p>
        <div className="space-y-3">
          <LabelledInput
            label={c.field.positionTitle}
            value={form.jobTitle}
            onChange={(v) => onFieldChange("jobTitle", v)}
            placeholder={c.placeholder.positionTitle}
          />
          <LabelledInput
            label={c.field.positionDescription}
            value={form.jobDescription}
            onChange={(v) => onFieldChange("jobDescription", v)}
            placeholder={c.placeholder.positionDescription}
          />
          <LabelledInput
            label={c.field.workplace}
            value={form.workLocation}
            onChange={(v) => onFieldChange("workLocation", v)}
            placeholder={c.placeholder.workplace}
          />
          <ChipGroup
            label={c.field.schedule}
            options={jornadaOptions}
            selected={form.jornada}
            onChange={(v) => onFieldChange("jornada", v)}
          />
        </div>
      </div>
      <div className="sticky bottom-0 z-10 flex items-center gap-3 border-t border-border bg-background p-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <IconArrowLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity disabled:opacity-40 hover:opacity-90"
        >
          {c.continue}
          <IconArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function ContractTypeStep({
  form,
  onFieldChange,
  onNext,
  onBack,
  dispatch,
  c,
}: {
  form: ContractFormData
  onFieldChange: (k: keyof ContractFormData, v: string | number | undefined) => void
  onNext: () => void
  onBack: () => void
  dispatch: Dispatch
  c: typeof contractCopy["es"]
}) {
  const [localStart, setLocalStart] = useState(() => displayDate(form.startDate))
  const [localEnd, setLocalEnd] = useState(() => displayDate(form.endDate ?? ""))
  const [localTrial, setLocalTrial] = useState(() =>
    form.trialPeriodDays ? String(form.trialPeriodDays) : "",
  )

  const commitAndNext = () => {
    const isoStart = toIsoDate(localStart)
    if (!isoStart) {
      dispatch({ type: "setError", error: c.error.invalidStartDate })
      return
    }

    const patch: Partial<ContractFormData> = { startDate: isoStart }

    if (form.contractType === "plazo_fijo") {
      if (!localEnd.trim()) {
        dispatch({ type: "setError", error: c.error.missingEndDate })
        return
      }
      const isoEnd = toIsoDate(localEnd)
      if (!isoEnd) {
        dispatch({ type: "setError", error: c.error.invalidEndDate })
        return
      }
      if (isoEnd <= isoStart) {
        dispatch({ type: "setError", error: c.error.endBeforeStart })
        return
      }
      patch.endDate = isoEnd
    } else {
      patch.endDate = undefined
    }

    if (localTrial) {
      const days = parseInt(localTrial, 10)
      patch.trialPeriodDays = days >= 1 && days <= 30 ? days : undefined
    } else {
      patch.trialPeriodDays = undefined
    }

    dispatch({ type: "patchForm", patch })
    onNext()
  }

  return (
    <div className="max-w-xl mx-auto space-y-4 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-foreground">
          {c.stepTitle.contractType}
        </p>
        <div className="space-y-3">
          <ChipGroup
            label={c.field.contractType}
            options={contractTypeOptions}
            selected={form.contractType}
            onChange={(v) => onFieldChange("contractType", v)}
          />
          <DateInput
            label={c.field.startDate}
            value={localStart}
            onChange={setLocalStart}
            c={c}
          />
          {form.contractType === "plazo_fijo" && (
            <DateInput
              label={c.field.endDate}
              value={localEnd}
              onChange={setLocalEnd}
              c={c}
            />
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {c.field.trialPeriod}
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={localTrial}
              onChange={(e) => {
                const v = e.target.value
                setLocalTrial(v)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  commitAndNext()
                }
              }}
              placeholder="Ej. 30"
              className="h-11 w-full max-w-28 rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30"
            />
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 z-10 flex items-center gap-3 border-t border-border bg-background p-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <IconArrowLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={commitAndNext}
          disabled={!localStart}
          className="flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity disabled:opacity-40 hover:opacity-90"
        >
          {c.continue}
          <IconArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function DateInput({
  label,
  value,
  onChange,
  c,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  c: typeof contractCopy["es"]
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label} {c.dateFormatLabel}
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(formatDateInput(e.target.value))}
        placeholder={c.dateFormatHint}
        maxLength={10}
        className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30"
      />
    </div>
  )
}

function SalaryStep({
  form,
  onFieldChange,
  onNext,
  onBack,
  currencyLabel,
  dispatch,
  c,
}: {
  form: ContractFormData
  onFieldChange: (k: keyof ContractFormData, v: string | number | undefined) => void
  onNext: () => void
  onBack: () => void
  currencyLabel: string
  dispatch: Dispatch
  c: typeof contractCopy["es"]
}) {
  const [salaryDisplay, setSalaryDisplay] = useState(() =>
    form.monthlySalary ? String(form.monthlySalary) : "",
  )
  const [celebrationLocal, setCelebrationLocal] = useState(
    form.celebrationPlace,
  )

  const commitAndNext = () => {
    const salary = parseCurrencyInput(salaryDisplay)
    if (!Number.isFinite(salary) || salary <= 0) {
      dispatch({ type: "setError", error: c.error.invalidSalary })
      return
    }
    if (!celebrationLocal.trim()) {
      dispatch({ type: "setError", error: c.error.missingCelebrationPlace })
      return
    }
    dispatch({
      type: "patchForm",
      patch: {
        monthlySalary: salary,
        celebrationPlace: celebrationLocal.trim(),
      },
    })
    onNext()
  }

  return (
    <div className="max-w-xl mx-auto space-y-4 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-foreground">
          {c.stepTitle.salary}
        </p>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {c.field.monthlySalaryCurrency(currencyLabel)}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={salaryDisplay}
              onChange={(e) => setSalaryDisplay(formatCurrencyInput(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  commitAndNext()
                }
              }}
              placeholder={c.placeholder.monthlySalary}
        className="h-12 w-full rounded-2xl border border-border bg-card pl-4 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30"
            />
          </div>
          <ChipGroup
            label={c.field.paymentFrequency}
            options={paymentFreqOptions}
            selected={form.paymentFrequency}
            onChange={(v) => onFieldChange("paymentFrequency", v)}
          />
          <ChipGroup
            label={c.field.paymentMethod}
            options={paymentMethodOptions}
            selected={form.paymentMethod}
            onChange={(v) => onFieldChange("paymentMethod", v)}
          />
          <LabelledInput
            label={c.field.celebrationPlace}
            value={celebrationLocal}
            onChange={setCelebrationLocal}
            placeholder={c.placeholder.celebrationPlace}
          />
        </div>
      </div>
      <div className="sticky bottom-0 z-10 flex items-center gap-3 border-t border-border bg-background p-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <IconArrowLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={commitAndNext}
          disabled={!salaryDisplay || !celebrationLocal.trim()}
          className="flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity disabled:opacity-40 hover:opacity-90"
        >
          {c.continue}
          <IconArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
