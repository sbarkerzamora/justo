---
country: ar
topic: preaviso
version: ar-v0.1.0
status: proposed
source: "Ley 20.744 de Contrato de Trabajo"
last_reviewed: "2026-05-11"
---

# Preaviso

## base_legal

- Art. 231: Plazos de preaviso segun antiguedad.
- Art. 232: Indemnizacion sustitutiva si no se otorga preaviso.
- Art. 233: Integracion del mes de despido.

## regla_operativa

- Antiguedad hasta 5 anos: 1 mes de preaviso.
- Antiguedad mayor a 5 anos: 2 meses de preaviso.
- Si no se otorga preaviso, se paga indemnizacion sustitutiva equivalente.
- Integracion mes de despido: si el despido no ocurre el ultimo dia del mes, se pagan los dias restantes.

## formula

- `dias_preaviso = antiguedad > 5 ? 60 : 30`
- `preaviso = salario_diario * dias_preaviso`

## vigencia_fuente

- Ley 20.744, Arts. 231, 232, 233.
