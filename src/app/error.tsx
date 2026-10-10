"use client"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="mx-auto flex min-h-[100svh] w-full max-w-[90rem] flex-col justify-end px-5 pt-32 pb-20 md:px-10 xl:px-16">
      <p className="label">Error</p>
      <h1 className="mt-4 max-w-3xl font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.92] tracking-[-0.04em]">
        Something went wrong.
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
        The page could not be displayed. You can try again.
      </p>
      <button type="button" className="btn btn-solid mt-10 w-full sm:w-auto" onClick={reset}>
        Try again
      </button>
    </section>
  )
}
