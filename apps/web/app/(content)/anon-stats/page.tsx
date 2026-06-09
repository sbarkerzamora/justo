import { permanentRedirect } from "next/navigation"

export default async function AnonStatsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>
}) {
  const params = await searchParams
  const qs = params.country ? `?country=${params.country}` : ""
  permanentRedirect(`/guia-laboral${qs}`)
}
