import { NextResponse } from "next/server"
import { buildTerminationPdf } from "@justo/pdf"
import { terminationTool, calculateTermination } from "@justo/tools"
import { checkRateLimit } from "@/lib/rate-limit"
import { getClientIp } from "@/lib/request-utils"

export async function POST(request: Request) {
  const clientIp = getClientIp(request)
  const { allowed, remaining, reset } = await checkRateLimit(
    "termination-pdf",
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
      { error: "Datos invalidos para PDF" },
      { status: 400 },
    )
  }

  if (!terminationTool.countrySupport.includes(parsed.data.countryCode)) {
    return NextResponse.json({ error: "Pais no soportado para PDF" }, { status: 400 })
  }

  const result = calculateTermination(parsed.data)
  const bytes = await buildTerminationPdf(parsed.data, result)

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="simulador-terminacion-${parsed.data.countryCode}.pdf"`,
    },
  })
}
