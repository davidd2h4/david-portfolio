import { httpUrl, publicUrl } from "@/lib/http"
import { LineLink } from "@/components/line-link"

export function ProjectActions({
  slug,
  liveUrl,
  repositoryUrl,
  includeCaseStudy = true,
}: {
  slug: string
  liveUrl: string | null
  repositoryUrl: string | null
  includeCaseStudy?: boolean
}) {
  const live = publicUrl(liveUrl)
  const source = httpUrl(repositoryUrl)

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {live ? (
        <LineLink href={live} external className="w-full sm:w-auto">
          Open live website
        </LineLink>
      ) : (
        <span className="btn btn-line w-full sm:w-auto" aria-disabled="true">
          Demo coming soon
        </span>
      )}
      {includeCaseStudy ? (
        <LineLink href={`/work/${slug}`} className="w-full sm:w-auto">
          View case study
        </LineLink>
      ) : null}
      {source ? (
        <LineLink href={source} external className="w-full sm:w-auto">
          Source code
        </LineLink>
      ) : null}
    </div>
  )
}
