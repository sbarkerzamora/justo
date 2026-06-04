import { describe, expect, test } from "bun:test"
import { assembleNicaraguaContract } from "@justo/core"
import type { ContractInput } from "@justo/core"
import { buildContractPdf } from "./contract-pdf"

describe("buildContractPdf", () => {
  test("generates PDF bytes for a valid contract", async () => {
    const input: ContractInput = {
      countryCode: "ni",
      celebrationPlace: "Managua",
      workerName: "Juan Pérez",
      workerId: "001-123456-7890",
      workerAddress: "Managua, Distrito I",
      employerName: "Empresa S.A.",
      employerId: "J123456789",
      employerRepresentative: "María García",
      employerAddress: "Managua, Carretera Masaya",
      jobTitle: "Asistente administrativo",
      jobDescription: "Atención al cliente y archivo de documentos",
      workLocation: "Managua",
      jornada: "diurna",
      contractType: "indeterminado",
      startDate: "2025-01-01",
      monthlySalary: 15000,
      paymentFrequency: "mensual",
      paymentMethod: "unidad_tiempo",
    }
    const result = assembleNicaraguaContract(input)
    const bytes = await buildContractPdf(input, result)

    expect(bytes.length).toBeGreaterThan(0)
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe("%PDF")
  })
})