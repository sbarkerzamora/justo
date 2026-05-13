---
country: pe
topic: deducciones
version: pe-v0.1.0
status: proposed
source: "Ley 26790 + D.L. 19990"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- D.L. 19990: Sistema Nacional de Pensiones (ONP) 13%.
- Ley 26790: EsSalud (9% empleador, no descontado al trabajador).

## regla_operativa

- ONP: 13% sobre base imponible.
- AFP: ~12.5% si el trabajador opto por sistema privado.

## formula

- `onp_laboral = base_onp * 0.13`

## vigencia_fuente

- D.L. 19990, Ley 26790.
