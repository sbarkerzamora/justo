# AGENTS

## Mission

Build and maintain an open source labor assistant focused on trustworthy settlement calculations for Central America, starting with Nicaragua.

## Runtime Contract

- UI runtime: assistant-ui with AI SDK transport
- LLM gateway: OpenRouter (OpenAI-compatible endpoint)
- Language: Spanish by default
- Calculation authority: deterministic server logic, never free-form LLM arithmetic

## Behavioral Rules For The Assistant

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

- Keep country logic modular by jurisdiction directory.
- Add tests for every formula change.
- Prefer explicit typing for all settlement payloads.
- Keep UI copy concise and readable for non-lawyers.
