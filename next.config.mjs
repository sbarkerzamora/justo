import path from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === "production"

const getPlausibleEndpointOrigin = () => {
  const endpoint = process.env.NEXT_PUBLIC_PLAUSIBLE_ENDPOINT
  if (!endpoint) return null

  try {
    return new URL(endpoint).origin
  } catch {
    return null
  }
}

const plausibleEndpointOrigin = getPlausibleEndpointOrigin()
const connectSources = [
  "'self'",
  "https://openrouter.ai",
  "https://*.openrouter.ai",
  "https://*.buymeacoffee.com",
]

if (plausibleEndpointOrigin) {
  connectSources.push(plausibleEndpointOrigin)
}

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://vercel.live https://cdnjs.buymeacoffee.com",
  "script-src-elem 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://vercel.live https://cdnjs.buymeacoffee.com",
  `connect-src ${connectSources.join(" ")}`,
  "frame-src 'self' https://www.buymeacoffee.com",
].join("; ")

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: rootDir,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
  async headers() {
    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Content-Security-Policy", value: contentSecurityPolicy },
    ]

    if (isProd) {
      headers.push({ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" })
    }

    return [
      {
        source: "/:path*",
        headers,
      },
    ]
  },
}

export default nextConfig
