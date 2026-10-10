import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Hero } from "@/components/hero"
import { Process } from "@/components/process"
import { Services } from "@/components/services"
import { Work } from "@/components/work"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      <About />
      <Services />
      <Process />
      <Contact />
    </>
  )
}
