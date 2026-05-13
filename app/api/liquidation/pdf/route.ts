import { NextResponse } from "next/server"

import { buildSettlementPdf } from "@/lib/pdf/settlement-pdf"
import { settlementInputSchema } from "@/lib/settlement/schema"
import { calculateNicaraguaSettlement } from "@/lib/settlement/ni/calculate"
import { calculateGuatemalaSettlement } from "@/lib/settlement/gt/calculate"
import { calculateHondurasSettlement } from "@/lib/settlement/hn/calculate"
import { calculateElSalvadorSettlement } from "@/lib/settlement/sv/calculate"
import { calculateCostaRicaSettlement } from "@/lib/settlement/cr/calculate"
import { calculatePanamaSettlement } from "@/lib/settlement/pa/calculate"
import { calculateMexicoSettlement } from "@/lib/settlement/mx/calculate"
import { calculateColombiaSettlement } from "@/lib/settlement/co/calculate"
import { calculatePeruSettlement } from "@/lib/settlement/pe/calculate"
import { calculateArgentinaSettlement } from "@/lib/settlement/ar/calculate"
import { calculateChileSettlement } from "@/lib/settlement/cl/calculate"

const calculators: Record<string, (input: any) => any> = {
  ni: calculateNicaraguaSettlement,
  gt: calculateGuatemalaSettlement,
  hn: calculateHondurasSettlement,
  sv: calculateElSalvadorSettlement,
  cr: calculateCostaRicaSettlement,
  pa: calculatePanamaSettlement,
  mx: calculateMexicoSettlement,
  co: calculateColombiaSettlement,
  pe: calculatePeruSettlement,
  ar: calculateArgentinaSettlement,
  cl: calculateChileSettlement,
}

export async function POST(request: Request) {
  const payload = await request.json()
  const parsed = settlementInputSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos para PDF" }, { status: 400 })
  }

  const cc = parsed.data.countryCode
  const calculator = calculators[cc]

  if (!calculator) {
    return NextResponse.json({ error: "Pais no soportado para PDF" }, { status: 400 })
  }

  const result = calculator(parsed.data)
  const bytes = await buildSettlementPdf(parsed.data, result)

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="liquidacion-${cc}.pdf"`,
    },
  })
}
