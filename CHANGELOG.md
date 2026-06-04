# Changelog

All notable changes to Justo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Salario neto y Aguinaldo/decimo/bono como herramientas disponibles (11 paises)
- Simulador de terminacion y Generador de contratos como tool components
- PureMultimodalInput con suggested actions y auto-resize textarea
- App header global con selector de pais sincronizado con URL
- Tool detail pages con SEO, metadata y JSON-LD por pais
- `docs/API.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`

### Changed
- Refactor completo del chat: state machine AppMode con 6 modos de herramienta
- Sidebar redisenada con Aceternity + custom implementation sin motion
- `/guia-laboral` reemplaza `/anon-stats` como ruta publica
- Country selector movido del sidebar al header global
- Colores del logo cerebral sincronizados con `getCountryAccent()`
- `useStoredCountry` ahora extrae pais del pathname (reactivo)

### Fixed
- Sidebar no visible en desktop por conflicto `hidden md:flex` en Tailwind v4
- Input del chat deshabilitado en estado vacio (textarea ahora solo disabled en isGenerating)
- Country selector fuera de sincronia con la navegacion
- Overlay mobile del sidebar tapaba el contenido al cerrar
- Animaciones de framer-motion reemplazadas por motion/react

## [0.1.0] - 2026-05-01

### Added
- Monorepo OSS con `@justo/core`, `@justo/tools`, `@justo/pdf`, `apps/web`
- Liquidacion laboral para 11 paises latinoamericanos con flujo guiado
- Chat AI con streaming y herramientas deterministicas (`quickEstimate`, `legalCorpusLookup`)
- Sidebar Aceternity basica
- Marketplace de herramientas (`/tools`)
- PDF basico de liquidacion (`@justo/pdf`)
- Estadisticas anonimas con Redis + Upstash
- Proxy de redireccion por pais (`proxy.ts`)
- Bot de Telegram con seleccion de pais
- CI con GitHub Actions (typecheck, lint, test, build)
