export type ContractCopy = {
  badge: string
  back: string
  continue: string
  welcomeMessage: string
  welcomeStart: string
  errorCalculating: string
  errorPdfDetail: (details: string) => string
  errorPdf: string
  stepTitle: Record<string, string>
  field: {
    workerName: string
    workerId: string
    workerAddress: string
    employerName: string
    employerRuc: string
    employerRep: string
    employerAddress: string
    positionTitle: string
    positionDescription: string
    workplace: string
    schedule: string
    contractType: string
    startDate: string
    endDate: string
    trialPeriod: string
    monthlySalaryCurrency: (currency: string) => string
    paymentFrequency: string
    paymentMethod: string
    celebrationPlace: string
  }
  placeholder: {
    workerName: string
    workerId: string
    workerAddress: string
    employerName: string
    employerRuc: string
    employerRep: string
    positionTitle: string
    positionDescription: string
    workplace: string
    trialPeriod: string
    monthlySalary: string
    celebrationPlace: string
  }
  scheduleOptions: Record<string, string>
  contractTypeOptions: Record<string, string>
  frequencyOptions: Record<string, string>
  paymentMethodOptions: Record<string, string>
  dateFormatHint: string
  dateFormatLabel: string
  confirm: {
    heading: string
    workerSection: string
    employerSection: string
    jobSection: string
    contractSection: string
    salarySection: string
    name: string
    id: string
    address: string
    legalName: string
    ruc: string
    representative: string
    title: string
    functions: string
    place: string
    schedule: string
    type: string
    start: string
    end: string
    monthlyAmount: string
    frequency: string
    method: string
    celebration: string
    trialPeriod: string
  }
  done: {
    heading: string
    subtitle: string
    generate: string
    generated: string
    forWorker: string
  }
  error: {
    invalidStartDate: string
    missingEndDate: string
    invalidEndDate: string
    endBeforeStart: string
    invalidSalary: string
    missingCelebrationPlace: string
  }
  onboardingSteps: Record<string, string>
}

export const contractCopy: Record<"es" | "en", ContractCopy> = {
  es: {
    badge: "Generador de contratos",
    back: "← Volver",
    continue: "Continuar",
    welcomeMessage:
      "Vamos a generar un contrato de trabajo listo para imprimir y firmar.",
    welcomeStart: "Iniciar generación de contrato",
    errorCalculating: "Error al calcular",
    errorPdfDetail: (details) => `No se pudo generar el PDF. Revisa: ${details}.`,
    errorPdf: "No se pudo generar el PDF.",
    stepTitle: {
      workerInfo: "Datos del trabajador",
      employerInfo: "Datos del empleador",
      jobInfo: "Información del puesto",
      contractType: "Tipo de contrato y fechas",
      salary: "Salario y forma de pago",
    },
    field: {
      workerName: "Nombre completo",
      workerId: "Cédula de identidad",
      workerAddress: "Dirección",
      employerName: "Razón social",
      employerRuc: "RUC",
      employerRep: "Representante legal",
      employerAddress: "Dirección",
      positionTitle: "Título del puesto",
      positionDescription: "Descripción de funciones",
      workplace: "Lugar de trabajo",
      schedule: "Jornada",
      contractType: "Tipo de contrato",
      startDate: "Fecha de inicio",
      endDate: "Fecha de fin",
      trialPeriod: "Período de prueba (días, opcional, máx. 30)",
      monthlySalaryCurrency: (currency) =>
        `Salario mensual en ${currency}`,
      paymentFrequency: "Frecuencia de pago",
      paymentMethod: "Forma de pago",
      celebrationPlace: "Lugar de celebración del contrato",
    },
    placeholder: {
      workerName: "Ej. Juan Pérez",
      workerId: "Ej. 001-123456-7890",
      workerAddress: "Ej. Managua, Distrito I",
      employerName: "Ej. Empresa S.A.",
      employerRuc: "Ej. J123456789",
      employerRep: "Ej. María García",
      positionTitle: "Ej. Asistente administrativo",
      positionDescription: "Ej. Atención al cliente, archivo, reportes",
      workplace: "Ej. Managua",
      trialPeriod: "Ej. 30",
      monthlySalary: "Ej. 15,000",
      celebrationPlace: "Ej. Managua",
    },
    scheduleOptions: {
      diurna: "Diurna",
      mixta: "Mixta",
      nocturna: "Nocturna",
    },
    contractTypeOptions: {
      indeterminado: "Tiempo indeterminado",
      fijo: "Plazo fijo",
      obra: "Obra determinada",
    },
    frequencyOptions: {
      mensual: "Mensual",
      quincenal: "Quincenal",
      semanal: "Semanal",
    },
    paymentMethodOptions: {
      tiempo: "Por unidad de tiempo",
      destajo: "Por destajo",
      comision: "Por comisión",
      otra: "Otra forma",
    },
    dateFormatHint: "DD/MM/AAAA",
    dateFormatLabel: "(DD/MM/AAAA)",
    confirm: {
      heading: "Revisar datos",
      workerSection: "Trabajador",
      employerSection: "Empleador",
      jobSection: "Puesto",
      contractSection: "Contrato",
      salarySection: "Salario",
      name: "Nombre",
      id: "Cédula",
      address: "Dirección",
      legalName: "Razón social",
      ruc: "RUC",
      representative: "Representante legal",
      title: "Título",
      functions: "Funciones",
      place: "Lugar",
      schedule: "Jornada",
      type: "Tipo",
      start: "Inicio",
      end: "Fin",
      monthlyAmount: "Monto mensual",
      frequency: "Frecuencia",
      method: "Forma de pago",
      celebration: "Celebración",
      trialPeriod: "Período de prueba",
    },
    done: {
      heading: "Contrato generado",
      subtitle: "Contrato para",
      generate: "Generar contrato",
      generated: "Contrato generado",
      forWorker: "Contrato para",
    },
    error: {
      invalidStartDate: "Fecha de inicio inválida. Usa DD/MM/AAAA.",
      missingEndDate: "Indica la fecha de fin para contratos a plazo fijo.",
      invalidEndDate: "Fecha de fin inválida. Usa DD/MM/AAAA.",
      endBeforeStart:
        "La fecha de fin debe ser posterior a la fecha de inicio.",
      invalidSalary: "Salario inválido.",
      missingCelebrationPlace:
        "Indica el lugar de celebración del contrato.",
    },
    onboardingSteps: {
      worker: "Trabajador",
      employer: "Empleador",
      job: "Puesto",
      contract: "Contrato",
      salary: "Salario",
    },
  },
  en: {
    badge: "Contract generator",
    back: "← Back",
    continue: "Continue",
    welcomeMessage:
      "Let's generate an employment contract ready to print and sign.",
    welcomeStart: "Start contract generation",
    errorCalculating: "Error calculating",
    errorPdfDetail: (details) => `Could not generate PDF. Check: ${details}.`,
    errorPdf: "Could not generate PDF.",
    stepTitle: {
      workerInfo: "Worker information",
      employerInfo: "Employer information",
      jobInfo: "Job information",
      contractType: "Contract type and dates",
      salary: "Salary and payment method",
    },
    field: {
      workerName: "Full name",
      workerId: "ID number",
      workerAddress: "Address",
      employerName: "Legal name",
      employerRuc: "Tax ID (RUC)",
      employerRep: "Legal representative",
      employerAddress: "Address",
      positionTitle: "Position title",
      positionDescription: "Job description",
      workplace: "Workplace",
      schedule: "Work schedule",
      contractType: "Contract type",
      startDate: "Start date",
      endDate: "End date",
      trialPeriod: "Trial period (days, optional, max 30)",
      monthlySalaryCurrency: (currency) => `Monthly salary in ${currency}`,
      paymentFrequency: "Payment frequency",
      paymentMethod: "Payment method",
      celebrationPlace: "Place of contract execution",
    },
    placeholder: {
      workerName: "E.g. John Smith",
      workerId: "E.g. 001-123456-7890",
      workerAddress: "E.g. Managua, District I",
      employerName: "E.g. Company Inc.",
      employerRuc: "E.g. J123456789",
      employerRep: "E.g. Jane Smith",
      positionTitle: "E.g. Administrative assistant",
      positionDescription: "E.g. Customer service, filing, reports",
      workplace: "E.g. Managua",
      trialPeriod: "E.g. 30",
      monthlySalary: "E.g. 15,000",
      celebrationPlace: "E.g. Managua",
    },
    scheduleOptions: {
      diurna: "Day shift",
      mixta: "Mixed shift",
      nocturna: "Night shift",
    },
    contractTypeOptions: {
      indeterminado: "Indefinite term",
      fijo: "Fixed term",
      obra: "Specific project",
    },
    frequencyOptions: {
      mensual: "Monthly",
      quincenal: "Biweekly",
      semanal: "Weekly",
    },
    paymentMethodOptions: {
      tiempo: "By time unit",
      destajo: "By piecework",
      comision: "By commission",
      otra: "Other",
    },
    dateFormatHint: "MM/DD/YYYY",
    dateFormatLabel: "(MM/DD/YYYY)",
    confirm: {
      heading: "Review data",
      workerSection: "Worker",
      employerSection: "Employer",
      jobSection: "Position",
      contractSection: "Contract",
      salarySection: "Salary",
      name: "Name",
      id: "ID",
      address: "Address",
      legalName: "Legal name",
      ruc: "Tax ID",
      representative: "Legal representative",
      title: "Title",
      functions: "Functions",
      place: "Place",
      schedule: "Schedule",
      type: "Type",
      start: "Start",
      end: "End",
      monthlyAmount: "Monthly amount",
      frequency: "Frequency",
      method: "Payment method",
      celebration: "Celebration",
      trialPeriod: "Trial period",
    },
    done: {
      heading: "Contract generated",
      subtitle: "Contract for",
      generate: "Generate contract",
      generated: "Contract generated",
      forWorker: "Contract for",
    },
    error: {
      invalidStartDate: "Invalid start date. Use MM/DD/YYYY.",
      missingEndDate: "Enter the end date for fixed-term contracts.",
      invalidEndDate: "Invalid end date. Use MM/DD/YYYY.",
      endBeforeStart: "End date must be after start date.",
      invalidSalary: "Invalid salary.",
      missingCelebrationPlace: "Enter the contract execution location.",
    },
    onboardingSteps: {
      worker: "Worker",
      employer: "Employer",
      job: "Position",
      contract: "Contract",
      salary: "Salary",
    },
  },
}
