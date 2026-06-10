const countryDocsLinks: Record<string, string> = {
  ni: "/docs/legal/nicaragua",
  sv: "/docs/legal/elsalvador",
  gt: "/docs/legal/guatemala",
  hn: "/docs/legal/honduras",
  cr: "/docs/legal/costarica",
  pa: "/docs/legal/panama",
  mx: "/docs/legal/mexico",
  co: "/docs/legal/colombia",
  pe: "/docs/legal/peru",
  ar: "/docs/legal/argentina",
  cl: "/docs/legal/chile",
}

export function getLegalDocsLink(countryCode?: string): string {
  return countryDocsLinks[countryCode ?? ""] ?? "/docs/legal/nicaragua"
}

const topicToDocSlug: Record<string, string> = {
  indemnizacion: "indemnizacion",
  liquidacion: "indemnizacion",
  aguinaldo: "aguinaldo",
  bono: "aguinaldo",
  vacaciones: "vacaciones",
  "salario-proporcional": "salario-proporcional",
  deducciones: "deducciones",
  inss: "inss",
  igss: "igss",
  ihss: "ihss",
  ccss: "ccss",
  css: "css",
  imss: "imss",
  isss: "isss",
  afp: "afp",
  "onp-afp": "onp-afp",
  "eps-pension": "eps-pension",
  salud: "salud",
  afc: "afc",
  "sac-aguinaldo": "sac-aguinaldo",
  cts: "cts",
  gratificaciones: "gratificaciones",
  "prima-servicios": "prima-servicios",
  cesantia: "cesantia",
  preaviso: "preaviso",
  "ir-rentas-trabajo": "ir-rentas-trabajo",
  isr: "isr",
  terminacion: "indemnizacion",
  "salario-neto": "deducciones",
}

export function getTopicDocsLink(countryCode: string, topic: string): string | null {
  const docSlug = topicToDocSlug[topic.toLowerCase().trim()]
  if (!docSlug) return null
  const countryPath = countryDocsLinks[countryCode]
  if (!countryPath) return null
  return `${countryPath}/${docSlug}`
}
