# Justo OSS Roadmap

## Now

- [x] 6 herramientas OSS disponibles: liquidación, vacaciones, salario neto, bono/aguinaldo, terminación y contratos — **11 países** cada una.
- [x] Chat con 6 modos de herramienta (settlement, vacations, salary-net, bonus, termination, contract) vía `?tool=` desde sidebar y URL.
- [x] Sidebar global Aceternity con tool links + controles (país, idioma, tema, GitHub).
- [x] Tool marketplace publico (`/tools`) con SEO por país para cada herramienta.
- [x] `@justo/core` — Cálculos determinísticos (settlement, vacations, salary-net, bonus, termination, contract) para 11 países.
- [x] `@justo/tools` — Tool registry con tipos, schemas Zod y country overrides.
- [x] `@justo/pdf` — PDF de liquidación, vacaciones, salario neto, bono, terminación y contrato.
- [x] App header global con selector de país sincronizado con URL.
- [x] `/guia-laboral` — Estadísticas anónimas y explicación del proyecto.
- [x] Error boundary global (`app/error.tsx`).
- [x] `.env.example` con variables de entorno documentadas.
- [x] Documentación de API publica (`docs/API.md`).
- [x] MIT License, README bilingüe, CONTRIBUTING.md, docs/architecture.md, docs/adding-a-tool.md.
- [x] CI: Typecheck, lint, test, build.
- [x] Docker + docker-compose para self-hosting.
- [x] Tests: 160 tests en core (66 calc × país), tools (8), PDF (6).

## Next — OSS

- [ ] Herramientas: horas extra, checklist laboral, asistente de contratación.
- [ ] Tool flow framework unificado (reducir duplicación entre tool components).
- [ ] Actualizar tool detail pages de liquidación y vacaciones al nuevo template SEO.
- [ ] Auditoría legal/contable por jurisdicción para fórmulas y referencias.
- [ ] Mejoras de accesibilidad WCAG en flujos de herramientas y chat.
- [ ] Más documentación pública del corpus legal.

## Later

- [ ] `CHANGELOG.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`.
- [ ] Internacionalización completa (100% traducido a EN).
- [ ] Nuevos países y actualizaciones de corpus legal según demanda.
- [ ] Mejores fixtures públicos para validar cálculos por jurisdicción.

## Relación con Justo Pro

`justo-pro` vive en un repo privado separado. Este repo OSS sigue siendo la fuente de verdad para fórmulas legales, registry de herramientas, PDFs base, corpus legal y experiencia pública self-hosted.

---

| Area | Estado |
|---|---|
| `@justo/core` | ✅ 6 cálculos × 11 países |
| `@justo/tools` | ✅ 10 herramientas (6 available, 4 coming soon) |
| `@justo/pdf` | ✅ 6 PDFs (liquidación, vacaciones, salario neto, bono, terminación, contrato) |
| Tool SEO pages | ✅ 6 páginas con metadata, country variants, JSON-LD |
| Chat tool modes | ✅ 6 modos con state machine `AppMode` |
| Sidebar | ✅ Global desktop + mobile overlay |
| Header | ✅ Global con selector de país, idioma, tema, GitHub |
| MultimodalInput | ✅ Textarea + suggested actions |
| CI | ✅ Typecheck, lint, test, build |
| Docker/Compose | ✅ Dockerfile + compose + .dockerignore |
| Tests | ✅ 160 tests entre core, tools y PDF |
| Self-hosting docs | ✅ README: sección Docker |
| API docs | ✅ `docs/API.md` con todos los endpoints |
| Changelog / Security / Code of Conduct | ⬜ Pendiente |
| `justo-pro` | Repo privado separado; consume packages OSS sin duplicar fórmulas |
