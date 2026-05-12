---
country: ni
topic: indemnizacion
version: ni-v0.2.0
status: active
source: "Codigo del Trabajo, Ley No. 185"
---

# Indemnizacion

## base_legal

- Art. 42: pago proporcional de prestaciones al terminar la relacion laboral.
- Art. 43: renuncia/mutuo acuerdo no elimina derecho por antiguedad del Art. 45.
- Art. 45: despido sin causa en contrato por tiempo indeterminado.

## regla_operativa

- Para contrato por tiempo indeterminado y terminacion por decision del empleador sin causa justificada:
  - 1 mes de salario por cada uno de los primeros 3 anos.
  - 20 dias de salario por cada ano desde el 4to en adelante.
  - Minimo total: 1 mes.
  - Maximo total: 5 meses.
- Las fracciones de ano se liquidan proporcionalmente.

## formula

- `salario_diario = salario_mensual / 30`
- `dias_indemnizacion = min(150, max(30, dias_primer_tramo + dias_segundo_tramo))`
  - `dias_primer_tramo = min(anos_antiguedad, 3) * 30`
  - `dias_segundo_tramo = max(anos_antiguedad - 3, 0) * 20`
- `monto_indemnizacion = salario_diario * dias_indemnizacion`

## variables

- `salario_mensual`
- `fecha_inicio`
- `fecha_salida`
- `tipo_terminacion`

## supuestos

- El motor aplica esta regla en escenarios de salida con derecho a indemnizacion por antiguedad conforme Art. 45.

## excepciones

- Si la terminacion es por causa justificada imputable al trabajador, no se aplica esta indemnizacion.
- Casos de reintegro y sanciones adicionales se tratan fuera del calculo base.

## vigencia_fuente

- Ley No. 185, vigente con reformas aplicables.
