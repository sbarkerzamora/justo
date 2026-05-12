import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

import { SettlementInput, SettlementResult } from "@/lib/settlement/types"

const money = (amount: number) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
    minimumFractionDigits: 2,
  }).format(amount)

export const buildSettlementPdf = async (
  input: SettlementInput,
  result: SettlementResult,
) => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)

  const left = 48
  let y = 800

  const text = (
    content: string,
    opts?: { size?: number; bold?: boolean; color?: [number, number, number] },
  ) => {
    page.drawText(content, {
      x: left,
      y,
      size: opts?.size ?? 11,
      font: opts?.bold ? bold : font,
      color: rgb(opts?.color?.[0] ?? 0.1, opts?.color?.[1] ?? 0.12, opts?.color?.[2] ?? 0.16),
    })
    y -= (opts?.size ?? 11) + 6
  }

  text("Reporte de Liquidacion Laboral", { size: 18, bold: true, color: [0.1, 0.2, 0.55] })
  text("Proyecto OSS Centroamerica · MVP Nicaragua", { size: 11 })
  text(`Generado: ${new Date(result.generatedAt).toLocaleString("es-NI")}`, { size: 10 })
  text(`Version legal: ${result.legalCorpusVersion}`, { size: 10 })

  y -= 8
  text("Datos del caso", { size: 13, bold: true })
  text(`Trabajador: ${input.employeeName}`)
  text(`Empleador: ${input.employerName}`)
  text(`Salario mensual: ${money(input.monthlySalary)}`)
  text(`Antiguedad: ${result.tenureText}`)

  y -= 8
  text("Ingresos", { size: 13, bold: true })
  for (const line of result.incomes) {
    text(`${line.label}: ${money(line.amount)}`)
    text(`  Formula: ${line.formula}`, { size: 9 })
    text(`  Base legal: ${line.legalReference}`, { size: 9 })
  }
  text(`Total ingresos: ${money(result.grossIncome)}`, { bold: true })

  y -= 8
  text("Deducciones", { size: 13, bold: true })
  for (const line of result.deductions) {
    text(`${line.label}: ${money(line.amount)}`)
    text(`  Formula: ${line.formula}`, { size: 9 })
    text(`  Base legal: ${line.legalReference}`, { size: 9 })
  }
  text(`Total deducciones: ${money(result.totalDeductions)}`, { bold: true })

  y -= 10
  text(`Neto a recibir: ${money(result.netTotal)}`, {
    size: 16,
    bold: true,
    color: [0.05, 0.23, 0.6],
  })

  y -= 24
  text("Firmas", { size: 13, bold: true })
  page.drawLine({ start: { x: left, y: y - 34 }, end: { x: left + 200, y: y - 34 }, thickness: 1 })
  page.drawLine({ start: { x: left + 260, y: y - 34 }, end: { x: left + 460, y: y - 34 }, thickness: 1 })
  page.drawText("Firma trabajador", { x: left, y: y - 48, size: 10, font })
  page.drawText("Firma empleador", { x: left + 260, y: y - 48, size: 10, font })

  y -= 92
  text(
    "Aviso: Este reporte es una estimacion asistida, debe validarse con normativa vigente y asesoria profesional.",
    { size: 9 },
  )

  return pdf.save()
}
