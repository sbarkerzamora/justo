# Justo Monorepo Architecture

Justo is organized as an open source monorepo. The public repository should remain useful without a future Pro product.

## Repository Layout

```text
apps/web        Public Next.js app
packages/core   Deterministic legal calculation engine
packages/tools  Open source labor tools registry
content/legal   Legal corpus by jurisdiction
docs            Repository-level engineering documentation
```

## Runtime Boundaries

### `packages/core`

`@justo/core` is the calculation authority.

It owns:

- Settlement input and output types.
- Zod schemas for settlement payloads.
- Shared arithmetic helpers.
- Country-specific legal parameters.
- Country-specific deterministic formulas.
- Formula tests.

Rules:

- Do not call LLMs from this package.
- Do not depend on Next.js, route handlers, React or browser APIs.
- Add tests for every formula change.
- Keep country logic modular by jurisdiction directory.

### `packages/tools`

`@justo/tools` is the open source tool layer.

It owns:

- Tool metadata.
- Tool availability: `available` or `coming_soon`.
- Tool registry helpers.
- Calculation tool wrappers around `@justo/core`.

Rules:

- General labor tools belong here and should remain open source.
- Roadmap tools can be listed as `coming_soon` without implementation.
- Do not duplicate formulas from `@justo/core`.
- Keep the registry simple until there is a real plugin need.

### `apps/web`

`@justo/web` is the public app.

It owns:

- Next.js routes and route handlers.
- Chat UI and guided calculation flow.
- Public marketplace pages under `/tools`.
- Docs UI under `/docs`.
- PDF generation route for the public app.
- Web-only infrastructure like Redis, rate limiting and provider config.

Rules:

- Consume `@justo/core` and `@justo/tools` instead of duplicating legal logic.
- Keep API keys on the server only.
- Avoid logging personal identifiable information in production.
- Confirm captured inputs before calculating.

### `content/legal`

The legal corpus is the MVP source of truth for references.

Rules:

- Keep files organized by country.
- Cite official sources where possible.
- Do not invent articles, rates or exceptions.
- If corpus changes affect calculations, update `@justo/core` and tests.

## Open Source vs Future Pro

This public repo includes:

- Legal corpus.
- Deterministic calculations.
- General labor tools.
- Public web app.
- Basic PDF generation.
- Self-hosting path.

Future Pro code should stay outside this repo unless explicitly open sourced.

Pro scope, when created:

- Internal HR assistant.
- Professional case review package.
- Organizations, roles and employees.
- Convex persistence.
- Billing.
- Audit logs.
- Private integrations.

The product rule is simple: general labor tools are open source; enterprise operations are paid.

## Verification Contract

Run these before merging changes:

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```
