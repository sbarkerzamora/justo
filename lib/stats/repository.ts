import { redis } from "@/lib/redis"
import type {
  AnonymousSettlementRecord,
  CountryStats,
  PercentileData,
} from "@/lib/stats/types"
import type { CountryCode } from "@/lib/settlement/types"

const RETENTION_DAYS = Number(process.env.STATS_RETENTION_DAYS) || 90
const TTL_SECONDS = RETENTION_DAYS * 24 * 60 * 60

function recordKey(country: CountryCode, id: string): string {
  return `stats:record:${country}:${id}`
}
function salaryKey(country: CountryCode): string {
  return `stats:salary:${country}`
}
function tenureKey(country: CountryCode): string {
  return `stats:tenure:${country}`
}
function netKey(country: CountryCode): string {
  return `stats:net:${country}`
}
function countersKey(country: CountryCode): string {
  return `stats:counters:${country}`
}

export async function persistAnonymousRecord(
  record: AnonymousSettlementRecord
): Promise<void> {
  if (!redis) return

  const cKey = recordKey(record.countryCode, record.id)
  const sKey = salaryKey(record.countryCode)
  const tKey = tenureKey(record.countryCode)
  const nKey = netKey(record.countryCode)
  const cntKey = countersKey(record.countryCode)

  const termType = record.terminationType ?? "no_especificado"
  const freq = record.frequency

  try {
    await redis.hset(cKey, {
      countryCode: record.countryCode,
      monthlySalary: String(record.monthlySalary),
      frequency: record.frequency,
      tenureDays: String(record.tenureDays),
      unusedVacationDays: String(record.unusedVacationDays),
      terminationType: termType,
      grossIncome: String(record.grossIncome),
      totalDeductions: String(record.totalDeductions),
      netTotal: String(record.netTotal),
      currency: record.currency,
      legalCorpusVersion: record.legalCorpusVersion,
      timestamp: String(record.timestamp),
    })

    await Promise.all([
      redis.zadd(sKey, { score: record.monthlySalary, member: record.id }),
      redis.zadd(tKey, { score: record.tenureDays, member: record.id }),
      redis.zadd(nKey, { score: record.netTotal, member: record.id }),
      redis.hincrby(cntKey, "total", 1),
      redis.hincrby(cntKey, `tipo_${termType}`, 1),
      redis.hincrby(cntKey, `freq_${freq}`, 1),
    ])

    await Promise.all([
      redis.expire(cKey, TTL_SECONDS),
      redis.expire(sKey, TTL_SECONDS),
      redis.expire(tKey, TTL_SECONDS),
      redis.expire(nKey, TTL_SECONDS),
      redis.expire(cntKey, TTL_SECONDS),
    ])
  } catch {
    /* telemetría no crítica */
  }
}

async function getPercentiles(key: string): Promise<PercentileData> {
  if (!redis) return emptyPercentiles()

  try {
    const count = await redis.zcard(key)
    if (!count || count === 0) return emptyPercentiles()

    const indices = [0, 0.25, 0.5, 0.75, 0.9, 1].map((p) =>
      Math.min(Math.floor(p * (count - 1)), count - 1)
    )

    const results: number[] = []
    for (const idx of indices) {
      const members = await redis.zrange<
        { member: string; score: number }[]
      >(key, idx, idx, { withScores: true })
      if (members && members.length > 0) {
        results.push(members[0].score)
      } else {
        results.push(0)
      }
    }

    return {
      min: results[0],
      p25: results[1],
      p50: results[2],
      p75: results[3],
      p90: results[4],
      max: results[5],
    }
  } catch {
    return emptyPercentiles()
  }
}

function emptyPercentiles(): PercentileData {
  return { min: 0, p25: 0, p50: 0, p75: 0, p90: 0, max: 0 }
}

export async function getCountryStats(
  countryCode: CountryCode
): Promise<CountryStats> {
  if (!redis) return emptyStats(countryCode)

  const cntKey = countersKey(countryCode)

  try {
    const [salary, tenure, net, counters] = await Promise.all([
      getPercentiles(salaryKey(countryCode)),
      getPercentiles(tenureKey(countryCode)),
      getPercentiles(netKey(countryCode)),
      redis.hgetall<Record<string, string>>(cntKey),
    ])

    const total = Number(counters?.total ?? 0)

    const byTerminationType: Record<string, number> = {}
    const byFrequency: Record<string, number> = {}
    if (counters) {
      for (const [field, val] of Object.entries(counters)) {
        const num = Number(val)
        if (field.startsWith("tipo_")) {
          byTerminationType[field.replace("tipo_", "")] = num
        } else if (field.startsWith("freq_")) {
          byFrequency[field.replace("freq_", "")] = num
        }
      }
    }

    return {
      countryCode,
      totalSettlements: total,
      byTerminationType,
      byFrequency,
      salary,
      tenure,
      net,
      legalCorpusVersion: "",
    }
  } catch {
    return emptyStats(countryCode)
  }
}

function emptyStats(countryCode: CountryCode): CountryStats {
  return {
    countryCode,
    totalSettlements: 0,
    byTerminationType: {},
    byFrequency: {},
    salary: emptyPercentiles(),
    tenure: emptyPercentiles(),
    net: emptyPercentiles(),
    legalCorpusVersion: "",
  }
}
