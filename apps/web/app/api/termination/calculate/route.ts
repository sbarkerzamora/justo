import { NextResponse } from "next/server"
import { terminationTool, calculateTermination } from "@justo/tools"
import { checkRateLimit } from "@/lib/rate-limit"
import { getClientIp } from "@/lib/request-utils"

export async function POST(request: Request) {
  const clientIp = getClientIp(request)
  const { allowed, remaining, reset } = await checkRateLimit(
    "termination-calculate",
    clientIp,
  )

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
      },
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: "JSON invalido en la solicitud" },
      { status: 400 },
    )
  }

  const parsed = terminationTool.inputSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Datos invalidos para calcular escenarios de terminacion",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    )
  }

  const result = calculateTermination(parsed.data)
  return NextResponse.json({ input: parsed.data, result })
}
