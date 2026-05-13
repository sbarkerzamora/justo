import { NextResponse } from "next/server"

import { SettlementInput } from "@/lib/settlement/types"
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
import { SettlementResult } from "@/lib/settlement/types"

const calculators: Record<string, (input: SettlementInput) => SettlementResult> = {
  gt: calculateGuatemalaSettlement,
  cl: calculateChileSettlement,
  ar: calculateArgentinaSettlement,
  pe: calculatePeruSettlement,
  co: calculateColombiaSettlement,
  mx: calculateMexicoSettlement,
  pa: calculatePanamaSettlement,
  cr: calculateCostaRicaSettlement,
  sv: calculateElSalvadorSettlement,
  hn: calculateHondurasSettlement,
  ni: calculateNicaraguaSettlement,
}

export async function POST(request: Request) {
  const payload = await request.json()
  const parsed = settlementInputSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Datos invalidos para calcular liquidacion",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    )
  }

  const { countryCode } = parsed.data
  const calculator = calculators[countryCode]

  if (!calculator) {
    return NextResponse.json(
      { error: `Pais no soportado: ${countryCode}` },
      { status: 400 },
    )
  }

  const result = calculator(parsed.data)
  return NextResponse.json({ input: parsed.data, result })
}
