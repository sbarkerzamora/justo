---
country: hn
topic: indemnizacion
version: hn-v0.2.0
status: proposed
source: "Codigo de Trabajo de Honduras, Decreto 189-59"
last_reviewed: "2026-05-11"
---

# Indemnizacion (Auxilio de Cesantia)

## base_legal

- Art. 120: Auxilio de cesantia por antiguedad.
- Art. 116: Preaviso segun tiempo de servicio.
- Art. 123(b): Base de calculo = promedio salarial ultimos 6 meses.

## texto_legal

**Artículo 116. Preaviso.** Si el contrato es por tiempo indeterminado cualquiera de las partes puede hacerlo terminar dando a la otra un preaviso. El preaviso será notificado con anticipación así:

a) De veinticuatro (24) horas, cuando el trabajador ha servido a un mismo patrono de modo continúo menos de tres (3) meses;

b) De una (1) semana, cuando le haya servido de tres (3) a seis (6) meses;

c) De dos (2) semanas, cuando le haya servido de seis (6) meses a un (1) año;

d) De un (1) mes, cuando le ha servido de uno (1) a dos (2) años; y

e) De dos (2) meses, cuando le ha servido por más de dos (2) años.

Dichos avisos pueden omitirse por cualquiera de las partes pagando a la otra la cantidad que le corresponda según lo dispuesto en el artículo 118.

**Artículo 120. Auxilio de cesantía.** Si el contrato de trabajo por tiempo indeterminado concluye por razón de despido injustificado, o por alguna de las causas previstas en el artículo 114 u otra ajena a la voluntad del trabajador, el patrono deberá pagarle a éste un auxilio de cesantía de acuerdo con las siguientes reglas:

a) Después de un trabajo continuo no menor de tres (3) meses ni mayor de seis (6), con un importe igual a diez (10) días de salario;

b) Después de un trabajo continuo mayor de seis (6) meses pero menor de un año, con un importe igual a veinte (20) días de salario;

c) Después de un trabajo continuo mayor de un (1) año, con un importe igual a un (1) mes de salario, por cada año de trabajo y si los servicios no alcanzan a un (1) año, en forma proporcional al plazo trabajado;

d) En ningún caso podrá exceder dicho auxilio del salario de veinticinco (25) meses.

**Artículo 123. Reglas para preaviso y auxilio de cesantía.** La indemnización que corresponda se calculará tomando como base el promedio de salarios devengados por el trabajador durante los últimos seis (6) meses que tenga de vigencia el contrato, o fracción de tiempo menor si no se hubiere ajustado dicho término.

## regla_operativa

- 3 a 6 meses: 10 dias de salario.
- 6 a 12 meses: 20 dias de salario.
- 1 ano o mas: 1 mes de salario por cada ano trabajado.
- Fracciones de ano se pagan proporcionalmente.
- Maximo: 25 meses de salario.

## formula

- `salario_diario = salario_mensual / 30`
- `dias_indemnizacion = min(anos_antiguedad * 30, 750)`
- `monto_indemnizacion = salario_diario * dias_indemnizacion`

## variables

- `salario_mensual`
- `fecha_inicio`
- `fecha_salida`

## vigencia_fuente

- Codigo de Trabajo de Honduras, Decreto 189-59, Art. 116, 120, 123.

## alcance_documental

- País: Honduras.
- Tema operativo: `indemnizacion`.
- Fuente primaria local para contraste: `OpenL-2605112256.md` (Código de Trabajo de Honduras).
- Fuente declarada del resumen: Codigo de Trabajo de Honduras, Decreto 189-59.
- Estado del documento: `proposed`.
- Uso previsto: Determina si existe pago por terminación y cómo aproximar la base indemnizatoria cuando la relación laboral termina por despido, renuncia u otra causal documentada.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 120: Auxilio de cesantia por antiguedad.
- Art. 116: Preaviso segun tiempo de servicio.
- Art. 123(b): Base de calculo = promedio salarial ultimos 6 meses.

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
- `dias_indemnizacion = min(anos_antiguedad * 30, 750)`
- `monto_indemnizacion = salario_diario * dias_indemnizacion`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `salario_mensual`
- `fecha_inicio`
- `fecha_salida`

## preguntas_sugeridas

- ¿La salida fue renuncia, despido con causa, despido sin causa o mutuo acuerdo?
- ¿Cuál fue tu salario ordinario mensual o promedio?
- ¿Cuáles fueron las fechas exactas de inicio y salida?

## ejemplos_de_consulta

- "Me despidieron, ¿qué indemnización aplica?"
- "Renuncié con varios años, ¿qué prestaciones siguen pendientes?"
