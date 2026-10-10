"use client"

import Image from "next/image"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

export function ProjectMedia({
  src,
  alt,
  accent,
  priority = false,
  objectPosition = "center",
}: {
  src: string
  alt: string
  accent: string
  priority?: boolean
  objectPosition?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"])

  return (
    <div ref={ref}>
      <div className="group relative block overflow-hidden bg-graphite">
        <div className="relative aspect-[4/5] sm:aspect-[16/11]">
          <motion.div
            className="absolute inset-x-0 -top-[12%] -bottom-[12%]"
            style={reduce ? undefined : { y }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 58vw, 100vw"
              quality={82}
              className="media-zoom object-cover"
              style={{ objectPosition }}
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/10" />
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px w-0 transition-all duration-700 ease-out group-hover:w-full"
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>
    </div>
  )
}
