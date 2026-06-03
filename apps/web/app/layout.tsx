import { Geist_Mono, Nunito_Sans } from "next/font/google"
import type { Metadata } from "next"
import { headers } from "next/headers"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LangUpdater } from "@/components/lang-updater"
import { AppShell } from "@/components/app-shell"
import { PlausibleAnalytics } from "@/components/plausible-analytics"
import { cn } from "@/lib/utils"
import { getSiteUrl } from "@/lib/site-url"
import { isValidLocale } from "@/lib/i18n"
import { isValidCountry } from "@/lib/countries"

const SITE_URL = getSiteUrl()

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Justo",
  authors: [{ name: "Justo" }],
  creator: "Justo",
  publisher: "Justo",
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Justo",
  url: SITE_URL,
  logo: `${SITE_URL}/images/og-image.png`,
  sameAs: ["https://github.com/sbarkerzamora/justo"],
}

const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const invokePath = headersList.get("x-invoke-path") || "/"
  const segments = invokePath.split("/").filter(Boolean)
  const localeFromPath =
    segments.length >= 1 && isValidLocale(segments[0]) ? segments[0] : null
  const countryFromPath =
    segments.length >= 2 && isValidCountry(segments[1]) ? segments[1] : null

  return (
    <html
      lang={localeFromPath ?? "es"}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        nunitoSans.variable
      )}
    >
      <body>
        <LangUpdater />
        <PlausibleAnalytics />
        <ThemeProvider>
          <AppShell
            initialLocale={localeFromPath ?? undefined}
            initialCountry={countryFromPath ?? undefined}
          >
            {children}
          </AppShell>
        </ThemeProvider>
        <script
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-name="BMC-Widget"
          data-cfasync="false"
          data-id="stephanbarker"
          data-description="Support me on Buy me a coffee!"
          data-message=""
          data-color="#FF5F5F"
          data-position="Left"
          data-x_margin="18"
          data-y_margin="18"
          defer
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </body>
    </html>
  )
}
