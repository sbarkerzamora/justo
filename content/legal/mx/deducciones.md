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

- `imss_laboral = base_imss * 0.025`

## vigencia_fuente

- LFT Art. 110 + Ley del Seguro Social.
