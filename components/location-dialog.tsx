"use client"

import { IconMapPin, IconWorld } from "@tabler/icons-react"
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Country = { code: string; name: string; flag: string; timezones: string[] }

const countries: Country[] = [
  { code: "ni", name: "Nicaragua", flag: "ni", timezones: ["America/Managua"] },
  { code: "sv", name: "El Salvador", flag: "sv", timezones: ["America/El_Salvador"] },
  { code: "gt", name: "Guatemala", flag: "gt", timezones: ["America/Guatemala"] },
  { code: "hn", name: "Honduras", flag: "hn", timezones: ["America/Tegucigalpa"] },
  { code: "cr", name: "Costa Rica", flag: "cr", timezones: ["America/Costa_Rica"] },
  { code: "pa", name: "Panamá", flag: "pa", timezones: ["America/Panama"] },
]

const tzToCountry = (tz: string): string | null => {
  for (const c of countries) {
    if (c.timezones.some((t) => tz.startsWith(t))) return c.code
  }
  return null
}

export function LocationDialog({
  open,
  onConfirm,
}: {
  open: boolean
  onConfirm: (code: string) => void
}) {
  const id = useId()
  const [selected, setSelected] = useState("ni")
  const [detecting, setDetecting] = useState(false)
  const [detected, setDetected] = useState<string | null>(null)

  const handleDetect = () => {
    setDetecting(true)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      const code = tzToCountry(tz)
      if (code) {
        setDetected(code)
        setSelected(code)
      } else {
        setDetected(null)
      }
    } catch {
      setDetected(null)
    }
    setDetecting(false)
  }

  const country = countries.find((c) => c.code === selected)
  const detectedCountry = detected ? countries.find((c) => c.code === detected) : null

  if (!open) return null

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="w-full max-w-md gap-0 p-0">
        <div className="p-6">
          <AlertDialogHeader className="place-items-start text-left">
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <IconWorld className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <AlertDialogTitle>Selecciona tu pais</AlertDialogTitle>
            <AlertDialogDescription>
              Elige el pais para calcular la liquidacion laboral segun su legislacion.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-5 space-y-4">
            {detectedCountry ? (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                <IconMapPin className="size-4 text-primary" />
                <span className="text-foreground">
                  Ubicacion detectada:{" "}
                  <span className="font-medium">{detectedCountry.name}</span>
                </span>
              </div>
            ) : null}

            <Button
              variant="outline"
              onClick={handleDetect}
              disabled={detecting}
              className="w-full rounded-xl border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              <IconMapPin className="size-4" />
              {detecting ? "Detectando..." : "Habilitar ubicacion automatica"}
            </Button>

            <div className="space-y-2">
              <label
                htmlFor={id}
                className="block text-sm font-medium text-muted-foreground"
              >
                O selecciona manualmente:
              </label>
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger
                  id={id}
                  className="w-full rounded-xl border-border bg-card text-foreground"
                >
                  <SelectValue placeholder="Seleccionar pais" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={4}
                  className="rounded-xl border-border bg-background p-1 shadow-lg"
                >
                  {countries.map((c) => (
                    <SelectItem
                      key={c.code}
                      value={c.code}
                      className="rounded-lg text-foreground"
                    >
                      <span className="flex items-center gap-2">
                        <img
                          src={`https://flagcdn.com/w40/${c.flag}.png`}
                          alt={c.name}
                          className="h-3 w-4.5 rounded-xs border border-border object-cover"
                        />
                        <span className="truncate">{c.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={() => onConfirm(selected)}
            className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/80"
          >
            Confirmar
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
