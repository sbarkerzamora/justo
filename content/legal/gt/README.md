# Corpus Legal Guatemala (MVP)

Version: `gt-v0.2.0`

## Set normativo

1. **Codigo de Trabajo de Guatemala** - Decreto 1441.
2. **Ley de Aguinaldo** - Decreto 76-78.
3. **Bono 14** - Decreto 42-92.
4. **Ley del IGSS** y normativa administrativa.
5. **Ley del ISR** y disposiciones vigentes para rentas del trabajo.

## Archivos

- `codigo-de-trabajo.md` (fuente espejo del Codigo de Trabajo, Decreto 1441)
- `indemnizacion.md` (Arts. 78, 82)
- `vacaciones.md` (Art. 130)
- `aguinaldo.md` (Decreto 76-78, Decreto 42-92)
- `salario-proporcional.md`
- `deducciones.md` (Art. 88 + Ley IGSS + Ley ISR)
- `igss.md`
- `isr.md`

## Contrato de datos para el motor

Cada archivo define `base_legal`, `regla_operativa`, `formula`, `variables`, `supuestos`, `excepciones`, `vigencia_fuente`.

## Guia de uso para el asistente

- País cubierto: Guatemala.
- Fuente primaria local: `codigo-de-trabajo.md` (Código de Trabajo de Guatemala, Decreto 1441).
- Documentos temáticos enriquecidos: `indemnizacion.md`, `vacaciones.md`, `aguinaldo.md`, `salario-proporcional.md`, `deducciones.md`, `igss.md`, `isr.md`.
- Antes de responder, el LLM debe recuperar el documento temático más cercano y contrastarlo con la fuente primaria local cuando la pregunta solicite base legal o detalle normativo.
- Para liquidaciones o estimaciones, debe preguntar primero por salario/base, fechas o antigüedad, tipo de terminación y pagos/días pendientes relevantes.
- Si un documento tiene estado `proposed` o contiene tasas sujetas a norma administrativa, la respuesta debe marcar la necesidad de validación legal/contable vigente.
- Ningún documento temático reemplaza asesoría profesional; el contenido es informativo y sirve como fuente operativa del MVP.
