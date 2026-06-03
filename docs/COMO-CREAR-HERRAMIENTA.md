# Como crear una herramienta en Justo

Este documento describe paso a paso como agregar una nueva herramienta de calculo o asistente al proyecto Justo, siguiendo los patrones existentes de liquidacion y vacaciones.

## Resumen de arquitectura

Una herramienta en Justo consta de tres capas:

1. **Core (`@justo/core`)** — Logica de calculo determinista, esquemas Zod y tipos
2. **Tools (`@justo/tools`)** — Wrapper con metadatos (nombre, descripcion, paises soportados, etc.)
3. **Web (`apps/web`)** — Wizard interactivo, API routes y generacion de PDF

---

## 1. Backend: Logica de calculo (`packages/core/src/<herramienta>/`)

### 1.1 Crear directorio por pais

```
packages/core/src/<herramienta>/
├── types.ts      # Tipos de entrada y salida
├── schema.ts     # Esquema Zod para validacion
├── <pais>/
│   ├── calculate.ts   # Funcion pura de calculo
│   └── legal-params.ts # Parametros legales del pais
└── index.ts      # Re-exports
```

**Ejemplo (`types.ts`):**

```ts
import type { CountryCode, CurrencyCode } from "../settlement"

export type MyToolCountryCode = Extract<CountryCode, "ni" | "gt">

export interface MyToolInput {
  countryCode: MyToolCountryCode
  monthlySalary: number
  startDate: string
  endDate: string
}

export interface MyToolResult {
  currency: CurrencyCode
  amount: number
  formula: string
  legalReference: string
  generatedAt: string
  legalCorpusVersion: string
}
```

**Ejemplo (`schema.ts`):**

```ts
import { z } from "zod"

export const myToolInputSchema = z.object({
  countryCode: z.enum(["ni", "gt"]),
  monthlySalary: z.number().positive(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export type MyToolInputPayload = z.infer<typeof myToolInputSchema>
```

**Ejemplo (`<pais>/calculate.ts`):**

```ts
import type { MyToolInput, MyToolResult } from "../types"

export function calculateMyTool(input: MyToolInput): MyToolResult {
  const amount = input.monthlySalary * 0.5 // logica determinista
  return {
    currency: "NIO",
    amount,
    formula: `${input.monthlySalary} * 0.5`,
    legalReference: "Ley 185 Art. 123",
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: "ni-v1.0.0",
  }
}
```

**Reglas:**
- La funcion debe ser **pura**: mismos inputs = mismos outputs, sin side effects.
- No usar `node:fs` ni dependencias de runtime del servidor. Devolver constantes inline.
- Agregar tests en `packages/core/src/<herramienta>/<pais>/calculate.test.ts`.

---

## 2. Tool wrapper (`packages/tools/src/<herramienta>.ts`)

Crear un archivo que exponga la herramienta con metadatos para el frontend:

```ts
import { calculateMyTool, myToolInputSchema, type MyToolInput, type MyToolResult } from "@justo/core"
import type { CalculationTool } from "./types"

export const myTool: CalculationTool<MyToolInput, MyToolResult> = {
  id: "my-tool",
  slug: "mi-herramienta",
  name: "Mi Herramienta",
  shortDescription: "Descripcion corta.",
  longDescription: "Descripcion larga detallada.",
  category: "calculation",
  availability: "available",
  countrySupport: ["ni", "gt"],
  inputRequirements: ["Pais", "Salario mensual", "Fechas"],
  outputSummary: ["Monto", "Formula", "Referencia legal"],
  inputSchema: myToolInputSchema,
  calculate: calculateMyTool,
  legalReferences: ["Ley 185 Art. 123"],
  corpusVersion: "ni-v1.0.0",
  disclaimer: "Resultado informativo...",
}

export function calculateMyToolPublic(input: MyToolInput): MyToolResult {
  if (!myTool.countrySupport.includes(input.countryCode)) {
    throw new Error(`Pais no soportado: ${input.countryCode}`)
  }
  return calculateMyTool(input)
}
```

Exportar desde `packages/tools/src/index.ts`:

```ts
export * from "./my-tool"
```

---

## 3. UI: Wizard interactivo (`apps/web/components/tools/<herramienta>/`)

### 3.1 Crear el componente principal

Crear `apps/web/components/tools/<herramienta>/index.tsx` con la siguiente estructura:

```tsx
"use client"

import { useReducer, useState } from "react"
import { calculateMyTool } from "@justo/tools"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"
import type { MyToolInput } from "@justo/core"

export type MyToolStep = "welcome" | "monthlySalary" | "startDate" | "endDate" | "confirm" | "done"

interface MyToolState {
  step: MyToolStep
  form: MyToolInput
  result: ReturnType<typeof calculateMyTool> | null
}

type Action =
  | { type: "setStep"; step: MyToolStep }
  | { type: "patchForm"; patch: Partial<MyToolInput> }
  | { type: "setResult"; result: ReturnType<typeof calculateMyTool> | null }
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

### 3.2 Agregar copy i18n

Agregar textos en `apps/web/lib/home-copy.tsx`:

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

## 4. PDF (opcional pero recomendado)

### 4.1 Generador de PDF

Crear `packages/pdf/src/<herramienta>-pdf.ts`:

```ts
import { PDFDocument } from "pdf-lib"
import type { MyToolInput, MyToolResult } from "@justo/core"
import {
  loadFonts, drawText, drawLine, drawBox,
  drawSectionTitle, drawKeyValue, drawSignatureBoxes, drawFooter,
} from "./pdf-helpers"

export const buildMyToolPdf = async (
  input: MyToolInput,
  result: MyToolResult,
) => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89])
  const fontSet = await loadFonts(pdf)

  const W = 595.28
  const H = 841.89
  const left = 48
  const right = W - 48
  let y = H - 48

  // Header
  drawText(page, "MI HERRAMIENTA", left, y, { size: 24, bold: true, fontSet })
  // ... resto del layout B&W minimalista

  return pdf.save()
}
```

Exportar desde `packages/pdf/src/index.ts`:

```ts
export * from "./my-tool-pdf"
```

### 4.2 API route

Crear `apps/web/app/api/<herramienta>/pdf/route.ts`:

```ts
import { NextResponse } from "next/server"
import { buildMyToolPdf } from "@justo/pdf"
import { calculateMyTool, myTool } from "@justo/tools"
import { checkRateLimit } from "@/lib/rate-limit"
import { getClientIp } from "@/lib/request-utils"

export async function POST(request: Request) {
  // rate limit, parse, validate, calculate, generate PDF, respond
}
```

### 4.3 Integracion en UI

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

---

## 5. Tests

### 5.1 Test de calculo

```ts
import { describe, expect, test } from "bun:test"
import { calculateMyTool } from "@justo/core"

describe("calculateMyTool", () => {
  test("calcula correctamente para Nicaragua", () => {
    const result = calculateMyTool({ countryCode: "ni", monthlySalary: 30000, startDate: "2024-01-01", endDate: "2025-01-01" })
    expect(result.amount).toBe(15000)
  })
})
```

### 5.2 Test de PDF

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

## 6. Checklist final

- [ ] Core: tipos, schema, calculo, tests
- [ ] Tools: wrapper con metadatos, export
- [ ] Web: wizard con onboarding, auto-formateo, confirmacion, resultados
- [ ] Web: copy i18n en `home-copy.tsx`
- [ ] Web: `AppMode` y render en `llm-home.tsx`
- [ ] Web: sidebar link
- [ ] PDF: generador B&W minimalista
- [ ] PDF: API route con rate limit
- [ ] PDF: boton de descarga en UI
- [ ] Tests pasan (`bun test`, `tsc --noEmit`, `eslint`)

---

## Consejos

- **Simplicidad primero**: no agregues abstracciones para un solo uso. Copia el patron de vacaciones/liquidacion y adapta.
- **No inventes datos legales**: todos los parametros legales deben venir del corpus legal versionado.
- **Mantener determinismo**: la logica de calculo no debe depender de la fecha actual (salvo `generatedAt`).
- **No loguees PII**: nunca registres nombres de trabajadores o salarios en logs de produccion.
