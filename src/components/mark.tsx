import { cn } from "@/lib/cn"

export function Mark({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const hasPeriod = text.endsWith(".")
  const word = hasPeriod ? text.slice(0, -1) : text

  return (
    <span className={cn(className)}>
      {word}
      {hasPeriod ? <span className="text-mist">.</span> : null}
    </span>
  )
}
