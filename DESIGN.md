# DESIGN.md

## Product Surface

- Register: product
- Primary surface: chat-first labor assistant for Nicaragua settlement calculations
- Interaction mode: conversational intake + deterministic calculation + printable report output

## Design Direction

- Color strategy: Restrained
- Theme choice scene: a worker or employer reviewing an employment exit in daytime office or home conditions where legibility and calm trust matter more than visual drama
- Tone: calm, civic, clear, practical

## Color System (OKLCH)

Use tinted neutrals and one committed blue for actions and totals.

- `--background`: `oklch(0.97 0.006 225)`
- `--surface`: `oklch(0.99 0.004 230)`
- `--surface-2`: `oklch(0.985 0.004 230)`
- `--text`: `oklch(0.26 0.02 230)`
- `--muted-text`: `oklch(0.45 0.03 230)`
- `--border`: `oklch(0.88 0.01 220)`
- `--primary`: `oklch(0.50 0.11 245)`
- `--primary-strong`: `oklch(0.43 0.11 248)`
- `--danger`: `oklch(0.57 0.19 26)`

## Typography

- Sans: Nunito Sans for interface and legal explanatory copy
- Mono: Geist Mono for formula snippets and references
- Body measure: max 72ch for long legal explanation text
- Scale ratio: at least 1.25 between hierarchy steps

## Layout Rules

- Desktop: split layout, chat column + calculation context panel
- Mobile: stacked layout, chat first then calculation tools
- Rhythm: variable vertical spacing, no nested cards
- Avoid container overuse, preserve open breathing space around chat viewport

## Component Patterns

- Chat shell: assistant-ui `ThreadPrimitive` + `ComposerPrimitive`
- Messages:
  - user bubble: filled primary
  - assistant bubble: neutral surface with subtle border
- Calculation panel:
  - compact input fields
  - explicit calculate action
  - explicit PDF action
- Result block:
  - net total prominent
  - legal corpus version visible

## Copy Guidelines

- Spanish first
- No legal theater language
- Ask one missing fact at a time
- Confirm captured facts before compute
- Always end completed calculation with a PDF suggestion

## Motion

- Keep motion minimal and purposeful
- Use ease-out curves only
- No bounce and no layout-shifting transitions

## Absolute Bans Applied

- No gradient text
- No side-stripe accent borders
- No glassmorphism default
- No hero-metric template blocks
- No repetitive icon cards grid

## Accessibility Baseline

- WCAG 2.2 AA
- Keyboard operable chat and form fields
- Visible focus indicator on all interactive controls
- Color contrast validated for body copy, buttons, and totals
- Error messages must be specific and actionable
