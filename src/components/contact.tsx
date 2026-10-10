"use client"

import { Mail } from "lucide-react"
import { FormEvent, useMemo, useState } from "react"
import { site } from "@/config/site"
import { Headline } from "@/components/headline"
import { Shell } from "@/components/shell"
import { httpUrl, isEmail, mailtoHref } from "@/lib/http"

type Fields = {
  name: string
  email: string
  project: string
  message: string
}

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>

const emptyFields: Fields = {
  name: "",
  email: "",
  project: "",
  message: "",
}

function BrandIcon({
  className,
  path,
}: {
  className?: string
  path: string
}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d={path} />
    </svg>
  )
}

const telegramPath =
  "M21.4 4.6 2.7 11.3c-1.2.5-1.2 1.1-.2 1.4l4.8 1.5 1.9 5.6c.2.6.1.9.8.9.4 0 .6-.2.9-.4l2.7-2.6 5.4 4c1 .5 1.6.3 1.9-.9l3.4-16.1c.4-1.4-.5-2-1.9-1.5Z"
const githubPath =
  "M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.4 9.4 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2Z"
const instagramPath =
  "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm8 1.8H8A3.2 3.2 0 0 0 4.8 8v8A3.2 3.2 0 0 0 8 19.2h8A3.2 3.2 0 0 0 19.2 16V8A3.2 3.2 0 0 0 16 4.8ZM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8Zm4.35-2.95a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9Z"

function validate(fields: Fields, maxMessage: number, mailto: boolean): FieldErrors {
  const errors: FieldErrors = {}
  if (fields.name.trim().length < 2) {
    errors.name = "Please enter your name."
  }
  if (!isEmail(fields.email)) {
    errors.email = "Enter a valid email address."
  }
  if (fields.message.trim().length < 10) {
    errors.message = "Please share a little more about the project."
  } else if (fields.message.trim().length > maxMessage) {
    errors.message = mailto
      ? "Please shorten the message so it can open in an email draft."
      : `Please keep the message under ${maxMessage} characters.`
  }
  return errors
}

export function Contact() {
  const endpoint = httpUrl(site.contact.formEndpoint)
  const ownerEmail = site.contact.email.trim()
  const emailReady = isEmail(ownerEmail)
  const mailto = !endpoint
  const maxMessage = endpoint ? 4000 : 1000

  const links = useMemo(
    () =>
      [
        emailReady
          ? {
              label: "Email",
              value: ownerEmail,
              href: mailtoHref(ownerEmail, site.contact.mailSubject),
              external: false,
              icon: <Mail aria-hidden className="size-4" />,
            }
          : null,
        httpUrl(site.contact.telegramUrl)
          ? {
              label: "Telegram",
              value: "Message",
              href: httpUrl(site.contact.telegramUrl) as string,
              external: true,
              icon: <BrandIcon className="size-4" path={telegramPath} />,
            }
          : null,
        httpUrl(site.contact.githubUrl)
          ? {
              label: "GitHub",
              value: "Profile",
              href: httpUrl(site.contact.githubUrl) as string,
              external: true,
              icon: <BrandIcon className="size-4" path={githubPath} />,
            }
          : null,
        httpUrl(site.contact.instagramUrl)
          ? {
              label: "Instagram",
              value: "Profile",
              href: httpUrl(site.contact.instagramUrl) as string,
              external: true,
              icon: <BrandIcon className="size-4" path={instagramPath} />,
            }
          : null,
      ].filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [emailReady, ownerEmail],
  )

  const [fields, setFields] = useState<Fields>(emptyFields)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [delivery, setDelivery] = useState<"mailto" | "endpoint" | null>(null)
  const [attempted, setAttempted] = useState(false)

  function update(key: keyof Fields, value: string) {
    const next = { ...fields, [key]: value }
    setFields(next)
    if (attempted) setErrors(validate(next, maxMessage, mailto))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAttempted(true)
    const nextErrors = validate(fields, maxMessage, mailto)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle")
      return
    }

    const payload = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      project: fields.project.trim() || "Not specified",
      message: fields.message.trim(),
    }

    if (!endpoint) {
      if (!emailReady) {
        setStatus("error")
        return
      }

      const body = `Name: ${payload.name}\nEmail: ${payload.email}\nProject: ${payload.project}\n\n${payload.message}`
      const href = `${mailtoHref(ownerEmail, site.contact.mailSubject)}&body=${encodeURIComponent(body)}`
      if (href.length > 1900) {
        setErrors({
          message: "Please shorten the message so it can open in an email draft.",
        })
        return
      }

      setStatus("submitting")
      window.location.href = href
      setDelivery("mailto")
      setStatus("success")
      return
    }

    setStatus("submitting")
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error("Request failed")
      setDelivery("endpoint")
      setStatus("success")
      setFields(emptyFields)
      setAttempted(false)
    } catch {
      setDelivery(null)
      setStatus("error")
    }
  }

  const formReady = Boolean(endpoint) || emailReady

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
          </div>

          <div className="border border-white/10 bg-graphite/80 p-6 sm:p-8 lg:col-span-6 lg:p-10">
            {status === "success" ? (
              <div role="status" aria-live="polite">
                <p className="label">Inquiry</p>
                <h3 className="mt-4 font-serif text-4xl tracking-tight">
                  {delivery === "endpoint" ? "Message received." : "Draft opened."}
                </h3>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                  {delivery === "endpoint"
                    ? "Your message was submitted successfully."
                    : `Your email app should have a draft addressed to ${ownerEmail}. Send that email to reach me. This website did not deliver the message.`}
                </p>
                <button
                  type="button"
                  className="btn btn-line mt-8"
                  onClick={() => {
                    setStatus("idle")
                    setDelivery(null)
                    setFields(emptyFields)
                    setErrors({})
                    setAttempted(false)
                  }}
                >
                  Write another
                </button>
              </div>
            ) : formReady ? (
              <form onSubmit={onSubmit} noValidate>
                <p className="label">Inquiry</p>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="inquiry-name" className="label">
                      Name
                    </label>
                    <input
                      id="inquiry-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={fields.name}
                      onChange={(event) => update("name", event.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "inquiry-name-error" : undefined}
                      className="field"
                    />
                    {errors.name ? (
                      <p id="inquiry-name-error" className="mt-2 text-sm text-[#e4bdb4]">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="inquiry-email" className="label">
                      Email
                    </label>
                    <input
                      id="inquiry-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={fields.email}
                      onChange={(event) => update("email", event.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "inquiry-email-error" : undefined}
                      className="field"
                    />
                    {errors.email ? (
                      <p id="inquiry-email-error" className="mt-2 text-sm text-[#e4bdb4]">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="inquiry-project" className="label">
                    Project type
                  </label>
                  <select
                    id="inquiry-project"
                    name="project"
                    value={fields.project}
                    onChange={(event) => update("project", event.target.value)}
                    className="field select-field"
                  >
                    <option value="">Select a starting point</option>
                    {site.contact.projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6">
                  <label htmlFor="inquiry-message" className="label">
                    Message
                  </label>
                  <textarea
                    id="inquiry-message"
                    name="message"
                    value={fields.message}
                    onChange={(event) => update("message", event.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "inquiry-message-error" : "inquiry-note"}
                    className="field"
                    maxLength={maxMessage + 200}
                  />
                  {errors.message ? (
                    <p id="inquiry-message-error" className="mt-2 text-sm text-[#e4bdb4]">
                      {errors.message}
                    </p>
                  ) : null}
                  {fields.message.length > maxMessage * 0.8 ? (
                    <p className="mt-2 text-xs tracking-wide text-muted">
                      {fields.message.trim().length} / {maxMessage}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="btn btn-solid mt-8 w-full sm:w-auto"
                  disabled={status === "submitting"}
                >
                  {status === "submitting"
                    ? endpoint
                      ? "Sending"
                      : "Opening email"
                    : "Send inquiry"}
                </button>

                <p id="inquiry-note" className="mt-5 max-w-md text-sm leading-relaxed text-muted">
                  {endpoint
                    ? "Submitting sends this message to the connected form service. A confirmation appears only if that service accepts it."
                    : `Submitting opens a draft in your email app, addressed to ${ownerEmail}. Nothing is sent until you send that email.`}
                </p>

                {status === "error" ? (
                  <p role="alert" className="mt-4 text-sm leading-relaxed text-[#e4bdb4]">
                    The message was not submitted.
                    {emailReady ? ` You can write directly to ${ownerEmail}.` : ""}
                  </p>
                ) : null}

                <noscript>
                  <p className="mt-4 text-sm text-muted">
                    This form needs JavaScript to open a draft. Email {ownerEmail} directly.
                  </p>
                </noscript>
              </form>
            ) : (
              <div>
                <p className="label">Inquiry</p>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                  Add an email address or a form endpoint in the site configuration to
                  enable inquiries.
                </p>
              </div>
            )}
          </div>
        </div>
      </Shell>
    </section>
  )
}
