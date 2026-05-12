# Contributing to Justo

Thanks for contributing.

## Development setup

1. Fork and clone the repository.
2. Install dependencies with `bun install`.
3. Copy `.env.example` to `.env.local` and add required values.
4. Start dev server with `bun run dev`.

## Quality checks

Run before opening a pull request:

```bash
bun run typecheck
bun run lint
bun run test
bun run build
```

## Pull requests

- Keep pull requests focused and small when possible.
- Explain why the change is needed.
- For legal calculation changes, include legal references and update tests.
- Do not commit secrets or `.env` files.

## Legal safety

- The app provides informational support and deterministic calculations.
- Never add undocumented legal rates or invented exceptions.
- When uncertain, document uncertainty and request legal review.
