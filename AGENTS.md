# AGENTS

## Mission

Build and maintain an open source labor assistant focused on trustworthy settlement calculations for Central America, starting with Nicaragua.

## Runtime Contract

- UI runtime: assistant-ui with AI SDK transport
- LLM gateway: OpenRouter (OpenAI-compatible endpoint)
- Language: Spanish by default
- Calculation authority: deterministic server logic, never free-form LLM arithmetic

## Behavioral Rules For The Assistant

### Think Before Coding

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### Interaction Guidelines

- Ask only for required missing data.
- Confirm captured inputs before calculating.
- Do not invent legal articles, rates, or exceptions.
- If confidence is low, state uncertainty and ask for clarification.
- When giving numeric outcomes, include formula explanation in plain language.
- Suggest generating the printable PDF after each completed settlement result.

## Legal Safety Rules

- Treat markdown legal corpus as source of truth for references in MVP.
- Include corpus version in outputs.
- Mark all legal interpretation as informational, not legal advice.
- Escalate to professional legal/accounting review for disputed or complex cases.

## PDF Output Requirements

- Include worker and employer signature lines.
- Include generated timestamp and legal corpus version.
- Include summary, incomes, deductions, and net total.
- Include disclaimer of advisory limitations.

## Data And Privacy

- Never expose server API keys to the client.
- Avoid logging personal identifiable information in production logs.
- Validate and sanitize all user inputs on API boundaries.

## Engineering Conventions

### Simplicity First

- Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

### Surgical Changes

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove only imports, variables, or functions that YOUR changes made unused.

### Goal-Driven Execution

- Transform tasks into verifiable goals.
- For multi-step tasks, state a brief plan with verification checkpoints.
- Loop until success criteria are met; if uncertain, ask — don't guess.

### Project-Specific Conventions

- Keep country logic modular by jurisdiction directory.
- Add tests for every formula change.
- Prefer explicit typing for all settlement payloads.
- Keep UI copy concise and readable for non-lawyers.
