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
