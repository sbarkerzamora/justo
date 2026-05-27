"use client"

import { cn } from "@/lib/utils"

type AsciiShaderBackgroundProps = {
  className?: string
}

const asciiRows = [
  "                 ....:::::----==++**##%%@@%%##**++==----:::::....",
  "             ...:::---==++**##%%@@@&&&&&&&&@@@%%##**++==---:::...",
  "          ..::--==++**##%%@@&&&BB99SSGGGSS99BB&&&@@%%##**++==--::..",
  "       ..:--=++**##%%@@&&B99SGGHHMMMMMMMMHHGGSS99B&&@@%%##**++=--:..",
  "     .:--=+**##%%@&&B9SGHMMhhhh333222222333hhhhMMHGS9B&&@%%##**+=--:.",
  "   .:-=+*##%%@&B9SGHMh32XXAAssiirr;;;;rriiissAAX23hMHGS9B&@%%##*+=-:.",
  "  .-=+*#%@&B9GHMh2XAsir;::::,,,,........,,,,::::;risAX2hMHG9B&@%#*+=-.",
  " .-=+#%@&9GHh3XAri;::,,....                  ....,,::;irAX3hHG9&@%#+=-.",
  " :-+*%@B9GMh2As;:,..                              ..,:;sA2hMG9B@%*+-:",
  ".-=#%@BGMhXir:,..                                    ..,:riXhMGB@%#=-.",
  ":=+#@&9HhAs;,.                                          .,;sAhH9&@#+=:",
  "-+*%@BGM2ir,.                                            .,ri2MGB@%*+-",
  "=+#@&9HhAs,.                 JUSTO                        .,sAhH9&@#+=",
  "-+*%@BGM2ir,.           calculo laboral                   .,ri2MGB@%*+-",
  ":=+#@&9HhAs;,.                                          .,;sAhH9&@#+=:",
  ".-=#%@BGMhXir:,..                                    ..,:riXhMGB@%#=-.",
  " :-+*%@B9GMh2As;:,..                              ..,:;sA2hMG9B@%*+-:",
  " .-=+#%@&9GHh3XAri;::,,....                  ....,,::;irAX3hHG9&@%#+=-.",
  "  .-=+*#%@&B9GHMh2XAsir;::::,,,,........,,,,::::;risAX2hMHG9B&@%#*+=-.",
  "   .:-=+*##%%@&B9SGHMh32XXAAssiirr;;;;rriiissAAX23hMHGS9B&@%%##*+=-:.",
  "     .:--=+**##%%@&&B9SGHMMhhhh333222222333hhhhMMHGS9B&&@%%##**+=--:.",
  "       ..:--=++**##%%@@&&B99SGGHHMMMMMMMMHHGGSS99B&&@@%%##**++=--:..",
  "          ..::--==++**##%%@@&&&BB99SSGGGSS99BB&&&@@%%##**++==--::..",
  "             ...:::---==++**##%%@@@&&&&&&&&@@@%%##**++==---:::...",
  "                 ....:::::----==++**##%%@@%%##**++==----:::::....",
]

export function AsciiShaderBackground({
  className,
}: AsciiShaderBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-0 overflow-hidden bg-background",
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_18%,oklch(0.78_0.09_235_/_0.20),transparent_46%),linear-gradient(135deg,oklch(0.99_0.004_245),oklch(0.955_0.01_250)_52%,oklch(0.99_0.002_245))]",
        "after:absolute after:inset-0 after:bg-background/45 after:[mask-image:radial-gradient(ellipse_at_center,transparent_18%,black_78%)]",
        "dark:before:bg-[radial-gradient(circle_at_50%_18%,oklch(0.58_0.12_245_/_0.24),transparent_48%),linear-gradient(135deg,oklch(0.09_0.016_250),oklch(0.018_0.004_250)_52%,oklch(0.12_0.018_250))] dark:after:bg-background/30",
        className
      )}
    >
      <pre
        className={cn(
          "pointer-events-none absolute top-[8svh] left-1/2 z-10 m-0 -translate-x-1/2 text-center font-mono leading-[0.78] select-none",
          "text-[clamp(7px,1.45vw,18px)] tracking-[-0.12em] text-slate-700/[0.13]",
          "max-sm:top-[15svh] max-sm:scale-[1.85] max-sm:text-[9px] max-sm:leading-[0.72] max-sm:opacity-70",
          "sm:min-w-[980px] md:min-w-[1180px] lg:min-w-[1360px]",
          "dark:text-sky-100/[0.18]"
        )}
      >
        {asciiRows.join("\n")}
      </pre>
      <div className="absolute inset-0 z-20 bg-[linear-gradient(to_bottom,var(--background)_0%,transparent_22%,transparent_62%,var(--background)_100%)] opacity-75" />
      <div className="absolute inset-0 z-30 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_52%,var(--background)_100%)]" />
    </div>
  )
}
