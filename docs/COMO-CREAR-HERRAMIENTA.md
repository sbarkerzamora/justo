# Como crear una herramienta en Justo

Este documento describe paso a paso como agregar una nueva herramienta de calculo o asistente al proyecto Justo, siguiendo los patrones existentes de `salary-net` y `vacations`.

## Resumen de arquitectura

Una herramienta en Justo consta de cuatro capas:

1. **Core (`@justo/core`)** — Logica de calculo determinista, esquemas Zod y tipos
2. **Tools (`@justo/tools`)** — Wrapper con metadatos y mapa de calculadoras por pais
3. **Web (`apps/web`)** — Wizard interactivo, API routes, generacion de PDF y herramienta AI
4. **PDF (`@justo/pdf`)** — Generador de PDF con formato por pais

---

## 1. Backend: Logica de calculo (`packages/core/src/<herramienta>/`)

### 1.1 Estructura de directorios

```
packages/core/src/<herramienta>/
├── types.ts            # Tipos de entrada y salida
├── schema.ts           # Esquema Zod para validacion
├── shared.ts           # (opcional) Builder generico si varios paises comparten logica
├── <code-pais>/
│   ├── calculate.ts    # Funcion pura de calculo
│   ├── legal-params.ts # Parametros legales del pais
│   └── calculate.test.ts
├── <code-pais>/
│   ├── calculate.ts
│   ├── legal-params.ts
│   └── calculate.test.ts
└── index.ts            # Re-exports
```

Usar `shared.ts` cuando la logica de calculo es la misma para todos los paises y solo varian parametros legales (divisor, premium, escala de antiguedad, etc.). Ver `packages/core/src/vacations/shared.ts` como ejemplo.

### 1.2 Tipos (`types.ts`)

```ts
import type { CountryCode, CurrencyCode } from "../settlement"

export interface MyToolInput {
  countryCode: CountryCode
  amount: number
  // campos opcionales especificos de pais, ej:
  // pensionSystem?: "afp" | "onp"  (solo PE)
  // seniorityYears?: number         (para HN, MX, AR, CL)
}

export interface MyToolResult {
  currency: CurrencyCode
  amount: number
  formula: string
  legalReference: string
  generatedAt: string
  legalCorpusVersion: string
  // ... otros campos especificos
}
```

### 1.3 Schema (`schema.ts`)

```ts
import { z } from "zod"
import { countryCodes } from "../settlement"

export const myToolInputSchema = z.object({
  countryCode: z.enum(countryCodes),
  amount: z.number().positive(),
  // campos opcionales: z.number().min(0).optional()
})
```

**Nota**: Usar `z.enum(countryCodes)` para obtener el union de todos los codigos de pais soportados por el proyecto.

### 1.4 Dos patrones de calculo

#### Patron A: Calculadora por pais independiente (como `salary-net`)

Cada pais tiene su propio `calculate.ts` con toda la logica:

```ts
// <code-pais>/calculate.ts
import type { MyToolInput, MyToolResult } from "../types"

export function calculateMyTool(input: MyToolInput): MyToolResult {
  // logica determinista especifica del pais
  return {
    currency: "NIO",
    amount: input.amount * 0.07,
    formula: `${input.amount} * 7%`,
    legalReference: "Ley 185 Art. 88",
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: "ni-v0.3.0",
  }
}
```

#### Patron B: Builder compartido con parametros por pais (como `vacations`)

Crear `shared.ts` con un builder generico:

```ts
// shared.ts
export interface MyToolParams {
  currency: CurrencyCode
  corpusVersion: string
  legalReference: string
  rate: number
}

export function buildMyTool(input: MyToolInput, params: MyToolParams): MyToolResult {
  const amount = input.amount * params.rate
  return {
    currency: params.currency,
    amount,
    formula: `${input.amount} x ${params.rate}`,
    legalReference: params.legalReference,
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: params.corpusVersion,
  }
}
```

Y cada pais solo define sus parametros:

```ts
// ni/legal-params.ts
export const getNiParams = (): MyToolParams => ({
  currency: "NIO",
  corpusVersion: "ni-v0.3.0",
  legalReference: "Ley 185 Art. 88",
  rate: 0.07,
})

// ni/calculate.ts
export function calculateNiMyTool(input: MyToolInput): MyToolResult {
  return buildMyTool(input, getNiParams())
}
```

### 1.5 Reglas

- La funcion debe ser **pura**: mismos inputs = mismos outputs, sin side effects.
- No usar `node:fs` ni dependencias de runtime del servidor. Devolver constantes inline.
- Usar `round2` de `../settlement` para redondeo a 2 decimales.
- Agregar tests en `packages/core/src/<herramienta>/<code-pais>/calculate.test.ts`.

---

## 2. Tool wrapper (`packages/tools/src/<herramienta>.ts`)

Crear un archivo que exponga la herramienta con un `Record<CountryCode, calculator>` y metadatos:

```ts
import {
  calculateNiMyTool,
  calculateSvMyTool,
  // ... importar todos los paises
  myToolInputSchema,
  type CountryCode,
  type MyToolInput,
  type MyToolResult,
} from "@justo/core"
import type { CalculationTool } from "./types"

const myToolCalculators: Record<
  CountryCode,
  (input: MyToolInput) => MyToolResult
> = {
  ni: calculateNiMyTool,
  sv: calculateSvMyTool,
  // ... todos los paises soportados
}

export const myTool: CalculationTool<MyToolInput, MyToolResult> = {
  id: "my-tool",
  slug: "mi-herramienta",
  name: "Mi Herramienta",
  shortDescription: "Descripcion corta.",
  longDescription: "Descripcion larga detallada.",
  category: "calculation",
  availability: "available",
  countrySupport: Object.keys(myToolCalculators) as CountryCode[],
  inputRequirements: ["Pais", "Monto"],
  outputSummary: ["Monto", "Formula", "Referencia legal"],
  inputSchema: myToolInputSchema,
  calculate: calculateMyToolWrapper,
  legalReferences: [
    "Ley 185 Art. 88 (NI)",
    "Art. 123 Codigo de Trabajo (SV)",
    // ... referencia legal para cada pais
  ],
  corpusVersion: "multi-v0.1.0",
  disclaimer: "Resultado informativo...",
}

export function calculateMyToolWrapper(input: MyToolInput): MyToolResult {
  const calculator = myToolCalculators[input.countryCode]
  if (!calculator) {
    throw new Error(`Pais no soportado: ${input.countryCode}`)
  }
  return calculator(input)
}
```

Exportar desde `packages/tools/src/index.ts`:
```ts
export * from "./my-tool"
```

### Registrar en el catalogo de herramientas

En `packages/tools/src/registry.ts`, agregar la herramienta al array `tools`:

```ts
import { myTool } from "./my-tool"

export const tools = [
  settlementTool,
  vacationsTool,
  salaryNetTool,
  myTool,              // <-- agregar aqui
  comingSoonTool({ ... }),
  // ...
]
```

Si la herramienta aun no esta implementada para todos los paises, usar `comingSoonTool()`.

---

## 3. UI: Wizard interactivo (`apps/web/components/tools/<herramienta>/`)

### 3.1 Crear el componente principal

```tsx
"use client"

import { useReducer, useState } from "react"
import { myTool } from "@justo/tools"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"
import type { MyToolInput } from "@justo/core"

export type MyToolStep = "welcome" | "input" | "confirm" | "done"

interface MyToolState {
  step: MyToolStep
  form: MyToolInput
  result: ReturnType<typeof myTool.calculate> | null
}

type Action =
  | { type: "setStep"; step: MyToolStep }
  | { type: "patchForm"; patch: Partial<MyToolInput> }
  | { type: "setResult"; result: ReturnType<typeof myTool.calculate> | null }
  | { type: "reset"; countryCode: string }

// reducer, initialState, helpers...

export function MyTool({
  countryCode,
  locale,
  fmt,
  onComplete,
  onCancel,
}: {
  countryCode: string
  locale: Locale
  fmt: (v: number) => string
  onComplete: (messages: { role: "user" | "assistant"; text: string }[]) => void
  onCancel: () => void
}) {
  // implementacion del wizard con onboarding, captura, confirmacion y resultados
}
```

**Elementos obligatorios:**
- **Paso `welcome`**: panel de onboarding con icono, titulo, descripcion y pasos previos numerados
- **Auto-formateo de inputs**: usar `formatCurrencyInput`, `formatDateInput`, `formatNumberInput` de `@/components/tools/input-formatters`
- **Panel de confirmacion**: resumen de datos capturados con botones de editar
- **Panel de resultados**: resultado principal destacado, metricas secundarias, formula y referencia legal
- **Boton "Volver al chat"**: llama `onComplete` con mensajes para imprimir en el hilo
- **Campos condicionales por pais**: ej. `pensionSystem` solo para PE, `seniorityYears` solo si el pais usa escala

### 3.2 Agregar copy i18n

En `apps/web/lib/home-copy.tsx`:
```tsx
myToolWelcomeTitle: string
myToolWelcomeDescription: string
```
En ambos idiomas (`es` y `en`).

### 3.3 Registrar en el router de la app

En `apps/web/components/chat/llm-home.tsx`:
1. Agregar `"my-tool"` al tipo `AppMode`
2. Importar `MyTool`
3. Agregar rama de render:
   ```tsx
   : mode === "my-tool" ? (
     <MyTool ... />
   ) : (
   ```
4. Agregar boton de acceso rapido en `WelcomeEmptyState`

### 3.4 Agregar en sidebar

En `apps/web/components/app-shell.tsx`, agregar link en `sidebarLinks`:
```tsx
{ label: "Mi herramienta", href: `${homePath}?tool=my-tool` }
```

---

## 4. AI SDK: Herramienta para el asistente (`apps/web/lib/ai/respond.ts`)

Registrar una tool AI para que el LLM pueda invocarla directamente desde el chat:

```ts
import { tool } from "ai"
import { z } from "zod"
import { calculateMyToolWrapper, myTool } from "@justo/tools"

// dentro del array tools de createToolLoopAgent:
quickMyToolEstimate: tool({
  description: `Descripcion para que el LLM sepa cuando usar esta herramienta.`,
  inputSchema: zodSchema(
    z.object({
      amount: z.number().positive().describe("Descripcion del campo"),
    })
  ),
  execute: async ({ amount }) => {
    try {
      const result = calculateMyToolWrapper({
        countryCode: countryCode as CountryCode,
        amount,
      })
      return JSON.stringify({
        amount: result.amount,
        formula: result.formula,
        currency: result.currency,
        legalCorpusVersion: result.legalCorpusVersion,
      })
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : "error desconocido"}. Usa la calculadora guiada.`
    }
  },
}),
```

---

## 5. PDF (opcional pero recomendado)

### 5.1 Generador de PDF con locale por pais

```ts
import { PDFDocument } from "pdf-lib"
import type { MyToolInput, MyToolResult } from "@justo/core"
import {
  loadFonts, drawText, drawLine, drawBox,
  drawSectionTitle, drawKeyValue, drawSignatureBoxes, drawFooter,
} from "./pdf-helpers"

const currencyLocaleMap: Record<string, string> = {
  NIO: "es-NI",
  USD: "es-SV",
  GTQ: "es-GT",
  // ... resto de paises
}

const currencyFormatters: Record<string, Intl.NumberFormat> = Object.fromEntries(
  Object.entries(currencyLocaleMap).map(([curr, locale]) => [
    curr,
    new Intl.NumberFormat(locale, { style: "currency", currency: curr, minimumFractionDigits: 2 }),
  ]),
)

const money = (amount: number, currencyCode: string) =>
  (currencyFormatters[currencyCode] ?? currencyFormatters.NIO).format(amount)

export const buildMyToolPdf = async (
  input: MyToolInput,
  result: MyToolResult,
) => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89])
  const fontSet = await loadFonts(pdf)

  const left = 48
  const right = 595.28 - 48
  let y = 841.89 - 48

  drawText(page, "MI HERRAMIENTA", left, y, { size: 24, bold: true, fontSet })
  // ... resto del layout

  return pdf.save()
}
```

Exportar desde `packages/pdf/src/index.ts`:
```ts
export * from "./my-tool-pdf"
```

### 5.2 API route para calculo

Crear `apps/web/app/api/<herramienta>/calculate/route.ts`:

```ts
import { NextResponse } from "next/server"
import { calculateMyToolWrapper, myTool } from "@justo/tools"
import { checkRateLimit } from "@/lib/rate-limit"
import { getClientIp } from "@/lib/request-utils"

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const rateLimitResult = await checkRateLimit(`my-tool-calculate`, ip, 60, 60000)
  if (!rateLimitResult.allowed) {
    return NextResponse.json({ error: rateLimitResult.error }, { status: 429 })
  }

  const parsed = myTool.inputSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const result = calculateMyToolWrapper(parsed.data)
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
```

### 5.3 API route para PDF

Crear `apps/web/app/api/<herramienta>/pdf/route.ts`:

```ts
import { NextResponse } from "next/server"
import { buildMyToolPdf } from "@justo/pdf"
import { calculateMyToolWrapper, myTool } from "@justo/tools"
import { checkRateLimit } from "@/lib/rate-limit"
import { getClientIp } from "@/lib/request-utils"

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const rateLimitResult = await checkRateLimit(`my-tool-pdf`, ip, 20, 60000)
  if (!rateLimitResult.allowed) {
    return NextResponse.json({ error: rateLimitResult.error }, { status: 429 })
  }

  const parsed = myTool.inputSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const result = calculateMyToolWrapper(parsed.data)
    const pdfBytes = await buildMyToolPdf(parsed.data, result)
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="mi-herramienta-${parsed.data.countryCode}.pdf"`,
      },
    })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
```

### 5.4 Integracion en UI

En el componente de la herramienta, agregar funcion `onExportPdf`:

```ts
const onExportPdf = async () => {
  const response = await fetch("/api/my-tool/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  })
  if (!response.ok) return
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `mi-herramienta-${countryCode}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
```

Y boton en el panel de resultados:
```tsx
<button onClick={() => void onExportPdf()}>
  <IconDownload /> {copy.downloadPdf}
</button>
```

### 5.5 Rate limits

Registrar ambos rate limits en `apps/web/lib/rate-limit.ts`:
```
my-tool-calculate: 60 requests / 60s
my-tool-pdf:       20 requests / 60s
```

---

## 6. Tests

### 6.1 Test de calculo

```ts
import { describe, expect, test } from "bun:test"
import { calculateNiMyTool } from "./calculate"

describe("calculateNiMyTool", () => {
  test("calcula correctamente para Nicaragua", () => {
    const result = calculateNiMyTool({ countryCode: "ni", amount: 30000 })
    expect(result.amount).toBe(2100) // 30000 * 7%
  })
})
```

### 6.2 Test de PDF

```ts
import { describe, expect, test } from "bun:test"
import { buildMyToolPdf } from "./my-tool-pdf"

describe("buildMyToolPdf", () => {
  test("genera bytes PDF validos", async () => {
    const bytes = await buildMyToolPdf(input, result)
    expect(bytes.length).toBeGreaterThan(0)
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe("%PDF")
  })
})
```

---

## 7. Checklist final

- [ ] Core: tipos, schema, shared builder (si aplica)
- [ ] Core: modulo por pais con `calculate.ts`, `legal-params.ts`, `calculate.test.ts`
- [ ] Core: `index.ts` exporta todos los paises
- [ ] Tools: wrapper con `Record<CountryCode, calculator>`, metadatos, export
- [ ] Tools: registro en `registry.ts`
- [ ] Web: wizard con onboarding, auto-formateo, confirmacion, resultados
- [ ] Web: copy i18n en `home-copy.tsx`
- [ ] Web: `AppMode` y render en `llm-home.tsx`
- [ ] Web: sidebar link en `app-shell.tsx`
- [ ] Web: AI tool en `respond.ts`
- [ ] Web: API route `calculate/route.ts` con rate limit
- [ ] PDF: generador B&W minimalista con locale por pais
- [ ] PDF: API route `pdf/route.ts` con rate limit
- [ ] PDF: boton de descarga en UI
- [ ] Tests pasan (`bun test`, `tsc --noEmit`)

---

## Consejos

- **Simplicidad primero**: no agregues abstracciones para un solo uso. Copia el patron existente (`salary-net` o `vacations`) y adapta.
- **Evaluar patron de calculo**: si todos los paises comparten la misma formula con diferentes parametros, usa el patron B (builder compartido). Si cada pais tiene logica radicalmente diferente, usa el patron A (calculadora independiente).
- **No inventes datos legales**: todos los parametros legales deben venir del corpus legal versionado.
- **Mantener determinismo**: la logica de calculo no debe depender de la fecha actual (salvo `generatedAt`).
- **Campos opcionales por pais**: si un campo solo aplica a ciertos paises (ej. `pensionSystem` solo PE), declaralo como `optional()` en el schema y documentalo.
- **No loguees PII**: nunca registres nombres de trabajadores o salarios en logs de produccion.
- **Locale del PDF**: usa `currencyLocaleMap` para que los montos se formateen segun la locale del pais (no asumas `es-NI` para todos).
