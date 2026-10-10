import { cn } from "@/lib/cn"

export function Shell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[90rem] px-5 md:px-10 xl:px-16",
        className,
      )}
    >
      {children}
    </div>
  )
}
