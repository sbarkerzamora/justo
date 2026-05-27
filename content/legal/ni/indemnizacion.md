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

## alcance_documental

- País: Nicaragua.
- Tema operativo: `indemnizacion`.
- Fuente primaria local para contraste: `Ley185Nic.md` (Código del Trabajo, Ley No. 185).
- Fuente declarada del resumen: Codigo del Trabajo, Ley No. 185.
- Estado del documento: `active`.
- Uso previsto: Determina si existe pago por terminación y cómo aproximar la base indemnizatoria cuando la relación laboral termina por despido, renuncia u otra causal documentada.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 42: pago proporcional de prestaciones al terminar la relacion laboral.
- Art. 43: renuncia/mutuo acuerdo no elimina derecho por antiguedad del Art. 45.
- Art. 45: despido sin causa en contrato por tiempo indeterminado.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- tipo de terminación y causa invocada
- fecha de inicio y fecha de salida
- salario ordinario mensual o promedio aplicable
- si hubo preaviso, pagos parciales o acuerdos previos

## criterios_de_interpretacion

- distinguir derecho a indemnización de pago de prestaciones proporcionales
- aplicar topes, tramos o mínimos solo si están expresamente en la base legal
- no asumir despido injustificado si el usuario solo dice que terminó la relación
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

- `salario_diario = salario_mensual / 30`
- `dias_indemnizacion = min(150, max(30, dias_primer_tramo + dias_segundo_tramo))`
  - `dias_primer_tramo = min(anos_antiguedad, 3) * 30`
  - `dias_segundo_tramo = max(anos_antiguedad - 3, 0) * 20`
- `monto_indemnizacion = salario_diario * dias_indemnizacion`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `salario_mensual`
- `fecha_inicio`
- `fecha_salida`
- `tipo_terminacion`

## preguntas_sugeridas

- ¿La salida fue renuncia, despido con causa, despido sin causa o mutuo acuerdo?
- ¿Cuál fue tu salario ordinario mensual o promedio?
- ¿Cuáles fueron las fechas exactas de inicio y salida?

## ejemplos_de_consulta

- "Me despidieron, ¿qué indemnización aplica?"
- "Renuncié con varios años, ¿qué prestaciones siguen pendientes?"
