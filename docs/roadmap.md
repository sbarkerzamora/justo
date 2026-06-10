# Justo OSS Roadmap

## ✅ Done (63 items)

- [x] 6 herramientas OSS disponibles: liquidación, vacaciones, salario neto, bono/aguinaldo, terminación y contratos — **11 países** cada una.
- [x] Chat con 6 modos de herramienta vía `?tool=` desde sidebar y URL.
- [x] Sidebar global con tool links + controles (país, idioma, tema, GitHub).
- [x] Tool marketplace publico (`/tools`) con SEO por país para cada herramienta.
- [x] `@justo/core` — Cálculos determinísticos para 11 países.
- [x] `@justo/tools` — Tool registry con tipos, schemas Zod y country overrides.
- [x] `@justo/pdf` — 6 PDFs (liquidación, vacaciones, salario neto, bono, terminación, contrato).
- [x] App header global con selector de país sincronizado con URL.
- [x] `/guia-laboral` — Estadísticas anónimas y explicación del proyecto.
- [x] GridLoader animado en 3 estados (Thinking, Generating, Searching).
- [x] Error boundary global (`app/error.tsx`).
- [x] `.env.example` con variables de entorno documentadas.
- [x] Documentación de API publica (`docs/API.md`).
- [x] MIT License, README bilingüe, CONTRIBUTING.md, docs/architecture.md, docs/adding-a-tool.md.
- [x] CI: Typecheck, lint, test, build.
- [x] Docker + docker-compose para self-hosting.
- [x] Tests: 160+ tests en core, tools y PDF.
- [x] Reasoning integrado — componente colapsable con tags de pensamiento LLM.
- [x] Doble scrollbar eliminado.
- [x] RAG v2: TOP_K 8, query expansion, prompt mejorado, step limit 4.
- [x] SEO EN: titles, descriptions, OG tags, SEO data por país en inglés.
- [x] `/en/tools`, `/en/tools/[slug]`, `/en/guia-laboral` — contenido en inglés.
- [x] LanguageToggle path-aware: preserva ruta y query params.
- [x] proxy.ts: permite paso de `/en/tools` y `/en/guia-laboral`.
- [x] Sidebar/header links locale-aware.
- [x] Salario-proporcional: AR, CL, GT, NI, CO, PE.

---

## 🔜 Next — OSS

### 1. Corpus: ISR/IR (income tax)

Agregar reglas de ISR/IR al corpus legal para 9 países.

| # | País | Archivo corpus | Fórmulas core | Tests |
|---|------|---------------|---------------|-------|
| 1.1 | AR | `docs/legal/ar/impuesto-a-las-ganancias.md` | `core/src/ar/` | `core/src/ar/__tests__/` |
| 1.2 | CL | `docs/legal/cl/impuesto-a-la-renta.md` | `core/src/cl/` | `core/src/cl/__tests__/` |
| 1.3 | CO | `docs/legal/co/impuesto-a-la-renta.md` | `core/src/co/` | `core/src/co/__tests__/` |
| 1.4 | CR | `docs/legal/cr/impuesto-sobre-la-renta.md` | `core/src/cr/` | `core/src/cr/__tests__/` |
| 1.5 | HN | `docs/legal/hn/impuesto-sobre-la-renta.md` | `core/src/hn/` | `core/src/hn/__tests__/` |
| 1.6 | MX | `docs/legal/mx/isr.md` | `core/src/mx/` | `core/src/mx/__tests__/` |
| 1.7 | PA | `docs/legal/pa/impuesto-sobre-la-renta.md` | `core/src/pa/` | `core/src/pa/__tests__/` |
| 1.8 | PE | `docs/legal/pe/impuesto-a-la-renta.md` | `core/src/pe/` | `core/src/pe/__tests__/` |
| 1.9 | SV | `docs/legal/sv/impuesto-sobre-la-renta.md` | `core/src/sv/` | `core/src/sv/__tests__/` |

**Verificación:** `pnpm test --filter @justo/core` + `pnpm typecheck --filter @justo/core`

---

### 2. Corpus: Salario-proporcional (países faltantes)

Agregar reglas de salario proporcional al corpus para 5 países.

| # | País | Archivo corpus | Fórmulas core | Tests |
|---|------|---------------|---------------|-------|
| 2.1 | CR | `docs/legal/cr/salario-proporcional.md` | `core/src/cr/` | `core/src/cr/__tests__/` |
| 2.2 | HN | `docs/legal/hn/salario-proporcional.md` | `core/src/hn/` | `core/src/hn/__tests__/` |
| 2.3 | MX | `docs/legal/mx/salario-proporcional.md` | `core/src/mx/` | `core/src/mx/__tests__/` |
| 2.4 | PA | `docs/legal/pa/salario-proporcional.md` | `core/src/pa/` | `core/src/pa/__tests__/` |
| 2.5 | SV | `docs/legal/sv/salario-proporcional.md` | `core/src/sv/` | `core/src/sv/__tests__/` |

**Verificación:** `pnpm test --filter @justo/core` + `pnpm typecheck --filter @justo/core`

---

### 3. Corpus: Preaviso como tópico standalone

Extraer preaviso de las fórmulas existentes en un cálculo independiente.

| # | Tarea | Archivos |
|---|-------|----------|
| 3.1 | Investigar reglas de preaviso por país (actualmente solo AR tiene) | `docs/legal/*/` |
| 3.2 | Crear documentos de corpus por país | `docs/legal/{país}/preaviso.md` |
| 3.3 | Agregar cálculo de preaviso a `@justo/core` | `core/src/{país}/` |
| 3.4 | Registrar como tool param `?tool=notice` | `tools/src/` |
| 3.5 | Agregar entrada en tool registry (`getAvailableTools`) | `tools/src/tools.ts` |
| 3.6 | Crear UI component de tool | `components/tools/notice/` |
| 3.7 | Crear PDF de preaviso | `pdf/src/notice/` |
| 3.8 | Agregar a sidebar links | `components/app-shell.tsx` |
| 3.9 | Agregar a tool detail pages (SEO) | `app/(content)/tools/preaviso/` |
| 3.10 | Tests por país | `core/src/{país}/__tests__/` |

**Verificación:** `pnpm test` + `pnpm typecheck` + `pnpm --filter @justo/web lint`

---

### 4. Re-ingesta completa del corpus

| # | Tarea |
|---|-------|
| 4.1 | Ejecutar `pnpm ingest:reset` |
| 4.2 | Verificar que todas las tools responden correctamente vía chat |
| 4.3 | Verificar RAG recall con queries de prueba por país |

---

### 5. Auditoría legal/contable profesional

| # | Tarea | Por país |
|---|-------|----------|
| 5.1 | Revisión de fórmulas de liquidación | 11 países |
| 5.2 | Revisión de vacaciones | 11 países |
| 5.3 | Revisión de salario neto | 11 países |
| 5.4 | Revisión de aguinaldo/décimo/bono | 11 países |
| 5.5 | Revisión de terminación | 11 países |
| 5.6 | Revisión de contratos | 11 países |
| 5.7 | Revisión de salario proporcional | 6 países |
| 5.8 | Revisión de ISR/IR (post-implementación) | 9 países |
| 5.9 | Revisión de preaviso (post-implementación) | TBD |

---

### 6. Nuevas herramientas

#### 6.1 Horas extra

| # | Tarea | Archivos |
|---|-------|----------|
| 6.1.1 | Investigar reglas de horas extra por país | `docs/legal/*/horas-extra.md` |
| 6.1.2 | Agregar cálculo a `@justo/core` | `core/src/{país}/` |
| 6.1.3 | Registrar en tool registry | `tools/src/tools.ts` |
| 6.1.4 | Crear UI component | `components/tools/overtime/` |
| 6.1.5 | Crear PDF | `pdf/src/overtime/` |
| 6.1.6 | Agregar a sidebar | `components/app-shell.tsx` |
| 6.1.7 | Agregar tool detail page | `app/(content)/tools/horas-extra/` |
| 6.1.8 | Tests por país | `core/src/{país}/__tests__/` |

#### 6.2 Checklist laboral

| # | Tarea | Archivos |
|---|-------|----------|
| 6.2.1 | Definir checklist items genéricos + por país | `tools/src/` |
| 6.2.2 | Registrar en tool registry | `tools/src/tools.ts` |
| 6.2.3 | Crear UI component interactivo | `components/tools/checklist/` |
| 6.2.4 | Agregar a sidebar | `components/app-shell.tsx` |

#### 6.3 Asistente de contratación

| # | Tarea | Archivos |
|---|-------|----------|
| 6.3.1 | Definir flujo de preguntas por país | `tools/src/` |
| 6.3.2 | Registrar en tool registry | `tools/src/tools.ts` |
| 6.3.3 | Crear UI component conversacional | `components/tools/hiring/` |
| 6.3.4 | Integrar con generador de contratos existente | |
| 6.3.5 | Agregar a sidebar | `components/app-shell.tsx` |

---

### 7. Tool flow framework unificado

| # | Tarea | Archivos |
|---|-------|----------|
| 7.1 | Extraer patrón común de las 6 tools existentes | `components/tools/*/index.tsx` |
| 7.2 | Crear hook `useToolFlow` con steps, state machine, validación | `components/tools/use-tool-flow.ts` |
| 7.3 | Crear `ToolFlowLayout` (header, steps, results) | `components/tools/tool-flow-layout.tsx` |
| 7.4 | Migrar settlement component | `components/tools/settlement/` |
| 7.5 | Migrar vacations component | `components/tools/vacations/` |
| 7.6 | Migrar salary-net component | `components/tools/salary-net/` |
| 7.7 | Migrar bonus component | `components/tools/bonus/` |
| 7.8 | Migrar termination component | `components/tools/termination/` |
| 7.9 | Migrar contract component | `components/tools/contract/` |
| 7.10 | Eliminar código duplicado post-migración | |
| 7.11 | Tests de integración del framework | |

**Verificación:** Las 6 tools existentes deben funcionar igual después de la migración.

---

### 8. Tool detail pages — nuevo template SEO

| # | Tarea | Archivos |
|---|-------|----------|
| 8.1 | Actualizar página de liquidación | `app/(content)/tools/liquidacion-laboral/` |
| 8.2 | Actualizar página de vacaciones | `app/(content)/tools/vacaciones/` |

---

### 9. Traducción EN: bot de Telegram

| # | Tarea | Archivos |
|---|-------|----------|
| 9.1 | Identificar strings hardcodeados en español | `apps/telegram-bot/` |
| 9.2 | Crear archivo de traducciones EN | `apps/telegram-bot/lib/translations.ts` |
| 9.3 | Implementar locale detection por usuario | `apps/telegram-bot/` |
| 9.4 | Probar flujos completos en EN | |

---

### 10. Accesibilidad WCAG

| # | Tarea | Prioridad WCAG |
|---|-------|----------------|
| 10.1 | Audit de contraste de color en tools | AA |
| 10.2 | Audit de navegación por teclado en flujos de herramientas | A |
| 10.3 | Audit de labels ARIA en inputs de herramientas | A |
| 10.4 | Audit de foco visible en chat y sidebar | AA |
| 10.5 | Audit de anuncios de screen reader en modales | A |
| 10.6 | Fix issues detectados | |
| 10.7 | Re-audit post-fix | |

---

### 11. Documentación pública del corpus legal

| # | Tarea | Archivos |
|---|-------|----------|
| 11.1 | Documentar estructura del corpus por país | `docs/corpus/README.md` |
| 11.2 | Documentar formato de documentos legales | `docs/corpus/format.md` |
| 11.3 | Documentar proceso de contribución al corpus | `docs/CONTRIBUTING.md` (ampliar) |
| 11.4 | Documentar fuentes legales oficiales por país | `docs/corpus/sources.md` |

---

## 📅 Later

- [ ] `CHANGELOG.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`.
- [ ] Nuevos países y actualizaciones de corpus legal según demanda.
- [ ] Mejores fixtures públicos para validar cálculos por jurisdicción.

---

## Relación con Justo Pro

`justo-pro` vive en un repo privado separado. Este repo OSS sigue siendo la fuente de verdad para fórmulas legales, registry de herramientas, PDFs base, corpus legal y experiencia pública self-hosted.

---

## Tabla resumen

| Area | Estado |
|---|---|
| `@justo/core` | ✅ 6 cálculos × 11 países |
| `@justo/tools` | ✅ 10 herramientas (6 available, 4 coming soon) |
| `@justo/pdf` | ✅ 6 PDFs |
| Tool SEO pages | ✅ ES + EN, hreflang, JSON-LD |
| Chat tool modes | ✅ 6 modos |
| Sidebar & Header | ✅ ES/EN locale-aware |
| RAG | ✅ V2 |
| i18n EN (web) | ✅ tools, tools/[slug], guia-laboral, sidebar, LanguageToggle |
| Proxy content routes | ✅ fix EN routes |
| Corpus: salario-proporcional | ✅ 6 países |
| **Corpus: ISR/IR** | ⬜ 9 países (🔜 #1) |
| **Corpus: salario-proporcional restante** | ⬜ 5 países (🔜 #2) |
| **Corpus: preaviso standalone** | ⬜ (🔜 #3) |
| **Herramientas: horas extra, checklist, hiring** | ⬜ (🔜 #6) |
| **Tool flow framework** | ⬜ (🔜 #7) |
| **Accessibilidad WCAG** | ⬜ (🔜 #10) |
| Telegram bot EN | ⬜ (🔜 #9) |
| Changelog / Security / Code of Conduct | ⬜ |
| Tests | ✅ 160+ |
| CI / Docker | ✅ |
| `justo-pro` | Repo privado separado |
