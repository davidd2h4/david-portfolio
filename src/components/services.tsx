import { site } from "@/config/site"
import { Shell } from "@/components/shell"

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="scroll-mt-24 border-t border-white/10 py-24 md:py-32 lg:py-40"
    >
      <Shell>
        <h2 id="services-title" className="label">
          {site.services.index} — {site.services.title}
        </h2>
        <ul className="mt-10 border-b border-white/10 md:mt-14">
          {site.services.items.map((item) => (
            <li key={item.number} className="group border-t border-white/10">
              <div className="grid gap-3 py-8 transition-colors duration-500 group-hover:bg-white/[0.03] md:grid-cols-12 md:items-baseline md:gap-8 md:px-4 md:py-10">
                <p className="font-serif text-xl text-mist transition-colors duration-300 group-hover:text-paper md:col-span-2">
                  {item.number}
                </p>
                <h3 className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] leading-tight tracking-tight md:col-span-4">
                  {item.title}
                </h3>
                <p className="max-w-md text-base leading-relaxed text-muted md:col-span-5">
                  {item.description}
                </p>
                <span
                  aria-hidden
                  className="hidden h-px w-8 bg-silver/0 transition-all duration-500 group-hover:w-14 group-hover:bg-silver md:col-span-1 md:block md:justify-self-end"
                />
              </div>
            </li>
          ))}
        </ul>
      </Shell>
    </section>
  )
}
