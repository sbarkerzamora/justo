import { NextResponse } from "next/server"

import { settlementInputSchema } from "@/lib/settlement/schema"
import { calculateNicaraguaSettlement } from "@/lib/settlement/ni/calculate"

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

  const result = calculateNicaraguaSettlement(parsed.data)
  return NextResponse.json({ input: parsed.data, result })
}
