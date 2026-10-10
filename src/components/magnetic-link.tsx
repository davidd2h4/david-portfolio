"use client"

import Link from "next/link"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"
import { cn } from "@/lib/cn"

const MotionLink = motion.create(Link)

type Variant = "solid" | "line"

export function MagneticLink({
  href,
  children,
  variant = "solid",
  className,
  external = false,
}: {
  href: string
  children: React.ReactNode
  variant?: Variant
  className?: string
  external?: boolean
}) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 280, damping: 22, mass: 0.35 })
  const springY = useSpring(y, { stiffness: 280, damping: 22, mass: 0.35 })

  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    if (reduce || event.pointerType !== "mouse") return
    const bounds = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (bounds.left + bounds.width / 2)
    const dy = event.clientY - (bounds.top + bounds.height / 2)
    x.set(Math.max(-10, Math.min(10, dx * 0.28)))
    y.set(Math.max(-8, Math.min(8, dy * 0.28)))
  }

  function onPointerLeave() {
    x.set(0)
    y.set(0)
  }

  const classes = cn(
    "btn",
    variant === "solid" ? "btn-solid" : "btn-line",
    className,
  )

  const shared = {
    className: classes,
    onPointerMove,
    onPointerLeave,
    style: { x: springX, y: springY },
  }

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...shared}
      >
        {children}
      </motion.a>
    )
  }

  if (href.startsWith("#") || href.startsWith("/#")) {
    return (
      <motion.a href={href} {...shared}>
        {children}
      </motion.a>
    )
  }

  return (
    <MotionLink href={href} {...shared}>
      {children}
    </MotionLink>
  )
}
