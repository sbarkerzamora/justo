"use client"

import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { countryList } from "@/lib/countries"
import Image from "next/image"

export function AnonCountrySelector({ current }: { current: string }) {
  const { push } = useRouter()

  return (
    <Select
      value={current}
      onValueChange={(cc) => push(`/anon-stats?country=${cc}`)}
    >
      <SelectTrigger
        aria-label="Seleccionar pais"
        className="h-10 w-[11rem] rounded-xl border-border bg-card px-3 text-sm font-semibold text-foreground hover:bg-accent"
      >
        <SelectValue />
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
                width={16}
                height={12}
                className="h-3 w-4.5 rounded-xs border border-border object-cover"
              />
              <span className="truncate">{c.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
