# Justo OSS Roadmap

## ✅ Done (72 items)

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
- [x] GridLoader: 20 mensajes rotativos humorísticos (ES/EN) con animación TextSwap.
- [x] Chat container: prompt-kit (overflow-y-auto, reemplaza wrapper propio).
- [x] Chat: mensajes assistant minimalistas (sin borde/card) + enlaces a docs por tópico.
- [x] README: roadmap compacto (✅ Done + 🔜 4 prioridades detalladas).
- [x] Tool UX: touch targets ≥44px, tipografía ≥12px, inputs con padding para botón enviar.
- [x] Tool UX: navegación con botón "Anterior" en todas las herramientas.
- [x] i18n: todas las herramientas traducidas al inglés (ES/EN completo).
- [x] Contract tool: full i18n con contract-copy.ts (~75 strings ES/EN).
- [x] Settlement panels: FrequencyPicker con labels traducidos.
- [x] ISR/IR: brackets progresivos en salary-net para AR, CL, HN, CO, CR (9 países).
- [x] ISR/IR: tasa flat en settlement (tasa marginal mínima) — 9 países.
- [x] ISR/IR: corpus legal `impuesto-sobre-la-renta` en source.tsx — 9 países.
- [x] Salario proporcional: tests unitarios para CR, HN, MX, PA, SV.
- [x] Node.js actualizado a v22.22.3 via NVM.
- [x] Re-ingesta del corpus: 11 países indexados (~5,200 chunks).
- [x] Preaviso standalone tool: módulo core + tool registration + API + UI + corpus.
- [x] Estandarización UI: PreavisoTool rewrite con OnboardingPanel + SummaryRow + StepNavigation.
- [x] Estandarización UI: Settlement migrado de ProgressHeader a inline progress bar.
- [x] Estandarización UI: Contract inputs unificados (h-12, rounded-2xl, bg-card).
- [x] Estandarización UI: ProgressHeader eliminado de settlement-panels.tsx.

---

## 🔜 Next — OSS

### 1. Herramientas nuevas

#### 1.1 Horas extra

| # | Tarea | Archivos |
|---|-------|----------|
| 2.1.1 | Investigar reglas de horas extra por país | `docs/legal/*/horas-extra.md` |
| 2.1.2 | Agregar cálculo a `@justo/core` | `core/src/{país}/` |
| 2.1.3 | Registrar en tool registry | `tools/src/tools.ts` |
| 2.1.4 | Crear UI component | `components/tools/overtime/` |
| 2.1.5 | Crear PDF | `pdf/src/overtime/` |
| 2.1.6 | Agregar a sidebar | `components/app-shell.tsx` |
| 2.1.7 | Agregar tool detail page | `app/(content)/tools/horas-extra/` |
| 2.1.8 | Tests por país | `core/src/{país}/__tests__/` |

#### 1.2 Checklist laboral

| # | Tarea | Archivos |
|---|-------|----------|
| 2.2.1 | Definir checklist items genéricos + por país | `tools/src/` |
| 2.2.2 | Registrar en tool registry | `tools/src/tools.ts` |
| 2.2.3 | Crear UI component interactivo | `components/tools/checklist/` |
| 2.2.4 | Agregar a sidebar | `components/app-shell.tsx` |

#### 1.3 Asistente de contratación

---

### 2. Layout + Clarify + Polish UI

Estandarizar espaciado, migrar ternarios a copy keys, agregar interactividad y feedback visual.

| # | Tarea | Archivos |
|---|-------|----------|
| 2.1 | Layout: preavito stat cards, summary rows, header padding | `preaviso/index.tsx` |
| 2.2 | Layout: contract onboarding gaps, badge text, button padding | `contract/index.tsx` |
| 2.3 | Clarify: 9 copy keys nuevas en home-copy.tsx | `home-copy.tsx` |
| 2.4 | Clarify: migrar ternarios preaviso a copy keys | `preaviso/index.tsx` |
| 2.5 | Clarify: salary-net showBack condicional | `salary-net/index.tsx` |
| 2.6 | Polish: focus rings, hover scales, active states en inputs/botones | 7 herramientas |
| 2.7 | Polish: fade-in/slide-up animaciones en resultados | 7 herramientas |
| 2.8 | Polish: responsive (stat cards apiladas, full-width mobile) | 7 herramientas |
| 2.9 | Polish: touch targets 48px, disabled states mejorados | 7 herramientas |

**Verificación:** `pnpm typecheck` + `pnpm test`

| # | Tarea | Archivos |
|---|-------|----------|
| 2.3.1 | Definir flujo de preguntas por país | `tools/src/` |
| 2.3.2 | Registrar en tool registry | `tools/src/tools.ts` |
| 2.3.3 | Crear UI component conversacional | `components/tools/hiring/` |
| 2.3.4 | Integrar con generador de contratos existente | |
| 2.3.5 | Agregar a sidebar | `components/app-shell.tsx` |

---

### 2. Tool flow framework unificado

| # | Tarea | Archivos |
|---|-------|----------|
| 3.1 | Extraer patrón común de las 6 tools existentes | `components/tools/*/index.tsx` |
| 3.2 | Crear hook `useToolFlow` con steps, state machine, validación | `components/tools/use-tool-flow.ts` |
| 3.3 | Crear `ToolFlowLayout` (header, steps, results) | `components/tools/tool-flow-layout.tsx` |
| 3.4 | Migrar settlement component | `components/tools/settlement/` |
| 3.5 | Migrar vacations component | `components/tools/vacations/` |
| 3.6 | Migrar salary-net component | `components/tools/salary-net/` |
| 3.7 | Migrar bonus component | `components/tools/bonus/` |
| 3.8 | Migrar termination component | `components/tools/termination/` |
| 3.9 | Migrar contract component | `components/tools/contract/` |
| 3.10 | Eliminar código duplicado post-migración | |
| 3.11 | Tests de integración del framework | |

**Verificación:** Las 6 tools existentes deben funcionar igual después de la migración.

---

### 3. Accesibilidad WCAG

| # | Tarea | Prioridad WCAG |
|---|-------|----------------|
| 4.1 | Audit de contraste de color en tools | AA |
| 4.2 | Audit de navegación por teclado en flujos de herramientas | A |
| 4.3 | Audit de labels ARIA en inputs de herramientas | A |
| 4.4 | Audit de foco visible en chat y sidebar | AA |
| 4.5 | Audit de anuncios de screen reader en modales | A |
| 4.6 | Fix issues detectados | |
| 4.7 | Re-audit post-fix | |

---

### 4. Traducción EN: bot de Telegram

| # | Tarea | Archivos |
|---|-------|----------|
| 5.1 | Identificar strings hardcodeados en español | `apps/telegram-bot/` |
| 5.2 | Crear archivo de traducciones EN | `apps/telegram-bot/lib/translations.ts` |
| 5.3 | Implementar locale detection por usuario | `apps/telegram-bot/` |
| 5.4 | Probar flujos completos en EN | |

---

### 5. Documentación pública del corpus legal

| # | Tarea | Archivos |
|---|-------|----------|
| 6.1 | Documentar estructura del corpus por país | `docs/corpus/README.md` |
| 6.2 | Documentar formato de documentos legales | `docs/corpus/format.md` |
| 6.3 | Documentar proceso de contribución al corpus | `docs/CONTRIBUTING.md` (ampliar) |
| 6.4 | Documentar fuentes legales oficiales por país | `docs/corpus/sources.md` |

---

### 6. Auditoría legal/contable profesional

| # | Tarea | Por país |
|---|-------|----------|
| 7.1 | Revisión de fórmulas de liquidación | 11 países |
| 7.2 | Revisión de vacaciones | 11 países |
| 7.3 | Revisión de salario neto | 11 países |
| 7.4 | Revisión de aguinaldo/décimo/bono | 11 países |
| 7.5 | Revisión de terminación | 11 países |
| 7.6 | Revisión de contratos | 11 países |
| 7.7 | Revisión de salario proporcional | 11 países |
| 7.8 | Revisión de ISR/IR | 9 países |
| 7.9 | Revisión de preaviso | TBD |

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
| Chat assistant messages | ✅ redesigned minimal + per-topic doc links |
| GridLoader typing labels | ✅ 20 rotating humorous messages (ES/EN) |
| Chat container | ✅ prompt-kit (use-stick-to-bottom wrapper) |
| Proxy content routes | ✅ fix EN routes |
| Corpus: ISR/IR | ✅ 9 países — brackets salary-net + flat rate settlement + corpus source.tsx |
| Corpus: salario-proporcional | ✅ 11 países — formulas verificadas + tests |
| Node.js | ✅ v22.22.3 (NVM) |
| RAG corpus ingestion | ✅ 11 países re-ingeridos (~5,200 chunks) |
| Preaviso tool | ✅ Core + tools + API + UI + corpus (11 países) |
| UI estandarización | ✅ Preaviso rewrite, Settlement inline progress, Contract inputs unificados |
| Validación hardening | ✅ Schemas, preaviso types, edit-dates bug fix, countrySupport routes |
| Layout + Clarify + Polish UI | ⬜ (🔜 #2) |
| **Horas extra, checklist, hiring** | ⬜ (🔜 #1) |
| **Tool flow framework** | ⬜ (🔜 #3) |
| **Tool flow framework** | ⬜ (🔜 #2) |
| **Accesibilidad WCAG** | ⬜ (🔜 #3) |
| **Telegram bot EN** | ⬜ (🔜 #4) |
| **Documentación corpus** | ⬜ (🔜 #5) |
| **Auditoría legal** | ⬜ (🔜 #6) |
| Tests | ✅ 128+ |
| CI / Docker | ✅ |
| `justo-pro` | Repo privado separado |
