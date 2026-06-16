export type TerminationCause =
  | "renuncia"
  | "despido_justificado"
  | "despido_injustificado"
  | "mutuo_acuerdo"
  | "fin_plazo"
  | "obra_terminada"
  | "jubilacion"
  | "fallecimiento"

export type JurisdictionContractType =
  | "indeterminado"
  | "plazo_fijo"
  | "obra_determinada"
  | "temporada"
  | "periodo_prueba"

export type BonusType =
  | "aguinaldo"
  | "decimoTercero"
  | "decimoCuarto"
  | "bono14"
  | "gratificacion"
  | "primaServicios"
  | "sac"

export type SectorType = "publico" | "privado"

export type PensionSystem = "afp" | "onp" | "ninguno"

export type HealthSystem = "fonasa" | "isapre" | "ninguno"
