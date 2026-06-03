---
country: cr
topic: vacaciones
version: cr-v0.2.0
status: proposed
source: "Codigo de Trabajo de Costa Rica"
last_reviewed: "2026-05-11"
---

# Vacaciones

## base_legal

- Art. 153: 2 semanas (14 dias) por cada 50 semanas de servicio.
- Art. 156: No compensables en dinero, excepto al terminar la relacion.

## texto_legal

**ARTÍCULO 153.-** Todo trabajador tiene derecho a vacaciones anuales remuneradas, cuyo mínimo se fija en dos semanas por cada cincuenta semanas de labores continuas, al servicio de un mismo patrono.

En caso de terminación del contrato de trabajo antes de cumplir el período de las cincuenta semanas, el trabajador tendrá derecho, como mínimo, a un día de vacaciones por cada mes trabajado, que se le pagará en el momento del retiro de su trabajo.

No interrumpirán la continuidad del trabajo, las licencias sin goce de salario, los descansos otorgados por el presente Código, sus reglamentos y sus leyes conexas, las enfermedades justificadas, la prórroga o renovación inmediata del contrato de trabajo, ni ninguna otra causa análoga que no termine con éste.

**ARTÍCULO 156.-** Las vacaciones serán absolutamente incompensables, salvo las siguientes excepciones:

a) Cuando el trabajador cese en su trabajo por cualquier causa, tendrá derecho a recibir en dinero el importe correspondiente por las vacaciones no disfrutadas.

b) Cuando el trabajo sea ocasional o a destajo.

c) Cuando por alguna circunstancia justificada el trabajador no haya disfrutado de sus vacaciones, podrá convenir con el patrono el pago del exceso del mínimo de dos semanas de vacaciones por cada cincuenta semanas, siempre que no supere el equivalente a tres períodos acumulados. Esta compensación no podrá otorgarse, si el trabajador ha recibido este beneficio en los dos años anteriores.

Sin perjuicio de lo establecido en los incisos anteriores, el patrono velará porque sus empleados gocen de las vacaciones a las cuales tengan derecho anualmente. En todo caso, se respetarán los derechos adquiridos en materia de vacaciones.

## regla_operativa

- 14 dias de vacaciones remuneradas por cada 50 semanas de trabajo.
- Al terminar antes de completar 50 semanas: 1 dia por mes trabajado.
- Base: promedio ordinario de ultimas 50 semanas.

## formula

- `salario_diario = salario_mensual / 30`
- `vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`

## vigencia_fuente

- Codigo de Trabajo de Costa Rica, Arts. 153, 156.

## alcance_documental

- País: Costa Rica.
- Tema operativo: `vacaciones`.
- Fuente primaria local para contraste: `OpenL-2605112303.md` (Código de Trabajo de Costa Rica).
- Fuente declarada del resumen: Codigo de Trabajo de Costa Rica.
- Estado del documento: `proposed`.
- Uso previsto: Explica el derecho a vacaciones, su pago al terminar la relación y la forma de valorar días pendientes o proporcionales.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 153: 2 semanas (14 dias) por cada 50 semanas de servicio.
- Art. 156: No compensables en dinero, excepto al terminar la relacion.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- días de vacaciones pendientes o gozados
- periodo laborado desde el último corte
- salario ordinario o promedio si era variable

## criterios_de_interpretacion

- no confundir vacaciones gozadas con vacaciones pagadas pendientes
- usar salario ordinario/promedio indicado por la fuente
- pedir días pendientes cuando el sistema no pueda inferirlos con certeza
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
- `vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`

## preguntas_sugeridas

- ¿Cuántos días de vacaciones pendientes tenías?
- ¿Tu salario era fijo o variable?
- ¿Desde cuándo no te liquidaban vacaciones?

## ejemplos_de_consulta

- "¿Me deben pagar vacaciones no gozadas?"
- "¿Cómo calculo días pendientes si trabajé parte del año?"
