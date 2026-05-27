---
country: cr
topic: aguinaldo
version: cr-v0.1.0
status: proposed
source: "Ley No. 2412, Ley del Aguinaldo de Costa Rica"
last_reviewed: "2026-05-11"
---

# Aguinaldo

## base_legal

- Ley No. 2412, Ley del Aguinaldo.
- Equivalente a 1/12 de salarios anuales.

## regla_operativa

- El aguinaldo equivale a 1/12 del total de salarios devengados en el ano.
- Al finalizar la relacion, se paga proporcional al periodo trabajado.
- Debe pagarse antes del 20 de diciembre.

## formula

- `aguinaldo_proporcional = salario_mensual * (dias_periodo / 365) * (1/12) * 12`
- Simplificado: `aguinaldo_proporcional = salario_mensual * (dias_periodo / 365)`

## vigencia_fuente

- Ley No. 2412.

## alcance_documental

- País: Costa Rica.
- Tema operativo: `aguinaldo`.
- Fuente primaria local para contraste: `OpenL-2605112303.md` (Código de Trabajo de Costa Rica).
- Fuente declarada del resumen: Ley No. 2412, Ley del Aguinaldo de Costa Rica.
- Estado del documento: `proposed`.
- Uso previsto: Describe el aguinaldo o décimo/bonificación anual aplicable, su proporcionalidad y datos necesarios para estimarlo.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Ley No. 2412, Ley del Aguinaldo.
- Equivalente a 1/12 de salarios anuales.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- periodo anual aplicable
- meses o días laborados en el periodo
- salario ordinario o promedio
- pagos de aguinaldo ya recibidos

## criterios_de_interpretacion

- calcular proporcionalidad solo con periodo conocido
- deducir pagos ya realizados si el usuario los confirma
- distinguir aguinaldo legal de bonos voluntarios
- contrastar con la fuente primaria local cuando la pregunta pida artículo, causal, excepción o fundamento legal detallado
- no extrapolar reglas de otro país ni tasas administrativas no confirmadas en el corpus

## guia_para_respuestas_llm

- Responder en español claro, con alcance informativo y sin presentarlo como asesoría legal profesional.
- Citar este archivo, su versión y la fuente primaria local cuando se use para una respuesta.
- Si faltan datos mínimos, hacer 2 o 3 preguntas concretas antes de calcular.
- Si el usuario pide un monto, usar el motor determinístico disponible; no hacer aritmética libre con el LLM.
- Si la consulta involucra conflicto, salario variable, pagos parciales, fueros, convenio especial o una causal discutida, marcar incertidumbre y recomendar revisión legal/contable profesional.

## formula_documentada

La fórmula operativa existente en este archivo es:

- `aguinaldo_proporcional = salario_mensual * (dias_periodo / 365) * (1/12) * 12`
- Simplificado: `aguinaldo_proporcional = salario_mensual * (dias_periodo / 365)`

## preguntas_sugeridas

- ¿Qué periodo quieres calcular?
- ¿Ya recibiste algún pago de aguinaldo de ese periodo?
- ¿Tu salario mensual era fijo o variable?

## ejemplos_de_consulta

- "¿Cuánto aguinaldo proporcional me toca?"
- "¿Se incluye el aguinaldo en mi liquidación?"
