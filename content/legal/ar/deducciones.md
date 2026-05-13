---
country: ar
topic: deducciones
version: ar-v0.1.0
status: proposed
source: "Ley 24.241 (SIPA) + Ley 23.660 (Obras Sociales)"
last_reviewed: "2026-05-11"
---

# Deducciones (Jubilacion, PAMI, Obra Social)

## base_legal

- Ley 24.241: Sistema Integrado Previsional Argentino (SIPA).
- Ley 19.032: PAMI (INSSJP).
- Ley 23.660: Obras Sociales.

## regla_operativa

- Jubilacion (SIPA): 11% del salario.
- PAMI: 3% del salario.
- Obra Social: 3% del salario.
- Total deducciones seguridad social: 17%.

## formula

- `jubilacion = base * 0.11`
- `pami = base * 0.03`
- `obra_social = base * 0.03`
- `total_seguridad_social = base * 0.17`

## variables

- `base`
- `jubilacion`
- `pami`
- `obra_social`

## supuestos

- `jubilacion = 0.11` (11% SIPA, Ley 24.241, pendiente confirmacion legal final).
- `pami = 0.03` (3% INSSJP, Ley 19.032, pendiente confirmacion legal final).
- `obra_social = 0.03` (3% Obra Social, Ley 23.660, pendiente confirmacion legal final).

## excepciones

- Aguinaldo (SAC) no integra base de deducciones de seguridad social segun regimen vigente.
- Topes minimos y maximos imponibles establecidos por ANSES no aplicados en MVP.

## vigencia_fuente

- Ley 24.241, Ley 19.032, Ley 23.660.
