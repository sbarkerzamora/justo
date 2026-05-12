---
country: ni
topic: deducciones
version: ni-v0.2.0
status: active
source: "Ley 185 Art. 88 + normativa INSS e IR vigente"
---

# Deducciones

## base_legal

- Art. 88 (Ley 185): del salario se hacen deducciones legales.
- Art. 97 (Ley 185): el decimo tercer mes esta exento de impuesto, descuentos, cotizaciones y deducciones.
- Normativa INSS vigente: cotizacion laboral aplicable.
- Normativa IR vigente para rentas del trabajo.

## regla_operativa

- Solo se aplican deducciones permitidas legalmente y sobre conceptos imponibles.
- Aguinaldo proporcional no integra base imponible de deducciones por regla del Art. 97.

## formula

- `inss_laboral = base_inss * tasa_inss_laboral`
- `ir_laboral = base_ir * tasa_ir_laboral`

## variables

- `base_inss`
- `tasa_inss_laboral`
- `base_ir`
- `tasa_ir_laboral`

## supuestos

- Las tasas vigentes son cargadas desde `inss.md` e `ir-rentas-trabajo.md`.

## excepciones

- Si la base imponible resulta 0 o negativa, la deduccion correspondiente es 0.

## vigencia_fuente

- Ley 185 Arts. 88 y 97, mas normas administrativas vigentes de INSS e IR.
