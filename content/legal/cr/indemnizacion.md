---
country: cr
topic: indemnizacion
version: cr-v0.1.0
status: proposed
source: "Codigo de Trabajo de Costa Rica"
last_reviewed: "2026-05-11"
---

# Indemnizacion (Cesantia y Preaviso)

## base_legal

- Art. 28: Preaviso segun tiempo de servicio.
- Art. 29: Auxilio de cesantia por antiguedad (tabla progresiva).
- Art. 30: Base de calculo = promedio salarial ultimos 6 meses.

## regla_operativa

- Cesantia: ~20 dias de salario por cada ano trabajado (maximo 8 anos).
- Preaviso: 1 semana (3-6 meses), 15 dias (6-12 meses), 1 mes (>1 ano).
- Base: promedio ordinario de ultimos 6 meses.

## formula

- `salario_diario = salario_mensual / 30`
- `dias_cesantia = min(anos_antiguedad * 20, 160)`
- `monto_cesantia = salario_diario * dias_cesantia`
- `dias_preaviso = anos_antiguedad >= 1 ? 30 : meses_antiguedad >= 6 ? 15 : 7`
- `monto_preaviso = salario_diario * dias_preaviso`

## vigencia_fuente

- Codigo de Trabajo de Costa Rica, Arts. 28, 29, 30.
