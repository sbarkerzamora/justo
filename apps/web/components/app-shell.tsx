"use client"

import { useState, createContext, useContext, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { countryList, isValidCountry } from "@/lib/countries"
import { localizedCountryPath, isValidLocale, type Locale } from "@/lib/i18n"
import { getCountryAccent } from "@/lib/country-accent"
import { homeCopy } from "@/lib/home-copy"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import {
  IconBrain,
  IconMessageCircle,
  IconCalculator,
  IconBeach,
  IconTools,
  IconChartBar,
  IconBook,
  IconBrandGithub,
  IconMoon,
  IconSun,
  IconX,
  IconArrowRight,
  IconCash,
  IconGift,
  IconClock,
  IconSwitch,
  IconFile,
  IconClipboardCheck,
  IconUserPlus,
  IconMenu2,
  IconBuilding,
} from "@tabler/icons-react"

type SidebarCtx = { open: boolean; setOpen: (v: boolean) => void }
const SidebarCtx = createContext<SidebarCtx>({ open: true, setOpen: () => {} })
export function useSidebarOpen() { return useContext(SidebarCtx) }

function useStoredCountry(
  pathname: string,
  initialLocale?: string,
  initialCountry?: string
) {
  const segments = pathname.split("/").filter(Boolean)
  const countryFromPath =
    segments.length >= 2 && isValidLocale(segments[0]) && isValidCountry(segments[1])
      ? segments[1]
      : null
  const localeFromPath =
    segments.length >= 1 && isValidLocale(segments[0])
      ? segments[0]
      : null

  const [stored] = useState(() => {
    if (typeof window === "undefined") {
      return {
        country: initialCountry ?? "ni",
        locale: initialLocale ?? "es",
      }
    }
    try {
      return {
        country: localStorage.getItem("justo-country") ?? initialCountry ?? "ni",
        locale: localStorage.getItem("justo-locale") ?? initialLocale ?? "es",
      }
    } catch {
      return { country: initialCountry ?? "ni", locale: initialLocale ?? "es" }
    }
  })

  return {
    country: countryFromPath ?? stored.country,
    locale: localeFromPath ?? stored.locale,
  }
}

const sidebarIcons: Record<string, React.ReactNode> = {
  Chat: <IconMessageCircle className="h-5 w-5 shrink-0" />,
  "Calculadora de liquidacion": <IconCalculator className="h-5 w-5 shrink-0" />,
  "Calculadora de vacaciones": <IconBeach className="h-5 w-5 shrink-0" />,
  Herramientas: <IconTools className="h-5 w-5 shrink-0" />,
  Estadisticas: <IconChartBar className="h-5 w-5 shrink-0" />,
  "Marco legal": <IconBook className="h-5 w-5 shrink-0" />,
}

export function AppShell({
  children,
  initialLocale,
  initialCountry,
}: {
  children: React.ReactNode
  initialLocale?: string
  initialCountry?: string
}) {
  const pathname = usePathname()
  const isDocs = pathname.startsWith("/docs")
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { country, locale } = useStoredCountry(pathname, initialLocale, initialCountry)
  const { push } = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const toggleMobile = useCallback(() => setMobileOpen((p) => !p), [])

  if (isDocs) return <>{children}</>

  const homePath = `/${locale}/${country}`

  const headerLinks = [
    { label: "Herramientas", href: "/tools", icon: <IconTools className="size-4" /> },
    { label: "Documentacion", href: "/docs/legal", icon: <IconBook className="size-4" /> },
  ]

  const sidebarLinks = [
    { label: "Chat", href: homePath },
    { label: "Calculadora de liquidacion", href: `${homePath}?tool=settlement` },
    { label: "Calculadora de vacaciones", href: `${homePath}?tool=vacations` },
    { label: "Herramientas", href: "/tools" },
    { label: "Estadisticas", href: "/anon-stats" },
    { label: "Marco legal", href: "/docs/legal" },
  ]

  const comingSoonSidebarLinks = [
    { labelEs: "Salario neto", labelEn: "Net salary", icon: <IconCash className="h-5 w-5 shrink-0" /> },
    { labelEs: "Aguinaldo / decimo / bono", labelEn: "Bonus / 13th salary", icon: <IconGift className="h-5 w-5 shrink-0" /> },
    { labelEs: "Horas extra", labelEn: "Overtime", icon: <IconClock className="h-5 w-5 shrink-0" /> },
    { labelEs: "Simulador de terminacion", labelEn: "Termination simulator", icon: <IconSwitch className="h-5 w-5 shrink-0" /> },
    { labelEs: "Generador de finiquito", labelEn: "Settlement document", icon: <IconFile className="h-5 w-5 shrink-0" /> },
    { labelEs: "Checklist laboral", labelEn: "Labor checklist", icon: <IconClipboardCheck className="h-5 w-5 shrink-0" /> },
    { labelEs: "Asistente de contratacion", labelEn: "Hiring assistant", icon: <IconUserPlus className="h-5 w-5 shrink-0" /> },
  ]

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="py-4">
        <Link href="/" className={cn("flex items-center text-sm", open ? "space-x-2" : "justify-center")}>
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
            style={{ background: getCountryAccent(country) }}
          >
            <IconBrain className="h-4 w-4 text-white" />
          </div>
          {open ? (
            <span className="font-semibold text-sidebar-foreground">Justo</span>
          ) : null}
        </Link>
      </div>

      {open ? (
        <div className="group mb-2 flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-2.5 py-1.5 transition-colors hover:border-sidebar-foreground/15 hover:bg-sidebar-accent/60">
          <IconBuilding className="size-3.5 shrink-0 text-primary" />
          <span className="truncate text-[11px] font-medium text-sidebar-foreground">
            {homeCopy[locale as Locale].hrCtaTitle}
          </span>
          <span className="ml-auto inline-flex shrink-0 items-center rounded bg-primary/10 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-primary">
            {homeCopy[locale as Locale].hrCtaBadge}
          </span>
        </div>
      ) : null}

      <div className="mb-4 flex flex-col gap-1.5">
        <div className={cn("flex items-center gap-1.5", open ? "" : "flex-col")}>
          <LanguageToggle current={locale} country={country} push={push} open={open} />
          <ThemeToggle resolvedTheme={resolvedTheme} setTheme={setTheme} />
        </div>
        {open ? (
          <a
            href="https://github.com/sbarkerzamora/justo"
            target="_blank"
            rel="noreferrer"
            className="group mt-1 flex flex-col gap-1 rounded-xl border border-sidebar-border bg-sidebar-accent/30 px-3 py-2.5 transition-colors hover:border-sidebar-foreground/20 hover:bg-sidebar-accent/50"
          >
            <div className="flex items-center gap-2">
              <IconBrandGithub className="size-3.5 text-sidebar-foreground/60" />
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-sidebar-foreground/50">
                Open source
              </span>
            </div>
            <span className="text-[13px] font-semibold text-sidebar-foreground">
              Ver en GitHub
            </span>
            <div className="flex items-center gap-1 text-[10px] text-sidebar-foreground/40">
              <span>sbarkerzamora/justo</span>
              <IconArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </a>
        ) : (
          <a
            href="https://github.com/sbarkerzamora/justo"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center rounded-lg border border-sidebar-border p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <IconBrandGithub className="size-4" />
          </a>
        )}
      </div>

      <div className="border-t border-sidebar-border pt-3">
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                open ? "" : "justify-center"
              )}
            >
              {sidebarIcons[link.label]}
              {open ? <span className="whitespace-nowrap">{link.label}</span> : null}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-3 border-t border-sidebar-border pt-3">
        <nav className="flex flex-col gap-1">
          {comingSoonSidebarLinks.map((link) => (
            <span
              key={link.labelEs}
              title={locale === "en" ? "Coming soon" : "Proximamente"}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-sidebar-foreground/40 opacity-50 cursor-not-allowed",
                open ? "" : "justify-center"
              )}
            >
              {link.icon}
              {open ? <span className="whitespace-nowrap">{locale === "en" ? link.labelEn : link.labelEs}</span> : null}
            </span>
          ))}
        </nav>
      </div>
    </div>
  )

  const info = countryList.find((c) => c.code === country)

  return (
    <SidebarCtx.Provider value={{ open: mobileOpen, setOpen: setMobileOpen }}>
      <div className="flex h-svh w-full bg-background">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "max-md:hidden flex flex-col border-r border-sidebar-border bg-sidebar px-4 shrink-0 overflow-y-auto transition-[width] duration-200",
            open ? "w-[240px]" : "w-[56px]"
          )}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {sidebarContent}
        </aside>

        {/* Mobile overlay */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={toggleMobile} />
            <nav className="absolute inset-y-0 left-0 w-[85vw] max-w-[320px] bg-sidebar border-r border-sidebar-border px-4 py-4 flex flex-col overflow-y-auto shadow-xl">
              <button
                type="button"
                onClick={toggleMobile}
                className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <IconX className="size-4" />
              </button>
              {sidebarContent}
            </nav>
          </div>
        ) : null}

        {/* Main area: header + content */}
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          {/* Global header */}
          <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-sm">
            <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleMobile}
                  className="inline-flex size-8 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent md:hidden"
                  aria-label="Abrir menu"
                >
                  <IconMenu2 className="size-4" />
                </button>
                <Link href="/" className="flex items-center gap-2">
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: getCountryAccent(country) }}
                  >
                    <IconBrain className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight text-foreground">
                    Justo
                  </span>
                </Link>
                <Select
                  value={country}
                  onValueChange={(nextCc) => push(localizedCountryPath(locale as "es" | "en", nextCc))}
                >
                  <SelectTrigger className="h-7 w-auto gap-1.5 rounded-lg border-border bg-transparent px-2 py-0 text-[11px] font-medium text-foreground hover:bg-accent">
                    <Image
                      src={`https://flagcdn.com/w40/${info?.flag ?? country}.png`}
                      alt={info?.name ?? country}
                      width={14}
                      height={10}
                      className="h-2.5 w-3.5 shrink-0 rounded-[1px] border border-border object-cover"
                    />
                    <span className="max-sm:hidden truncate max-w-[100px]">
                      {info?.name ?? country}
                    </span>
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={6}
                    className="rounded-xl border-border bg-background p-1 shadow-lg"
                  >
                    {countryList.map((c) => (
                      <SelectItem key={c.code} value={c.code} className="rounded-lg text-foreground">
                        <span className="flex items-center gap-2">
                          <Image
                            src={`https://flagcdn.com/w40/${c.flag}.png`}
                            alt={c.name}
                            width={14}
                            height={10}
                            className="h-2.5 w-3.5 rounded-[1px] border border-border object-cover"
                          />
                          <span className="truncate text-xs">{c.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1.5">
                {headerLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent max-sm:px-2"
                  >
                    {link.icon}
                    <span className="max-sm:hidden">{link.label}</span>
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent"
                >
                  {resolvedTheme === "dark" ? (
                    <IconSun className="size-4" />
                  ) : (
                    <IconMoon className="size-4" />
                  )}
                </button>
                <a
                  href="https://github.com/sbarkerzamora/justo"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent"
                >
                  <IconBrandGithub className="size-4" />
                </a>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto">{children}</main>

          {pathname === "/" || pathname.startsWith(`/${locale}/${country}`) ? (
            <footer className="border-t border-border px-4 py-3 text-center text-[11px] text-muted-foreground">
              <p>Justo · Asistente laboral open source · No constituye asesoría legal profesional</p>
            </footer>
          ) : null}
        </div>
      </div>
    </SidebarCtx.Provider>
  )
}

function LanguageToggle({
  current,
  country,
  push,
  open,
}: {
  current: string
  country: string
  push: (url: string) => void
  open: boolean
}) {
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => push(localizedCountryPath(current === "es" ? "en" : "es", country))}
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-sidebar-border text-[11px] font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        {current.toUpperCase()}
      </button>
    )
  }

  return (
    <div className="flex rounded-lg border border-sidebar-border text-[11px] font-medium">
      <button
        type="button"
        onClick={() => push(localizedCountryPath("es", country))}
        className={cn(
          "rounded-l-md px-2 py-1 transition-colors",
          current === "es"
            ? "bg-sidebar-accent text-sidebar-foreground"
            : "text-sidebar-foreground/50 hover:text-sidebar-foreground"
        )}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => push(localizedCountryPath("en", country))}
        className={cn(
          "rounded-r-md px-2 py-1 transition-colors",
          current === "en"
            ? "bg-sidebar-accent text-sidebar-foreground"
            : "text-sidebar-foreground/50 hover:text-sidebar-foreground"
        )}
      >
        EN
      </button>
    </div>
  )
}

function ThemeToggle({
  resolvedTheme,
  setTheme,
}: {
  resolvedTheme?: string
  setTheme: (theme: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-sidebar-border text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
    >
      {resolvedTheme === "dark" ? (
        <IconSun className="size-3.5" />
      ) : (
        <IconMoon className="size-3.5" />
      )}
    </button>
  )
}
