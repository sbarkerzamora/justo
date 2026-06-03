import { NextResponse } from "next/server"
import { buildVacationsPdf } from "@justo/pdf"
import { calculateVacations, vacationsTool } from "@justo/tools"

import { checkRateLimit } from "@/lib/rate-limit"
import { getClientIp } from "@/lib/request-utils"

export async function POST(request: Request) {
  const clientIp = getClientIp(request)

  const { allowed, remaining, reset } = await checkRateLimit("pdf", clientIp)
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
    return NextResponse.json({ error: "Datos invalidos para PDF" }, { status: 400 })
  }

  const countryCode = parsed.data.countryCode

  if (!vacationsTool.countrySupport.includes(countryCode)) {
    return NextResponse.json({ error: "Pais no soportado para PDF" }, { status: 400 })
  }

  const result = calculateVacations(parsed.data)
  const bytes = await buildVacationsPdf(parsed.data, result)

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="vacaciones-${countryCode}.pdf"`,
    },
  })
}
