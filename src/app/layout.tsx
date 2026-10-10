import type { Metadata, Viewport } from "next"
import { Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google"
import { Suspense } from "react"
import { site } from "@/config/site"
import { Footer } from "@/components/footer"
import { MotionProvider } from "@/components/motion-provider"
import { Navigation } from "@/components/navigation"
import { httpUrl } from "@/lib/http"
import "./globals.css"

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
})

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
})

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

const title = `${site.name} — ${site.role}`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description: site.hero.text,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "David",
    "freelance web developer",
    "creative developer",
    "website design",
    "Next.js",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title,
    description: site.hero.text,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.hero.text,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: site.url,
  },
}

export const viewport: Viewport = {
  themeColor: "#08090B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
}

function personJsonLd() {
  const sameAs = [
    site.contact.githubUrl,
    site.contact.telegramUrl,
    site.contact.instagramUrl,
  ]
    .map((value) => httpUrl(value))
    .filter((value): value is string => Boolean(value))
    .filter((value) => !/your[-_]username|example\.com/i.test(value))

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description: site.hero.text,
    url: site.url,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink font-sans text-paper antialiased">
        <a className="skip-link" href="#top">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <MotionProvider>
          <Suspense fallback={null}>
            <Navigation />
          </Suspense>
          <div className="grain" aria-hidden="true" />
          <main id="top" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  )
}
