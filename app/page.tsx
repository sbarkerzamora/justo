import type { Metadata } from "next"
import { LocationGate } from "@/components/location-gate"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  title: "Justo · Calculadora de Liquidación Laboral para Centroamérica",
  description:
    "Calcula tu liquidación laboral según la legislación de Nicaragua, Guatemala, El Salvador, Honduras, Costa Rica, Panamá, México, Colombia, Perú, Argentina y Chile. Gratis, sin registro y con trazabilidad legal.",
  openGraph: {
    title: "Justo · Asistente laboral para Centroamérica y América Latina",
    description:
      "Calcula liquidaciones laborales y consulta la legislación de 11 países con transparencia y trazabilidad.",
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
