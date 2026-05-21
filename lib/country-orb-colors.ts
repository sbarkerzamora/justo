export const defaultOrbColors: [string, string] = ["#7AA4D0", "#D8E7F6"]

const countryOrbColors: Record<string, [string, string]> = {
  ni: ["#4F86C6", "#A8C8E8"],
  sv: ["#3F7FBE", "#C5DDF3"],
  gt: ["#5AA2D6", "#C9E8FB"],
  hn: ["#4A95D1", "#BFDFF6"],
  cr: ["#BD2E3A", "#2C4D86"],
  pa: ["#2F66AF", "#D64545"],
  mx: ["#2E8B63", "#C63E3E"],
  co: ["#D1A100", "#2F5FAF"],
  pe: ["#C7434B", "#F2D6D9"],
  ar: ["#64A9D8", "#E5F4FF"],
  cl: ["#C13E4A", "#2F5CA8"],
}

export function getCountryOrbColors(countryCode: string): [string, string] {
  return countryOrbColors[countryCode] ?? defaultOrbColors
}
