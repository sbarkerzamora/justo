import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

import { SettlementInput, SettlementResult } from "@/lib/settlement/types"

const COLORS = {
  primary: rgb(0.05, 0.2, 0.55),
  primaryLight: rgb(0.88, 0.92, 0.97),
  accent: rgb(0.1, 0.55, 0.35),
  text: rgb(0.12, 0.14, 0.18),
  muted: rgb(0.45, 0.48, 0.52),
  border: rgb(0.82, 0.84, 0.87),
  white: rgb(1, 1, 1),
  cardBg: rgb(0.96, 0.97, 0.98),
  rowEven: rgb(0.98, 0.99, 0.995),
  rowOdd: rgb(1, 1, 1),
  netBg: rgb(0.05, 0.22, 0.6),
  netText: rgb(1, 1, 1),
}

const money = (amount: number, currencyCode: string) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: currencyCode,
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
  const mono = await pdf.embedFont(StandardFonts.Courier)

  const W = 595.28
  const H = 841.89
  const left = 48
  const right = W - 48
  const contentW = right - left
  let y = H - 48

  const drawText = (
    content: string,
    opts?: {
      size?: number
      bold?: boolean
      mono?: boolean
      color?: [number, number, number]
      x?: number
      align?: "left" | "right"
    },
  ) => {
    const f = opts?.bold ? bold : opts?.mono ? mono : font
    const px = opts?.x ?? left
    const size = opts?.size ?? 11
    const color = opts?.color
      ? rgb(opts.color[0], opts.color[1], opts.color[2])
      : COLORS.text

    if (opts?.align === "right") {
      const w = f.widthOfTextAtSize(content, size)
      page.drawText(content, { x: px - w, y, size, font: f, color })
    } else {
      page.drawText(content, { x: px, y, size, font: f, color })
    }
    y -= size + 4
    return size + 4
  }

  const sectionTitle = (title: string) => {
    y -= 6
    const h = 18
    page.drawRectangle({ x: left - 4, y, width: contentW + 8, height: h, color: COLORS.primaryLight })
    page.drawText(title, { x: left + 4, y: y + 2, size: 12, font: bold, color: COLORS.primary })
    y -= h + 4
  }

  const cardBg = () => {
    page.drawRectangle({ x: left - 4, y: y - 4, width: contentW + 8, height: 4, color: COLORS.cardBg })
  }

  const drawRow = (label: string, value: string) => {
    drawText(label, { size: 10, color: [0.45, 0.48, 0.52] })
    const labelH = 10 + 4
    y += labelH
    drawText(value, { size: 11, bold: true, x: left + 140 })
    y += 2
  }

  const line = (yPos?: number) => {
    const ly = yPos ?? y
    page.drawLine({ start: { x: left, y: ly }, end: { x: right, y: ly }, thickness: 0.5, color: COLORS.border })
  }

  // ── HEADER ──
  page.drawRectangle({ x: 0, y: H - 100, width: W, height: 100, color: COLORS.primary })
  page.drawText("LIQUIDACION LABORAL", {
    x: left, y: H - 52, size: 22, font: bold, color: COLORS.white,
  })
  page.drawText(`Reporte generado automáticamente · ${result.currency}`, {
    x: left, y: H - 74, size: 11, font, color: COLORS.white,
  })
  const dateStr = new Date(result.generatedAt).toLocaleString("es-NI")
  const corpusStr = `Corpus: ${result.legalCorpusVersion}`
  const dateW = font.widthOfTextAtSize(dateStr, 10)
  const corpusW = font.widthOfTextAtSize(corpusStr, 10)
  page.drawText(dateStr, { x: right - dateW, y: H - 52, size: 10, font, color: COLORS.white })
  page.drawText(corpusStr, { x: right - corpusW, y: H - 68, size: 10, font, color: COLORS.white })

  y = H - 120

  // ── DATOS DEL CASO ──
  sectionTitle("Datos del caso")
  cardBg()
  drawRow("Trabajador:", input.employeeName)
  drawRow("Empleador:", input.employerName)
  drawRow("Salario mensual:", money(input.monthlySalary, result.currency))
  drawRow("Antiguedad:", result.tenureText)
  y -= 2
  line()

  // ── RESUMEN EJECUTIVO ──
  y -= 8
  sectionTitle("Resumen ejecutivo")

  const netBoxH = 44
  const netBoxY = y - netBoxH
  page.drawRectangle({ x: left, y: netBoxY, width: contentW, height: netBoxH, color: COLORS.netBg })
  page.drawText("NETO A RECIBIR", {
    x: left + 16, y: netBoxY + 18, size: 12, font: bold, color: COLORS.netText,
  })
  const netAmountStr = money(result.netTotal, result.currency)
  const netW = bold.widthOfTextAtSize(netAmountStr, 18)
  page.drawText(netAmountStr, {
    x: right - 16 - netW, y: netBoxY + 12, size: 18, font: bold, color: COLORS.netText,
  })
  page.drawText(`Total ingresos: ${money(result.grossIncome, result.currency)}`, {
    x: left + 16, y: netBoxY + 2, size: 9, font, color: rgb(0.7, 0.78, 0.9),
  })
  page.drawText(`Total deducciones: ${money(result.totalDeductions, result.currency)}`, {
    x: left + 160, y: netBoxY + 2, size: 9, font, color: rgb(0.7, 0.78, 0.9),
  })

  y = netBoxY - 12

  // ── DETALLE DE INGRESOS ──
  sectionTitle("Ingresos")

  // Table header
  const col1 = left + 4
  const col2 = left + 120
  const col3 = left + 250
  const col4 = right - 4
  const rowH = 17
  const hdrH = 18

  page.drawRectangle({ x: left - 4, y: y - 4, width: contentW + 8, height: hdrH, color: COLORS.primary })
  page.drawText("Concepto", { x: col1, y: y + 2, size: 9, font: bold, color: COLORS.white })
  page.drawText("Formula", { x: col2, y: y + 2, size: 9, font: bold, color: COLORS.white })
  page.drawText("Base legal", { x: col3, y: y + 2, size: 9, font: bold, color: COLORS.white })
  page.drawText("Monto", { x: col4, y: y + 2, size: 9, font: bold, color: COLORS.white })
  y -= hdrH

  for (const line of result.incomes) {
    const bg = result.incomes.indexOf(line) % 2 === 0 ? COLORS.rowEven : COLORS.rowOdd
    page.drawRectangle({ x: left - 4, y, width: contentW + 8, height: rowH, color: bg })
    drawText(line.label, { size: 9, x: col1 })
    y += 13
    drawText(line.formula, { size: 8, mono: true, x: col2, color: [0.45, 0.48, 0.52] })
    drawText(line.legalReference, { size: 7, x: col3, color: [0.45, 0.48, 0.52] })
    drawText(money(line.amount, result.currency), { size: 10, bold: true, x: col4, align: "right" })
    y += rowH - 13
  }

  line()
  drawText(`Total ingresos: ${money(result.grossIncome, result.currency)}`, { size: 11, bold: true, x: right, align: "right", color: [0.1, 0.55, 0.35] })
  y += 2
  line()

  // ── DETALLE DE DEDUCCIONES ──
  y -= 4
  sectionTitle("Deducciones")

  page.drawRectangle({ x: left - 4, y: y - 4, width: contentW + 8, height: hdrH, color: COLORS.primary })
  page.drawText("Concepto", { x: col1, y: y + 2, size: 9, font: bold, color: COLORS.white })
  page.drawText("Formula", { x: col2, y: y + 2, size: 9, font: bold, color: COLORS.white })
  page.drawText("Base legal", { x: col3, y: y + 2, size: 9, font: bold, color: COLORS.white })
  page.drawText("Monto", { x: col4, y: y + 2, size: 9, font: bold, color: COLORS.white })
  y -= hdrH

  for (const line of result.deductions) {
    const bg = result.deductions.indexOf(line) % 2 === 0 ? COLORS.rowEven : COLORS.rowOdd
    page.drawRectangle({ x: left - 4, y, width: contentW + 8, height: rowH, color: bg })
    drawText(line.label, { size: 9, x: col1 })
    y += 13
    drawText(line.formula, { size: 8, mono: true, x: col2, color: [0.45, 0.48, 0.52] })
    drawText(line.legalReference, { size: 7, x: col3, color: [0.45, 0.48, 0.52] })
    drawText(money(line.amount, result.currency), { size: 10, bold: true, x: col4, align: "right" })
    y += rowH - 13
  }

  line()
  drawText(`Total deducciones: ${money(result.totalDeductions, result.currency)}`, { size: 11, bold: true, x: right, align: "right", color: [0.55, 0.15, 0.15] })
  y += 2
  line()

  // ── FIRMAS ──
  y -= 12
  sectionTitle("Firmas")

  const sigBoxW = 220
  const sigBoxH = 60
  const sigY = y - sigBoxH
  const sigLeft = left
  const sigRight = left + 290

  const drawSigBox = (label: string, xPos: number) => {
    page.drawRectangle({ x: xPos, y: sigY, width: sigBoxW, height: sigBoxH, color: COLORS.white, borderColor: COLORS.border, borderWidth: 0, })
    page.drawLine({ start: { x: xPos + 10, y: sigY + 20 }, end: { x: xPos + sigBoxW - 10, y: sigY + 20 }, thickness: 1, color: COLORS.text })
    page.drawText(label, { x: xPos + 10, y: sigY + 4, size: 10, font, color: COLORS.muted })
    page.drawText("Firma", { x: xPos + 10, y: sigY + 24, size: 9, font, color: COLORS.muted })
  }

  drawSigBox("Trabajador", sigLeft)
  drawSigBox("Empleador", sigRight)

  y = sigY - 16

  // ── FOOTER ──
  line(y)
  y -= 14
  drawText(
    "Aviso: Este reporte es una estimacion asistida generada por Justo. Debe validarse con normativa vigente y asesoria profesional.",
    { size: 8, color: [0.55, 0.58, 0.62] },
  )
  drawText("Justo · github.com/sbarkerzamora/justo · Codigo abierto (MIT)", {
    size: 8, color: [0.55, 0.58, 0.62],
  })

  return pdf.save()
}
