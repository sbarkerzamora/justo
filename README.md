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
  <strong>Asistente laboral open source para Centroamérica</strong><br />
  Consulta legal contextual + calculadora guiada de liquidación laboral con trazabilidad jurídica.
</p>

---

## Características

| | Funcionalidad |
|---|---|
| 🤖 | **Chat legal contextual** — Consulta derechos, prestaciones y deducciones con referencias al corpus legal del país seleccionado. |
| 🧮 | **Calculadora guiada de liquidación** — Completa paso a paso los datos del trabajador y obtén el cálculo completo. |
| 🌎 | **Multi-país** — 11 países: Centroamérica + México, Colombia, Perú, Argentina y Chile. Cada uno con su propia legislación. |
| 📄 | **PDF profesional** — Reporte descargable con header, tabla de ingresos/deducciones, resumen ejecutivo y firmas. |
| ⚖️ | **Trazabilidad legal** — Cada concepto muestra su fórmula de cálculo y el artículo de ley que lo respalda. |
| 🔒 | **Sin datos en servidor** — Toda la información permanece en tu navegador (localStorage). |
| 🌙 | **Tema oscuro** — Compatible con modo claro y oscuro. |

### Novedades recientes

- **Rutas por país**: navegación directa por código (`/ni`, `/gt`, `/sv`, etc.) con shell específico por jurisdicción.
- **SEO técnico**: se agregaron `sitemap` y `robots` + metadata dinámica para páginas por país.
- **Ajustes React/Next**: migración de enlaces internos a `next/link`, banderas a `next/image` y refactor de `LlmHome` en subcomponentes para mejor mantenibilidad.
- **Mejoras de rendimiento**: hoist de `Intl.NumberFormat`, paralelización de operaciones independientes y optimizaciones en generación de PDF.

---

## Cómo funciona

```
  ┌─────────────────────────────────────────────────────────────┐
  │  1. Abres la app → Seleccionas tu país                      │
  │  2. Consultas legales libres o presionas "Iniciar cálculo"  │
  │  3. Completas: nombre, salario, fechas, vacaciones          │
  │  4. Revisas el resumen y confirmas                          │
  │  5. Obtienes desglose completo + PDF descargable            │
  └─────────────────────────────────────────────────────────────┘
```

### En detalle

1. **Selección de país** — Al abrir la app, elige tu país o permite la detección automática por ubicación.
2. **Chat legal** — Escribe cualquier pregunta sobre derechos laborales, indemnizaciones o deducciones. El asistente responde con referencias al corpus legal.
3. **Cálculo guiado** — Presiona "Iniciar cálculo" y completa los datos del trabajador: nombre, salario mensual, fechas de inicio y salida, vacaciones pendientes y frecuencia de pago.
4. **Confirmación** — Revisa el resumen de datos capturados antes de calcular. Puedes editar cualquier campo.
5. **Resultado** — El motor determinístico calcula: indemnización, aguinaldo, vacaciones, salario proporcional y deducciones (INSS/ISSS/IGSS/IHSS/CCSS según país).
6. **PDF** — Descarga un reporte profesional con desglose, fórmulas, base legal y espacios para firmas.

---

## Países soportados

| País | Código | Moneda | Legislación | Versión |
|---|---|---|---|---|
| Nicaragua | `ni` | NIO (Córdoba) | Ley No. 185 | `ni-v0.2.0` |
| Guatemala | `gt` | GTQ (Quetzal) | Decreto 1441 | `gt-v0.1.0` |
| Honduras | `hn` | HNL (Lempira) | Decreto 189-59 | `hn-v0.1.0` |
| El Salvador | `sv` | USD | Código de Trabajo | `sv-v0.1.0` |
| Costa Rica | `cr` | CRC (Colón) | Código de Trabajo | `cr-v0.1.0` |
| Panamá | `pa` | USD | Decreto 252 | `pa-v0.1.0` |
| México | `mx` | MXN (Peso) | LFT | `mx-v0.1.0` |
| Colombia | `co` | COP (Peso) | CST | `co-v0.1.0` |
| Perú | `pe` | PEN (Sol) | Ley General de Trabajo | `pe-v0.1.0` |
| Argentina | `ar` | ARS (Peso) | LCT Ley 20.744 | `ar-v0.1.0` |
| Chile | `cl` | CLP (Peso) | Código del Trabajo | `cl-v0.1.0` |

---

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **UI**: assistant-ui (`@assistant-ui/react`) + Tailwind CSS v4
- **AI**: Vercel AI SDK v6 (`ai`) + OpenRouter gateway
- **Docs**: Fumadocs (`fumadocs-core` + `fumadocs-ui`)
- **PDF**: `pdf-lib`
- **Animaciones**: `motion` + `tw-animate-css`
- **Lenguaje**: TypeScript

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

### Configurar variables de entorno

Copia `.env.example` a `.env.local` y configura tu proveedor de IA:

```bash
cp .env.example .env.local
```

Variables requeridas:

| Variable | Descripción |
|---|---|
| `AI_PROVIDER` | Proveedor de chat: `openrouter` o `nvidia` |
| `OPENROUTER_API_KEY` | Tu API key de OpenRouter |
| `OPENROUTER_BASE_URL` | URL base (default ya incluido) |
| `OPENROUTER_MODEL` | Modelo a usar (ej: `openai/gpt-4o-mini`) |
| `NVIDIA_API_KEY` | Tu API key de NVIDIA, si usas `AI_PROVIDER=nvidia` |
| `NVIDIA_MODEL` | Modelo NVIDIA a usar |

### Ejecutar

```bash
bun run dev
```

Abrir `http://localhost:3000`.

---

## Estructura del proyecto

```
app/
├── [country]/                    # Ruta dinámica por país (ej: /ni)
│   ├── layout.tsx                # Layout por jurisdicción
│   └── page.tsx                  # Home de país (metadata dinámica)
├── api/
│   ├── chat/                     # LLM chat via OpenRouter
│   └── liquidation/
│       ├── calculate/            # Cálculo determinístico (por país)
│       └── pdf/                  # Generación de PDF
├── docs/                         # Documentación (Fumadocs)
├── robots.ts                     # Robots policy
├── sitemap.ts                    # Sitemap generado por app router
└── page.tsx                      # Entrada: selector/redirección de país
components/
├── chat/llm-home.tsx             # Interfaz de chat + calculadora
├── location-dialog.tsx           # Selección de país
├── location-gate.tsx             # Guardia de ubicación
├── docs-footer.tsx               # Footer de documentación
├── docs-nav-title.tsx            # Nav de docs con país
└── ui/                           # Componentes shadcn/ui
content/
├── legal/{ni,gt,hn,sv,cr,pa,mx,co,pe,ar,cl}/   # Corpus legal por país
└── docs/                         # Documentación en MDX
lib/
├── settlement/{ni,gt,hn,sv,cr,pa,mx,co,pe,ar,cl}/  # Motores de cálculo
├── pdf/settlement-pdf.ts         # Generación de PDF
└── source.tsx                    # Fuente estática de Fumadocs
```

---

## API Endpoints

| Endpoint | Descripción |
|---|---|
| `POST /api/chat` | Consulta legal asistida por LLM vía OpenRouter |
| `POST /api/liquidation/calculate` | Cálculo determinístico de liquidación (rutea por `countryCode`) |
| `POST /api/liquidation/pdf` | Genera PDF descargable con el resultado |

---

## ⚠️ Aviso legal

> **Este proyecto es informativo y no constituye asesoría legal profesional.**
>
> - Los cálculos y la información proporcionada deben verificarse contra la normativa oficial vigente de cada país.
> - Las tasas de deducciones (INSS, IGSS, ISSS, IHSS, CCSS, AFP, EPS, ONP, SARA, PAMI, AFC, ISR, etc.) son valores propuestos y requieren confirmación con las entidades oficiales correspondientes.
> - Para casos complejos, disputados o de alto valor, se recomienda contratar los servicios de un abogado laboral o contador profesional en la jurisdicción correspondiente.
> - Este software se proporciona "tal cual", sin garantías de ningún tipo, expresas o implícitas.

---

## Contribuir

Las contribuciones son bienvenidas.

1. Haz fork del repositorio.
2. Crea una rama: `feat/tu-cambio`.
3. Agrega tests para cambios en fórmulas o comportamiento.
4. Abre un Pull Request con contexto y referencias legales cuando corresponda.

### Verificaciones locales

```bash
bun run typecheck
bun run lint
bun run test
bun run build
```

---

## Documentación

- Documentación de la app en `/docs`
- Páginas legales por país: `/docs/legal/{nicaragua,guatemala,honduras,elsalvador,costarica,panama,mexico,colombia,peru,argentina,chile}`
- Corpus legal fuente: `content/legal/`

---

## Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. Configura las variables de entorno:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_BASE_URL`
   - `OPENROUTER_MODEL`
3. Despliega `main` como rama de producción.

Después del deploy, verifica:
- [ ] Las consultas legales responden correctamente.
- [ ] El flujo guiado de liquidación se completa para cada país.
- [ ] La descarga de PDF funciona desde la tarjeta de resultado.

---

## Roadmap

- [x] Nicaragua, Guatemala, Honduras, El Salvador, Costa Rica, Panamá
- [x] México, Colombia, Perú, Argentina, Chile
- [ ] Harden legal corpus and deduction rules across all jurisdictions
- [ ] Add automated tests for all formula branches per country
- [ ] Add thread persistence and case history
- [ ] UI/UX refinements and responsive improvements

---

<p align="center">
  <strong>Justo</strong> · <a href="https://github.com/sbarkerzamora/justo">github.com/sbarkerzamora/justo</a> · Código abierto (MIT)<br />
  Desarrollado por <a href="https://stephanbarker.com">stephanbarker.com</a>
</p>
