"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

const LABELS = {
  id: { copy: "Salin perintah", copied: "Tersalin" },
  en: { copy: "Copy command", copied: "Copied" },
}

function CopyButton({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)
  // Same rule as the header: `/en` and `/en/...` are English, everything else Indonesian.
  const pathname = usePathname()
  const labels = LABELS[pathname === "/en" || pathname.startsWith("/en/") ? "en" : "id"]

  async function onCopy() {
    if (await copyText(text)) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? labels.copied : labels.copy}
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground rounded-md",
        copied && "border-primary text-primary-foreground dark:text-primary",
        className
      )}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  )
}

/** Try the Clipboard API first; if it is refused (http, permissions), fall back to execCommand. */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const el = document.createElement("textarea")
    el.value = text
    el.setAttribute("readonly", "")
    el.style.position = "fixed"
    el.style.opacity = "0"
    document.body.appendChild(el)
    el.select()
    let ok = false
    try {
      ok = document.execCommand("copy")
    } catch {
      ok = false
    }
    el.remove()
    return ok
  }
}

export { CopyButton }
