"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { ProjectImage } from "@/config/site"
import { cn } from "@/lib/cn"

export function Gallery({ images }: { images: ProjectImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    function onClose() {
      setActive(0)
    }

    dialog.addEventListener("close", onClose)
    return () => dialog.removeEventListener("close", onClose)
  }, [])

  function open(index: number) {
    setActive(index)
    dialogRef.current?.showModal()
  }

  function close() {
    dialogRef.current?.close()
  }

  function step(direction: number) {
    setActive((current) => (current + direction + images.length) % images.length)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      step(1)
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      step(-1)
    }
  }

  const current = images[active]

  return (
    <>
      <ul className="grid gap-8 md:grid-cols-2 md:gap-6">
        {images.map((image, index) => (
          <li key={`${image.src}-${image.caption}`} className={cn(index === 0 && "md:col-span-2")}>
            <button
              type="button"
              onClick={() => open(index)}
              className="group block w-full text-left"
            >
              <span
                className={cn(
                  "relative block overflow-hidden bg-graphite",
                  index === 0 ? "aspect-[16/9]" : "aspect-[4/3]",
                )}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={index === 0 ? "100vw" : "(min-width: 768px) 45vw, 100vw"}
                  quality={82}
                  className="media-zoom object-cover"
                  style={{ objectPosition: image.objectPosition ?? "center" }}
                />
              </span>
              <span className="mt-3 flex items-center justify-between gap-4 text-[0.68rem] tracking-[0.16em] text-muted uppercase">
                <span>{image.caption}</span>
                <span>{image.kind === "interface" ? "Interface" : "Atmosphere"}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        onKeyDown={onKeyDown}
        onClick={(event) => {
          if (event.target === dialogRef.current) close()
        }}
      >
        {current ? (
          <div className="bg-ink">
            <div className="relative aspect-[16/10] bg-black">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
                style={{ objectPosition: current.objectPosition ?? "center" }}
              />
            </div>
            <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-silver">
                <span className="text-paper">{current.caption}</span>
                <span className="mx-2 text-white/30">/</span>
                {current.kind === "interface" ? "Interface" : "Atmosphere"}
                <span className="mx-2 text-white/30">/</span>
                {active + 1} of {images.length}
              </p>
              <div className="flex flex-wrap gap-2">
                {images.length > 1 ? (
                  <>
                    <button type="button" className="btn btn-line" onClick={() => step(-1)}>
                      Previous
                    </button>
                    <button type="button" className="btn btn-line" onClick={() => step(1)}>
                      Next
                    </button>
                  </>
                ) : null}
                <button type="button" className="btn btn-solid" onClick={close}>
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  )
}
