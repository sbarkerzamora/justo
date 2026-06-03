# Corpus Legal Honduras (MVP)

Version: `hn-v0.2.0`

## Set normativo

1. **Codigo de Trabajo de Honduras** - Decreto 189-59.
2. **Ley del Decimotercer Mes** - Decreto 133-92.
3. **Ley del IHSS** y normativa administrativa.

## Archivos

- `OpenL-2605112256.md` (fuente espejo del Codigo de Trabajo)
- `codigo_de_trabajo-hn.pdf`
- `indemnizacion.md`
- `vacaciones.md`
- `aguinaldo.md`
- `deducciones.md`
- `ihss.md`

## Contrato de datos para el motor

Cada archivo tematico define `base_legal`, `regla_operativa`, `formula`, `variables`, `supuestos`, `excepciones`, `vigencia_fuente`.

## Guia de uso para el asistente

- País cubierto: Honduras.
- Fuente primaria local: `OpenL-2605112256.md` (Código de Trabajo de Honduras).
- Documentos temáticos enriquecidos: `aguinaldo.md`, `deducciones.md`, `ihss.md`, `indemnizacion.md`, `vacaciones.md`.
- Antes de responder, el LLM debe recuperar el documento temático más cercano y contrastarlo con la fuente primaria local cuando la pregunta solicite base legal o detalle normativo.
- Para liquidaciones o estimaciones, debe preguntar primero por salario/base, fechas o antigüedad, tipo de terminación y pagos/días pendientes relevantes.
- Si un documento tiene estado `proposed` o contiene tasas sujetas a norma administrativa, la respuesta debe marcar la necesidad de validación legal/contable vigente.
- Ningún documento temático reemplaza asesoría profesional; el contenido es informativo y sirve como fuente operativa del MVP.
