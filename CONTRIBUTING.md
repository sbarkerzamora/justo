# Contributing to Justo

Thanks for contributing. Justo is an open source labor assistant focused on transparent legal references and deterministic settlement calculations.

## Development Setup

1. Fork and clone the repository.
2. Install dependencies with `pnpm install`.
3. Copy `.env.example` to `.env.local` and add required values.
4. Start the web app with `pnpm dev`.

The public app lives in `apps/web`, but root scripts are the supported entrypoint.

## Quality Checks

Run before opening a pull request:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Monorepo Map

- `apps/web`: public Next.js app, route handlers, UI, docs integration, PDF route and chat experience.
- `packages/core`: deterministic calculation authority, settlement types, schemas, helpers and country formulas.
- `packages/tools`: open source labor tools registry and tool metadata.
- `content/legal`: legal corpus used as the MVP source of truth for references.

## Adding Or Changing Calculations

- Put formula changes in `packages/core/src/settlement/{country}/`.
- Add or update tests next to the country implementation.
- Include legal references in the output lines where applicable.
- Do not rely on LLM-generated arithmetic.
- Do not add undocumented rates, articles or exceptions.

## Adding A Tool

- Add shared metadata to `packages/tools/src/registry.ts`.
- Add implementation in a dedicated file under `packages/tools/src/` only when the tool is actually available.
- Use `availability: "coming_soon"` for roadmap tools without implementation.
- Keep general labor tools open source.
- Add tests for registry behavior and any new calculation behavior.

## Updating Legal Corpus

- Update Markdown files under `content/legal/{country}/`.
- Keep language clear and cite the source law or official reference.
- Do not invent legal articles, rates or interpretations.
- If the change affects a formula, update `packages/core` and tests in the same PR.

## Pull Requests

- Keep pull requests focused and small when possible.
- Explain why the change is needed.
- For legal calculation changes, include legal references and update tests.
- Do not commit secrets or `.env` files.
- Mention any uncertainty that needs legal/accounting review.

## Legal Safety

- The app provides informational support and deterministic calculations.
- The corpus Markdown is the MVP source of truth for legal references.
- Always mark results as informational, not professional legal advice.
- For disputed, incomplete or high-value cases, recommend professional legal/accounting review.
