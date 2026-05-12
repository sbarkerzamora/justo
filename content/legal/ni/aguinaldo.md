---
country: ni
topic: aguinaldo
version: ni-v0.2.0
status: active
source: "Codigo del Trabajo, Ley No. 185"
---

# Aguinaldo

## base_legal

- Art. 93: derecho a decimo tercer mes completo o proporcional.
- Art. 94: base de calculo (ultimo salario o salario mas alto de ultimos 6 meses en modalidad variable).
- Art. 95: oportunidad de pago.
- Art. 97: exencion de impuesto, descuentos, cotizaciones y deducciones.

## regla_operativa

- Al finalizar relacion laboral, se paga parte proporcional del decimo tercer mes por tiempo trabajado mayor de un mes y menor de un ano.

## formula

- `aguinaldo_proporcional = salario_base_aguinaldo * (dias_periodo / 365)`

## variables

- `salario_base_aguinaldo`
- `dias_periodo`
- `modalidad_salario` (fijo o variable)

## supuestos

- El MVP usa salario mensual fijo como base, salvo que se habilite modulo de salario variable.

## excepciones

- Si el tiempo trabajado no supera un mes, no se liquida proporcional de aguinaldo por esta regla.

## vigencia_fuente

- Ley No. 185, Arts. 93, 94, 95, 97.
