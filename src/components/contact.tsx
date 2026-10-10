import { Mail } from "lucide-react"
import { site } from "@/config/site"
import { Headline } from "@/components/headline"
import { Shell } from "@/components/shell"
import { httpUrl, isEmail, mailtoHref } from "@/lib/http"

function BrandIcon({ className, path }: { className?: string; path: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d={path} />
    </svg>
  )
}

const githubPath =
  "M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.4 9.4 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2Z"
const instagramPath =
  "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm8 1.8H8A3.2 3.2 0 0 0 4.8 8v8A3.2 3.2 0 0 0 8 19.2h8A3.2 3.2 0 0 0 19.2 16V8A3.2 3.2 0 0 0 16 4.8ZM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8Zm4.35-2.95a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9Z"

export function Contact() {
  const email = site.contact.email.trim()
  const emailReady = isEmail(email)
  const gmailHref = emailReady
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(site.contact.mailSubject)}`
    : null
  const github = httpUrl(site.contact.githubUrl)
  const instagram = httpUrl(site.contact.instagramUrl)

  const links = [
    emailReady
      ? {
          label: "Email",
          value: email,
          href: mailtoHref(email, site.contact.mailSubject),
          external: false,
          icon: <Mail aria-hidden className="size-4" />,
        }
      : null,
    github
      ? {
          label: "GitHub",
          value: "Profile",
          href: github,
          external: true,
          icon: <BrandIcon className="size-4" path={githubPath} />,
        }
      : null,
    instagram
      ? {
          label: "Instagram",
          value: "Profile",
          href: instagram,
          external: true,
          icon: <BrandIcon className="size-4" path={instagramPath} />,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item))

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-24 border-t border-white/10 py-24 md:py-32 lg:py-40"
    >
      <Shell>
        <p className="label">
          {site.contact.index} — {site.contact.label}
        </p>
        <div className="mt-8 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Headline
              id="contact-title"
              text={site.contact.headline}
              className="font-serif text-[clamp(3rem,7vw,6.2rem)] leading-[0.92] tracking-[-0.04em]"
            />
            <p className="mt-6 max-w-md text-lg leading-relaxed text-silver">
              {site.contact.text}
            </p>

            {links.length > 0 ? (
              <ul className="mt-12 border-t border-white/10">
                {links.map((link) => (
                  <li key={link.label} className="border-b border-white/10">
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group flex items-center justify-between gap-4 py-4"
                    >
                      <span className="flex items-center gap-3 text-[0.72rem] tracking-[0.18em] text-muted uppercase transition-colors group-hover:text-paper">
                        {link.icon}
                        {link.label}
                      </span>
                      <span className="truncate text-sm text-paper transition-colors group-hover:text-mist">
                        {link.value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="border border-white/10 bg-graphite/80 p-6 sm:p-8 lg:col-span-6 lg:self-start lg:p-10">
            <p className="label">Inquiry</p>
            {gmailHref ? (
              <a
                href={gmailHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-solid mt-8 w-full sm:w-auto"
              >
                Write me an email
              </a>
            ) : (
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                Add an email address in the site configuration to enable inquiries.
              </p>
            )}
          </div>
        </div>
      </Shell>
    </section>
  )
}
