---
country: mx
topic: deducciones
version: mx-v0.1.0
status: proposed
source: "Ley Federal del Trabajo Art. 110 + Ley del Seguro Social"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- Art. 110: Deducciones autorizadas y limites.
- Ley del Seguro Social: cotizacion IMSS.
- Ley del INFONAVIT: aportacion patronal del 5% (no descontada al trabajador).

## regla_operativa

- IMSS: ~2.5% sobre salario base de cotizacion.
- Aguinaldo exento de deducciones.
- INFONAVIT es aportacion patronal, no se descuenta al trabajador.

## formula

- `imss_laboral = base_imss * tasa_imss_laboral`

## variables

- `base_imss`
- `tasa_imss_laboral`

## supuestos

- `tasa_imss_laboral = 0.025` (2.5%: enfermedades ~1.5% + invalidez ~0.625% + cesantia ~0.375%, pendiente confirmacion legal final).

## excepciones

- Aguinaldo exento de deducciones IMSS segun LFT Art. 87.
- INFONAVIT es aportacion patronal, no se descuenta al trabajador.

## vigencia_fuente

- LFT Art. 110 + Ley del Seguro Social.
