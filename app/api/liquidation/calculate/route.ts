import { NextResponse } from "next/server"

import { checkRateLimit } from "@/lib/rate-limit"
import { getClientIp } from "@/lib/request-utils"
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
import { buildAnonymousRecord } from "@/lib/stats/mapper"
import { persistAnonymousRecord } from "@/lib/stats/repository"

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
  const clientIp = getClientIp(request)

  const { allowed, remaining, reset } = await checkRateLimit("calculate", clientIp)
  if (!allowed) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    )
  }

  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON invalido en la solicitud" }, { status: 400 })
  }

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

  void persistAnonymousRecord(buildAnonymousRecord(parsed.data, result)).catch(
    () => {
      /* telemetría no crítica */
    }
  )

  return NextResponse.json({ input: parsed.data, result })
}
