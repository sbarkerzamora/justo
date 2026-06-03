import { NextResponse } from "next/server"
import { buildContractPdf } from "@justo/pdf"
import { contractTool } from "@justo/tools"
import {
  assembleNicaraguaContract,
  assembleElSalvadorContract,
  assembleGuatemalaContract,
  assembleHondurasContract,
  assembleCostaRicaContract,
  assemblePanamaContract,
  assembleMexicoContract,
  assembleColombiaContract,
  assemblePeruContract,
  assembleArgentinaContract,
  assembleChileContract,
  type CountryCode,
  type ContractInputPayload,
  type ContractResult,
} from "@justo/core"
import { checkRateLimit } from "@/lib/rate-limit"
import { getClientIp } from "@/lib/request-utils"

const contractAssemblers: Record<string, (input: ContractInputPayload) => ContractResult> = {
  ni: assembleNicaraguaContract,
  sv: assembleElSalvadorContract,
  gt: assembleGuatemalaContract,
  hn: assembleHondurasContract,
  cr: assembleCostaRicaContract,
  pa: assemblePanamaContract,
  mx: assembleMexicoContract,
  co: assembleColombiaContract,
  pe: assemblePeruContract,
  ar: assembleArgentinaContract,
  cl: assembleChileContract,
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request)
  const { allowed, remaining, reset } = await checkRateLimit(
    "contract-pdf",
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

  const parsed = contractTool.inputSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos para generar contrato" },
      { status: 400 },
    )
  }

  const assembler = contractAssemblers[parsed.data.countryCode as CountryCode]
  if (!assembler) {
    return NextResponse.json(
      { error: `País no soportado: ${parsed.data.countryCode}` },
      { status: 400 },
    )
  }
  const result = assembler(parsed.data)
  const bytes = await buildContractPdf(parsed.data, result)

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="contrato-laboral-${parsed.data.countryCode}.pdf"`,
    },
  })
}
