export function httpUrl(value: string | null | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null

  try {
    const url = new URL(trimmed)
    if (url.protocol !== "http:" && url.protocol !== "https:") return null
    return url.toString()
  } catch {
    return null
  }
}

function isLocalHost(hostname: string) {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase()
  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "::1"
  )
}

/** A public website address. Localhost and empty values are ignored. */
export function publicUrl(value: string | null | undefined): string | null {
  const url = httpUrl(value)
  if (!url) return null
  if (isLocalHost(new URL(url).hostname)) return null
  return url
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function mailtoHref(email: string, subject?: string) {
  const address = email.trim()
  const href = `mailto:${address}`
  if (!subject?.trim()) return href
  return `${href}?subject=${encodeURIComponent(subject.trim())}`
}
