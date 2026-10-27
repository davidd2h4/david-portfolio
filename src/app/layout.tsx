import type { Metadata, Viewport } from "next";
import { EB_Garamond, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Cursor } from "@/components/motion/Cursor";
import { PageTransition } from "@/components/motion/PageTransition";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { SITE_URL } from "@/config/site";
import { dictionaries } from "@/i18n/dictionary";
import { LocaleProvider } from "@/i18n/locale";
import "./globals.css";

const sans = Inter_Tight({ subsets: ["latin", "cyrillic"], variable: "--font-inter-tight", display: "swap" });
const serif = EB_Garamond({ subsets: ["latin", "cyrillic"], style: ["italic", "normal"], variable: "--font-garamond", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], weight: ["400", "500"], variable: "--font-mono-face", display: "swap" });

const { meta } = dictionaries.en;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: meta.title, template: "%s — DAVID" },
  description: meta.description,
  applicationName: "DAVID",
  authors: [{ name: "DAVID" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "DAVID",
    title: meta.title,
    description: meta.description,
    url: "/",
    locale: "en_US",
    alternateLocale: ["uk_UA"],
  },
  twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f3f0ea",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide scroll-reveal content before hydration only when JS runs,
            and plays the short intro once per visit (never with reduced motion). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.classList.add('js');try{if(!sessionStorage.getItem('david-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro-play');sessionStorage.setItem('david-intro','1')}}catch(e){}",
          }}
        />
      </head>
      <body className="grain">
        <div aria-hidden className="intro">
          <span className="intro-word">
            DAVID<span className="text-signal-soft">.</span>
          </span>
        </div>
        <LocaleProvider>
          <SkipLink />
          <SmoothScroll />
          <ScrollProgress />
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <PageTransition />
          <Cursor />
        </LocaleProvider>
      </body>
    </html>
  );
}
