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

- `onp_laboral = base_onp * tasa_onp`

## variables

- `base_onp`
- `tasa_onp`

## supuestos

- `tasa_onp = 0.13` (13% ONP, D.L. 19990, pendiente confirmacion legal final).
- AFP: ~12.5% si el trabajador opto por sistema privado (no implementado en MVP).

## excepciones

- Gratificaciones no integran base de ONP segun regimen vigente.
- EsSalud (9%) es aportacion patronal, no se descuenta al trabajador.

## vigencia_fuente

- D.L. 19990, Ley 26790.
