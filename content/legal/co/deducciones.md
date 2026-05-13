---
country: co
topic: deducciones
version: co-v0.1.0
status: proposed
source: "Codigo Sustantivo del Trabajo Art. 150 + Ley 100 de 1993"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- Art. 150: Deducciones autorizadas y topes.
- Ley 100 de 1993: Seguridad social obligatoria.

## regla_operativa

- EPS (salud): 4% sobre base.
- Pension (AFP): 4% sobre base.
- Total seguridad social: 8% sobre base imponible.
- Tope de embargabilidad: 20% del exceso sobre minimo (Art. 155).

## formula

- `eps_laboral = base_eps * tasa_eps`
- `pension_laboral = base_pension * tasa_pension`
- `total_seguridad_social = eps_laboral + pension_laboral`

## variables

- `base_eps`
- `tasa_eps`
- `base_pension`
- `tasa_pension`

## supuestos

- `tasa_eps = 0.04` (4% salud, Ley 100 de 1993, pendiente confirmacion legal final).
- `tasa_pension = 0.04` (4% pension, Ley 100 de 1993, pendiente confirmacion legal final).

## excepciones

- Aguinaldo y cesantia no integran base de deducciones de seguridad social segun regimen vigente.
- Aportes a cuenta AFC (ahorro voluntario) no implementados en MVP.

## vigencia_fuente

- Codigo Sustantivo del Trabajo Arts. 150, 155 + Ley 100 de 1993.
