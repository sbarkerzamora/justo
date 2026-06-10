# Adding a New Country

This guide covers every layer that must be touched when adding a new country to Justo. Following this checklist ensures all 6 tools, the chat, and the legal corpus work correctly for the new jurisdiction.

## Overview

Adding a country touches 5 layers:

| Layer | Scope |
|-------|-------|
| `@justo/core` | Canonical type + per-tool calculators + legal params + tests |
| `@justo/tools` | Country registry + calculator dispatch + per-country overrides |
| `apps/web` | UI country config, AI metadata, LLM tool descriptions |
| `content/legal` | Legal corpus markdown with structured frontmatter |
| RAG (Upstash) | Vector embeddings for semantic search |

---

## 1. `@justo/core` — Deterministic Calculations

### 1.1 Canonical Country Code Type

**File:** `packages/core/src/settlement/types.ts`

Add the new country code to the `CountryCode` union. This is the single source of truth.

```diff
  export type CountryCode =
    | "ni" | "gt" | "hn" | "sv" | "cr" | "pa"
    | "mx" | "co" | "pe" | "ar" | "cl"
+   | "XX"
```

Also add the country's currency code if new:

```diff
  export type CurrencyCode = "NIO" | "GTQ" | ... | "XXC"
```

### 1.2 Per-Tool Calculators

For each of the 6 tools, create a country subdirectory and calculator:

```
packages/core/src/
├── settlement/XX/
│   ├── calculate.ts       # calculate{XCountry}Settlement
│   ├── legal-params.ts    # Country-specific rates (INSS, IR, min salary, etc.)
│   └── calculate.test.ts  # Tests for this country
├── salary-net/XX/
│   ├── calculate.ts
│   ├── legal-params.ts
│   └── calculate.test.ts
├── vacations/XX/
│   ├── calculate.ts
│   └── calculate.test.ts
├── bonus/XX/
│   ├── calculate.ts
│   └── calculate.test.ts
├── termination/XX/
│   ├── calculate.ts
│   └── calculate.test.ts
└── contract/XX/
    ├── calculate.ts
    └── calculate.test.ts
```

**Template: `calculate.ts`**

```ts
import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { get{XCountry}SalaryNetLegalRates } from "./legal-params"

const CURRENCY = "XXC"
const LEGAL_CORPUS_VERSION = "XX-v0.1.0"

export const calculate{XCountry}SalaryNet = (input: SalaryNetInput): SalaryNetResult => {
  const { socialSecurityRate, incomeTaxRate } = get{XCountry}SalaryNetLegalRates()
  return buildNetSalary(input, CURRENCY, LEGAL_CORPUS_VERSION,
    [{ label: "Social security", rate: socialSecurityRate, legalReference: "Art. X" }],
    { label: "Income tax", rate: incomeTaxRate, legalReference: "Art. Y", source: "corpus" }
  )
}
```

**Template: `legal-params.ts`**

```ts
export const get{XCountry}SalaryNetLegalRates = () => {
  return { socialSecurityRate: 0.08, incomeTaxRate: 0.02 }
}
```

**Template: `calculate.test.ts`**

```ts
import { describe, it, expect } from "bun:test"
import { calculate{XCountry}SalaryNet } from "./calculate"

describe("XCountry salary net", () => {
  it("calculates net salary from gross", () => {
    const result = calculate{XCountry}SalaryNet({
      countryCode: "XX",
      grossSalary: 10000,
      frequency: "mensual",
    })
    expect(result.netSalary).toBeGreaterThan(0)
    expect(result.currency).toBe("XXC")
  })
})
```

### 1.3 Barrel Exports

**File:** `packages/core/src/{tool}/index.ts`

```diff
+ export { calculate{XCountry}Settlement } from "./XX/calculate"
+ export { calculate{XCountry}SalaryNet } from "./XX/calculate"
  // repeat for each tool
```

### 1.4 Zod Schema

**File:** `packages/core/src/{tool}/schema.ts`

If the tool schema has a `countryCodes` enum, add the new code:

```diff
  countryCode: z.enum([
    "ni", "gt", "sv", "hn", "cr", "pa", "mx", "co", "pe", "ar", "cl",
+   "XX",
  ]),
```

---

## 2. `@justo/tools` — Tool Registry

### 2.1 Country List

**File:** `packages/tools/src/registry.ts`

Add to `allCountries`:

```diff
  const allCountries: CountryCode[] = [
    "ar", "cl", "co", "cr", "gt", "hn", "mx", "ni", "pa", "pe", "sv",
+   "XX",
  ]
```

### 2.2 Calculator Dispatch (×6 tools)

For each tool file (`packages/tools/src/settlement.ts`, `salary-net.ts`, `vacations.ts`, etc.):

```ts
// 1. Add to calculator map
const calculators: Record<CountryCode, (input: Input) => Result> = {
  // ...existing entries
  XX: calculate{XCountry}{ToolName},
}

// 2. Add country override
const countryOverrides: Partial<Record<CountryCode, CountryOverride>> = {
  // ...existing entries
  XX: {
    longDescription: "Description of how this tool works in {XCountry}.",
    legalReferences: ["Art. A", "Art. B"],
    corpusVersion: "XX-v0.1.0",
  },
}
```

---

## 3. `apps/web` — Web App

### 3.1 Country Info

**File:** `apps/web/lib/countries.ts`

Add a `CountryInfo` entry with all required fields:

- `name` — Country name in Spanish
- `nameEn` — Country name in English
- `code` — 2-letter ISO code
- `flag` — ISO code for flag CDN
- `currency` — ISO currency code
- `locale` — BCP-47 locale string
- `hreflang` — Language tag for hreflang
- `timezone` — IANA timezone
- `title`, `description`, `ogTitle`, `ogDescription` — SEO in Spanish
- `titleEn`, `descriptionEn`, `ogTitleEn`, `ogDescriptionEn` — SEO in English
- `exampleQuestions` — Suggested chat questions in Spanish
- `exampleQuestionsEn` — Suggested chat questions in English

### 3.2 AI Country Metadata

**File:** `apps/web/lib/ai/countries-meta.ts`

```diff
  export const SUPPORTED_COUNTRIES = [
-   "ni", "gt", "sv", "hn", "cr", "pa", "mx", "co", "pe", "ar", "cl",
+   "XX", "ni", "gt", "sv", "hn", "cr", "pa", "mx", "co", "pe", "ar", "cl",
  ] as const

  export const countryMeta: Record<string, { name: string; law: string }> = {
+   XX: { name: "XCountry", law: "Labor Code Name (Law No. X)" },
  }
```

### 3.3 LLM Tool Descriptions

**File:** `apps/web/lib/ai/respond.ts`

Update the deduction names in `quickNetSalaryEstimate`'s description to include the new country:

```diff
  description: `Calcula el salario neto estimado en ... usando el motor deterministico.
-   (${countryCode === "ni" ? "INSS, IR" : ...})
+   (${countryCode === "ni" ? "INSS, IR" : ... countryCode === "XX" ? "Social, Tax" : ...})
```

Also update `quickVacationEstimate` to remove the hardcoded `"ni"` restriction (line 347):

```diff
  if (countryCode !== "ni" && countryCode !== "XX") {
    return "El calculo de vacaciones solo esta disponible para Nicaragua y XCountry actualmente."
  }
```

### 3.4 Color Accent (optional)

**File:** `apps/web/lib/country-accent.ts`

Add a theme accent color for the new country's UI.

### 3.5 Docs Link

**File:** `apps/web/lib/legal-docs-link.ts`

```diff
  const countryDocsLinks: Record<string, string> = {
+   XX: "/docs/legal/xcountry",
  }
```

---

## 4. Legal Corpus

### 4.1 Directory

Create the country directory:

```
content/legal/XX/
```

### 4.2 Required Files

| File | Purpose |
|------|---------|
| `README.md` | Corpus version, legal set description, usage notes |
| `{LawName}.md` | Full text of the governing labor law |
| `indemnizacion.md` | Severance/termination rules |
| `vacaciones.md` | Vacation accrual and payment rules |
| `salario-proporcional.md` | Proportional salary calculation |
| `deducciones.md` | Mandatory payroll deductions |
| `{social-security}.md` | Social security (country-specific name) |
| `{income-tax}.md` | Income tax on wages (if applicable) |
| `aguinaldo.md` / `{bonus}.md` | 13th salary, bonus 14, prima, SAC, gratificaciones (as applicable) |

### 4.3 File Format

Every topic file must use this frontmatter:

```yaml
---
country: XX
topic: indemnizacion
version: XX-v0.1.0
status: active
source: "Labor Code Name, Law No. X"
---
```

Follow the standard section structure used by existing countries:

```
# Topic Name

## base_legal
## texto_legal
## regla_operativa
## formula
## variables
## supuestos
## excepciones
## vigencia_fuente
## alcance_documental
## trazabilidad_normativa
## datos_minimos_para_responder
## criterios_de_interpretacion
## guia_para_respuestas_llm
## formula_documentada
## variables_documentadas
## preguntas_sugeridas
## ejemplos_de_consulta
```

---

## 5. RAG — Upstash Vector Index

Upload legal chunks with metadata `country = "XX"` to Upstash so the RAG system can retrieve context for the new country.

If self-hosting, the `legal-corpus-cache.ts` reads from the filesystem directly — no separate upload step is needed.

---

## 6. Verification Checklist

Run all checks from the monorepo root:

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Tests (core, tools, PDF)
bun test

# Full build
pnpm build
```

Manual verification:

- [ ] Chat responds with correct country metadata ("Eres Justo, experto en derecho laboral de XCountry")
- [ ] RAG returns relevant legal snippets for XCountry queries
- [ ] Each tool calculator produces correct results for XCountry
- [ ] Tool detail pages render with XCountry-specific content
- [ ] `/guia-laboral?country=XX` shows XCountry stats and SEO content
- [ ] Country selector shows the new flag and name
- [ ] Sidebar tool links work with the new country selected
- [ ] PDF generation works for each tool in the new country

## Files Touched Summary

| File | Change |
|------|--------|
| `packages/core/src/settlement/types.ts` | Add `"XX"` to CountryCode |
| `packages/core/src/{tool}/XX/calculate.ts` | ×6 — country calculator |
| `packages/core/src/{tool}/XX/legal-params.ts` | ×2 — legal rates |
| `packages/core/src/{tool}/XX/calculate.test.ts` | ×6 — tests |
| `packages/core/src/{tool}/index.ts` | ×6 — barrel exports |
| `packages/core/src/{tool}/schema.ts` | ×1-2 — Zod enum |
| `packages/tools/src/registry.ts` | Add to allCountries |
| `packages/tools/src/{tool-name}.ts` | ×6 — calculator + overrides |
| `apps/web/lib/countries.ts` | CountryInfo entry |
| `apps/web/lib/ai/countries-meta.ts` | SUPPORTED_COUNTRIES + countryMeta |
| `apps/web/lib/ai/respond.ts` | Deduction descriptions |
| `apps/web/lib/country-accent.ts` | Color accent |
| `apps/web/lib/legal-docs-link.ts` | Docs link mapping |
| `content/legal/XX/` | Corpus directory + files |
