"use client"

import {
  IconBook,
  IconBrandGithub,
  IconCalculator,
  IconCheck,
  IconDownload,
  IconEdit,
  IconMoon,
  IconSparkles,
  IconSun,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { ChatMarkdown } from "@/components/chat/chat-markdown"

type Role = "user" | "assistant"
type FlowStep =
  | "idle"
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

type ChatMessage = { id: string; role: Role; text: string }
type SettlementForm = {
  countryCode: string
  employeeName: string
  employerName: string
  monthlySalary: number
  frequency: "mensual" | "quincenal" | "semanal"
  unusedVacationDays: number
  startDate: string
  endDate: string
}
type SettlementApiResponse = {
  input: SettlementForm
  result: {
    netTotal: number
    legalCorpusVersion: string
    incomes: { label: string; amount: number; formula: string; legalReference: string }[]
    deductions: { label: string; amount: number; formula: string; legalReference: string }[]
    grossIncome: number
    totalDeductions: number
  }
}

const defaultForm = (cc: string): SettlementForm => ({
  countryCode: cc,
  employeeName: "",
  employerName: "",
  monthlySalary: 0,
  frequency: "mensual",
  unusedVacationDays: 0,
  startDate: "",
  endDate: "",
})

const stepOrder: FlowStep[] = [
  "employeeName",
  "employerName",
  "monthlySalary",
  "startDate",
  "endDate",
  "unusedVacationDays",
  "frequency",
  "confirm",
]

const stepLabels: Record<string, string> = {
  employeeName: "Nombre del trabajador",
  employerName: "Nombre del empleador",
  monthlySalary: "Salario mensual",
  startDate: "Fecha de inicio",
  endDate: "Fecha de salida",
  unusedVacationDays: "Vacaciones pendientes",
  frequency: "Frecuencia de pago",
  confirm: "Confirmar datos",
}

const uid = () => crypto.randomUUID()
const money = (value: number, currencyCode?: string) =>
  new Intl.NumberFormat("es-NI", { style: "currency", currency: currencyCode ?? "NIO" }).format(value)

const currencyConfig: Record<string, { code: string; locale: string; label: string }> = {
  ni: { code: "NIO", locale: "es-NI", label: "córdobas (NIO)" },
  gt: { code: "GTQ", locale: "es-GT", label: "quetzales (GTQ)" },
  sv: { code: "USD", locale: "es-SV", label: "dólares (USD)" },
  hn: { code: "HNL", locale: "es-HN", label: "lempiras (HNL)" },
  cr: { code: "CRC", locale: "es-CR", label: "colones (CRC)" },
  pa: { code: "USD", locale: "es-PA", label: "dólares (USD)" },
}

const toIsoDate = (displayDate: string) => {
  const m = displayDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  const d = Number(m[1])
  const mo = Number(m[2])
  const y = Number(m[3])
  const dt = new Date(Date.UTC(y, mo - 1, d))
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() + 1 !== mo || dt.getUTCDate() !== d) return null
  return `${y.toString().padStart(4, "0")}-${mo.toString().padStart(2, "0")}-${d
    .toString()
    .padStart(2, "0")}`
}

const countryLabels: Record<string, string> = {
  ni: "Nicaragua",
  sv: "El Salvador",
  gt: "Guatemala",
  hn: "Honduras",
  cr: "Costa Rica",
  pa: "Panamá",
}

export function LlmHome({ countryCode, onChangeCountry }: { countryCode?: string; onChangeCountry?: () => void }) {
  const cc = countryCode ?? "ni"
  const fmt = (v: number) => money(v, currencyConfig[cc]?.code)
  const { resolvedTheme, setTheme } = useTheme()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [step, setStep] = useState<FlowStep>("idle")
  const [editMode, setEditMode] = useState<EditMode>(null)
  const [form, setForm] = useState<SettlementForm>(defaultForm(cc))
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingLabel, setTypingLabel] = useState("Escribiendo")
  const [result, setResult] = useState<SettlementApiResponse | null>(null)
  const [lastCalculation, setLastCalculation] = useState<SettlementApiResponse | null>(null)
  const queue = useRef<Promise<void>>(Promise.resolve())

  const [editSalary, setEditSalary] = useState("")
  const [editVacations, setEditVacations] = useState("")
  const [editStartDate, setEditStartDate] = useState("")
  const [editEndDate, setEditEndDate] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading])
  const stepIdx = useMemo(() => {
    if (step === "idle") return 0
    if (step === "done") return 8
    return Math.max(stepOrder.indexOf(step) + 1, 1)
  }, [step])
  const isCalculationMode = step !== "idle"

  const append = (role: Role, text: string) => setMessages((p) => [...p, { id: uid(), role, text }])
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const appendAssistant = (text: string, opts?: { delay?: number; phase?: string }) => {
    queue.current = queue.current.then(async () => {
      setTypingLabel(opts?.phase ?? "Escribiendo")
      setIsTyping(true)
      await wait(opts?.delay ?? 500)
      setIsTyping(false)
      append("assistant", text)
    })
    return queue.current
  }

  const askForStep = (s: FlowStep) => {
    const map: Record<string, string> = {
      employeeName: "Empecemos, cual es el nombre completo del trabajador?",
      employerName: "Gracias. Cual es el nombre del empleador o empresa?",
      startDate: "Cual es la fecha de inicio laboral? Formato DD/MM/AAAA.",
      endDate: "Cual es la fecha de salida? Formato DD/MM/AAAA.",
      unusedVacationDays: "Cuantos dias de vacaciones pendientes hay?",
      frequency: "Selecciona la frecuencia de pago.",
    }
    if (map[s]) void appendAssistant(map[s], { delay: 520 })
  }

  const startFlow = () => {
    setMessages([])
    setForm(defaultForm(cc))
    setResult(null)
    setEditMode(null)
    setStep("employeeName")
    void appendAssistant("Perfecto, te guiare paso a paso para calcular tu liquidacion.", {
      delay: 520,
      phase: "Preparando guia",
    })
    askForStep("employeeName")
  }

  const resetConversation = () => {
    setMessages([])
    setInput("")
    setStep("idle")
    setEditMode(null)
    setIsTyping(false)
    setResult(null)
    focusMainInput()
  }

  const focusMainInput = () => {
    inputRef.current?.focus()
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  const nextStep = (s: FlowStep): FlowStep => {
    const i = stepOrder.indexOf(s)
    return stepOrder[i + 1] ?? "confirm"
  }

  const applyField = (field: keyof SettlementForm, value: string) => {
    if (field === "monthlySalary" || field === "unusedVacationDays") {
      const n = Number(value)
      if (Number.isNaN(n) || n < 0) return false
      setForm((p) => ({ ...p, [field]: n }))
      return true
    }
    if (field === "startDate" || field === "endDate") {
      if (!toIsoDate(value.trim())) return false
      setForm((p) => ({ ...p, [field]: value.trim() }))
      return true
    }
    if (field === "frequency") {
      const v = value.toLowerCase().trim()
      if (!(["mensual", "quincenal", "semanal"] as const).includes(v as SettlementForm["frequency"])) return false
      setForm((p) => ({ ...p, frequency: v as SettlementForm["frequency"] }))
      return true
    }
    const v = value.trim()
    if (v.length < 2) return false
    setForm((p) => ({ ...p, [field]: v }))
    return true
  }

  const showSummary = () => {
    setStep("confirm")
    void appendAssistant("Revisa los datos capturados y confirma para calcular.", {
      delay: 480,
      phase: "Preparando confirmacion",
    })
  }

  const toPayload = () => {
    const start = toIsoDate(form.startDate)
    const end = toIsoDate(form.endDate)
    if (!start || !end) return null
    return { ...form, startDate: start, endDate: end }
  }

  const runCalculation = async () => {
    const payload = toPayload()
    if (!payload) {
      await appendAssistant("Las fechas no son validas. Usa DD/MM/AAAA.", { delay: 480 })
      return
    }
    if (payload.endDate < payload.startDate) {
      await appendAssistant("La fecha de salida no puede ser menor que la fecha de inicio.", { delay: 480 })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/liquidation/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        await appendAssistant("No pude calcular con esos datos. Revisemos el resumen.", {
          delay: 520,
          phase: "Validando datos",
        })
        return
      }
      const data: SettlementApiResponse = await res.json()
      await appendAssistant("Datos validados, aplicando normativa laboral.", {
        delay: 520,
        phase: "Aplicando normativa",
      })
      await appendAssistant("Listo, preparando resultado final.", {
        delay: 500,
        phase: "Preparando resultado",
      })
      setResult(data)
      setLastCalculation(data)
      setStep("done")
      await appendAssistant(`Neto estimado: ${fmt(data.result.netTotal)}`, {
        delay: 420,
        phase: "Escribiendo resultado",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onFrequencySelect = (f: SettlementForm["frequency"]) => {
    setForm((p) => ({ ...p, frequency: f }))
    append("user", f[0].toUpperCase() + f.slice(1))
    const ns = nextStep("frequency")
    setStep(ns)
    if (ns === "confirm") showSummary()
  }

  const onConfirmAction = async (action: "confirm" | "salary" | "dates" | "vacations") => {
    if (action === "confirm") {
      append("user", "Confirmar y calcular")
      await runCalculation()
      return
    }
    append("user", action === "salary" ? "Editar salario" : action === "dates" ? "Editar fechas" : "Editar vacaciones")
    setEditMode(action === "salary" ? "salary" : action === "dates" ? "dates" : "vacations")
    if (action === "salary") setEditSalary(String(form.monthlySalary || ""))
    if (action === "dates") {
      setEditStartDate(form.startDate)
      setEditEndDate(form.endDate)
    }
    if (action === "vacations") setEditVacations(String(form.unusedVacationDays || 0))
  }

  const saveEdit = async () => {
    if (editMode === "salary") {
      if (!applyField("monthlySalary", editSalary)) return
    }
    if (editMode === "vacations") {
      if (!applyField("unusedVacationDays", editVacations)) return
    }
    if (editMode === "dates") {
      if (!applyField("startDate", editStartDate) || !applyField("endDate", editEndDate)) return
    }
    setEditMode(null)
    await appendAssistant("Cambios aplicados.", { delay: 380 })
  }

  const sendLegalQuery = async (text: string) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", parts: [{ type: "text", text }] }] }),
      })
      if (!res.ok) {
        await appendAssistant("No pude responder en este momento.", { delay: 500 })
        return
      }
      const data = await res.json()
      await appendAssistant(data.text, { delay: 0 })
    } finally {
      setIsLoading(false)
    }
  }

  const backToLegalChat = async () => {
    setStep("idle")
    setResult(null)
    setEditMode(null)
    await appendAssistant("Listo, volvimos al modo consulta. Escribe tu pregunta y te ayudo.", {
      delay: 350,
      phase: "Cambiando modo",
    })
    focusMainInput()
  }

  const onSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput("")
    append("user", text)

    if (step === "done") {
      await appendAssistant("Si deseas recalcular, pulsa Iniciar calculo nuevamente.", { delay: 420 })
      return
    }
    if (step === "frequency" || step === "confirm") {
      await appendAssistant("Usa las opciones interactivas para continuar.", { delay: 420 })
      return
    }
    if (step !== "idle") {
      const fieldMap: Partial<Record<FlowStep, keyof SettlementForm>> = {
        employeeName: "employeeName",
        employerName: "employerName",
        monthlySalary: "monthlySalary",
        startDate: "startDate",
        endDate: "endDate",
        unusedVacationDays: "unusedVacationDays",
      }
      const field = fieldMap[step]
      if (!field || !applyField(field, text)) {
        await appendAssistant("Ese dato no es valido para este paso.", { delay: 420 })
        return
      }
      const ns = nextStep(step)
      setStep(ns)
      if (ns === "confirm") showSummary()
      else if (ns === "monthlySalary") {
        void appendAssistant(
          `Cual es el salario mensual en ${currencyConfig[cc]?.label ?? "córdobas (NIO)"}?`,
          { delay: 520 },
        )
      } else askForStep(ns)
      return
    }

    const lower = text.toLowerCase()
    if (lower.includes("calcular") || lower.includes("liquidacion")) {
      startFlow()
      return
    }
    await sendLegalQuery(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void onSend()
    }
  }

  const onExportPdf = async (payloadOverride?: SettlementForm) => {
    const payload = payloadOverride ?? toPayload()
    if (!payload) return
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
    a.download = "liquidacion-nicaragua.pdf"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="mx-auto flex h-svh max-w-4xl flex-col px-4 md:px-8">
      <header className="sticky top-0 z-10 mx-auto mb-4 mt-3 flex w-full max-w-4xl items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 shadow-sm max-sm:px-3 max-sm:py-2.5">
        <a href="/" className="text-lg font-semibold tracking-tight text-foreground">Justo</a>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetConversation}
            className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-accent max-sm:h-7 max-sm:px-2"
          >
            <span className="max-sm:hidden">Nueva conversacion</span>
            <span className="sm:hidden">+</span>
          </button>
          <a
            href="/docs"
            className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-accent"
            aria-label="Ir a documentacion"
          >
            <IconBook className="size-4" />
            Docs
          </a>
          <a
            href="https://github.com/sbarkerzamora/justo"
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-accent"
            aria-label="Repositorio del proyecto en GitHub"
          >
            <IconBrandGithub className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-accent"
            aria-label="Cambiar tema"
          >
            {resolvedTheme === "dark" ? (
              <IconSun className="size-4" />
            ) : (
              <IconMoon className="size-4" />
            )}
          </button>
        </div>
      </header>

      <section className="flex flex-1 flex-col min-h-0">
        {isCalculationMode ? (
          <div className="mb-3 space-y-2 max-sm:mb-2">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Paso {stepIdx} de 8</span>
              <span className="max-sm:hidden">{step === "done" ? "Resultado" : stepLabels[stepOrder[stepIdx - 1]]}</span>
              <span className="sm:hidden">{step === "done" ? "OK" : `P${stepIdx}`}</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${(stepIdx / 8) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <img
                src={`https://flagcdn.com/w40/${cc}.png`}
                alt={countryLabels[cc] ?? cc}
                className="h-2.5 w-3.5 rounded-[1px] border border-border object-cover"
              />
              <span>
                Calculando segun legislacion de <span className="font-medium text-foreground">{countryLabels[cc] ?? cc}</span>
              </span>
              <a
                href="/docs"
                className="ml-auto underline underline-offset-2 hover:text-foreground"
              >
                Ver marco legal →
              </a>
            </div>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto min-h-0 space-y-3 px-2 pb-2 max-sm:px-1">
          {messages.length === 0 ? (
            <div className="flex min-h-[50svh] flex-col items-center justify-center gap-4 px-2 text-center">
              <div className="max-w-xl space-y-3 text-sm leading-relaxed text-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 duration-300">
                <p>
                  Hola, soy Justo. Puedes consultarme sobre la legislacion laboral de
                  Centroamerica o calcular una <strong>liquidacion laboral</strong> completa.
                </p>
                <ul className="list-disc space-y-1 pl-5 text-left text-muted-foreground">
                  <li>
                    <strong>Consulta legal</strong>: preguntame sobre derechos, prestaciones,
                    indemnizaciones y deducciones segun el pais que seleccionaste.
                  </li>
                  <li>
                    <strong>Calculo de liquidacion</strong>: completa los pasos guiados y obten
                    el desglose con formulas legales, deducciones y PDF descargable.
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={startFlow}
                className="inline-flex items-center gap-3 rounded-2xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-300 ease-out hover:translate-y-[-1px]"
              >
                <IconCalculator className="size-5" />
                Iniciar calculo
                <IconSparkles className="size-5" />
              </button>
            </div>
          ) : null}

          {messages.map((m) => (
            <div
              key={m.id}
              className={
                (m.role === "user" ? "flex justify-end" : "flex justify-start") +
                " motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 duration-200"
              }
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] whitespace-pre-line rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "max-w-[88%] rounded-2xl border border-border bg-card px-4 py-2.5 text-sm leading-relaxed text-foreground"
                }
              >
                <ChatMarkdown text={m.text} />
              </div>
            </div>
          ))}

          {isCalculationMode && step === "frequency" ? (
            <div className="rounded-2xl border border-border bg-card p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Selecciona una opcion
              </p>
              <div className="flex gap-2">
                {(["mensual", "quincenal", "semanal"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => onFrequencySelect(f)}
                    className="rounded-xl border border-border px-3 py-2 text-sm font-medium capitalize text-foreground hover:bg-accent"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {isCalculationMode && step === "confirm" ? (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">Resumen capturado</p>
              <div className="grid gap-2 text-sm">
                <Row label="Trabajador" value={form.employeeName} />
                <Row label="Empleador" value={form.employerName} />
                <Row label="Salario" value={fmt(form.monthlySalary)} />
                <Row label="Fechas" value={`${form.startDate} -> ${form.endDate}`} />
                <Row label="Vacaciones" value={`${form.unusedVacationDays} dias`} />
                <Row label="Frecuencia" value={form.frequency} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <ActionButton onClick={() => void onConfirmAction("confirm")} icon={<IconCheck className="size-4" />} label="Confirmar y calcular" primary />
                <ActionButton onClick={() => void onConfirmAction("salary")} icon={<IconEdit className="size-4" />} label="Editar salario" />
                <ActionButton onClick={() => void onConfirmAction("dates")} icon={<IconEdit className="size-4" />} label="Editar fechas" />
                <ActionButton onClick={() => void onConfirmAction("vacations")} icon={<IconEdit className="size-4" />} label="Editar vacaciones" />
              </div>
            </div>
          ) : null}

          {isCalculationMode && editMode ? (
            <div className="rounded-2xl border border-border bg-card p-4">
              {editMode === "salary" ? (
                <label className="grid gap-2 text-sm">
                  <span className="text-foreground">Nuevo salario mensual</span>
                  <input
                    inputMode="decimal"
                    value={editSalary}
                    onChange={(e) => setEditSalary(e.target.value)}
                    className="h-10 rounded-xl border border-border bg-background px-3 text-foreground"
                  />
                </label>
              ) : null}
              {editMode === "vacations" ? (
                <label className="grid gap-2 text-sm">
                  <span className="text-foreground">Nuevos dias de vacaciones</span>
                  <input
                    inputMode="numeric"
                    value={editVacations}
                    onChange={(e) => setEditVacations(e.target.value)}
                    className="h-10 rounded-xl border border-border bg-background px-3 text-foreground"
                  />
                </label>
              ) : null}
              {editMode === "dates" ? (
                <div className="grid gap-2 text-sm">
                  <label className="grid gap-1">
                    <span className="text-foreground">Fecha inicio (DD/MM/AAAA)</span>
                    <input
                      inputMode="numeric"
                      pattern="[0-9/]*"
                      enterKeyHint="next"
                      autoComplete="off"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className="h-10 rounded-xl border border-border bg-background px-3 text-foreground"
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-foreground">Fecha salida (DD/MM/AAAA)</span>
                    <input
                      inputMode="numeric"
                      pattern="[0-9/]*"
                      enterKeyHint="done"
                      autoComplete="off"
                      value={editEndDate}
                      onChange={(e) => setEditEndDate(e.target.value)}
                      className="h-10 rounded-xl border border-border bg-background px-3 text-foreground"
                    />
                  </label>
                </div>
              ) : null}
              <div className="mt-3 flex gap-2">
                <ActionButton onClick={() => void saveEdit()} label="Guardar cambios" primary />
                <ActionButton onClick={() => setEditMode(null)} label="Cancelar" />
              </div>
            </div>
          ) : null}

          {isTyping ? (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground">
                <div className="mb-1 text-xs font-medium">{typingLabel}</div>
                <div className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-primary motion-safe:animate-bounce" />
                  <span className="size-2 rounded-full bg-primary motion-safe:animate-bounce [animation-delay:120ms]" />
                  <span className="size-2 rounded-full bg-primary motion-safe:animate-bounce [animation-delay:240ms]" />
                </div>
              </div>
            </div>
          ) : null}

          {isCalculationMode && result ? (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground">Resultado final</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Version legal: {result.result.legalCorpusVersion}
              </p>
              <p className="mt-3 text-2xl font-semibold text-primary">
                Neto: {fmt(result.result.netTotal)}
              </p>
              <div className="mt-3 grid gap-2 text-sm">
                <Row label="Ingresos brutos" value={fmt(result.result.grossIncome)} />
                <Row label="Deducciones" value={fmt(result.result.totalDeductions)} />
              </div>
              <details className="mt-3 rounded-xl border border-border p-3 text-sm text-foreground">
                <summary className="cursor-pointer font-medium">Ver desglose completo</summary>
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
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
              >
                <IconDownload className="size-4" />
                Descargar PDF
              </button>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={startFlow}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Volver a calcular
                </button>
                <button
                  type="button"
                  onClick={() => void backToLegalChat()}
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
                >
                  Escribir una pregunta
                </button>
              </div>
            </div>
          ) : null}

          {!isCalculationMode && lastCalculation ? (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground">Ultimo calculo</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Version legal: {lastCalculation.result.legalCorpusVersion}
              </p>
              <p className="mt-2 text-xl font-semibold text-primary">
                Neto: {fmt(lastCalculation.result.netTotal)}
              </p>
              <button
                type="button"
                onClick={() => void onExportPdf(lastCalculation.input)}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
              >
                <IconDownload className="size-4" />
                Descargar PDF
              </button>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border pb-4 pt-3">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu consulta o responde al paso actual"
              className="min-h-10 flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => void onSend()}
              disabled={!canSend}
              className="rounded-xl bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {isLoading ? "Pensando..." : "Enviar"}
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-3 text-center text-xs text-muted-foreground max-sm:py-2 max-sm:text-[10px]">
        <div className="mb-2 flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={onChangeCountry}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-foreground hover:bg-accent"
          >
            <img
              src={`https://flagcdn.com/w40/${cc}.png`}
              alt={countryLabels[cc] ?? cc}
              className="h-2.5 w-3.5 rounded-[2px] border border-border object-cover"
            />
            {countryLabels[cc] ?? cc}
          </button>
        </div>
        <p>
          Justo &middot; Asistente laboral open source para Centroamerica &middot; La informacion
          aqui presentada no constituye asesoria legal profesional
        </p>
        <p className="mt-1">
          Desarrollado por{" "}
          <a
            href="https://stephanbarker.com"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            stephanbarker.com
          </a>
        </p>
      </footer>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize text-foreground">{value}</span>
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
          ? "inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          : "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground"
      }
    >
      {icon}
      {label}
    </button>
  )
}
