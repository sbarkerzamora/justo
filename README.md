# Justo

![Justo](public/images/og-image.png)

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License MIT" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/status-alpha-yellow" alt="Status Alpha" />
</p>

<p align="center">
  <strong>🌐 Idiomas</strong><br />
  <a href="README.md"><strong>Español</strong></a> · <a href="README.en.md">English</a>
</p>

<p align="center">
  <strong>Asistente laboral open source para Centroamérica y América Latina</strong><br />
  Chat laboral con IA + calculadora determinística de liquidación + trazabilidad legal por país.
</p>

---

## Qué es Justo

Justo ayuda a trabajadores a entender sus derechos laborales y estimar liquidaciones con explicaciones claras, fórmulas verificables y referencias al corpus legal del país seleccionado.

El producto separa dos responsabilidades:

- **Chat con IA**: orienta, responde preguntas laborales y explica conceptos usando el corpus legal.
- **Calculadora laboral**: no usa IA para calcular. Los montos se generan con lógica determinística en el servidor, organizada por jurisdicción.

> Justo es informativo y no reemplaza asesoría legal profesional.

---

## Características

| | Funcionalidad |
|---|---|
| 🤖 | **Chat laboral con IA** — Responde consultas sobre derechos, prestaciones, indemnizaciones, vacaciones, aguinaldo y deducciones con referencias al corpus legal. |
| 🧮 | **Calculadora determinística** — Calcula liquidaciones en servidor con reglas explícitas por país; el modelo no inventa aritmética legal. |
| 🌎 | **11 países soportados** — Nicaragua, Guatemala, El Salvador, Honduras, Costa Rica, Panamá, México, Colombia, Perú, Argentina y Chile. |
| 📄 | **PDF imprimible** — Reporte con resumen, ingresos, deducciones, neto total, versión del corpus, aviso legal y líneas de firma. |
| ⚖️ | **Trazabilidad legal** — Cada concepto puede incluir fórmula, referencia legal y versión del corpus utilizado. |
| 💬 | **Respuestas enriquecidas** — Markdown seguro, tablas compactas, fórmulas, fuentes legales y avisos optimizados para móvil. |
| 🔒 | **Privacidad por defecto** — Sin cuentas de usuario ni persistencia de casos por defecto. Evitar PII en logs de producción es parte del contrato del proyecto. |
| 📊 | **Analytics opcional** — Plausible self-hosted puede activarse con variables públicas; está deshabilitado por defecto. |
| 🌙 | **Tema claro/oscuro** — UI responsive con soporte de tema del sistema. |

---

## Cómo funciona

```text
  ┌─────────────────────────────────────────────────────────────┐
  │  1. Abres la app y eliges país e idioma                     │
  │  2. Preguntas al chat o presionas "Iniciar cálculo"         │
  │  3. Capturas salario, fechas, vacaciones y frecuencia       │
  │  4. Confirmas los datos antes de calcular                   │
  │  5. Obtienes desglose, fórmulas, fuentes y PDF              │
  └─────────────────────────────────────────────────────────────┘
```

1. **Selección de país** — La app permite elegir jurisdicción y genera rutas localizadas como `/es/ni` o `/en/ni`.
2. **Chat laboral** — El usuario consulta derechos laborales. La IA debe usar el corpus legal y pedir datos faltantes cuando sea necesario.
3. **Cálculo guiado** — El flujo captura datos mínimos: trabajador, empleador, salario mensual, fechas, vacaciones pendientes y frecuencia de pago.
4. **Cálculo determinístico** — El servidor ejecuta el motor del país correspondiente en `lib/settlement/{country}/`.
5. **Resultado y PDF** — Se muestra el neto estimado, ingresos, deducciones, fórmulas y un PDF descargable.

---

## Países soportados

| País | Código | Moneda | Legislación base | Versión |
|---|---|---|---|---|
| Nicaragua | `ni` | NIO | Ley No. 185 | `ni-v0.2.0` |
| Guatemala | `gt` | GTQ | Decreto 1441 | `gt-v0.1.0` |
| El Salvador | `sv` | USD | Código de Trabajo | `sv-v0.1.0` |
| Honduras | `hn` | HNL | Decreto 189-59 | `hn-v0.1.0` |
| Costa Rica | `cr` | CRC | Código de Trabajo | `cr-v0.1.0` |
| Panamá | `pa` | USD | Código de Trabajo | `pa-v0.1.0` |
| México | `mx` | MXN | Ley Federal del Trabajo | `mx-v0.1.0` |
| Colombia | `co` | COP | Código Sustantivo del Trabajo | `co-v0.1.0` |
| Perú | `pe` | PEN | Ley General de Trabajo | `pe-v0.1.0` |
| Argentina | `ar` | ARS | Ley de Contrato de Trabajo 20.744 | `ar-v0.1.0` |
| Chile | `cl` | CLP | Código del Trabajo | `cl-v0.1.0` |

---

## Stack técnico

- **Framework**: Next.js 16 + React 19
- **UI**: assistant-ui, Tailwind CSS v4, Radix UI
- **Chat IA**: Vercel AI SDK v6 con OpenRouter o NVIDIA
- **Cálculos**: TypeScript determinístico por jurisdicción
- **Docs**: Fumadocs + MDX
- **PDF**: `pdf-lib`
- **Analytics**: Plausible self-hosted opcional con `@plausible-analytics/tracker`
- **Rate limiting/cache**: Upstash Redis opcional/recomendado en producción
- **Validación**: Zod
- **Runtime de tests**: Bun

---

## Cómo empezar

### Requisitos

- Node.js >= 22.6
- pnpm >= 10.18
- Bun >= 1.3

### Instalación

```bash
pnpm install
```

### Variables de entorno

Copia el ejemplo y configura tus claves:

```bash
cp .env.example .env.local
```

Variables principales:

| Variable | Descripción |
|---|---|
| `AI_PROVIDER` | Proveedor del chat: `openrouter` o `nvidia`. |
| `OPENROUTER_API_KEY` | API key de OpenRouter. |
| `OPENROUTER_BASE_URL` | URL base compatible con OpenAI. |
| `OPENROUTER_MODEL` | Modelo del chat. |
| `NVIDIA_API_KEY` | API key de NVIDIA si `AI_PROVIDER=nvidia`. |
| `NVIDIA_BASE_URL` | URL base de NVIDIA. |
| `NVIDIA_MODEL` | Modelo NVIDIA. |
| `NVIDIA_TEMPERATURE` | Temperatura del modelo NVIDIA. |
| `NVIDIA_TOP_P` | Top-p del modelo NVIDIA. |
| `NVIDIA_MAX_OUTPUT_TOKENS` | Máximo de tokens de salida. |
| `NVIDIA_THINKING_ENABLED` | Habilita/deshabilita razonamiento si el modelo lo soporta. |
| `NVIDIA_REASONING_BUDGET` | Presupuesto de razonamiento si aplica. |
| `NEXT_PUBLIC_APP_NAME` | Nombre público de la app. |
| `NEXT_PUBLIC_SITE_URL` | URL canónica para SEO, sitemap y metadata. |
| `UPSTASH_REDIS_REST_URL` | Redis REST URL para rate limiting/cache. |
| `UPSTASH_REDIS_REST_TOKEN` | Token REST de Upstash. |
| `STATS_RETENTION_DAYS` | Días de retención para estadísticas anónimas. |
| `NEXT_PUBLIC_PLAUSIBLE_ENABLED` | Activa Plausible si es `true`. Default: `false`. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Dominio configurado en Plausible. Dejar vacío hasta producción. |
| `NEXT_PUBLIC_PLAUSIBLE_ENDPOINT` | Endpoint self-hosted de eventos, ej. `https://analytics.example.com/api/event`. Requerido si Plausible está habilitado. |

### Ejecutar en desarrollo

```bash
pnpm dev
```

Abrir `http://localhost:3000`.

---

## Estructura del proyecto

```text
app/
├── [locale]/[country]/             # Rutas localizadas por país, ej: /es/ni
│   ├── layout.tsx                  # Metadata por jurisdicción
│   └── page.tsx                    # Home del país
├── api/
│   ├── chat/                       # Chat IA con corpus legal y herramientas
│   ├── liquidation/
│   │   ├── calculate/              # Cálculo determinístico por countryCode
│   │   └── pdf/                    # Generación de PDF
│   └── search/                     # Búsqueda de documentación/corpus
├── docs/                           # Documentación Fumadocs
├── robots.ts
├── sitemap.ts
└── page.tsx                        # Entrada principal / selector de ubicación
components/
├── chat/                           # UI del chat, Markdown y flujo guiado
├── plausible-analytics.tsx         # Tracking opcional de Plausible
├── location-gate.tsx               # Selección/detección de país
├── theme-provider.tsx
└── ui/                             # Componentes visuales reutilizables
content/
├── legal/{ni,gt,sv,hn,cr,pa,mx,co,pe,ar,cl}/  # Corpus legal por país
└── docs/                           # Documentación MDX
lib/
├── settlement/{ni,gt,sv,hn,cr,pa,mx,co,pe,ar,cl}/  # Motores por país
├── ai/                             # Configuración de proveedor y corpus
├── pdf/settlement-pdf.ts
└── countries.ts                    # Metadata de países
```

---

## API endpoints

| Endpoint | Descripción |
|---|---|
| `POST /api/chat` | Chat laboral con IA, corpus legal y herramientas determinísticas. |
| `POST /api/liquidation/calculate` | Calcula liquidación con motor determinístico por país. |
| `POST /api/liquidation/pdf` | Genera PDF descargable con resultado, fórmulas y firmas. |
| `POST /api/search` | Busca contenido en documentación/corpus para la experiencia docs. |

---

## Seguridad legal y privacidad

- El chat usa IA para orientar y explicar; no debe inventar leyes, tasas ni artículos.
- La calculadora no usa IA para la aritmética: los cálculos salen de lógica determinística en servidor.
- El corpus Markdown en `content/legal/` es la fuente de verdad del MVP para referencias.
- Las API keys del proveedor de IA y Redis nunca deben exponerse al cliente.
- No hay cuentas ni persistencia de casos por defecto.
- Plausible está deshabilitado por defecto. Cuando se activa, usa el endpoint self-hosted configurado y registra pageviews sin query string.
- Para producción, evita registrar PII en logs de servidor.

---

## Aviso legal

> **Este proyecto es informativo y no constituye asesoría legal profesional.**
>
> - Los cálculos y respuestas deben verificarse contra la normativa oficial vigente de cada país.
> - Las tasas, deducciones y reglas pueden cambiar y requieren revisión legal/contable.
> - Para casos complejos, disputados o de alto valor, consulta a un abogado laboral o contador profesional en la jurisdicción correspondiente.
> - El software se entrega "tal cual", sin garantías de ningún tipo.

---

## Contribuir

Las contribuciones son bienvenidas.

1. Haz fork del repositorio.
2. Crea una rama: `feat/tu-cambio`.
3. Agrega tests para cambios de fórmulas, reglas o comportamiento.
4. Incluye referencias legales cuando modifiques corpus o lógica por país.
5. Abre un Pull Request con contexto claro.

### Verificaciones locales

```bash
pnpm typecheck
pnpm lint
bun test
pnpm build
```

---

## Documentación

- App docs: `/docs`
- Páginas legales por país: `/docs/legal/{nicaragua,guatemala,honduras,elsalvador,costarica,panama,mexico,colombia,peru,argentina,chile}`
- Corpus legal fuente: `content/legal/`

---

## Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. Configura variables de IA, site URL y Redis si aplica.
3. Si activas Plausible self-hosted, define:
   - `NEXT_PUBLIC_PLAUSIBLE_ENABLED=true`
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=<dominio configurado en Plausible>`
   - `NEXT_PUBLIC_PLAUSIBLE_ENDPOINT=https://<tu-plausible>/api/event`
4. Despliega la rama de producción.

Después del deploy, verifica:

- [ ] El chat responde con corpus legal y mantiene respuestas breves.
- [ ] El flujo guiado calcula correctamente para cada país soportado.
- [ ] La descarga de PDF funciona desde el resultado.
- [ ] Plausible self-hosted recibe pageviews solo si está habilitado.

---

## Roadmap

- [x] Soporte inicial para 11 países
- [x] Chat laboral con IA y corpus legal
- [x] Calculadora guiada con PDF descargable
- [x] Respuestas enriquecidas y responsive en el chat
- [ ] Auditoría legal/contable por jurisdicción
- [ ] Tests exhaustivos por fórmula y rama de cálculo
- [ ] Persistencia opcional de casos e historial
- [ ] Mejoras de accesibilidad y revisión WCAG
- [ ] Más documentación pública del corpus legal

---

<p align="center">
  <strong>Justo</strong> · <a href="https://github.com/sbarkerzamora/justo">github.com/sbarkerzamora/justo</a> · Código abierto (MIT)<br />
  Desarrollado por <a href="https://stephanbarker.com">stephanbarker.com</a>
</p>
