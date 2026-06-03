# Corpus Legal El Salvador (MVP)

Version: `sv-v0.2.0`

## Set normativo

1. **Codigo de Trabajo de El Salvador** - Decreto Legislativo.
2. **Ley del Seguro Social (ISSS)**.
3. **Ley del Sistema de Ahorro para Pensiones (AFP)** - Decreto 927.

## Archivos

- `OpenL-2605112301.md` (fuente espejo del Codigo de Trabajo)
- `codigo-del-trabajo-el-salvador.pdf`
- `indemnizacion.md`
- `aguinaldo.md`
- `vacaciones.md`
- `deducciones.md`
- `isss.md`
- `afp.md`

## Contrato de datos para el motor

Cada archivo tematico define `base_legal`, `regla_operativa`, `formula`, `variables`, `supuestos`, `excepciones`, `vigencia_fuente`.

## Guia de uso para el asistente

- País cubierto: El Salvador.
- Fuente primaria local: `OpenL-2605112301.md` (Código de Trabajo de El Salvador).
- Documentos temáticos enriquecidos: `afp.md`, `aguinaldo.md`, `deducciones.md`, `indemnizacion.md`, `isss.md`, `vacaciones.md`.
- Antes de responder, el LLM debe recuperar el documento temático más cercano y contrastarlo con la fuente primaria local cuando la pregunta solicite base legal o detalle normativo.
- Para liquidaciones o estimaciones, debe preguntar primero por salario/base, fechas o antigüedad, tipo de terminación y pagos/días pendientes relevantes.
- Si un documento tiene estado `proposed` o contiene tasas sujetas a norma administrativa, la respuesta debe marcar la necesidad de validación legal/contable vigente.
- Ningún documento temático reemplaza asesoría profesional; el contenido es informativo y sirve como fuente operativa del MVP.
