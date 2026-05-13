---
country: pe
topic: onp-afp
version: pe-v0.1.0
status: proposed
source: "Ley 26790 y D.L. 19990 (Sistema de Pensiones Peruano)"
last_reviewed: "2026-05-11"
---

# ONP y AFP (sistema de pensiones)

## base_legal

- D.L. 19990 - Sistema Nacional de Pensiones (ONP).
- Ley 25897 - Sistema Privado de Pensiones (AFP).
- Ley 26790 - Seguro Social de Salud (EsSalud).

## regla_operativa

- ONP (Sistema Nacional): 13% del salario del trabajador.
- AFP (Sistema Privado): ~12.5% (incluye comision y prima de seguro).
- EsSalud: 9% empleador (no descontado al trabajador).
- En el MVP se usa la tasa ONP del 13%.

## formula

- `onp_laboral = base_onp * 0.13`

## supuestos

- `tasa_onp = 0.13` (13% para ONP, pendiente confirmacion).

## vigencia_fuente

- D.L. 19990, Ley 25897, Ley 26790.
