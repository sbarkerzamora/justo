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
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  type Dispatch,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react"
import { ChatMarkdown } from "@/components/chat/chat-markdown"
import ShinyText from "@/components/ShinyText"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Orb, type AgentState } from "@/components/ui/orb"
import { getCountryOrbColors } from "@/lib/country-orb-colors"
import { countryList, getCountryInfo } from "@/lib/countries"
import { homeCopy } from "@/lib/home-copy"
import type { Locale } from "@/lib/i18n"
import { getLegalDocsLink } from "@/lib/legal-docs-link"
import { useChatMessages } from "@/components/chat/use-chat-messages"
import { useChatUI } from "@/components/chat/use-chat-ui"

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
    incomes: {
      label: string
      amount: number
      formula: string
      legalReference: string
    }[]
    deductions: {
      label: string
      amount: number
      formula: string
      legalReference: string
    }[]
    grossIncome: number
    totalDeductions: number
  }
}

type FlowState = {
  step: FlowStep
  editMode: EditMode
  form: SettlementForm
  result: SettlementApiResponse | null
  lastCalculation: SettlementApiResponse | null
  editSalary: string
  editVacations: string
  editStartDate: string
  editEndDate: string
}

type FlowAction =
  | { type: "resetFlow"; countryCode: string }
  | { type: "setStep"; step: FlowStep }
  | { type: "setEditMode"; editMode: EditMode }
  | { type: "setForm"; form: SettlementForm }
  | { type: "patchForm"; patch: Partial<SettlementForm> }
  | { type: "setResult"; result: SettlementApiResponse | null }
  | { type: "setLastCalculation"; result: SettlementApiResponse | null }
  | {
      type: "setEditField"
      field: "editSalary" | "editVacations" | "editStartDate" | "editEndDate"
      value: string
    }

const createInitialFlowState = (cc: string): FlowState => ({
  step: "idle",
  editMode: null,
  form: defaultForm(cc),
  result: null,
  lastCalculation: null,
  editSalary: "",
  editVacations: "",
  editStartDate: "",
  editEndDate: "",
})

const flowReducer = (state: FlowState, action: FlowAction): FlowState => {
  switch (action.type) {
    case "resetFlow":
      return createInitialFlowState(action.countryCode)
    case "setStep":
      return { ...state, step: action.step }
    case "setEditMode":
      return { ...state, editMode: action.editMode }
    case "setForm":
      return { ...state, form: action.form }
    case "patchForm":
      return { ...state, form: { ...state.form, ...action.patch } }
    case "setResult":
      return { ...state, result: action.result }
    case "setLastCalculation":
      return { ...state, lastCalculation: action.result }
    case "setEditField":
      return { ...state, [action.field]: action.value }
    default:
      return state
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

const stepLabels: Record<Locale, Record<string, string>> = {
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

const numberFormatters: Record<string, Intl.NumberFormat> = {
  NIO: new Intl.NumberFormat("es-NI", { style: "currency", currency: "NIO" }),
  USD: new Intl.NumberFormat("es-NI", { style: "currency", currency: "USD" }),
  GTQ: new Intl.NumberFormat("es-NI", { style: "currency", currency: "GTQ" }),
  HNL: new Intl.NumberFormat("es-NI", { style: "currency", currency: "HNL" }),
  CRC: new Intl.NumberFormat("es-NI", { style: "currency", currency: "CRC" }),
  MXN: new Intl.NumberFormat("es-NI", { style: "currency", currency: "MXN" }),
  COP: new Intl.NumberFormat("es-NI", { style: "currency", currency: "COP" }),
  PEN: new Intl.NumberFormat("es-NI", { style: "currency", currency: "PEN" }),
  ARS: new Intl.NumberFormat("es-NI", { style: "currency", currency: "ARS" }),
  CLP: new Intl.NumberFormat("es-NI", { style: "currency", currency: "CLP" }),
}
const money = (value: number, currencyCode?: string) =>
  (numberFormatters[currencyCode ?? "NIO"] ?? numberFormatters.NIO).format(
    value
  )

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
  return `${y.toString().padStart(4, "0")}-${mo.toString().padStart(2, "0")}-${d
    .toString()
    .padStart(2, "0")}`
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

const shouldStartGuidedFlow = (text: string, locale: Locale) => {
  const normalized = normalizeText(text)
  const es = locale === "es"
  return (
    (es && normalized.includes("iniciar calcul")) ||
    (es && normalized.includes("calculo guiado")) ||
    (es && normalized.includes("calcular mi liquidacion")) ||
    (es && normalized.includes("liquidacion completa")) ||
    (es && normalized.includes("paso a paso")) ||
    normalized.includes("start guided") ||
    normalized.includes("guided calculation") ||
    normalized.includes("calculate my settlement") ||
    normalized.includes("step by step") ||
    normalized.includes("full settlement")
  )
}

export function LlmHome({
  countryCode,
  locale,
  onChangeCountry,
  onChangeLocale,
}: {
  countryCode?: string
  locale: Locale
  onChangeCountry?: (code: string) => void
  onChangeLocale?: (locale: Locale) => void
}) {
  const cc = countryCode ?? "ni"
  const copy = homeCopy[locale]
  const info = getCountryInfo(cc)
  const countryName = info?.name ?? cc
  const currencyCode = info?.currencyCode ?? "NIO"
  const currencyLabel = info?.currencyLabel ?? "córdobas (NIO)"
  const examples =
    locale === "en"
      ? (info?.exampleQuestionsEn ?? genericEnglishExamples(countryName))
      : (info?.exampleQuestions ?? [])
  const fmt = (v: number) => money(v, currencyCode)
  const { resolvedTheme, setTheme } = useTheme()
  const {
    messages,
    setMessages,
    input,
    setInput,
    append,
    setMessageText,
    appendAssistant,
    resetMessages,
  } = useChatMessages()
  const {
    isLoading,
    isTyping,
    typingLabel,
    isStreamingReply,
    hasStreamChunk,
    setLoading,
    setTyping,
    setTypingLabel,
    setStreamingReply,
    setHasStreamChunk,
  } = useChatUI()
  const [flow, dispatch] = useReducer(flowReducer, cc, createInitialFlowState)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  const {
    step,
    editMode,
    form,
    result,
    lastCalculation,
    editSalary,
    editVacations,
    editStartDate,
    editEndDate,
  } = flow

  useEffect(() => {
    if (messages.length === 0) return
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  useEffect(() => {
    dispatch({ type: "resetFlow", countryCode: cc })
  }, [cc])

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading]
  )
  const stepIdx = useMemo(() => {
    if (step === "idle") return 0
    if (step === "done") return 8
    return Math.max(stepOrder.indexOf(step) + 1, 1)
  }, [step])
  const isCalculationMode = step !== "idle"

  const appendAssistantWithUI = (
    text: string,
    opts?: { delay?: number; phase?: string }
  ) =>
    appendAssistant(
      text,
      opts,
      () => {
        setTypingLabel(opts?.phase ?? copy.typing)
        setTyping(true)
      },
      () => setTyping(false)
    )

  const askForStep = (s: FlowStep) => {
    const map: Record<string, string> = {
      employeeName: copy.employeeNameQuestion,
      employerName: copy.employerNameQuestion,
      startDate: copy.startDateQuestion,
      endDate: copy.endDateQuestion,
      unusedVacationDays: copy.vacationDaysQuestion,
      frequency: copy.frequencyQuestion,
    }
    if (map[s]) void appendAssistantWithUI(map[s], { delay: 520 })
  }

  const startFlow = () => {
    if (isLoading) return
    resetMessages()
    dispatch({ type: "setForm", form: defaultForm(cc) })
    dispatch({ type: "setResult", result: null })
    dispatch({ type: "setEditMode", editMode: null })
    dispatch({ type: "setStep", step: "employeeName" })
    void appendAssistantWithUI(copy.guidedIntro, {
      delay: 520,
      phase: copy.flowPrepared,
    })
    askForStep("employeeName")
  }

  const resetConversation = () => {
    resetMessages()
    dispatch({ type: "setStep", step: "idle" })
    dispatch({ type: "setEditMode", editMode: null })
    setTyping(false)
    dispatch({ type: "setResult", result: null })
    focusMainInput()
  }

  const focusMainInput = () => {
    inputRef.current?.focus()
  }

  const nextStep = (s: FlowStep): FlowStep => {
    const i = stepOrder.indexOf(s)
    return stepOrder[i + 1] ?? "confirm"
  }

  const applyField = (field: keyof SettlementForm, value: string) => {
    if (field === "monthlySalary" || field === "unusedVacationDays") {
      const n = Number(value)
      if (Number.isNaN(n) || n < 0) return false
      dispatch({
        type: "patchForm",
        patch: { [field]: n } as Partial<SettlementForm>,
      })
      return true
    }
    if (field === "startDate" || field === "endDate") {
      if (!toIsoDate(value.trim())) return false
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

  const showSummary = () => {
    dispatch({ type: "setStep", step: "confirm" })
    void appendAssistantWithUI(copy.reviewSummary, {
      delay: 480,
      phase: copy.preparingConfirmation,
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
      await appendAssistantWithUI(copy.invalidDates, { delay: 480 })
      return
    }
    if (payload.endDate < payload.startDate) {
      await appendAssistantWithUI(copy.endBeforeStart, { delay: 480 })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/liquidation/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        await appendAssistantWithUI(copy.calculationFailed, {
          delay: 520,
          phase: copy.validatingData,
        })
        return
      }
      const data: SettlementApiResponse = await res.json()
      await Promise.all([
        appendAssistantWithUI(copy.dataValidated, {
          delay: 520,
          phase: copy.applyingRules,
        }),
        appendAssistantWithUI(copy.resultReady, {
          delay: 500,
          phase: copy.preparingResult,
        }),
      ])
      dispatch({ type: "setResult", result: data })
      dispatch({ type: "setLastCalculation", result: data })
      dispatch({ type: "setStep", step: "done" })
      await appendAssistantWithUI(
        copy.estimatedNet(fmt(data.result.netTotal)),
        {
          delay: 420,
          phase: "Escribiendo resultado",
        }
      )
    } finally {
      setLoading(false)
    }
  }

  const onFrequencySelect = (f: SettlementForm["frequency"]) => {
    dispatch({ type: "patchForm", patch: { frequency: f } })
    append("user", f[0].toUpperCase() + f.slice(1))
    const ns = nextStep("frequency")
    dispatch({ type: "setStep", step: ns })
    if (ns === "confirm") showSummary()
  }

  const onConfirmAction = async (
    action: "confirm" | "salary" | "dates" | "vacations"
  ) => {
    if (action === "confirm") {
      append("user", copy.confirmAndCalculate)
      await runCalculation()
      return
    }
    append(
      "user",
      action === "salary"
        ? copy.editSalary
        : action === "dates"
          ? copy.editDates
          : copy.editVacations
    )
    dispatch({
      type: "setEditMode",
      editMode:
        action === "salary"
          ? "salary"
          : action === "dates"
            ? "dates"
            : "vacations",
    })
    if (action === "salary")
      dispatch({
        type: "setEditField",
        field: "editSalary",
        value: String(form.monthlySalary || ""),
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

  const saveEdit = async () => {
    if (editMode === "salary") {
      if (!applyField("monthlySalary", editSalary)) return
    }
    if (editMode === "vacations") {
      if (!applyField("unusedVacationDays", editVacations)) return
    }
    if (editMode === "dates") {
      if (
        !applyField("startDate", editStartDate) ||
        !applyField("endDate", editEndDate)
      )
        return
    }
    dispatch({ type: "setEditMode", editMode: null })
    await appendAssistantWithUI(copy.changesApplied, { delay: 380 })
  }

  const sendLegalQuery = async (text: string) => {
    setLoading(true)
    setTypingLabel(copy.assistantThinking)
    setTyping(true)
    const docsLink = getLegalDocsLink(cc)
    const fallbackMessage = copy.fallback(docsLink)
    const assistantMessageId = crypto.randomUUID()
    let assistantMessageCreated = false

    setStreamingReply(true)
    setHasStreamChunk(false)

    const ensureAssistantMessage = () => {
      if (assistantMessageCreated) return
      assistantMessageCreated = true
      setMessages((current) => [
        ...current,
        { id: assistantMessageId, role: "assistant", text: "" },
      ])
    }

    const showAssistantMessage = (message: string) => {
      ensureAssistantMessage()
      setMessageText(assistantMessageId, message)
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", parts: [{ type: "text", text }] }],
          countryCode: cc,
        }),
      })
      if (!res.ok) {
        const errorMessage = await res
          .json()
          .then((data: { error?: unknown }) =>
            typeof data.error === "string" ? data.error : undefined
          )
          .catch(() => undefined)
        showAssistantMessage(copy.fallback(docsLink, errorMessage))
        return
      }

      if (!res.body) {
        showAssistantMessage(fallbackMessage)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let streamedText = ""
      let visibleText = ""
      let receivedChunk = false

      const revealText = async (targetText: string) => {
        ensureAssistantMessage()
        while (visibleText.length < targetText.length) {
          const remaining = targetText.length - visibleText.length
          const step = remaining > 80 ? 5 : remaining > 30 ? 3 : 2
          visibleText = targetText.slice(0, visibleText.length + step)
          setMessageText(assistantMessageId, visibleText)
          await wait(18)
        }
      }

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        if (!chunk) continue

        streamedText += chunk
        if (!receivedChunk && streamedText.trim().length > 0) {
          receivedChunk = true
          setHasStreamChunk(true)
          setTyping(false)
        }
        await revealText(streamedText)
      }

      const finalChunk = decoder.decode()
      if (finalChunk) {
        streamedText += finalChunk
        if (!receivedChunk && streamedText.trim().length > 0) {
          receivedChunk = true
          setHasStreamChunk(true)
          setTyping(false)
        }
        await revealText(streamedText)
      }

      if (!streamedText.trim()) {
        showAssistantMessage(fallbackMessage)
      }
    } catch (error) {
      showAssistantMessage(
        copy.fallback(
          docsLink,
          error instanceof Error ? error.message : undefined
        )
      )
    } finally {
      setTyping(false)
      setStreamingReply(false)
      setHasStreamChunk(false)
      setLoading(false)
    }
  }

  const backToLegalChat = async () => {
    dispatch({ type: "setStep", step: "idle" })
    dispatch({ type: "setResult", result: null })
    dispatch({ type: "setEditMode", editMode: null })
    await appendAssistantWithUI(copy.backToChat, {
      delay: 350,
      phase: copy.backToChatPhase,
    })
    focusMainInput()
  }

  const sendText = async (text: string) => {
    if (!text || isLoading) return
    append("user", text)

    if (step === "done") {
      await appendAssistantWithUI(copy.recalculateHint, { delay: 420 })
      return
    }
    if (step === "frequency" || step === "confirm") {
      await appendAssistantWithUI(copy.useInteractiveOptions, { delay: 420 })
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
        await appendAssistantWithUI(copy.invalidData, {
          delay: 420,
        })
        return
      }
      const ns = nextStep(step)
      dispatch({ type: "setStep", step: ns })
      if (ns === "confirm") showSummary()
      else if (ns === "monthlySalary") {
        void appendAssistantWithUI(copy.monthlySalaryQuestion(currencyLabel), {
          delay: 520,
        })
      } else askForStep(ns)
      return
    }

    if (shouldStartGuidedFlow(text, locale)) {
      startFlow()
      return
    }
    await sendLegalQuery(text)
  }

  const onSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput("")
    await sendText(text)
  }

  const handleExampleClick = (q: string) => {
    if (isLoading) return
    setInput("")
    void sendText(q)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
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

  const orbState: AgentState = isStreamingReply
    ? hasStreamChunk
      ? "talking"
      : "thinking"
    : isLoading
      ? isTyping
        ? "talking"
        : "thinking"
      : null
  const orbColors = getCountryOrbColors(cc)

  return (
    <LlmHomeView
      cc={cc}
      countryName={countryName}
      onChangeCountry={onChangeCountry}
      onChangeLocale={onChangeLocale}
      locale={locale}
      copy={copy}
      resetConversation={resetConversation}
      resolvedTheme={resolvedTheme}
      setTheme={setTheme}
      isCalculationMode={isCalculationMode}
      stepIdx={stepIdx}
      step={step}
      messages={messages}
      examples={examples}
      handleExampleClick={handleExampleClick}
      startFlow={startFlow}
      onFrequencySelect={onFrequencySelect}
      form={form}
      fmt={fmt}
      onConfirmAction={onConfirmAction}
      editMode={editMode}
      editSalary={editSalary}
      editVacations={editVacations}
      editStartDate={editStartDate}
      editEndDate={editEndDate}
      dispatch={dispatch}
      saveEdit={saveEdit}
      isTyping={isTyping}
      typingLabel={typingLabel}
      result={result}
      onExportPdf={onExportPdf}
      backToLegalChat={backToLegalChat}
      lastCalculation={lastCalculation}
      messagesEndRef={messagesEndRef}
      messagesContainerRef={messagesContainerRef}
      inputRef={inputRef}
      input={input}
      setInput={setInput}
      handleKeyDown={handleKeyDown}
      onSend={onSend}
      canSend={canSend}
      isLoading={isLoading}
      orbState={orbState}
      orbColors={orbColors}
    />
  )
}

const genericEnglishExamples = (countryName: string) => [
  `How much severance do I get in ${countryName}?`,
  "How is the proportional bonus calculated?",
  "Which deductions apply to my settlement?",
]

function LlmHomeView(props: {
  cc: string
  countryName: string
  locale: Locale
  copy: (typeof homeCopy)[Locale]
  onChangeCountry?: (code: string) => void
  onChangeLocale?: (locale: Locale) => void
  resetConversation: () => void
  resolvedTheme?: string
  setTheme: (theme: string) => void
  isCalculationMode: boolean
  stepIdx: number
  step: FlowStep
  messages: ChatMessage[]
  examples: string[]
  handleExampleClick: (q: string) => void
  startFlow: () => void
  onFrequencySelect: (f: SettlementForm["frequency"]) => void
  form: SettlementForm
  fmt: (v: number) => string
  onConfirmAction: (
    action: "confirm" | "salary" | "dates" | "vacations"
  ) => Promise<void>
  editMode: EditMode
  editSalary: string
  editVacations: string
  editStartDate: string
  editEndDate: string
  dispatch: Dispatch<FlowAction>
  saveEdit: () => Promise<void>
  isTyping: boolean
  typingLabel: string
  result: SettlementApiResponse | null
  onExportPdf: (payloadOverride?: SettlementForm) => Promise<void>
  backToLegalChat: () => Promise<void>
  lastCalculation: SettlementApiResponse | null
  messagesEndRef: RefObject<HTMLDivElement | null>
  messagesContainerRef: RefObject<HTMLDivElement | null>
  inputRef: RefObject<HTMLInputElement | null>
  input: string
  setInput: (value: string) => void
  handleKeyDown: (e: KeyboardEvent) => void
  onSend: () => Promise<void>
  canSend: boolean
  isLoading: boolean
  orbState: AgentState
  orbColors: [string, string]
}) {
  const {
    cc,
    countryName,
    locale,
    copy,
    onChangeCountry,
    onChangeLocale,
    resetConversation,
    resolvedTheme,
    setTheme,
    isCalculationMode,
    stepIdx,
    step,
    messages,
    examples,
    handleExampleClick,
    startFlow,
    onFrequencySelect,
    form,
    fmt,
    onConfirmAction,
    editMode,
    editSalary,
    editVacations,
    editStartDate,
    editEndDate,
    dispatch,
    saveEdit,
    isTyping,
    typingLabel,
    result,
    onExportPdf,
    backToLegalChat,
    lastCalculation,
    messagesEndRef,
    messagesContainerRef,
    inputRef,
    input,
    setInput,
    handleKeyDown,
    onSend,
    canSend,
    isLoading,
    orbState,
    orbColors,
  } = props

  return (
    <main className="mx-auto flex h-svh max-w-4xl flex-col overflow-clip px-4 md:px-8">
      <HomeHeader
        cc={cc}
        countryName={countryName}
        locale={locale}
        copy={copy}
        onChangeCountry={onChangeCountry}
        onChangeLocale={onChangeLocale}
        onReset={resetConversation}
        resolvedTheme={resolvedTheme}
        onToggleTheme={() =>
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }
      />
      <section className="flex min-h-0 flex-1 flex-col pb-28">
        {isCalculationMode ? (
          <ProgressHeader
            cc={cc}
            countryName={countryName}
            locale={locale}
            copy={copy}
            step={step}
            stepIdx={stepIdx}
          />
        ) : null}
        <div
          ref={messagesContainerRef}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto px-2 pb-4 max-sm:px-1"
        >
          {messages.length === 0 ? (
            <WelcomeEmptyState
              cc={cc}
              countryName={countryName}
              copy={copy}
              examples={examples}
              onExampleClick={handleExampleClick}
              onStartFlow={startFlow}
              isLoading={isLoading}
              orbState={orbState}
              orbColors={orbColors}
            />
          ) : null}
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                (m.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start") +
                " duration-200 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1"
              }
            >
              {m.role === "assistant" ? (
                <JustoOrbAvatar orbState={orbState} orbColors={orbColors} />
              ) : null}
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm whitespace-pre-line text-primary-foreground"
                    : "max-w-[88%] rounded-2xl border border-border bg-card px-4 py-2.5 text-sm leading-relaxed text-foreground"
                }
              >
                <ChatMarkdown text={m.text} />
              </div>
            </div>
          ))}
          {!isCalculationMode && messages.length > 0 ? (
            <StartGuidedButton onClick={startFlow} copy={copy} />
          ) : null}
          {isCalculationMode && step === "frequency" ? (
            <FrequencyPicker onSelect={onFrequencySelect} copy={copy} />
          ) : null}
          {isCalculationMode && step === "confirm" ? (
            <ConfirmPanel
              form={form}
              fmt={fmt}
              copy={copy}
              onConfirmAction={onConfirmAction}
            />
          ) : null}
          {isCalculationMode && editMode ? (
            <EditPanel
              editMode={editMode}
              editSalary={editSalary}
              editVacations={editVacations}
              editStartDate={editStartDate}
              editEndDate={editEndDate}
              dispatch={dispatch}
              saveEdit={saveEdit}
              copy={copy}
            />
          ) : null}
          {isTyping ? (
            <TypingPanel
              typingLabel={typingLabel}
              orbState={orbState}
              orbColors={orbColors}
            />
          ) : null}
          {isCalculationMode && result ? (
            <ResultPanel
              result={result}
              fmt={fmt}
              copy={copy}
              onExportPdf={onExportPdf}
              startFlow={startFlow}
              backToLegalChat={backToLegalChat}
            />
          ) : null}
          {!isCalculationMode && lastCalculation ? (
            <LastCalculationPanel
              lastCalculation={lastCalculation}
              fmt={fmt}
              copy={copy}
              onExportPdf={onExportPdf}
            />
          ) : null}
          <div ref={messagesEndRef} />
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background px-4 pt-3 shadow-lg motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-2 md:px-8">
        <Composer
          inputRef={inputRef}
          input={input}
          setInput={setInput}
          handleKeyDown={handleKeyDown}
          onSend={onSend}
          canSend={canSend}
          isLoading={isLoading}
          copy={copy}
        />
        <FooterBar copy={copy} />
      </div>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground capitalize">{value}</span>
    </div>
  )
}

function JustoOrbAvatar({
  orbState,
  orbColors,
}: {
  orbState: AgentState
  orbColors: [string, string]
}) {
  return (
    <div className="mr-2 size-8 shrink-0 overflow-hidden rounded-full border border-border bg-card shadow-sm">
      <Orb className="size-8" agentState={orbState} colors={orbColors} />
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

function ProgressHeader({
  cc,
  countryName,
  locale,
  copy,
  step,
  stepIdx,
}: {
  cc: string
  countryName: string
  locale: Locale
  copy: (typeof homeCopy)[Locale]
  step: FlowStep
  stepIdx: number
}) {
  return (
    <div className="mb-3 space-y-2 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-top-1 max-sm:mb-2">
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>{copy.progressStep(stepIdx)}</span>
        <span className="max-sm:hidden">
          {step === "done"
            ? copy.result
            : stepLabels[locale][stepOrder[stepIdx - 1]]}
        </span>
        <span className="sm:hidden">
          {step === "done" ? "OK" : locale === "en" ? `S${stepIdx}` : `P${stepIdx}`}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${(stepIdx / 8) * 100}%` }}
        />
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Image
          src={`https://flagcdn.com/w40/${cc}.png`}
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
  )
}

function StartGuidedButton({
  onClick,
  copy,
}: {
  onClick: () => void
  copy: (typeof homeCopy)[Locale]
}) {
  return (
    <div className="flex justify-center pt-1 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary hover:text-foreground"
      >
        <IconCalculator className="size-4" />
        {copy.startGuided}
      </button>
    </div>
  )
}

function FrequencyPicker({
  onSelect,
  copy,
}: {
  onSelect: (f: SettlementForm["frequency"]) => void
  copy: (typeof homeCopy)[Locale]
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        {copy.frequencyOption}
      </p>
      <div className="flex gap-2">
        {(["mensual", "quincenal", "semanal"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onSelect(f)}
            className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground capitalize transition-colors duration-200 hover:bg-accent"
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  )
}

function ConfirmPanel({
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
        <Row label={copy.vacations} value={`${form.unusedVacationDays} dias`} />
        <Row label={copy.frequency} value={form.frequency} />
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

function EditPanel({
  editMode,
  editSalary,
  editVacations,
  editStartDate,
  editEndDate,
  dispatch,
  saveEdit,
  copy,
}: {
  editMode: EditMode
  editSalary: string
  editVacations: string
  editStartDate: string
  editEndDate: string
  dispatch: Dispatch<FlowAction>
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
            onChange={(e) =>
              dispatch({
                type: "setEditField",
                field: "editSalary",
                value: e.target.value,
              })
            }
            className="h-10 rounded-xl border border-border bg-background px-3 text-foreground"
          />
        </label>
      ) : null}
      {editMode === "vacations" ? (
        <label className="grid gap-2 text-sm">
          <span className="text-foreground">{copy.newVacationDays}</span>
          <input
            inputMode="numeric"
            value={editVacations}
            onChange={(e) =>
              dispatch({
                type: "setEditField",
                field: "editVacations",
                value: e.target.value,
              })
            }
            className="h-10 rounded-xl border border-border bg-background px-3 text-foreground"
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
              onChange={(e) =>
                dispatch({
                  type: "setEditField",
                  field: "editStartDate",
                  value: e.target.value,
                })
              }
              className="h-10 rounded-xl border border-border bg-background px-3 text-foreground"
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
              onChange={(e) =>
                dispatch({
                  type: "setEditField",
                  field: "editEndDate",
                  value: e.target.value,
                })
              }
              className="h-10 rounded-xl border border-border bg-background px-3 text-foreground"
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
          onClick={() => dispatch({ type: "setEditMode", editMode: null })}
          label={copy.cancel}
        />
      </div>
    </div>
  )
}

function TypingPanel({
  typingLabel,
  orbState,
  orbColors,
}: {
  typingLabel: string
  orbState: AgentState
  orbColors: [string, string]
}) {
  return (
    <div className="flex justify-start motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <JustoOrbAvatar orbState={orbState} orbColors={orbColors} />
      <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm text-foreground">
        <IconSparkles className="size-4 shrink-0 text-primary" />
        <ShinyText
          text={typingLabel}
          speed={2}
          delay={0}
          color="var(--muted-foreground)"
          shineColor="var(--foreground)"
          spread={120}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
          disabled={false}
          className="text-xs font-medium"
        />
      </div>
    </div>
  )
}

function ResultPanel({
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
      <p className="mt-3 text-2xl font-semibold text-primary">
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
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent"
      >
        <IconDownload className="size-4" />
        {copy.downloadPdf}
      </button>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={startFlow}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity duration-200 hover:opacity-90"
        >
          {copy.calculateAgain}
        </button>
        <button
          type="button"
          onClick={() => void backToLegalChat()}
          className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent"
        >
          {copy.writeQuestion}
        </button>
      </div>
    </div>
  )
}

function LastCalculationPanel({
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
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent"
      >
        <IconDownload className="size-4" />
        {copy.downloadPdf}
      </button>
    </div>
  )
}

function Composer({
  inputRef,
  input,
  setInput,
  handleKeyDown,
  onSend,
  canSend,
  isLoading,
  copy,
}: {
  inputRef: RefObject<HTMLInputElement | null>
  input: string
  setInput: (value: string) => void
  handleKeyDown: (e: KeyboardEvent) => void
  onSend: () => Promise<void>
  canSend: boolean
  isLoading: boolean
  copy: (typeof homeCopy)[Locale]
}) {
  return (
    <div className="mx-auto flex max-w-4xl items-center gap-2 rounded-2xl border border-border bg-card px-4 shadow-sm">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={copy.askPlaceholder}
        aria-label="Mensaje de chat"
        className="min-h-10 flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <button
        type="button"
        onClick={() => void onSend()}
        disabled={!canSend}
        className="rounded-xl bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity duration-200 enabled:hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? copy.thinking : copy.send}
      </button>
    </div>
  )
}

function FooterBar({ copy }: { copy: (typeof homeCopy)[Locale] }) {
  return (
    <footer className="py-2.5 text-center text-[11px] text-muted-foreground max-sm:text-[10px]">
      <div className="mx-auto flex max-w-4xl items-center justify-center gap-1.5 px-4">
        <span>Justo</span>
        <span className="max-sm:hidden" aria-hidden="true">
          ·
        </span>
        <span className="max-sm:hidden">{copy.laborAssistant}</span>
        <span className="max-sm:hidden" aria-hidden="true">
          ·
        </span>
        <span className="max-sm:hidden">{copy.legalDisclaimer}</span>
        <span aria-hidden="true">·</span>
        <a
          href="https://stephanbarker.com"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          stephanbarker.com
        </a>
      </div>
    </footer>
  )
}

function HomeHeader({
  cc,
  countryName,
  locale,
  copy,
  onChangeCountry,
  onChangeLocale,
  onReset,
  resolvedTheme,
  onToggleTheme,
}: {
  cc: string
  countryName: string
  locale: Locale
  copy: (typeof homeCopy)[Locale]
  onChangeCountry?: (code: string) => void
  onChangeLocale?: (locale: Locale) => void
  onReset: () => void
  resolvedTheme?: string
  onToggleTheme: () => void
}) {
  return (
    <header className="sticky top-0 z-10 mx-auto mt-3 mb-4 flex w-full max-w-4xl items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-top-2 max-sm:px-3 max-sm:py-2.5">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Justo
        </Link>
        <CountrySelect
          cc={cc}
          countryName={countryName}
          onChangeCountry={onChangeCountry}
          copy={copy}
        />
      </div>
      <div className="flex items-center gap-2">
        <LanguageSelect
          locale={locale}
          onChangeLocale={onChangeLocale}
          copy={copy}
        />
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-accent max-sm:h-7 max-sm:px-2"
        >
          <span className="max-sm:hidden">{copy.newConversation}</span>
          <span className="sm:hidden">+</span>
        </button>
        <Link
          href={`/docs?country=${cc}`}
          className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-accent"
          aria-label={copy.docs}
        >
          <IconBook className="size-4" />
          {copy.docs}
        </Link>
        <a
          href="https://github.com/sbarkerzamora/justo"
          target="_blank"
          rel="noreferrer"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-accent"
          aria-label={copy.githubLabel}
        >
          <IconBrandGithub className="size-4" />
        </a>
        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-accent"
          aria-label={copy.themeLabel}
        >
          {resolvedTheme === "dark" ? (
            <IconSun className="size-4" />
          ) : (
            <IconMoon className="size-4" />
          )}
        </button>
      </div>
    </header>
  )
}

function CountrySelect({
  cc,
  countryName,
  onChangeCountry,
  copy,
}: {
  cc: string
  countryName: string
  onChangeCountry?: (code: string) => void
  copy: (typeof homeCopy)[Locale]
}) {
  return (
    <Select value={cc} onValueChange={(value) => onChangeCountry?.(value)}>
      <SelectTrigger
        aria-label={copy.countryLabel}
        className="h-7 w-auto gap-1.5 rounded-lg border-border bg-card px-2 py-1 text-[11px] font-medium text-foreground hover:bg-accent max-sm:w-8 max-sm:gap-0 max-sm:border-0 max-sm:bg-transparent max-sm:p-0 max-sm:[&_svg]:hidden"
      >
        <Image
          src={`https://flagcdn.com/w40/${cc}.png`}
          alt={countryName}
          width={16}
          height={12}
          className="h-3 w-4 rounded-[1px] border border-border object-cover sm:hidden"
        />
        <SelectValue placeholder={countryName} className="max-sm:hidden" />
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={6}
        className="rounded-xl border-border bg-background p-1 shadow-lg"
      >
        {countryList.map((c) => (
          <SelectItem
            key={c.code}
            value={c.code}
            className="rounded-lg text-foreground"
          >
            <span className="flex items-center gap-2">
              <Image
                src={`https://flagcdn.com/w40/${c.flag}.png`}
                alt={c.name}
                width={16}
                height={12}
                className="h-3 w-4.5 rounded-xs border border-border object-cover"
              />
              <span className="truncate">{c.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function LanguageSelect({
  locale,
  onChangeLocale,
  copy,
}: {
  locale: Locale
  onChangeLocale?: (locale: Locale) => void
  copy: (typeof homeCopy)[Locale]
}) {
  return (
    <Select
      value={locale}
      onValueChange={(value) => onChangeLocale?.(value as Locale)}
    >
      <SelectTrigger
        aria-label={copy.languageLabel}
        className="h-8 w-[4.4rem] rounded-lg border-border bg-card px-2 text-xs font-semibold text-foreground hover:bg-accent max-sm:w-12"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={6}
        className="rounded-xl border-border bg-background p-1 shadow-lg"
      >
        <SelectItem value="es" className="rounded-lg text-foreground">
          ES
        </SelectItem>
        <SelectItem value="en" className="rounded-lg text-foreground">
          EN
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

function WelcomeEmptyState({
  cc,
  countryName,
  copy,
  examples,
  onExampleClick,
  onStartFlow,
  isLoading,
  orbState,
  orbColors,
}: {
  cc: string
  countryName: string
  copy: (typeof homeCopy)[Locale]
  examples: string[]
  onExampleClick: (q: string) => void
  onStartFlow: () => void
  isLoading: boolean
  orbState: AgentState
  orbColors: [string, string]
}) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-8">
      <div className="flex max-w-md flex-col items-center gap-y-5 text-center duration-300 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
        <div className="size-16 overflow-hidden rounded-full border border-border bg-card shadow-sm motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
          <Orb className="size-16" agentState={orbState} colors={orbColors} />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
          <Image
            src={`https://flagcdn.com/w40/${cc}.png`}
            alt={countryName}
            width={16}
            height={12}
            className="h-3 w-4 rounded-[1px] border border-border object-cover"
          />
          {countryName}
        </div>
        <p className="text-sm leading-relaxed text-foreground motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
          {copy.welcome(countryName)}
        </p>
        <div className="space-y-2 text-left motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
          <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
            {copy.examplesHeading}
          </p>
          <div className="space-y-1.5">
            {examples.slice(0, 3).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onExampleClick(q)}
                disabled={isLoading}
                className="block w-full rounded-xl border border-border bg-card px-3 py-2 text-left text-xs text-foreground transition-colors duration-200 hover:bg-accent hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onStartFlow}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-50 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1"
        >
          <IconCalculator className="size-4" />
          {copy.startGuided}
          <IconSparkles className="size-4" />
        </button>
      </div>
    </div>
  )
}
