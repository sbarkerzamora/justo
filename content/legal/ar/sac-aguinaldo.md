---
country: ar
topic: sac-aguinaldo
version: ar-v0.1.0
status: proposed
source: "Ley 23.041 + Ley 20.744"
last_reviewed: "2026-05-11"
---

# SAC (Sueldo Anual Complementario / Aguinaldo)

## base_legal

- Ley 23.041: Sueldo Anual Complementario.
- Art. 121-123 LCT: Proporcional al tiempo trabajado.

## regla_operativa

- Dos pagos al ano: 30 de junio y 18 de diciembre.
- Cada pago: 50% de la mejor remuneracion mensual del semestre.
- Al terminar la relacion, proporcional al semestre en curso.

## formula

- `sac_proporcional = (mejor_salario_semestre / 2) * (dias_semestre / 181)`

## vigencia_fuente

- Ley 23.041, Arts. 121, 122, 123 LCT.

## alcance_documental

- País: Argentina.
- Tema operativo: `sac-aguinaldo`.
- Fuente primaria local para contraste: `leydeltrabajoargentina.md` (Ley de Contrato de Trabajo 20.744).
- Fuente declarada del resumen: Ley 23.041 + Ley 20.744.
- Estado del documento: `proposed`.
- Uso previsto: Describe el sueldo anual complementario/aguinaldo, su proporcionalidad y datos necesarios para estimarlo.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Ley 23.041: Sueldo Anual Complementario.
- Art. 121-123 LCT: Proporcional al tiempo trabajado.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- semestre o periodo aplicable
- tiempo trabajado dentro del periodo
- mejor remuneración o base aplicable según la fuente
- pagos ya recibidos

## criterios_de_interpretacion

- separar SAC devengado de salario ordinario pendiente
- validar periodo antes de estimar
- no asumir pagos no informados
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

- `sac_proporcional = (mejor_salario_semestre / 2) * (dias_semestre / 181)`

## preguntas_sugeridas

- ¿Qué semestre o periodo quieres calcular?
- ¿Cuál fue la remuneración base del periodo?
- ¿Ya te pagaron parte del SAC/aguinaldo?

## ejemplos_de_consulta

- "¿Cuánto SAC proporcional corresponde?"
- "¿Qué pasa si salí antes de cerrar el semestre?"
