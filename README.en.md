# Justo

![Justo](public/images/og-image.png)

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License MIT" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/status-alpha-yellow" alt="Status Alpha" />
</p>

<p align="center">
  <strong>🌐 Languages</strong><br />
  <a href="README.md">Español</a> · <a href="README.en.md"><strong>English</strong></a>
</p>

<p align="center">
  <strong>Open-source labor assistant for Central America</strong><br />
  Contextual legal consultation + guided labor settlement calculator with legal traceability.
</p>

---

## Features

| | Functionality |
|---|---|
| 🤖 | **Contextual Legal Chat** — Consult labor rights, benefits, and deductions with references to the legal corpus of the selected country. |
| 🧮 | **Guided Settlement Calculator** — Complete step-by-step worker data and get the full calculation. |
| 🌎 | **Multi-country** — 11 countries: Central America + Mexico, Colombia, Peru, Argentina, and Chile. Each with its own legislation. |
| 📄 | **Professional PDF** — Downloadable report with header, income/deduction table, executive summary, and signature spaces. |
| ⚖️ | **Legal Traceability** — Each concept shows its calculation formula and the law article that supports it. |
| 🔒 | **No Server Data** — All information stays in your browser (localStorage). |
| 🌙 | **Dark Mode** — Compatible with light and dark themes. |

### Recent Updates

- **Country Routes**: Direct navigation by code (`/ni`, `/gt`, `/sv`, etc.) with jurisdiction-specific shell.
- **Technical SEO**: Added `sitemap` and `robots` + dynamic metadata for country pages.
- **React/Next Adjustments**: Migration to `next/link` for internal links, `next/image` for flags, and refactored `LlmHome` into subcomponents for better maintainability.
- **Performance Improvements**: Hoisting `Intl.NumberFormat`, parallelizing independent operations, and optimizing PDF generation.

---

## How It Works

```
  ┌─────────────────────────────────────────────────────────────┐
  │  1. Open the app → Select your country                      │
  │  2. Free legal consultation or press "Start calculation"    │
  │  3. Complete: name, salary, dates, vacation                 │
  │  4. Review summary and confirm                              │
  │  5. Get full breakdown + downloadable PDF                   │
  └─────────────────────────────────────────────────────────────┘
```

### In Detail

1. **Country Selection** — When you open the app, choose your country or allow automatic location detection.
2. **Legal Chat** — Ask any question about labor rights, severance, or deductions. The assistant responds with references to the legal corpus.
3. **Guided Calculation** — Press "Start calculation" and complete worker data: name, monthly salary, start and end dates, pending vacation, and payment frequency.
4. **Confirmation** — Review the summary of captured data before calculating. You can edit any field.
5. **Result** — The deterministic engine calculates: severance, Christmas bonus, vacation, proportional salary, and deductions (INSS/ISSS/IGSS/IHSS/CCSS depending on country).
6. **PDF** — Download a professional report with breakdown, formulas, legal basis, and signature spaces.

---

## Supported Countries

| Country | Code | Currency | Legislation | Version |
|---|---|---|---|---|
| Nicaragua | `ni` | NIO (Córdoba) | Law No. 185 | `ni-v0.2.0` |
| Guatemala | `gt` | GTQ (Quetzal) | Decree 1441 | `gt-v0.1.0` |
| Honduras | `hn` | HNL (Lempira) | Decree 189-59 | `hn-v0.1.0` |
| El Salvador | `sv` | USD | Labor Code | `sv-v0.1.0` |
| Costa Rica | `cr` | CRC (Colón) | Labor Code | `cr-v0.1.0` |
| Panama | `pa` | USD | Decree 252 | `pa-v0.1.0` |
| Mexico | `mx` | MXN (Peso) | LFT | `mx-v0.1.0` |
| Colombia | `co` | COP (Peso) | CST | `co-v0.1.0` |
| Peru | `pe` | PEN (Sol) | General Labor Law | `pe-v0.1.0` |
| Argentina | `ar` | ARS (Peso) | LCT Law 20.744 | `ar-v0.1.0` |
| Chile | `cl` | CLP (Peso) | Labor Code | `cl-v0.1.0` |

---

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **UI**: assistant-ui (`@assistant-ui/react`) + Tailwind CSS v4
- **AI**: Vercel AI SDK v6 (`ai`) + OpenRouter gateway
- **Docs**: Fumadocs (`fumadocs-core` + `fumadocs-ui`)
- **PDF**: `pdf-lib`
- **Animations**: `motion` + `tw-animate-css`
- **Language**: TypeScript

---

## Getting Started

### Requirements

- Node.js >= 22.6
- Bun >= 1.3

### Installation

```bash
bun install
```

### Configure Environment Variables

Copy `.env.example` to `.env.local` and configure your OpenRouter key:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `OPENROUTER_BASE_URL` | Base URL (default already included) |
| `OPENROUTER_MODEL` | Model to use (e.g., `openai/gpt-4o-mini`) |

### Run

```bash
bun run dev
```

Open `http://localhost:3000`.

---

## Project Structure

```
app/
├── [country]/                    # Dynamic route by country (e.g., /ni)
│   ├── layout.tsx                # Layout per jurisdiction
│   └── page.tsx                  # Country home (dynamic metadata)
├── api/
│   ├── chat/                     # LLM chat via OpenRouter
│   └── liquidation/
│       ├── calculate/            # Deterministic calculation (by country)
│       └── pdf/                  # PDF generation
├── docs/                         # Documentation (Fumadocs)
├── robots.ts                     # Robots policy
├── sitemap.ts                    # Sitemap generated by app router
└── page.tsx                      # Entry: country selector/redirect
components/
├── chat/llm-home.tsx             # Chat + calculator interface
├── location-dialog.tsx           # Country selection
├── location-gate.tsx             # Location guard
├── docs-footer.tsx               # Documentation footer
├── docs-nav-title.tsx            # Docs nav with country
└── ui/                           # shadcn/ui components
content/
├── legal/{ni,gt,hn,sv,cr,pa,mx,co,pe,ar,cl}/   # Legal corpus by country
└── docs/                         # Documentation in MDX
lib/
├── settlement/{ni,gt,hn,sv,cr,pa,mx,co,pe,ar,cl}/  # Calculation engines
├── pdf/settlement-pdf.ts         # PDF generation
└── source.tsx                    # Static source for Fumadocs
```

---

## API Endpoints

| Endpoint | Description |
|---|---|
| `POST /api/chat` | Legal consultation assisted by LLM via OpenRouter |
| `POST /api/liquidation/calculate` | Deterministic settlement calculation (routed by `countryCode`) |
| `POST /api/liquidation/pdf` | Generate downloadable PDF with the result |

---

## ⚠️ Legal Notice

> **This project is informational and does not constitute professional legal advice.**
>
> - Calculations and information provided must be verified against the current official regulations of each country.
> - Deduction rates (INSS, IGSS, ISSS, IHSS, CCSS, AFP, EPS, ONP, SARA, PAMI, AFC, ISR, etc.) are proposed values and require confirmation with the corresponding official entities.
> - For complex, disputed, or high-value cases, it is recommended to hire the services of a labor attorney or professional accountant in the corresponding jurisdiction.
> - This software is provided "as is", without warranties of any kind, express or implied.

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a branch: `feat/your-change`.
3. Add tests for changes to formulas or behavior.
4. Open a Pull Request with context and legal references where applicable.

### Local Checks

```bash
bun run typecheck
bun run lint
bun run test
bun run build
```

---

## Documentation

- App documentation in `/docs`
- Legal pages by country: `/docs/legal/{nicaragua,guatemala,honduras,elsalvador,costarica,panama,mexico,colombia,peru,argentina,chile}`
- Source legal corpus: `content/legal/`

---

## Deploy on Vercel

1. Import the repository in Vercel.
2. Configure environment variables:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_BASE_URL`
   - `OPENROUTER_MODEL`
3. Deploy `main` as the production branch.

After deployment, verify:
- [ ] Legal queries respond correctly.
- [ ] The guided settlement flow completes for each country.
- [ ] PDF download works from the result card.

---

## Roadmap

- [x] Nicaragua, Guatemala, Honduras, El Salvador, Costa Rica, Panama
- [x] Mexico, Colombia, Peru, Argentina, Chile
- [ ] Harden legal corpus and deduction rules across all jurisdictions
- [ ] Add automated tests for all formula branches per country
- [ ] Add thread persistence and case history
- [ ] UI/UX refinements and responsive improvements

---

<p align="center">
  <strong>Justo</strong> · <a href="https://github.com/sbarkerzamora/justo">github.com/sbarkerzamora/justo</a> · Open source (MIT)<br />
  Developed by <a href="https://stephanbarker.com">stephanbarker.com</a>
</p>
