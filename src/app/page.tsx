import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { ProjectIndex } from "@/components/home/ProjectIndex";
import { Services } from "@/components/home/Services";
import { Showcase } from "@/components/home/Showcase";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Showcase />
      <ProjectIndex />
      <About />
      <Services />
      <Contact />
    </>
  );
}
