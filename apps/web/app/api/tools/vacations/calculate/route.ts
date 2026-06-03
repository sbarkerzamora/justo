import { NextResponse } from "next/server"
import { calculateVacations, vacationsTool } from "@justo/tools"

import { checkRateLimit } from "@/lib/rate-limit"
import { getClientIp } from "@/lib/request-utils"

export async function POST(request: Request) {
  const clientIp = getClientIp(request)

  const { allowed, remaining, reset } = await checkRateLimit("vacations-calculate", clientIp)
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

  const parsed = vacationsTool.inputSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Datos invalidos para calcular vacaciones",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    )
  }

  if (!vacationsTool.countrySupport.includes(parsed.data.countryCode)) {
    return NextResponse.json(
      { error: `Pais no soportado: ${parsed.data.countryCode}` },
      { status: 400 },
    )
  }

  const result = calculateVacations(parsed.data)

  return NextResponse.json({ input: parsed.data, result })
}
