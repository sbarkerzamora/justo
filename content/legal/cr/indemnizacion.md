---
country: cr
topic: indemnizacion
version: cr-v0.2.0
status: proposed
source: "Codigo de Trabajo de Costa Rica"
last_reviewed: "2026-05-11"
---

# Indemnizacion (Cesantia y Preaviso)

## base_legal

- Art. 28: Preaviso segun tiempo de servicio.
- Art. 29: Auxilio de cesantia por antiguedad (tabla progresiva).
- Art. 30: Base de calculo = promedio salarial ultimos 6 meses.

## texto_legal

**ARTÍCULO 28.-** En el contrato por tiempo indefinido cada una de las partes puede ponerle término, sin justa causa, dando aviso previo a la otra, de acuerdo con las siguientes reglas:

a) Después de un trabajo continuo no menor de tres meses ni mayor de seis, con un mínimo de una semana de anticipación;

b) Después de un trabajo continuo que exceda de seis meses y no sea mayor de un año, con un mínimo de quince días de anticipación, y

c) Después de un año de trabajo continuo con un mínimo de un mes de anticipación.

Dichos avisos se darán siempre por escrito, pero si el contrato fuere verbal, el trabajador podrá darlo en igual forma en caso de que lo hiciere ante dos testigos; y pueden omitirse, sin perjuicio del auxilio de cesantía, por cualquiera de las partes, pagando a la otra una cantidad igual al salario correspondiente a los plazos anteriores. Durante el término del aviso el patrono estará obligado a conceder un día de asueto al trabajador, cada semana, para que busque colocación.

**ARTÍCULO 29.-** Si el contrato de trabajo por tiempo indeterminado concluye por despido injustificado, o algunas de las causas previstas en el artículo 83 u otra ajena a la voluntad del trabajador, el patrono deberá pagarle un auxilio de cesantía de acuerdo con las siguientes reglas:

1. Después de un trabajo continuo no menor de tres meses ni mayor de seis, un importe igual a siete días de salario.
2. Después de un trabajo continuo mayor de seis meses pero menor de un año, un importe igual a catorce días de salario.
3. Después de un trabajo continuo mayor de un año, con el importe de días de salario indicado en la siguiente tabla:

a) Año 1: 19,5 días por año laborado.
b) Año 2: 20 días por año laborado o fracción superior a seis meses.
c) Año 3: 20,5 días por año laborado o fracción superior a seis meses.
d) Año 4: 21 días por año laborado o fracción superior a seis meses.
e) Año 5: 21,24 días por año laborado o fracción superior a seis meses.
f) Año 6: 21,5 días por año laborado o fracción superior a seis meses.
g) Año 7: 22 días por año laborado o fracción superior a seis meses.
h) Año 8: 22 días por año laborado o fracción superior a seis meses.
i) Año 9: 22 días por año laborado o fracción superior a seis meses.
j) Año 10: 21,5 días por año laborado o fracción superior a seis meses.
k) Año 11: 21 días por año laborado o fracción superior a seis meses.
l) Año 12: 20,5 días por año laborado o fracción superior a seis meses.
m) Año 13 y siguientes: 20 días por año laborado o fracción superior a seis meses.

4. En ningún caso podrá indemnizar dicho auxilio de cesantía más que los últimos ocho años de relación laboral.
5. El auxilio de cesantía deberá pagarse aunque el trabajador pase inmediatamente a servir a las órdenes de otro patrono.

**ARTÍCULO 30.-** El preaviso y el auxilio de cesantía se regirán por las siguientes reglas comunes:

a) El importe de los mismos no podrá ser objeto de compensación, venta o cesión, ni podrá ser embargado, salvo en la mitad por concepto de pensiones alimenticias;

b) La indemnización que corresponda se calculará tomando como base el promedio de salarios devengados por el trabajador durante los últimos seis meses que tenga de vigencia el contrato, o fracción de tiempo menor si no se hubiere ajustado dicho término;

c) La continuidad del trabajo no se interrumpe por enfermedad, vacaciones, huelga legal y otras causas análogas que, según este Código, no rompen el contrato de trabajo, y

d) Será absolutamente nula la cláusula del contrato que tienda a interrumpir la continuidad de los servicios prestados o por prestarse.

## regla_operativa

- Cesantia: ~20 dias de salario por cada ano trabajado (maximo 8 anos).
- Preaviso: 1 semana (3-6 meses), 15 dias (6-12 meses), 1 mes (>1 ano).
- Base: promedio ordinario de ultimos 6 meses.

## formula

- `salario_diario = salario_mensual / 30`
- `dias_cesantia = min(anos_antiguedad * 20, 160)`
- `monto_cesantia = salario_diario * dias_cesantia`
- `dias_preaviso = anos_antiguedad >= 1 ? 30 : meses_antiguedad >= 6 ? 15 : 7`
- `monto_preaviso = salario_diario * dias_preaviso`

## vigencia_fuente

- Codigo de Trabajo de Costa Rica, Arts. 28, 29, 30.

## alcance_documental

- País: Costa Rica.
- Tema operativo: `indemnizacion`.
- Fuente primaria local para contraste: `OpenL-2605112303.md` (Código de Trabajo de Costa Rica).
- Fuente declarada del resumen: Codigo de Trabajo de Costa Rica.
- Estado del documento: `proposed`.
- Uso previsto: Determina si existe pago por terminación y cómo aproximar la base indemnizatoria cuando la relación laboral termina por despido, renuncia u otra causal documentada.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 28: Preaviso segun tiempo de servicio.
- Art. 29: Auxilio de cesantia por antiguedad (tabla progresiva).
- Art. 30: Base de calculo = promedio salarial ultimos 6 meses.

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
- `dias_cesantia = min(anos_antiguedad * 20, 160)`
- `monto_cesantia = salario_diario * dias_cesantia`
- `dias_preaviso = anos_antiguedad >= 1 ? 30 : meses_antiguedad >= 6 ? 15 : 7`
- `monto_preaviso = salario_diario * dias_preaviso`

## preguntas_sugeridas

- ¿La salida fue renuncia, despido con causa, despido sin causa o mutuo acuerdo?
- ¿Cuál fue tu salario ordinario mensual o promedio?
- ¿Cuáles fueron las fechas exactas de inicio y salida?

## ejemplos_de_consulta

- "Me despidieron, ¿qué indemnización aplica?"
- "Renuncié con varios años, ¿qué prestaciones siguen pendientes?"
