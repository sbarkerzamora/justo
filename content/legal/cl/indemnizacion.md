---
country: cl
topic: indemnizacion
version: cl-v0.1.0
status: proposed
source: "Codigo del Trabajo de Chile"
last_reviewed: "2026-05-11"
---

# Indemnizacion por anos de servicio

## base_legal

- Art. 163: 30 dias de ultima remuneracion por cada ano, fraccion >6 meses = ano completo.
- Art. 161-162: Indemnizacion sustitutiva del aviso previo (1 mes).
- Maximo: 330 dias (11 anos).

## formula

- `salario_diario = salario_mensual / 30`
- `indemnizacion_anos = min(anos_antiguedad, 11) * 30 * salario_diario`
- `aviso_sustitutivo = salario_mensual`
- `total = indemnizacion_anos + aviso_sustitutivo`

## vigencia_fuente

- Codigo del Trabajo de Chile, Arts. 161, 162, 163.
