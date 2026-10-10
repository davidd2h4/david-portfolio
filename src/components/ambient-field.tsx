"use client"

import { useEffect, useRef } from "react"

export function AmbientField() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      const x = (event.clientX / window.innerWidth) * 100
      const y = (event.clientY / window.innerHeight) * 100
      node.style.setProperty("--mx", `${x.toFixed(2)}%`)
      node.style.setProperty("--my", `${y.toFixed(2)}%`)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  return <div ref={ref} className="ambient" aria-hidden="true" />
}
