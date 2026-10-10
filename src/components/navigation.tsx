"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { site } from "@/config/site"
import { mailtoHref } from "@/lib/http"
import { cn } from "@/lib/cn"
import { Mark } from "@/components/mark"

const sectionIds = site.nav.map((item) => item.id)

export function Navigation() {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const menuId = useId()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef(false)
  const [open, setOpen] = useState(false)
  const [pathSnapshot, setPathSnapshot] = useState(pathname)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  if (pathSnapshot !== pathname) {
    setPathSnapshot(pathname)
    setOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (pathname !== "/") return

    let frame = 0

    const update = () => {
      frame = 0
      const marker = window.innerHeight * 0.38
      let current: string | null = null

      for (const id of sectionIds) {
        const node = document.getElementById(id)
        if (!node) continue
        if (node.getBoundingClientRect().top <= marker) current = id
      }

      setActiveSection((previous) => (previous === current ? previous : current))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [pathname])

  useEffect(() => {
    if (!open) {
      if (restoreFocus.current) {
        menuButtonRef.current?.focus()
        restoreFocus.current = false
      }
      return
    }

    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  function closeMenu(restore: boolean) {
    restoreFocus.current = restore
    setOpen(false)
  }

  function onDialogKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      closeMenu(true)
      return
    }

    if (event.key !== "Tab" || !dialogRef.current) return

    const items = dialogRef.current.querySelectorAll<HTMLElement>("a, button")
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) return

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  function onLogoClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") return
    event.preventDefault()
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
    setOpen(false)
  }

  function isActive(id: string) {
    if (pathname.startsWith("/work")) return id === "work"
    return pathname === "/" && activeSection === id
  }

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-white/10 bg-ink/80 backdrop-blur-md"
          : "bg-gradient-to-b from-ink/75 to-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-5 md:h-[4.5rem] md:px-10 xl:px-16">
        <Link
          href="/"
          onClick={onLogoClick}
          className="font-serif text-lg tracking-wide"
        >
          <Mark text={site.mark} />
          <span className="sr-only"> home</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => {
            const active = isActive(item.id)
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "group relative py-2 text-[0.72rem] tracking-[0.18em] text-muted uppercase transition-colors duration-300 hover:text-paper",
                  active && "text-paper",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-mist transition-transform duration-300",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </a>
            )
          })}
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="grid size-11 place-items-center text-paper md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(true)}
        >
          <Menu aria-hidden className="size-5" />
          <span className="sr-only">Open menu</span>
        </button>
      </div>
    </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[70] flex min-h-[100svh] flex-col bg-ink px-5 pt-2 pb-16 md:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onKeyDown={onDialogKeyDown}
          >
            <div className="flex h-16 items-center justify-between">
              <Link href="/" onClick={onLogoClick} className="font-serif text-lg">
                <Mark text={site.mark} />
              </Link>
              <button
                ref={closeButtonRef}
                type="button"
                className="grid size-11 place-items-center"
                onClick={() => closeMenu(true)}
              >
                <X aria-hidden className="size-5" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <nav aria-label="Mobile" className="mt-10 flex flex-1 flex-col justify-center gap-2">
              {site.nav.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={() => closeMenu(false)}
                  className="flex items-baseline gap-4 py-2 font-serif text-[clamp(2.6rem,12vw,3.5rem)] leading-none tracking-tight"
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + index * 0.045, duration: 0.45 }}
                >
                  <span className="text-sm tracking-[0.18em] text-mist">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </motion.a>
              ))}
            </nav>

            {site.contact.email ? (
              <a
                href={mailtoHref(site.contact.email, site.contact.mailSubject)}
                className="text-sm tracking-wide text-muted"
              >
                {site.contact.email}
              </a>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
