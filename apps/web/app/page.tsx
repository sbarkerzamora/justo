import type { Metadata } from "next"
import { LocationGate } from "@/components/location-gate"
import { getSiteUrl } from "@/lib/site-url"

const SITE_URL = getSiteUrl()

export const metadata: Metadata = {
  title: "Justo · Asistente laboral con IA y calculadoras para América Latina",
  description:
    "Consulta tus derechos laborales con un asistente de IA entrenado en la legislación de 11 países. Calcula liquidación, vacaciones, salario neto, aguinaldo y más. Gratis, sin registro y open source.",
  keywords: [
    "asistente laboral",
    "calculadora laboral",
    "liquidación laboral",
    "calculadora de vacaciones",
    "salario neto",
    "aguinaldo",
    "derechos laborales",
    "inteligencia artificial derecho laboral",
  ],
  openGraph: {
    title: "Justo · Asistente laboral IA para América Latina",
    description:
      "Chat IA sobre derechos laborales + calculadoras de liquidación, vacaciones, salario neto y aguinaldo para 11 países. Open source y trazable.",
    url: SITE_URL,
    siteName: "Justo",
    images: [
      {
        url: `${SITE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_419",
    type: "website",
  },
}

export default function Page() {
  return <LocationGate />
}
