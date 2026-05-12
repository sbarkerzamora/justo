# Justo

Justo is an open source labor assistant for Central America, starting with Nicaragua. The first tool is a conversational labor settlement calculator that explains formulas, references legal basis, and exports a printable PDF with worker and employer signature lines.

## MVP Scope

- Country: Nicaragua (`ni`)
- Experience: LLM chat-first interface
- Calculation authority: deterministic server logic
- Output: detailed settlement breakdown + printable PDF

## Tech Stack

- Next.js 16 + React 19
- assistant-ui (`@assistant-ui/react`) for chat UI
- Vercel AI SDK v6 (`ai`) + OpenRouter gateway
- TypeScript + Tailwind CSS v4

## Quick Start

### 1) Requirements

- Node.js >= 22.6
- Bun >= 1.3

### 2) Install dependencies

```bash
bun install
```

### 3) Configure environment variables

Copy `.env.example` to `.env.local` and set your OpenRouter key:

```bash
cp .env.example .env.local
```

Required variables:

- `OPENROUTER_API_KEY`
- `OPENROUTER_BASE_URL` (default already provided)
- `OPENROUTER_MODEL`

### 4) Run locally

```bash
bun run dev
```

Open `http://localhost:3000`.

## Project Structure

- `app/` Next.js routes and API endpoints
- `components/chat/` assistant-ui chat interface
- `lib/settlement/` deterministic settlement logic by jurisdiction
- `lib/pdf/` PDF generation utilities
- `content/legal/ni/` legal corpus for Nicaragua

## Current API Endpoints

- `POST /api/chat` streamed assistant responses via OpenRouter
- `POST /api/liquidation/calculate` deterministic settlement result
- `POST /api/liquidation/pdf` printable settlement PDF

## Legal and Safety Notes

- This project is informational and does not constitute legal advice.
- Settlement formulas must be verified against current official regulations.
- Complex or disputed cases should be escalated to legal/accounting professionals.

## Open Source Contribution

Contributions are welcome.

1. Fork the repository.
2. Create a branch: `feat/your-change`.
3. Add tests for formula or behavior changes.
4. Open a pull request with context and legal references when applicable.

### Suggested local checks

```bash
bun run typecheck
bun run lint
```

## Documentation

- App documentation is available at `/docs`.
- Legal source pages for Nicaragua are available at `/docs/legal/nicaragua`.
- Source legal markdown lives in `content/legal/ni`.

## Deploy on Vercel

1. Import repository in Vercel.
2. Configure environment variables:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_BASE_URL`
   - `OPENROUTER_MODEL`
3. Deploy `main` as production branch.

After deploy, verify:

- Legal chat responses work.
- Guided liquidation flow completes.
- PDF download works from result card.

## Roadmap

- Harden Nicaragua legal corpus and deduction rules (INSS + IR)
- Add automated tests for all formula branches
- Add support for Guatemala, Honduras, El Salvador, Costa Rica, and Panama
- Add thread persistence and case history
