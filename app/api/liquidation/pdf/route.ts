import { NextResponse } from "next/server"

import { buildSettlementPdf } from "@/lib/pdf/settlement-pdf"
import { settlementInputSchema } from "@/lib/settlement/schema"
import { calculateNicaraguaSettlement } from "@/lib/settlement/ni/calculate"

export async function POST(request: Request) {
  const payload = await request.json()
  const parsed = settlementInputSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos para PDF" }, { status: 400 })
  }

  const result = calculateNicaraguaSettlement(parsed.data)
  const bytes = await buildSettlementPdf(parsed.data, result)

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="liquidacion-nicaragua.pdf"',
    },
  })
}
