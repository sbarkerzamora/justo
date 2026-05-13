---
country: ar
topic: sac-aguinaldo
version: ar-v0.1.0
status: proposed
source: "Ley 23.041 + Ley 20.744"
last_reviewed: "2026-05-11"
---

# SAC (Sueldo Anual Complementario / Aguinaldo)

## base_legal

- Ley 23.041: Sueldo Anual Complementario.
- Art. 121-123 LCT: Proporcional al tiempo trabajado.

## regla_operativa

- Dos pagos al ano: 30 de junio y 18 de diciembre.
- Cada pago: 50% de la mejor remuneracion mensual del semestre.
- Al terminar la relacion, proporcional al semestre en curso.

## formula

- `sac_proporcional = (mejor_salario_semestre / 2) * (dias_semestre / 181)`

## vigencia_fuente

- Ley 23.041, Arts. 121, 122, 123 LCT.
