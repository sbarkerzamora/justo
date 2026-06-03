# Corpus Legal Costa Rica (MVP)

Version: `cr-v0.2.0`

## Set normativo

1. **Codigo de Trabajo de Costa Rica**.
2. **Ley del Aguinaldo** - Ley No. 2412.
3. **Ley Constitutiva de la CCSS** - Ley No. 17.

## Archivos

- `OpenL-2605112303.md` (fuente espejo del Codigo de Trabajo)
- `Codigo_Trabajo_Costa_Rica.pdf`
- `indemnizacion.md`
- `aguinaldo.md`
- `vacaciones.md`
- `deducciones.md`
- `ccss.md`

## Contrato de datos para el motor

Cada archivo tematico define base legal, regla operativa, formula, variables, supuestos, excepciones y vigencia.

## Guia de uso para el asistente

- País cubierto: Costa Rica.
- Fuente primaria local: `OpenL-2605112303.md` (Código de Trabajo de Costa Rica).
- Documentos temáticos enriquecidos: `aguinaldo.md`, `ccss.md`, `deducciones.md`, `indemnizacion.md`, `vacaciones.md`.
- Antes de responder, el LLM debe recuperar el documento temático más cercano y contrastarlo con la fuente primaria local cuando la pregunta solicite base legal o detalle normativo.
- Para liquidaciones o estimaciones, debe preguntar primero por salario/base, fechas o antigüedad, tipo de terminación y pagos/días pendientes relevantes.
- Si un documento tiene estado `proposed` o contiene tasas sujetas a norma administrativa, la respuesta debe marcar la necesidad de validación legal/contable vigente.
- Ningún documento temático reemplaza asesoría profesional; el contenido es informativo y sirve como fuente operativa del MVP.
