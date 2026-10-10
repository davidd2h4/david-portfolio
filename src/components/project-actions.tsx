import { httpUrl, publicUrl } from "@/lib/http"
import { LineLink } from "@/components/line-link"

export function ProjectActions({
  liveUrl,
  repositoryUrl,
  liveLabel = "Open live website",
}: {
  liveUrl: string | null
  repositoryUrl: string | null
  liveLabel?: string
}) {
  const live = publicUrl(liveUrl)
  const source = httpUrl(repositoryUrl)

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {live ? (
        <LineLink href={live} external className="w-full sm:w-auto">
          {liveLabel}
        </LineLink>
      ) : (
        <span className="btn btn-line w-full sm:w-auto" aria-disabled="true">
          Demo coming soon
        </span>
      )}
      {source ? (
        <LineLink href={source} external className="w-full sm:w-auto">
          Source code
        </LineLink>
      ) : null}
    </div>
  )
}
