"use client"

import {
  AlertDialog as AlertDialogRoot,
  AlertDialogAction as ActionPrimitive,
  AlertDialogCancel as CancelPrimitive,
  AlertDialogContent as ContentPrimitive,
  AlertDialogDescription as DescriptionPrimitive,
  AlertDialogOverlay as OverlayPrimitive,
  AlertDialogPortal as PortalPrimitive,
  AlertDialogTitle as TitlePrimitive,
  AlertDialogTrigger as TriggerPrimitive,
} from "@radix-ui/react-alert-dialog"
import * as React from "react"

import { cn } from "@/lib/utils"

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogRoot>) {
  return <AlertDialogRoot data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof TriggerPrimitive>) {
  return <TriggerPrimitive data-slot="alert-dialog-trigger" {...props} />
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof PortalPrimitive>) {
  return <PortalPrimitive data-slot="alert-dialog-portal" {...props} />
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof OverlayPrimitive>) {
  return (
    <OverlayPrimitive
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/25 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof ContentPrimitive>) {
  return (
    <PortalPrimitive>
      <AlertDialogOverlay />
      <ContentPrimitive
        data-slot="alert-dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl border border-border/60 bg-background p-6 text-sm shadow-lg duration-100 outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      />
    </PortalPrimitive>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof TitlePrimitive>) {
  return (
    <TitlePrimitive
      data-slot="alert-dialog-title"
      className={cn("text-base font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DescriptionPrimitive>) {
  return (
    <DescriptionPrimitive
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof ActionPrimitive>) {
  return (
    <ActionPrimitive
      data-slot="alert-dialog-action"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/80",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof CancelPrimitive>) {
  return (
    <CancelPrimitive
      data-slot="alert-dialog-cancel"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition hover:bg-accent",
        className,
      )}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
}
