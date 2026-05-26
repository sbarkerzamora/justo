# Corpus Legal Mexico (MVP)

Version: `mx-v0.1.0`

## Set normativo

1. **Ley Federal del Trabajo de Mexico** - LFT.
2. **Ley del Seguro Social** - IMSS.
3. **Ley del INFONAVIT**.

## Archivos

- `1044_Ley_Federal_del_Trabajo.md` (fuente espejo de la LFT)
- `1044_Ley_Federal_del_Trabajo.pdf`
- `indemnizacion.md`
- `aguinaldo.md`
- `vacaciones.md`
- `deducciones.md`
- `imss.md`

## Contrato de datos para el motor

Cada archivo tematico define `base_legal`, `regla_operativa`, `formula`, `variables`, `supuestos`, `excepciones`, `vigencia_fuente`.

## Guia de uso para el asistente

- País cubierto: México.
- Fuente primaria local: `1044_Ley_Federal_del_Trabajo.md` (Ley Federal del Trabajo).
- Documentos temáticos enriquecidos: `aguinaldo.md`, `deducciones.md`, `imss.md`, `indemnizacion.md`, `vacaciones.md`.
- Antes de responder, el LLM debe recuperar el documento temático más cercano y contrastarlo con la fuente primaria local cuando la pregunta solicite base legal o detalle normativo.
- Para liquidaciones o estimaciones, debe preguntar primero por salario/base, fechas o antigüedad, tipo de terminación y pagos/días pendientes relevantes.
- Si un documento tiene estado `proposed` o contiene tasas sujetas a norma administrativa, la respuesta debe marcar la necesidad de validación legal/contable vigente.
- Ningún documento temático reemplaza asesoría profesional; el contenido es informativo y sirve como fuente operativa del MVP.
