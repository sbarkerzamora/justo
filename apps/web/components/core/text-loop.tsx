"use client"

import { Children, useEffect, useState } from "react"
import {
  AnimatePresence,
  type AnimatePresenceProps,
  motion,
  type Transition,
  type Variants,
  useReducedMotion,
} from "motion/react"
import { cn } from "@/lib/utils"

export type TextLoopProps = {
  children: React.ReactNode[]
  className?: string
  interval?: number
  transition?: Transition
  variants?: Variants
  onIndexChange?: (index: number) => void
  trigger?: boolean
  mode?: AnimatePresenceProps["mode"]
}

export function TextLoop({
  children,
  className,
  interval = 2,
  transition = { duration: 0.3 },
  variants,
  onIndexChange,
  trigger = true,
  mode = "popLayout",
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const items = Children.toArray(children)
  const safeIndex = Math.min(currentIndex, Math.max(0, items.length - 1))

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrentIndex((current) =>
        current >= items.length ? Math.max(0, items.length - 1) : current
      )
    }, 0)

    return () => window.clearTimeout(timer)
  }, [items.length])

  useEffect(() => {
    if (!trigger || shouldReduceMotion || items.length <= 1) return

    const intervalMs = interval * 1000
    const timer = setInterval(() => {
      setCurrentIndex((current) => {
        const next = (current + 1) % items.length
        onIndexChange?.(next)
        return next
      })
    }, intervalMs)

    return () => clearInterval(timer)
  }, [items.length, interval, onIndexChange, shouldReduceMotion, trigger])

  const motionVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  }

  return (
    <div className={cn("relative inline-block whitespace-nowrap", className)}>
      {shouldReduceMotion ? (
        items[safeIndex]
      ) : (
        <AnimatePresence mode={mode} initial={false}>
          <motion.div
            key={safeIndex}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            variants={variants || motionVariants}
          >
            {items[safeIndex]}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
