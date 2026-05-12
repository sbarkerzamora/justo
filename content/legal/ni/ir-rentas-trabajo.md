---
country: ni
topic: ir-rentas-trabajo
version: ni-v0.2.0
status: proposed
source: "Ley de Concertacion Tributaria y normativa vigente de rentas del trabajo"
last_reviewed: "2026-05-11"
---

# IR (rentas del trabajo)

## base_legal

- Ley de Concertacion Tributaria.
- Disposiciones vigentes para retencion o calculo de rentas del trabajo aplicables a liquidacion.

## regla_operativa

- El IR se aplica sobre base imponible definida por normativa tributaria, despues de deducciones permitidas.
- En el MVP inicial se usa una tasa referencial operativa documentada y revisable.

## formula

- `ir_laboral = max(base_ir, 0) * tasa_ir_laboral`

## variables

- `base_ir`
- `tasa_ir_laboral`

## supuestos

- `tasa_ir_laboral = 0.015` (set normativo propuesto, pendiente confirmacion legal final en produccion).

## excepciones

- Aguinaldo proporcional exento de deducciones segun Art. 97 de Ley 185.

## vigencia_fuente

- Requiere confirmacion de tabla/escala anual vigente antes de uso productivo.
