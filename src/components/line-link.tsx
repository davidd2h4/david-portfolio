import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/cn"

export function LineLink({
  href,
  children,
  external = false,
  className,
}: {
  href: string
  children: React.ReactNode
  external?: boolean
  className?: string
}) {
  const classes = cn("btn btn-line group", className)
  const content = (
    <>
      {children}
      <ArrowUpRight
        aria-hidden
        className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
