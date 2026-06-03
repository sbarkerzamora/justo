---
country: gt
topic: salario-proporcional
version: gt-v0.2.0
status: proposed
source: "Codigo de Trabajo de Guatemala, Decreto 1441"
last_reviewed: "2026-06-03"
---

# Salario pendiente

## formula

- `salario_proporcional = (salario_mensual / 30) * dias_trabajados`

## alcance_documental

- País: Guatemala.
- Tema operativo: `salario-proporcional`.
- Fuente primaria local para contraste: `codigo-de-trabajo.md` (Código de Trabajo de Guatemala, Decreto 1441).
- Fuente declarada del resumen: Codigo de Trabajo de Guatemala, Decreto 1441.
- Estado del documento: `proposed`.
- Uso previsto: Calcula el salario pendiente del periodo en curso al momento de la salida.

## criterios_de_interpretacion

- usar salario ordinario mensual como base
- contar días efectivamente trabajados en el mes de salida
- contrastar con la fuente primaria local cuando la pregunta pida artículo, causal, excepción o fundamento legal detallado
- no extrapolar reglas de otro país ni tasas administrativas no confirmadas en el corpus

## guia_para_respuestas_llm

- Responder en español claro, con alcance informativo y sin presentarlo como asesoría legal profesional.
- Si faltan datos mínimos, hacer 2 o 3 preguntas concretas antes de calcular.
- Si el usuario pide un monto, usar el motor determinístico disponible; no hacer aritmética libre con el LLM.

## formula_documentada

La fórmula operativa existente en este archivo es:

- `salario_proporcional = (salario_mensual / 30) * dias_trabajados`

## preguntas_sugeridas

- ¿Cuál es tu salario mensual?
- ¿Cuántos días trabajaste en el mes de salida?

## ejemplos_de_consulta

- "¿Cuánto me deben del mes en curso?"
- "¿Cómo calculan el salario proporcional al renunciar?"
