import { NextResponse } from "next/server"

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

  if (countryCode === "gt") {
    const result = calculateGuatemalaSettlement(parsed.data)
    return NextResponse.json({ input: parsed.data, result })
  }

  if (countryCode === "cl") {
    const result = calculateChileSettlement(parsed.data)
    return NextResponse.json({ input: parsed.data, result })
  }

  if (countryCode === "ar") {
    const result = calculateArgentinaSettlement(parsed.data)
    return NextResponse.json({ input: parsed.data, result })
  }

  if (countryCode === "pe") {
    const result = calculatePeruSettlement(parsed.data)
    return NextResponse.json({ input: parsed.data, result })
  }

  if (countryCode === "co") {
    const result = calculateColombiaSettlement(parsed.data)
    return NextResponse.json({ input: parsed.data, result })
  }

  if (countryCode === "mx") {
    const result = calculateMexicoSettlement(parsed.data)
    return NextResponse.json({ input: parsed.data, result })
  }

  if (countryCode === "pa") {
    const result = calculatePanamaSettlement(parsed.data)
    return NextResponse.json({ input: parsed.data, result })
  }

  if (countryCode === "cr") {
    const result = calculateCostaRicaSettlement(parsed.data)
    return NextResponse.json({ input: parsed.data, result })
  }

  if (countryCode === "sv") {
    const result = calculateElSalvadorSettlement(parsed.data)
    return NextResponse.json({ input: parsed.data, result })
  }

  if (countryCode === "hn") {
    const result = calculateHondurasSettlement(parsed.data)
    return NextResponse.json({ input: parsed.data, result })
  }

  const result = calculateNicaraguaSettlement(parsed.data)
  return NextResponse.json({ input: parsed.data, result })
}
