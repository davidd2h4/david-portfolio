import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[100svh] w-full max-w-[90rem] flex-col justify-end px-5 pt-32 pb-20 md:px-10 xl:px-16">
      <p className="label">404</p>
      <h1 className="mt-4 max-w-3xl font-serif text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] tracking-[-0.04em]">
        This page is not here.
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
        The address may be mistyped, or the page may have moved.
      </p>
      <Link href="/" className="btn btn-solid mt-10 w-full sm:w-auto">
        Back home
      </Link>
    </section>
  )
}
