import { NextResponse } from "next/server"
import { calculateSettlement, settlementTool } from "@justo/tools"

import { checkRateLimit } from "@/lib/rate-limit"
import { getClientIp } from "@/lib/request-utils"
import { buildAnonymousRecord } from "@/lib/stats/mapper"
import { persistAnonymousRecord } from "@/lib/stats/repository"

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

  const parsed = settlementTool.inputSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Datos invalidos para calcular liquidacion",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    )
  }

  if (!settlementTool.countrySupport.includes(parsed.data.countryCode)) {
    return NextResponse.json(
      { error: `Pais no soportado: ${parsed.data.countryCode}` },
      { status: 400 },
    )
  }

  const result = calculateSettlement(parsed.data)

  void persistAnonymousRecord(buildAnonymousRecord(parsed.data, result)).catch(
    () => {
      /* telemetría no crítica */
    }
  )

  return NextResponse.json({ input: parsed.data, result })
}
