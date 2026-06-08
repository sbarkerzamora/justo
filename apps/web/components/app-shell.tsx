"use client"

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { BuyMeABeerButton } from "@/components/buy-me-a-beer-button"
import { cn } from "@/lib/utils"
import { countryList, isValidCountry } from "@/lib/countries"
import { localizedCountryPath, isValidLocale, type Locale } from "@/lib/i18n"
import { getCountryAccent } from "@/lib/country-accent"
import { homeCopy } from "@/lib/home-copy"
import { getLegalLinks } from "@/lib/legal-pages"
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
  IconCoins,
  IconTools,
  IconChartBar,
  IconBook,
  IconBrandGithub,
  IconMoon,
  IconSun,
  IconX,
  IconArrowRight,
  IconGift,
  IconFileDescription,
  IconClock,
  IconSwitch,
  IconFile,
  IconClipboardCheck,
  IconUserPlus,
  IconMenu2,
  IconBuilding,
  IconBeer,
} from "@tabler/icons-react"

type SidebarCtx = { open: boolean; setOpen: (v: boolean) => void }
const SidebarCtx = createContext<SidebarCtx>({ open: true, setOpen: () => {} })
export function useSidebarOpen() {
  return useContext(SidebarCtx)
}

function useStoredCountry(
  pathname: string,
  initialLocale?: string,
  initialCountry?: string
) {
  const segments = pathname.split("/").filter(Boolean)
  const countryFromPath =
    segments.length >= 2 &&
    isValidLocale(segments[0]) &&
    isValidCountry(segments[1])
      ? segments[1]
      : null
  const localeFromPath =
    segments.length >= 1 && isValidLocale(segments[0]) ? segments[0] : null

  const [stored] = useState(() => {
    if (typeof window === "undefined") {
      return {
        country: initialCountry ?? "ni",
        locale: initialLocale ?? "es",
      }
    }
    try {
      return {
        country:
          localStorage.getItem("justo-country") ?? initialCountry ?? "ni",
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
  "Salario neto": <IconCoins className="h-5 w-5 shrink-0" />,
  "Aguinaldo / decimo / bono": <IconGift className="h-5 w-5 shrink-0" />,
  "Simulador de terminacion": <IconSwitch className="h-5 w-5 shrink-0" />,
  "Generador de contratos": (
    <IconFileDescription className="h-5 w-5 shrink-0" />
  ),
  Herramientas: <IconTools className="h-5 w-5 shrink-0" />,
  "Guia laboral": <IconChartBar className="h-5 w-5 shrink-0" />,
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
  const { country, locale } = useStoredCountry(
    pathname,
    initialLocale,
    initialCountry
  )
  const { push } = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), []) // eslint-disable-line react-hooks/set-state-in-effect
  const toggleMobile = useCallback(() => setMobileOpen((p) => !p), [])

  if (isDocs) return <>{children}</>

  const homePath = `/${locale}/${country}`
  const legalLinks = getLegalLinks(locale)

  const headerLinks = [
    {
      label: "Herramientas",
      href: "/tools",
      icon: <IconTools className="size-4" />,
    },
    {
      label: "Documentacion",
      href: "/docs/legal",
      icon: <IconBook className="size-4" />,
    },
  ]

  const sidebarLinks = [
    { label: "Chat", href: homePath },
    {
      label: "Calculadora de liquidacion",
      href: `${homePath}?tool=settlement`,
    },
    { label: "Calculadora de vacaciones", href: `${homePath}?tool=vacations` },
    { label: "Salario neto", href: `${homePath}?tool=salary-net` },
    { label: "Aguinaldo / decimo / bono", href: `${homePath}?tool=bonus` },
    { label: "Simulador de terminacion", href: `${homePath}?tool=termination` },
    { label: "Generador de contratos", href: `${homePath}?tool=contract` },
    { label: "Herramientas", href: "/tools" },
    { label: "Guia laboral", href: "/guia-laboral" },
    { label: "Marco legal", href: "/docs/legal" },
  ]

  const comingSoonSidebarLinks = [
    {
      labelEs: "Horas extra",
      labelEn: "Overtime",
      icon: <IconClock className="h-5 w-5 shrink-0" />,
    },
    {
      labelEs: "Generador de finiquito",
      labelEn: "Settlement document",
      icon: <IconFile className="h-5 w-5 shrink-0" />,
    },
    {
      labelEs: "Checklist laboral",
      labelEn: "Labor checklist",
      icon: <IconClipboardCheck className="h-5 w-5 shrink-0" />,
    },
    {
      labelEs: "Asistente de contratacion",
      labelEn: "Hiring assistant",
      icon: <IconUserPlus className="h-5 w-5 shrink-0" />,
    },
  ]

  const renderSidebarContent = ({
    expanded,
    onNavigate,
  }: {
    expanded: boolean
    onNavigate?: () => void
  }) => (
    <div className="flex h-full flex-col">
      <div className="py-4">
        <Link
          href="/"
          onClick={onNavigate}
          className={cn(
            "flex items-center text-sm",
            expanded ? "space-x-2" : "justify-center"
          )}
        >
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
            style={{ background: getCountryAccent(country) }}
          >
            <IconBrain className="h-4 w-4 text-white" />
          </div>
          {expanded ? (
            <span className="font-semibold text-sidebar-foreground">Justo</span>
          ) : null}
        </Link>
      </div>

      {expanded ? (
        <div className="group mb-2 flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-2.5 py-1.5 transition-colors hover:border-sidebar-foreground/15 hover:bg-sidebar-accent/60">
          <IconBuilding className="size-3.5 shrink-0 text-primary" />
          <span className="truncate text-[11px] font-medium text-sidebar-foreground">
            {homeCopy[locale as Locale].hrCtaTitle}
          </span>
          <span className="ml-auto inline-flex shrink-0 items-center rounded bg-primary/10 px-1 py-0.5 text-[8px] font-semibold tracking-wider text-primary uppercase">
            {homeCopy[locale as Locale].hrCtaBadge}
          </span>
        </div>
      ) : null}

      <div className="mb-4 flex flex-col gap-1.5">
        <div
          className={cn(
            "flex items-center gap-1.5",
            expanded ? "" : "flex-col"
          )}
        >
          <LanguageToggle
            current={locale}
            country={country}
            push={push}
            open={expanded}
          />
          <ThemeToggle resolvedTheme={resolvedTheme} setTheme={setTheme} />
        </div>
        {expanded ? (
          <a
            href="https://github.com/sbarkerzamora/justo"
            target="_blank"
            rel="noreferrer"
            className="group mt-1 flex flex-col gap-1 rounded-xl border border-sidebar-border bg-sidebar-accent/30 px-3 py-2.5 transition-colors hover:border-sidebar-foreground/20 hover:bg-sidebar-accent/50"
          >
            <div className="flex items-center gap-2">
              <IconBrandGithub className="size-3.5 text-sidebar-foreground/60" />
              <span className="text-[10px] font-medium tracking-[0.12em] text-sidebar-foreground/50 uppercase">
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
                expanded ? "" : "justify-center"
              )}
              onClick={onNavigate}
            >
              {sidebarIcons[link.label]}
              {expanded ? (
                <span className="whitespace-nowrap">{link.label}</span>
              ) : null}
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
                "flex cursor-not-allowed items-center gap-2 rounded-lg px-2 py-2 text-sm text-sidebar-foreground/40 opacity-50",
                expanded ? "" : "justify-center"
              )}
            >
              {link.icon}
              {expanded ? (
                <span className="whitespace-nowrap">
                  {locale === "en" ? link.labelEn : link.labelEs}
                </span>
              ) : null}
            </span>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-sidebar-border pt-3 pb-4">
        {expanded ? (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] leading-snug text-sidebar-foreground/50">
              {locale === "en"
                ? "Help keep Justo open, verifiable, and free for workers."
                : "Ayuda a mantener Justo abierto, verificable y gratis para trabajadores."}
            </p>
            <div className="max-w-full overflow-hidden rounded-lg">
              <BuyMeABeerButton />
            </div>
            <p className="text-[10px] leading-snug text-sidebar-foreground/40">
              Justo · Open source ·{" "}
              {locale === "en" ? "Not legal advice" : "No es asesoria legal"}
            </p>
            <nav className="flex flex-wrap gap-x-2 gap-y-1" aria-label="Legal">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={onNavigate}
                  className="text-[10px] text-sidebar-foreground/45 underline-offset-2 transition-colors hover:text-sidebar-foreground hover:underline"
                >
                  {link.linkLabel}
                </Link>
              ))}
            </nav>
          </div>
        ) : (
          <a
            href="https://www.buymeacoffee.com/stephanbarker"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center rounded-lg border border-sidebar-border p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label="Buy me a beer"
          >
            <IconBeer className="size-4" />
          </a>
        )}
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
            "flex shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar px-4 transition-[width] duration-200 max-md:hidden",
            open ? "w-[240px]" : "w-[56px]"
          )}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {renderSidebarContent({ expanded: open })}
        </aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              className="fixed inset-0 z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <motion.div
                className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                onClick={toggleMobile}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
              <motion.nav
                className="absolute inset-y-0 left-0 flex w-[320px] max-w-[88vw] flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar px-4 py-4 shadow-xl"
                initial={{ x: "-100%", opacity: 0.85 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0.85 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={toggleMobile}
                  className="absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
                  aria-label="Cerrar menu"
                >
                  <IconX className="size-4" />
                </button>
                {renderSidebarContent({
                  expanded: true,
                  onNavigate: () => setMobileOpen(false),
                })}
              </motion.nav>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Main area: header + content */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
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
                  onValueChange={(nextCc) =>
                    push(localizedCountryPath(locale as "es" | "en", nextCc))
                  }
                >
                  <SelectTrigger className="h-7 w-auto gap-1.5 rounded-lg border-border bg-transparent px-2 py-0 text-[11px] font-medium text-foreground hover:bg-accent">
                    <Image
                      src={`https://flagcdn.com/w40/${info?.flag ?? country}.png`}
                      alt={info?.name ?? country}
                      width={14}
                      height={10}
                      className="h-2.5 w-3.5 shrink-0 rounded-[1px] border border-border object-cover"
                    />
                    <span className="max-w-[100px] truncate max-sm:hidden">
                      {info?.name ?? country}
                    </span>
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={6}
                    className="rounded-xl border-border bg-background p-1 shadow-lg"
                  >
                    {countryList.map((c) => (
                      <SelectItem
                        key={c.code}
                        value={c.code}
                        className="rounded-lg text-foreground"
                      >
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
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent"
                >
                  {!mounted ? (
                    <div className="size-4 rounded-full border border-border" />
                  ) : resolvedTheme === "dark" ? (
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

          <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
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
        onClick={() =>
          push(localizedCountryPath(current === "es" ? "en" : "es", country))
        }
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
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), []) // eslint-disable-line react-hooks/set-state-in-effect
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-sidebar-border text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
    >
      {!mounted ? (
        <div className="size-3.5 rounded-full border border-sidebar-border" />
      ) : resolvedTheme === "dark" ? (
        <IconSun className="size-3.5" />
      ) : (
        <IconMoon className="size-3.5" />
      )}
    </button>
  )
}
