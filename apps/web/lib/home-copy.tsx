import type { Locale } from "@/lib/i18n"
import type { ReactNode } from "react"

type HomeCopy = {
  preparing: string
  newConversation: string
  docs: string
  githubLabel: string
  themeLabel: string
  countryLabel: string
  languageLabel: string
  askPlaceholder: string
  send: string
  searching: string
  thinking: string
  assistantThinking: string
  typing: string
  typingMessages: string[]
  legalDisclaimer: string
  laborAssistant: string
  welcome: (countryName: string) => ReactNode
  examplesHeading: string
  startGuided: string
  progressStep: (step: number) => string
  result: string
  calculatingUnder: (countryName: string) => ReactNode
  legalDocs: string
  frequencyOption: string
  summaryTitle: string
  worker: string
  employer: string
  salary: string
  dates: string
  vacations: string
  frequency: string
  confirmAndCalculate: string
  editSalary: string
  editDates: string
  editVacations: string
  newMonthlySalary: string
  newVacationDays: string
  startDate: string
  endDate: string
  saveChanges: string
  cancel: string
  finalResult: string
  lastCalculation: string
  legalVersion: string
  net: string
  grossIncome: string
  deductions: string
  fullBreakdown: string
  downloadPdf: string
  calculateAgain: string
  writeQuestion: string
  guidedIntro: string
  flowPrepared: string
  employeeNameQuestion: string
  employerNameQuestion: string
  startDateQuestion: string
  endDateQuestion: string
  vacationDaysQuestion: string
  frequencyQuestion: string
  monthlySalaryQuestion: (currencyLabel: string) => string
  invalidData: string
  invalidDates: string
  endBeforeStart: string
  reviewSummary: string
  preparingConfirmation: string
  calculationFailed: string
  validatingData: string
  dataValidated: string
  applyingRules: string
  preparingResult: string
  resultReady: string
  estimatedNet: (value: string) => string
  changesApplied: string
  backToChat: string
  backToChatPhase: string
  useInteractiveOptions: string
  recalculateHint: string
  fallbackReason: string
  fallback: (docsLink: string, errorMessage?: string) => string
  settlementWelcomeTitle: string
  settlementWelcomeDescription: string
  vacationsWelcomeTitle: string
  vacationsWelcomeDescription: string
  bonusWelcomeTitle: string
  bonusWelcomeDescription: string
  terminationWelcomeTitle: string
  terminationWelcomeDescription: string
  contractWelcomeTitle: string
  contractWelcomeDescription: string
  salaryNetWelcomeTitle: string
  salaryNetWelcomeDescription: string
  preavisoWelcomeTitle: string
  preavisoWelcomeDescription: string
  grossSalary: string
  netResult: string
  netPerPeriod: string
  monthly: string
  biweekly: string
  weekly: string
  startButton: string
  hrCtaTitle: string
  hrCtaDescription: string
  hrCtaBadge: string
  backToPrevious: string
  resultHeading: string
  incomesLabel: string
  expandLabel: string
  daysLabel: string
  amount: string
  accruedDays: string
  usedDays: string
  pendingDays: string
  dailySalary: string
  formulaLabel: string
  legalRefLabel: string
  corpusVersion: string
  deductionRate: string
  netSalaryHeading: string
  bonusHeading: string
  terminationHeading: string
  estimatedBonus: string
  breakdownLabel: string
  scenarioFallback: string
  tenureSubtitle: (years: number) => string
  pensionSystem: string
  errorCalculating: string
  monthlyNetResult: string
  vacationResultHeading: string
}

export const homeCopy: Record<Locale, HomeCopy> = {
  es: {
    preparing: "Preparando Justo...",
    newConversation: "Nueva conversacion",
    docs: "Docs",
    githubLabel: "Repositorio del proyecto en GitHub",
    themeLabel: "Cambiar tema",
    countryLabel: "Cambiar pais",
    languageLabel: "Cambiar idioma",
    askPlaceholder: "Escribe tu consulta o responde al paso actual",
    send: "Enviar",
    searching: "Buscando...",
    thinking: "Pensando...",
    assistantThinking: "Justo esta pensando",
    typing: "Escribiendo",
    typingMessages: [
      "Interrogando al Codigo de Trabajo...",
      "Consultando con los jueces laborales...",
      "Revisando el expediente...",
      "Invocando el espiritu de la ley laboral...",
      "Puliendo los articulos legales...",
      "Descifrando jerigonza juridica...",
      "Sacando punta al lapiz legal...",
      "Ajustando corbata y toga...",
      "Buscando en el archivo muerto...",
      "Contando vacaciones una por una...",
      "Calculando el aguinaldo con carino...",
      "Midieron el cafe de la oficina...",
      "Consultando el oraculo laboral...",
      "Aceitando los engranajes legales...",
      "Cotejando con el libro gordo...",
      "Preguntandole a un abogado imaginario...",
      "Haciendo malabares con las formulas...",
      "Traduciendo de legal a humano...",
      "Buscando el articulo perdido...",
      "Sacando la calculadora de bolsillo...",
    ],
    legalDisclaimer: "No constituye asesoria legal profesional",
    laborAssistant: "Asistente laboral",
    welcome: (countryName) => (
      <>
        Hola, soy <strong>Justo</strong>. Preguntame sobre tus derechos
        laborales segun la legislacion de <strong>{countryName}</strong>.
      </>
    ),
    examplesHeading: "Ejemplos de preguntas:",
    startGuided: "Iniciar calculo guiado",
    progressStep: (step) => `Paso ${step} de 8`,
    result: "Resultado",
    calculatingUnder: (countryName) => (
      <>
        Calculando segun legislacion de{" "}
        <span className="font-medium text-foreground">{countryName}</span>
      </>
    ),
    legalDocs: "Ver marco legal ->",
    frequencyOption: "Selecciona una opcion",
    summaryTitle: "Resumen capturado",
    worker: "Trabajador",
    employer: "Empleador",
    salary: "Salario",
    dates: "Fechas",
    vacations: "Vacaciones",
    frequency: "Frecuencia",
    confirmAndCalculate: "Confirmar y calcular",
    editSalary: "Editar salario",
    editDates: "Editar fechas",
    editVacations: "Editar vacaciones",
    newMonthlySalary: "Nuevo salario mensual",
    newVacationDays: "Nuevos dias de vacaciones",
    startDate: "Fecha inicio (DD/MM/AAAA)",
    endDate: "Fecha salida (DD/MM/AAAA)",
    saveChanges: "Guardar cambios",
    cancel: "Cancelar",
    finalResult: "Resultado final",
    lastCalculation: "Ultimo calculo",
    legalVersion: "Version legal",
    net: "Neto",
    grossIncome: "Ingresos brutos",
    deductions: "Deducciones",
    fullBreakdown: "Ver desglose completo",
    downloadPdf: "Descargar PDF",
    calculateAgain: "Volver a calcular",
    writeQuestion: "Escribir una pregunta",
    guidedIntro:
      "Perfecto, te guiare paso a paso para calcular tu liquidacion.",
    flowPrepared: "Preparando guia",
    employeeNameQuestion:
      "Empecemos, cual es el nombre completo del trabajador?",
    employerNameQuestion: "Gracias. Cual es el nombre del empleador o empresa?",
    startDateQuestion:
      "Cual es la fecha de inicio laboral? Formato DD/MM/AAAA.",
    endDateQuestion: "Cual es la fecha de salida? Formato DD/MM/AAAA.",
    vacationDaysQuestion: "Cuantos dias de vacaciones pendientes hay?",
    frequencyQuestion: "Selecciona la frecuencia de pago.",
    monthlySalaryQuestion: (currencyLabel) =>
      `Cual es el salario mensual en ${currencyLabel}?`,
    invalidData: "Ese dato no es valido para este paso.",
    invalidDates: "Las fechas no son validas. Usa DD/MM/AAAA.",
    endBeforeStart:
      "La fecha de salida no puede ser menor que la fecha de inicio.",
    reviewSummary: "Revisa los datos capturados y confirma para calcular.",
    preparingConfirmation: "Preparando confirmacion",
    calculationFailed: "No pude calcular con esos datos. Revisemos el resumen.",
    validatingData: "Validando datos",
    dataValidated: "Datos validados, aplicando normativa laboral.",
    applyingRules: "Aplicando normativa",
    preparingResult: "Preparando resultado",
    resultReady: "Listo, preparando resultado final.",
    estimatedNet: (value) => `Neto estimado: ${value}`,
    changesApplied: "Cambios aplicados.",
    backToChat:
      "Listo, volvimos al modo consulta. Escribe tu pregunta y te ayudo.",
    backToChatPhase: "Cambiando modo",
    useInteractiveOptions: "Usa las opciones interactivas para continuar.",
    recalculateHint: "Si deseas recalcular, pulsa Iniciar calculo nuevamente.",
    fallbackReason: "El proveedor de IA no completo la respuesta.",
    fallback: (docsLink, errorMessage) => {
      const reason = errorMessage
        ? `Detalle: ${errorMessage}`
        : "El proveedor de IA no completo la respuesta."
      return `${reason}\n\nPuedo seguir ayudandote. Intenta de nuevo en un momento o revisa el marco legal aqui: [Abrir documentacion](${docsLink})`
    },
    settlementWelcomeTitle: "Calculadora de liquidación",
    settlementWelcomeDescription: "Calcula tu liquidación laboral con fórmulas transparentes y referencias legales. Te guiaremos paso a paso.",
    vacationsWelcomeTitle: "Calculadora de vacaciones",
    vacationsWelcomeDescription: "Calcula el monto de tus vacaciones acumuladas con fórmulas claras y trazabilidad legal.",
    bonusWelcomeTitle: "Calculadora de aguinaldo / décimo / bono",
    bonusWelcomeDescription: "Calcula montos proporcionales de aguinaldo, décimo, bono 14, prima, SAC o gratificaciones según tu país, con fórmulas transparentes y referencias legales.",
    terminationWelcomeTitle: "Simulador de terminación",
    terminationWelcomeDescription: "Compara escenarios de renuncia, despido justificado, despido injustificado y mutuo acuerdo. Incluye indemnización, preaviso y prima de antigüedad según tu país.",
    contractWelcomeTitle: "Generador de contratos",
    contractWelcomeDescription: "Genera un contrato individual de trabajo listo para imprimir y firmar. Captura datos del trabajador, empleador, puesto, jornada, duración y salario según la Ley 185 de Nicaragua.",
    salaryNetWelcomeTitle: "Calculadora de salario neto",
    salaryNetWelcomeDescription: "Calcula tu salario neto después de deducciones legales (INSS, IR, ISSS, AFP, etc.) con fórmulas transparentes.",
    preavisoWelcomeTitle: "Calculadora de preaviso laboral",
    preavisoWelcomeDescription: "Calculá los días de preaviso y la indemnización sustitutiva según la antigüedad del trabajador y la legislación aplicable.",
    grossSalary: "Salario bruto",
    netResult: "Salario neto",
    netPerPeriod: "Salario neto por período",
    monthly: "Mensual",
    biweekly: "Quincenal",
    weekly: "Semanal",
    startButton: "Comenzar",
    hrCtaTitle: "Justo para RRHH",
    hrCtaDescription: "Herramientas avanzadas para gestión de talento, nómina y cumplimiento laboral.",
    hrCtaBadge: "Próximamente",
    backToPrevious: "← Anterior",
    resultHeading: "Resultado",
    incomesLabel: "Ingresos",
    expandLabel: "Ver",
    daysLabel: "días",
    amount: "Monto",
    accruedDays: "Días acumulados",
    usedDays: "Días gozados",
    pendingDays: "Días pendientes",
    dailySalary: "Salario diario",
    formulaLabel: "Fórmula",
    legalRefLabel: "Referencia legal",
    corpusVersion: "Corpus",
    deductionRate: "Tasa de deducción",
    netSalaryHeading: "Resultado de salario neto",
    bonusHeading: "Resultado de aguinaldo",
    terminationHeading: "Comparación de escenarios",
    estimatedBonus: "Aguinaldo estimado",
    breakdownLabel: "Desglose",
    scenarioFallback: "No aplica para este caso.",
    tenureSubtitle: (years) => `Basado en ${years} años de antigüedad`,
    pensionSystem: "Sistema de pensiones",
    errorCalculating: "Error al calcular",
    monthlyNetResult: "Salario neto mensual",
    vacationResultHeading: "Resultado de vacaciones",
  },
  en: {
    preparing: "Preparing Justo...",
    newConversation: "New conversation",
    docs: "Docs",
    githubLabel: "Project repository on GitHub",
    themeLabel: "Change theme",
    countryLabel: "Change country",
    languageLabel: "Change language",
    askPlaceholder: "Ask a question or answer the current step",
    send: "Send",
    searching: "Searching...",
    thinking: "Thinking...",
    assistantThinking: "Justo is thinking",
    typing: "Writing",
    typingMessages: [
      "Grilling the Labor Code...",
      "Consulting the labor judges...",
      "Reviewing the case file...",
      "Summoning the spirit of labor law...",
      "Polishing the legal articles...",
      "Deciphering legal jargon...",
      "Sharpening the legal pencil...",
      "Adjusting tie and robe...",
      "Digging through the archives...",
      "Counting vacations one by one...",
      "Calculating bonuses with care...",
      "Measuring the office coffee...",
      "Consulting the labor oracle...",
      "Oiling the legal gears...",
      "Cross-checking the big book...",
      "Asking an imaginary lawyer...",
      "Juggling the formulas...",
      "Translating from legal to human...",
      "Finding the missing article...",
      "Getting the pocket calculator...",
    ],
    legalDisclaimer: "Not professional legal advice",
    laborAssistant: "Labor assistant",
    welcome: (countryName) => (
      <>
        Hi, I am <strong>Justo</strong>. Ask me about labor rights under the
        laws of <strong>{countryName}</strong>.
      </>
    ),
    examplesHeading: "Example questions:",
    startGuided: "Start guided calculation",
    progressStep: (step) => `Step ${step} of 8`,
    result: "Result",
    calculatingUnder: (countryName) => (
      <>
        Calculating under the laws of{" "}
        <span className="font-medium text-foreground">{countryName}</span>
      </>
    ),
    legalDocs: "View legal framework ->",
    frequencyOption: "Select an option",
    summaryTitle: "Captured summary",
    worker: "Worker",
    employer: "Employer",
    salary: "Salary",
    dates: "Dates",
    vacations: "Vacation days",
    frequency: "Frequency",
    confirmAndCalculate: "Confirm and calculate",
    editSalary: "Edit salary",
    editDates: "Edit dates",
    editVacations: "Edit vacation days",
    newMonthlySalary: "New monthly salary",
    newVacationDays: "New vacation days",
    startDate: "Start date (DD/MM/YYYY)",
    endDate: "End date (DD/MM/YYYY)",
    saveChanges: "Save changes",
    cancel: "Cancel",
    finalResult: "Final result",
    lastCalculation: "Last calculation",
    legalVersion: "Legal version",
    net: "Net",
    grossIncome: "Gross income",
    deductions: "Deductions",
    fullBreakdown: "View full breakdown",
    downloadPdf: "Download PDF",
    calculateAgain: "Calculate again",
    writeQuestion: "Ask a question",
    guidedIntro:
      "Perfect, I will guide you step by step to calculate your settlement.",
    flowPrepared: "Preparing guide",
    employeeNameQuestion: "Let's start. What is the worker's full name?",
    employerNameQuestion: "Thanks. What is the employer or company name?",
    startDateQuestion: "What is the employment start date? Use DD/MM/YYYY.",
    endDateQuestion: "What is the exit date? Use DD/MM/YYYY.",
    vacationDaysQuestion: "How many pending vacation days are there?",
    frequencyQuestion: "Select the payment frequency.",
    monthlySalaryQuestion: (currencyLabel) =>
      `What is the monthly salary in ${currencyLabel}?`,
    invalidData: "That value is not valid for this step.",
    invalidDates: "The dates are not valid. Use DD/MM/YYYY.",
    endBeforeStart: "The exit date cannot be earlier than the start date.",
    reviewSummary: "Review the captured information and confirm to calculate.",
    preparingConfirmation: "Preparing confirmation",
    calculationFailed:
      "I could not calculate with that information. Let's review the summary.",
    validatingData: "Validating data",
    dataValidated: "Data validated, applying labor rules.",
    applyingRules: "Applying rules",
    preparingResult: "Preparing result",
    resultReady: "Done, preparing the final result.",
    estimatedNet: (value) => `Estimated net: ${value}`,
    changesApplied: "Changes applied.",
    backToChat:
      "Done, we are back in question mode. Write your question and I will help.",
    backToChatPhase: "Changing mode",
    useInteractiveOptions: "Use the interactive options to continue.",
    recalculateHint:
      "If you want to recalculate, press Start guided calculation again.",
    fallbackReason: "The AI provider did not complete the response.",
    fallback: (docsLink, errorMessage) => {
      const reason = errorMessage
        ? `Detail: ${errorMessage}`
        : "The AI provider did not complete the response."
      return `${reason}\n\nI can keep helping. Try again in a moment or review the legal framework here: [Open documentation](${docsLink})`
    },
    settlementWelcomeTitle: "Settlement Calculator",
    settlementWelcomeDescription: "Calculate your labor settlement with transparent formulas and legal references. We'll guide you step by step.",
    vacationsWelcomeTitle: "Vacation Calculator",
    vacationsWelcomeDescription: "Calculate your accrued vacation amount with clear formulas and legal traceability.",
    bonusWelcomeTitle: "Bonus / 13th salary calculator",
    bonusWelcomeDescription: "Calculate proportional amounts of aguinaldo, 13th salary, bonus 14, prima, SAC or gratifications by country, with transparent formulas and legal references.",
    terminationWelcomeTitle: "Termination Simulator",
    terminationWelcomeDescription: "Compare scenarios for resignation, justified dismissal, unjustified dismissal and mutual agreement. Includes severance, notice pay and seniority premium by country.",
    contractWelcomeTitle: "Contract Generator",
    contractWelcomeDescription: "Generate an individual employment contract ready to print and sign. Captures worker and employer data, job details, work schedule, duration and salary according to Nicaragua's Labor Code (Law 185).",
    salaryNetWelcomeTitle: "Net Salary Calculator",
    salaryNetWelcomeDescription: "Calculate your net salary after legal deductions (INSS, IR, ISSS, AFP, etc.) with transparent formulas.",
    preavisoWelcomeTitle: "Notice Period Calculator",
    preavisoWelcomeDescription: "Calculate the notice period and substitute payment based on the worker's tenure and applicable legislation.",
    grossSalary: "Gross salary",
    netResult: "Net salary",
    netPerPeriod: "Net salary by period",
    monthly: "Monthly",
    biweekly: "Biweekly",
    weekly: "Weekly",
    startButton: "Start",
    hrCtaTitle: "Justo for HR",
    hrCtaDescription: "Advanced tools for talent management, payroll and labor compliance.",
    hrCtaBadge: "Coming soon",
    backToPrevious: "← Previous",
    resultHeading: "Result",
    incomesLabel: "Incomes",
    expandLabel: "Expand",
    daysLabel: "days",
    amount: "Amount",
    accruedDays: "Accrued days",
    usedDays: "Used days",
    pendingDays: "Pending days",
    dailySalary: "Daily salary",
    formulaLabel: "Formula",
    legalRefLabel: "Legal reference",
    corpusVersion: "Corpus",
    deductionRate: "Deduction rate",
    netSalaryHeading: "Net salary result",
    bonusHeading: "Bonus result",
    terminationHeading: "Scenario comparison",
    estimatedBonus: "Estimated bonus",
    breakdownLabel: "Breakdown",
    scenarioFallback: "Not applicable for this case.",
    tenureSubtitle: (years) => `Based on ${years} years of tenure`,
    pensionSystem: "Pension system",
    errorCalculating: "Error calculating",
    monthlyNetResult: "Monthly net salary",
    vacationResultHeading: "Vacation result",
  },
}
