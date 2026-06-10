# Como Agregar una Herramienta a Justo

Esta guia explica el proceso para agregar una nueva herramienta laboral open source
al registry de Justo.

## Arquitectura

Toda herramienta sigue la arquitectura de 3 capas:

```
@justo/core       → Calculo deterministico (no depende de React/Next)
@justo/tools      → Registry de la herramienta + metadata + validation
apps/web          → Tool component + tool detail page + API endpoints
```

---

## Paso 1: Definir el calculo en `@justo/core`

Crea el archivo de calculo en `packages/core/src/{tool-name}/`:

```
packages/core/src/{tool-name}/
├── schema.ts      → Zod schema del input
├── types.ts       → Input y Result types
├── index.ts       → Barrel export
├── ni/
│   ├── calculate.ts
│   └── calculate.test.ts
└── ... (por país)
```

### Schema y types

```ts
// schema.ts
import { z } from "zod"

export const myToolInputSchema = z.object({
  countryCode: z.enum(["ni", "sv", ...]),
  monthlySalary: z.number().positive(),
  // ... otros campos
})

// types.ts
export type MyToolInput = z.infer<typeof myToolInputSchema>

export type MyToolResult = {
  currency: string
  amount: number
  formula: string
  legalReference: string
  legalCorpusVersion: string
  generatedAt: string
}
```

### Funcion de calculo por pais

```ts
// ni/calculate.ts
export function calculateNicaraguaMyTool(input: MyToolInput): MyToolResult {
  // ... logica deterministica
  return {
    currency: "NIO",
    amount: ...,
    formula: "...",
    legalReference: "Ley ... Arts. ...",
    legalCorpusVersion: "ni-v0.3.0",
    generatedAt: new Date().toISOString(),
  }
}
```

### Tests

```ts
// ni/calculate.test.ts
import { describe, expect, test } from "bun:test"
import { calculateNicaraguaMyTool } from "./calculate"

describe("calculateNicaraguaMyTool", () => {
  test("calculates correctly", () => {
    const result = calculateNicaraguaMyTool({ ... })
    expect(result.amount).toBeCloseTo(1000)
  })
})
```

Exporta todo desde `packages/core/src/index.ts`.

---

## Paso 2: Registrar en `@justo/tools`

### Tool file

Crea `packages/tools/src/{tool-name}.ts`:

```ts
import { calculateMyTool, myToolInputSchema } from "@justo/core"
import type { CalculationTool } from "./types"

export const myTool: CalculationTool<MyToolInput, MyToolResult> = {
  id: "my-tool",
  slug: "mi-herramienta",
  name: "Mi herramienta",
  shortDescription: "...",
  longDescription: "...",
  category: "calculation",
  availability: "coming_soon", // o "available"
  countrySupport: ["ni"],
  inputRequirements: ["Salario mensual", "Fecha inicio"],
  outputSummary: ["Monto estimado", "Formula", "Referencia legal"],
  inputSchema: myToolInputSchema,
  calculate: calculateMyTool,
  legalReferences: ["Ley ... Arts. ..."],
  corpusVersion: "ni-v0.3.0",
  disclaimer: "...",
  countryOverrides: {
    ni: {
      longDescription: "...",
      legalReferences: ["..."],
      corpusVersion: "ni-v0.3.0",
    },
  },
}
```

### Registry

Agrega tu tool al array `tools` en `packages/tools/src/registry.ts`.

Si la herramienta esta en roadmap (no disponible), usa `comingSoonTool({...})`.

Exporta desde `packages/tools/src/index.ts`.

---

## Paso 3: Tool component en `apps/web`

### Chat mode

Agrega el tool param al `AppMode` type y a `validToolParams` en `components/chat/llm-home.tsx`.

Crea el tool component en `components/tools/{tool-name}/`:

```ts
export function MyTool({
  cc,
  countryName,
  locale,
  currencyInfo,
  fmt,
}: { ... }) {
  // State machine con pasos: welcome → input → confirm → done
  // Llama a calculateMyTool directamente desde @justo/tools
  // Renderiza formularios y resultados
}
```

### Tool detail page

Crea `apps/web/app/tools/{slug}/page.tsx` siguiendo el template de las herramientas existentes (ej: `salario-neto`).

Usa `getToolPageMetadata()` y `buildToolJsonLd()` de `lib/tool-seo.ts` para SEO y structured data.

### Sidebar icon

Agrega el icono en `sidebarIcons` en `app-shell.tsx`.

Agrega el link en `sidebarLinks`.

---

## Paso 4: LLM Tools (opcional)

Si la herramienta debe ser invocable desde el chat via el LLM (no solo desde la UI guiada),
agrega un tool en `apps/web/lib/ai/respond.ts` similar a `quickEstimate` o `quickVacationEstimate`.

---

## Nuevos países y tu herramienta

Toda herramienta debe funcionar en **todos** los países actuales y futuros. Al crear una herramienta:

- Usa el tipo canónico `CountryCode` de `packages/core/src/settlement/types.ts` como fuente de verdad. Nunca hardcodees países literalmente.
- Define un `Record<CountryCode, CalculatorFn>` en `packages/tools/src/{tool}.ts`. Esto fuerza a TypeScript a verificar que cada país tiene su calculadora.
- Si un país aún no tiene lógica para esta herramienta, lanza un error descriptivo: `throw new Error("Herramienta no disponible para {país}")`.
- El enum Zod `countryCodes` en el schema debe usar `SUPPORTED_COUNTRIES` o el union `CountryCode`, no valores literales.
- Agrega `countryOverrides` por cada país en el tool registry con al menos `corpusVersion` y `legalReferences`.
- Cuando se agregue un nuevo país (ver [`docs/adding-a-country.md`](./adding-a-country.md)), se detectará en TypeScript como error de compilación si tu herramienta no lo cubre.

---

## Resumen de archivos a tocar

| Archivo | Que hacer |
|---|---|
| `packages/core/src/{tool-name}/` | Schema, types, calculos por pais, tests |
| `packages/core/src/index.ts` | Exportar |
| `packages/tools/src/{tool-name}.ts` | Tool definition |
| `packages/tools/src/registry.ts` | Agregar al array tools |
| `packages/tools/src/index.ts` | Exportar |
| `components/chat/llm-home.tsx` | Agregar AppMode, validToolParams, import |
| `components/tools/{tool-name}/` | Tool component con state machine |
| `components/app-shell.tsx` | Icono + link en sidebar |
| `apps/web/app/tools/{slug}/page.tsx` | Tool detail page con SEO |
| `lib/ai/respond.ts` | (opcional) LLM tool para el chat |
| `apps/web/app/api/tools/{slug}/calculate/route.ts` | (opcional) API endpoint si se requiere server-side |
