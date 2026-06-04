# API Publica de Justo

Justo expone endpoints HTTP publicos para integracion con sistemas externos.
Todas las rutas estan bajo `/api/` y son accesibles sin autenticacion (self-hosted).

## Rate Limiting

Todos los endpoints estan protegidos con rate limiting via Upstash Redis:

| Endpoint | Limite | Ventana |
|---|---|---|
| `/api/chat` | 10 requests | 60 segundos |
| `/api/liquidation/calculate` | 60 requests | 60 segundos |
| `/api/liquidation/pdf` | 20 requests | 60 segundos |
| `/api/tools/vacations/calculate` | 60 requests | 60 segundos |
| `/api/search` | — | — |

Las respuestas incluyen headers:
- `X-RateLimit-Remaining`: solicitudes restantes
- `Retry-After`: segundos hasta el reset (solo en 429)

---

## `POST /api/liquidation/calculate`

Calcula liquidacion laboral completa.

**Body:**

```json
{
  "countryCode": "ni",
  "employeeName": "Juan Perez",
  "employerName": "Empresa S.A.",
  "monthlySalary": 15000,
  "frequency": "mensual",
  "unusedVacationDays": 10,
  "startDate": "2023-01-15",
  "endDate": "2026-06-01"
}
```

**Response (200):**

```json
{
  "input": { ... },
  "result": {
    "currency": "NIO",
    "grossIncome": 15000,
    "totalDeductions": 1500,
    "netTotal": 13500,
    "tenureDays": 1233,
    "tenureText": "3 anos 4 meses",
    "legalCorpusVersion": "ni-v0.3.0",
    "incomes": [
      { "label": "Indemnización", "amount": 15000, "formula": "1 x salario", "legalReference": "Ley 185 Art. 76" },
      { "label": "Vacaciones", "amount": 5000, "formula": "10 x 500", "legalReference": "Ley 185 Art. 78" }
    ],
    "deductions": [
      { "label": "INSS", "amount": 616.5, "formula": "15000 x 4.11%", "legalReference": "Ley 185 Art. 88" }
    ]
  }
}
```

**Errores:**

| Status | Causa |
|---|---|
| 400 | Datos invalidos (schema validation) |
| 400 | Pais no soportado |
| 429 | Demasiadas solicitudes |

---

## `POST /api/liquidation/pdf`

Genera un PDF imprimible de la liquidacion.

**Body:** Mismo schema que `/api/liquidation/calculate`.

**Response (200):** `application/pdf` — binario del PDF.

---

## `POST /api/tools/vacations/calculate`

Calcula vacaciones acumuladas, gozadas y pendientes.

**Body:**

```json
{
  "countryCode": "ni",
  "monthlySalary": 15000,
  "startDate": "2023-01-15",
  "endDate": "2026-06-01",
  "usedVacationDays": 5
}
```

**Response (200):**

```json
{
  "input": { ... },
  "result": {
    "currency": "NIO",
    "accruedVacationDays": 30.4,
    "usedVacationDays": 5,
    "pendingVacationDays": 25.4,
    "dailySalary": 500,
    "amount": 12700,
    "formula": "(1233 dias x 30 / 365 - 5) x 500",
    "legalReference": "Ley 185 Arts. 76, 77 y 78",
    "legalCorpusVersion": "ni-v0.3.0",
    "generatedAt": "2026-06-03T..."
  }
}
```

---

## `POST /api/chat`

Chat con el asistente laboral Justo.

**Body:**

```json
{
  "messages": [
    { "role": "user", "parts": [{ "type": "text", "text": "Cuanto me toca de liquidacion?" }] }
  ],
  "countryCode": "ni"
}
```

**Response:** `text/event-stream` — streaming de tokens SSE desde el LLM.

---

## `POST /api/search`

Busqueda en el corpus legal del pais.

**Body:**

```json
{
  "country": "ni",
  "query": "indemnizacion vacaciones"
}
```

---

## `POST /api/webhooks/telegram`

Webhook para el bot de Telegram (solo si esta configurado).

---

## Paises Soportados

Los codigos de pais compatibles son:
`ni`, `gt`, `sv`, `hn`, `cr`, `pa`, `mx`, `co`, `pe`, `ar`, `cl`
