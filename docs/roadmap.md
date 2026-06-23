# Justo OSS Roadmap

## ✅ Done

| Área | Logro |
|------|-------|
| **Core** | 7 herramientas (liquidación, vacaciones, salario neto, aguinaldo, terminación, contrato, preaviso) × 11 países = 77 calculadoras determinísticas |
| **Tools** | Registry con schemas Zod, country overrides, validación API |
| **PDF** | 7 PDFs compactos B&W, sanitización WinAnsi, diseño 1-page para contratos. drawHeader unificado |
| **Chat** | 7 modos de herramienta, refactor a componentes individuales, dropdown de herramientas en input, responsive (flex-wrap, sin overflow horizontal), contenido centrado mobile |
| **UI** | Sidebar/header locale-aware, i18n ES/EN completo, tool flow estandarizado (onboarding, summary, steps, navigation), inputs unificados (h-12, rounded-2xl, bg-card), focus rings + animaciones |
| **SEO** | Tool pages ES+EN por país (hreflang, JSON-LD, sitemap, meta tags, geo tags) |
| **RAG** | V2 con query expansion, TOP_K 8, step limit 4, 11 países indexados (~5,200 chunks) |
| **Terminación** | Personalizada por causa/contrato en 11 países con `isSpecialTerminationClosure`, `noticeGivenInWriting` para NI, 28 tests |
| **Liquidación** | Ajustes explícitos (salario pendiente, horas extra, prestaciones) + ajustes conservadores por causa/contrato en 11 países |
| **Preaviso** | Tool standalone: core + API + UI + PDF + corpus para 11 países. Estandarizada con StepNavigation |
| **Salary-Net** | ISR/IR progresivo con brackets en 9 países, tasa flat en 2. Topes/documentación de SS |
| **Vacaciones** | Días anuales (flat/escala), prima vacacional (0%/25%/30%), divisor diario (30/25) |
| **Aguinaldo/Bono** | 13th month, aguinaldo escala, bono 14, prima, decimo, gratificaciones, SAC. Chile = fallback (gratificación legal requiere utilidades empresa) |
| **Contrato** | 7 cláusulas estándar por país, IDs locales (RUC, DUI, NIT, etc.), cláusula extra MX capacitación |
| **Infra** | Docker + compose, CI (typecheck+lint+test+build), Node 22 (NVM), proxy routes EN |
| **Tests** | 160+ tests (core + tools + PDF), 28 tests de terminación |
| **GridLoader** | 20 mensajes humorísticos rotativos ES/EN con TextSwap |
| **Stats** | Persistencia anónima Upstash conectada vía fire-and-forget POST |

---

## 🟡 En Progreso / Pendiente de Profundizar

| Item | Estado |
|------|--------|
| Precisión jurisdiccional — topes salariales | 🟡 Fase 1 (MX/SV/CO) |
| Precisión jurisdiccional — topes imponibles SS | 🟡 Fase 2 (CL/AR) |
| Precisión jurisdiccional — pensión PE consistente | 🟡 Fase 3 |
| Precisión jurisdiccional — divisor 25 AR | 🟡 Fase 4 |
| Precisión jurisdiccional — créditos fiscales | 🟡 Fase 5 (CL/AR/CO/PE) |
| Employer-cost (costo patronal) | ⬜ Fase 6 |
| Tipos de contrato completos (5 vs 3) | ⬜ Fase 7 |
| Layout + Polish UI | ⬜ Pendiente |
| Accesibilidad WCAG | ⬜ Pendiente |
| Telegram bot EN | ⬜ Pendiente |
| Documentación corpus | ⬜ Pendiente |
| Auditoría legal profesional | ⬜ Pendiente |
| Horas extra, checklist, hiring | ⬜ Pendiente |

---

## 🔜 Plan de Precisión Jurisdiccional (Priorizado)

### Fase 1 — Topes salariales en Liquidación y Terminación

**Problema:** 3 países tienen topes basados en salario mínimo no implementados.

| # | País | Tool | Regla | Archivos |
|---|------|------|-------|----------|
| 1.1 | MX | Liquidación + Terminación | Prima de antigüedad tope 2× SM (Art. 162 LFT) | `settlement/mx/`, `termination/mx/` |
| 1.2 | SV | Liquidación + Terminación | Indemnización tope 4× SM diario (Art. 58 CT) | `settlement/sv/`, `termination/sv/` |
| 1.3 | CO | Liquidación + Terminación | Escala dual <10 SMMLV / ≥10 SMMLV (Art. 64 CST) | `settlement/co/`, `termination/co/` |
| 1.4 | — | Nuevo módulo | `shared/minimum-wages.ts` con valores vigentes por país | `packages/core/src/shared/` |

**Verificación:** Tests por país con salarios bajo/sobre el tope.

---

### Fase 2 — Topes imponibles en Salario Neto

**Problema:** CL y AR no aplican topes a deducciones SS, sobreestimando descuentos para salarios altos.

| # | País | Regla | Archivos |
|---|------|-------|----------|
| 2.1 | CL | AFP + Salud tope 80.2 UF | `salary-net/cl/` |
| 2.2 | AR | ANSES topes mínimo/máximo | `salary-net/ar/` |

**Solución:** Agregar `maxBase?: number` opcional al tipo de deducción SS en `salary-net/shared.ts`.

---

### Fase 3 — Sistema de pensión consistente en PE

**Problema:** Liquidación, terminación y bono de Perú usan ONP 13% fijo; ignoran elección AFP/ONP del usuario.

| # | Tool | Cambio |
|---|------|--------|
| 3.1 | Liquidación PE | Agregar `pensionSystem` al input y propagar |
| 3.2 | Terminación PE | Idem |
| 3.3 | Bonus PE | Idem |
| 3.4 | Schema | Zod + types para SettlementInput, TerminationInput, BonusInput |
| 3.5 | UI | Selector AFP/ONP reutilizable en pasos de cada tool |

---

### Fase 4 — Divisor 25 consistente en AR

**Problema:** Vacaciones AR usa divisor 25 (correcto). Liquidación AR usa 30.

| # | Tool | Cambio |
|---|------|--------|
| 4.1 | Liquidación AR | Usar divisor 25 en vacaciones proporcionales |
| 4.2 | Terminación AR | Verificar y corregir si aplica |

---

### Fase 5 — Créditos y deducciones fiscales

**Problema:** IR progresivo actual solo aplica brackets. No modela créditos ni deducciones personales.

| # | País | Mejora |
|---|------|--------|
| 5.1 | CL | Crédito por gastos (crédito tributario) |
| 5.2 | AR | Deducción especial para empleados (Ganancias) |
| 5.3 | CO | Aportes a salud sobre UVT |
| 5.4 | PE | Deducción de 5 UIT anual |

---

### Fase 6 — Módulo de costos patronales

**Problema:** Ninguna tool muestra el costo total empleador. Tasas documentadas en corpus no implementadas.

**Solución:** `packages/core/src/employer-cost/` con `calculateEmployerCost(salary, countryCode)`. Integrado como sección "Costo patronal" dentro de cada tool existente.

| País | Tasas documentadas |
|------|-------------------|
| PE | EsSalud 9% |
| MX | INFONAVIT 5% |
| CL | AFC empleador 2.4% |
| CO | Parafiscales (SENA, ICBF) — pendiente tasas definitivas |
| General | SS patronal de cada país |

---

### Fase 7 — Tipos de contrato completos

**Problema:** `ContractType` en contrato tiene 3 valores; `jurisdiction-types.ts` tiene 5.

| # | Cambio | Archivos |
|---|--------|----------|
| 7.1 | Agregar `temporada` y `periodo_prueba` a ContractInput | `contract/schema.ts`, `contract/types.ts` |
| 7.2 | Actualizar UI de contrato | `contract/index.tsx` |

---

### Tabla Resumen por Herramienta y País

| Herramienta | NI | SV | GT | HN | CR | PA | MX | CO | PE | AR | CL |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **Liquidación** | ✅ | 🟡1 | ✅ | ✅ | ✅ | ✅ | 🟡1 | 🟡1 | 🟡3 | 🟡4 | ✅ |
| **Terminación** | ✅ | 🟡1 | ✅ | ✅ | ✅ | ✅ | 🟡1 | 🟡1 | 🟡3 | 🟡4 | ✅ |
| **Vacaciones** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡4 | ✅ |
| **Salario Neto** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡2 | 🟡2 |
| **Aguinaldo/Bono** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡3 | ✅ | ✅(fallback) |
| **Contrato** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡7 | ✅ | ✅ | ✅ | ✅ |
| **Preaviso** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Employer Cost** | ⬜6 | ⬜6 | ⬜6 | ⬜6 | ⬜6 | ⬜6 | ⬜6 | ⬜6 | ⬜6 | ⬜6 | ⬜6 |

**✅** = Implementado · **🟡N** = Gap (fase N) · **⬜N** = No implementado

---

## 📅 Later

- [ ] `CHANGELOG.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`
- [ ] Layout + Polish UI (animaciones, responsive, touch targets)
- [ ] Accesibilidad WCAG (contraste, teclado, ARIA, screen reader)
- [ ] Telegram bot EN
- [ ] Documentación corpus legal
- [ ] Auditoría legal/contable profesional (11 países × 7 herramientas)
- [ ] Horas extra, checklist laboral, asistente contratación
- [ ] Tool flow framework unificado
- [ ] Nuevos países según demanda

---

## Relación con Justo Pro

`justo-pro` vive en repo privado separado. Este repo OSS es fuente de verdad para fórmulas, registry, PDFs base, corpus legal y experiencia pública self-hosted.
