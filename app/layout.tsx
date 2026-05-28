import { Geist_Mono, Nunito_Sans } from "next/font/google"
import type { Metadata } from "next"
import Script from "next/script"

import "./globals.css"
import { RootProvider } from "fumadocs-ui/provider/next"
import { ThemeProvider } from "@/components/theme-provider"
import { LangUpdater } from "@/components/lang-updater"
import { cn } from "@/lib/utils"
import { getSiteUrl } from "@/lib/site-url"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
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
        <RootProvider search={{ preload: false }}>
          <ThemeProvider>{children}</ThemeProvider>
        </RootProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <Script
          data-name="BMC-Widget"
          data-cfasync="false"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="stephanbarker"
          data-description="Support me on Buy me a coffee!"
          data-message=""
          data-color="#FF5F5F"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="18"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
