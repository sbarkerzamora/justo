import type { Metadata } from "next"
import { LocationGate } from "@/components/location-gate"

export const metadata: Metadata = {
  title: "Justo · Asistente laboral para Centroamérica",
  description:
    "Calcula liquidaciones laborales y consulta la legislación de Nicaragua con transparencia y trazabilidad.",
  openGraph: {
    title: "Justo · Asistente laboral para Centroamérica",
    description:
      "Calcula liquidaciones laborales y consulta la legislación de Nicaragua con transparencia y trazabilidad.",
    url: "https://github.com/sbarkerzamora/justo",
    siteName: "Justo",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_NI",
    type: "website",
  },
}

export default function Page() {
  return <LocationGate />
}
