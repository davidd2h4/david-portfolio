import { cn } from "@/lib/cn"

function linesFrom(text: string) {
  if (text.includes("\n")) {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  }

  const parts = text.split(/(?<=\.)\s+/).filter(Boolean)
  return parts.length > 0 ? parts : [text]
}

export function Headline({
  text,
  as: Tag = "h2",
  className,
  id,
}: {
  text: string
  as?: "h1" | "h2" | "p"
  className?: string
  id?: string
}) {
  const lines = linesFrom(text)

  return (
    <Tag id={id} className={className}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className="mask-line">
          <span
            className={cn("rise rise-view block")}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
