import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { isValidCountry } from "@/lib/countries"
import { defaultLocale, isValidLocale, localizedCountryPath } from "@/lib/i18n"

const legalPageSlugs = new Set([
  "terminos",
  "privacidad",
  "cookies",
  "terms",
  "privacy",
])

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/tools") ||
    pathname.startsWith("/guia-laboral") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next()
  }

  if (pathname === "/") {
    return NextResponse.next()
  }

  const segments = pathname.split("/").filter(Boolean)
  const firstSegment = segments[0]
  const secondSegment = segments[1]

  if (firstSegment && isValidLocale(firstSegment)) {
    if (
      secondSegment &&
      (legalPageSlugs.has(secondSegment) ||
        secondSegment === "tools" ||
        secondSegment === "guia-laboral" ||
        isValidCountry(secondSegment))
    ) {
      return NextResponse.next()
    }

    return NextResponse.redirect(
      new URL(localizedCountryPath(firstSegment, "ni"), request.url)
    )
  }

  if (firstSegment && isValidCountry(firstSegment)) {
    return NextResponse.redirect(
      new URL(localizedCountryPath(defaultLocale, firstSegment), request.url),
      301
    )
  }

  return NextResponse.redirect(new URL("/", request.url))
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images/|favicon.ico).*)"],
}
