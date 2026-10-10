/**
 * DAVID — site configuration
 * --------------------------
 * Edit this file to update the portfolio. Components read from here
 * so names, copy, contacts, and projects stay in one place.
 *
 * Contacts
 * - Leave a string empty ("") to hide that link.
 * - `formEndpoint`: set a full URL that accepts POST JSON
 *   `{ name, email, project, message }` (for example a Formspree endpoint).
 *   Leave `null` to open a draft in the visitor's email app instead.
 *   The site never tells the visitor a message was delivered unless the
 *   configured endpoint responds successfully.
 *
 * Live websites
 * - Edit `liveDemos` below. That is the only place for the public project URLs.
 * - Paste the deployed https address after the site is online.
 * - Leave `null` until then. The portfolio shows “Demo coming soon”.
 * - Do not paste localhost. Local addresses are ignored.
 *
 * Projects
 * - `repositoryUrl`: full http(s) URL, or `null` to hide the source button.
 * - Do not invent URLs. Use null until the real address exists.
 * - Atmosphere images are visual direction, not interface screenshots.
 * - Add real screenshots by placing files in
 *   `public/projects/<slug>/screenshots/` and appending them to `gallery`
 *   with `kind: "interface"`. See `public/projects/README.md`.
 *
 * Headlines
 * - A newline (\n) forces a line break in large headlines.
 */

export type ImageKind = "atmosphere" | "interface"

export type ProjectImage = {
  src: string
  alt: string
  caption: string
  kind: ImageKind
  objectPosition?: string
}

export type Project = {
  slug: string
  number: string
  title: string
  category: string
  summary: string
  overview: string
  designApproach: string
  features: { title: string; description: string }[]
  technologies: string[]
  accent: string
  palette: string[]
  hero: ProjectImage
  gallery: ProjectImage[]
  /** Full URL of the live demo, or null while it does not exist. */
  liveUrl: string | null
  /** Full URL of the public repository, or null while it does not exist. */
  repositoryUrl: string | null
}

const atmosphere = (
  src: string,
  alt: string,
  caption: string,
  objectPosition = "center",
): ProjectImage => ({
  src,
  alt,
  caption,
  kind: "atmosphere",
  objectPosition,
})

/**
 * Deployed websites for the three portfolio projects.
 * This is the only place to paste a public URL after a project is deployed.
 * Leave null until then. Do not use localhost.
 */
export const liveDemos: {
  noir: string | null
  "aurel-estates": string | null
  "nova-detailing": string | null
} = {
  noir: "https://noir-restaurant.vercel.app/",
  "aurel-estates": "https://aurel-estates-chi.vercel.app/",
  "nova-detailing": "https://nova-deteiling.vercel.app/",
}

export const site = {
  name: "David",
  mark: "DAVID.",
  role: "Web Developer & Digital Designer",
  label: "Independent Web Developer",
  year: 2026,
  /**
   * Canonical site URL for metadata, Open Graph, sitemap, and robots.
   * Set NEXT_PUBLIC_SITE_URL in the environment when you deploy.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),

  hero: {
    label: "Independent Web Developer",
    title: "DAVID.",
    subtitle: "Web Developer & Digital Designer.",
    text: "Premium websites. Modern design. Seamless experiences.",
    primaryCta: { label: "View my work", href: "/#work" },
    secondaryCta: { label: "Let’s talk", href: "/#contact" },
  },

  work: {
    index: "01",
    label: "Work",
    title: "Selected work",
    intro:
      "Three demonstration concepts across dining, property, and automotive.",
  },

  about: {
    index: "02",
    label: "About",
    headline: "Thoughtful design.\nFunctional code.",
    text: "I’m David, an independent web developer focused on creating modern, visually compelling, and intuitive websites. I combine design thinking, frontend development, and AI-assisted workflows to turn ideas into polished digital experiences.",
  },

  services: {
    index: "03",
    label: "Services",
    title: "Services",
    items: [
      {
        number: "01",
        title: "Website Development",
        description: "Modern responsive websites for businesses and brands.",
      },
      {
        number: "02",
        title: "Landing Pages",
        description: "High-impact pages focused on clarity and conversion.",
      },
      {
        number: "03",
        title: "Interactive Experiences",
        description:
          "Custom interfaces, animations, galleries, and interactive features.",
      },
      {
        number: "04",
        title: "Website Redesign",
        description:
          "Modernizing existing websites through improved design and usability.",
      },
    ],
  },

  process: {
    index: "04",
    label: "Process",
    title: "From first conversation to launch",
    steps: [
      {
        number: "01",
        title: "Discover",
        description: "Understand the business, audience, and objectives.",
      },
      {
        number: "02",
        title: "Design",
        description: "Define visual direction and user experience.",
      },
      {
        number: "03",
        title: "Develop",
        description: "Build the responsive, functional website.",
      },
      {
        number: "04",
        title: "Launch",
        description: "Test, refine, and prepare the website for publication.",
      },
    ],
  },

  contact: {
    index: "05",
    label: "Contact",
    headline: "Have a project\nin mind?",
    text: "Let’s create something exceptional.",
    /** Shown on the page and used for mailto. Leave "" to hide email contact. */
    email: "davidwork2184@gmail.com",
    /** Prefilled subject for mailto links. */
    mailSubject: "Project Inquiry — DAVID Portfolio",
    /** Full URL, or "" to hide. */
    telegramUrl: "",
    /** Full URL, or "" to hide. */
    githubUrl: "",
    /** Full URL, or "" to hide. */
    instagramUrl: "",
    /**
     * Optional form backend. POST JSON { name, email, project, message }.
     * null = mailto draft. The UI explains which behavior is active.
     */
    formEndpoint: null as string | null,
    projectTypes: [
      "Website",
      "Landing page",
      "Interactive experience",
      "Redesign",
      "Not sure yet",
    ],
  },

  nav: [
    { id: "work", label: "Work", href: "/#work" },
    { id: "about", label: "About", href: "/#about" },
    { id: "services", label: "Services", href: "/#services" },
    { id: "process", label: "Process", href: "/#process" },
    { id: "contact", label: "Contact", href: "/#contact" },
  ],

  liveDemos,

  projects: [
    {
      slug: "noir",
      number: "01",
      title: "NOIR",
      category: "Premium Restaurant Website",
      summary:
        "A cinematic fine-dining experience with an interactive menu, refined visual storytelling, and a demonstration table-reservation interface.",
      overview:
        "Noir is a demonstration of how a fine-dining website can feel like the room itself: dim, precise, and unhurried. The concept pairs a cinematic opening with an interactive menu and a table-reservation interface that shows how a visit could be requested. It is a portfolio study, not a commissioned restaurant site.",
      designApproach:
        "The direction starts in the room, not the chrome of the interface. Black marble, candlelight, and a single plate set the tone, and the page follows that restraint: large images, few words, and a menu that unfolds course by course. Reservation is a quiet next step, never a banner.",
      features: [
        {
          title: "Interactive menu",
          description:
            "Courses presented as a paced sequence rather than a dense list.",
        },
        {
          title: "Visual storytelling",
          description: "Full-bleed atmosphere with type kept quiet and exact.",
        },
        {
          title: "Reservation demonstration",
          description:
            "A table-request interface showing how a visit could be arranged.",
        },
        {
          title: "Material palette",
          description: "Charcoal, candlelight amber, and a thin silver line.",
        },
      ],
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Motion"],
      accent: "#C4A574",
      palette: ["#08090B", "#1A140F", "#C4A574", "#E8E6E1"],
      hero: atmosphere(
        "/projects/noir/hero.jpg",
        "A candlelit fine-dining plate on black marble, with wine glasses and a low flame.",
        "Opening course",
      ),
      gallery: [
        atmosphere(
          "/projects/noir/hero.jpg",
          "A candlelit fine-dining plate on black marble, with wine glasses and a low flame.",
          "The room, after dark",
        ),
        atmosphere(
          "/projects/noir/detail.jpg",
          "Close view of a dark dining table with brass cutlery, linen, and candlelight.",
          "Table study",
        ),
      ],
      liveUrl: liveDemos.noir,
      repositoryUrl: null,
    },
    {
      slug: "aurel-estates",
      number: "02",
      title: "AUREL ESTATES",
      category: "Luxury Real Estate Website",
      summary:
        "A refined luxury real-estate experience featuring property discovery, detailed listings, galleries, and interactive browsing.",
      overview:
        "Aurel Estates is a demonstration of luxury property presentation: discovery, long-form listings, and galleries arranged with the pacing of an editorial. The interface favors material, light, and proportion before it asks a visitor to compare specifications. It is a portfolio study, not a listing for a real agency.",
      designApproach:
        "Luxury here is pace. Each residence is given room to be looked at — stone, glass, and dusk — before facts appear. Browsing stays linear and photographic, closer to a private viewing than a portal of filters.",
      features: [
        {
          title: "Property discovery",
          description: "Browsing led by character and setting.",
        },
        {
          title: "Listing narrative",
          description:
            "Light, material, and plan before a wall of specifications.",
        },
        {
          title: "Gallery browsing",
          description: "Large photographs with calm, deliberate transitions.",
        },
        {
          title: "Editorial tone",
          description: "Warm stone, oak, and evening glass.",
        },
      ],
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      accent: "#C4B39A",
      palette: ["#1C1814", "#8C6239", "#C4B39A", "#E7E1D6"],
      hero: atmosphere(
        "/projects/aurel-estates/hero.jpg",
        "A penthouse living room at dusk, with a low sofa, stone fireplace, and city lights beyond the glass.",
        "Evening residence",
      ),
      gallery: [
        atmosphere(
          "/projects/aurel-estates/hero.jpg",
          "A penthouse living room at dusk, with a low sofa, stone fireplace, and city lights beyond the glass.",
          "Living room at dusk",
        ),
        atmosphere(
          "/projects/aurel-estates/detail.jpg",
          "A limestone residential facade with tall black-framed windows beside a reflecting pool.",
          "Facade study",
        ),
      ],
      liveUrl: liveDemos["aurel-estates"],
      repositoryUrl: null,
    },
    {
      slug: "nova-detailing",
      number: "03",
      title: "NOVA DETAILING",
      category: "Premium Automotive Detailing Website",
      summary:
        "A premium automotive detailing experience featuring cinematic imagery and an interactive before-and-after comparison.",
      overview:
        "Nova Detailing is a demonstration of a premium automotive brand online. Dramatic imagery leads, services stay legible, and a before-and-after comparison shows how a detailing result could be explored. It is a portfolio study, not a campaign for a real studio.",
      designApproach:
        "The study borrows studio lighting: one highlight, deep black, and a reflective floor. The page should feel as considered as the finish itself. A before-and-after control is the single moment of interaction, precise and easy to read.",
      features: [
        {
          title: "Cinematic framing",
          description: "Studio light translated into layout and crop.",
        },
        {
          title: "Before and after",
          description: "A comparison for exploring a detailing result.",
        },
        {
          title: "Service clarity",
          description: "Packages described without visual noise.",
        },
        {
          title: "Surface study",
          description: "Black paint, a silver edge, and a wet-look floor.",
        },
      ],
      technologies: ["HTML", "CSS", "JavaScript"],
      accent: "#8EA6BB",
      palette: ["#050506", "#15171C", "#8EA6BB", "#D5D8DE"],
      hero: atmosphere(
        "/projects/nova-detailing/hero.jpg",
        "A dark luxury coupe in a black studio, traced by a single highlight and reflected in the floor.",
        "Studio light",
      ),
      gallery: [
        atmosphere(
          "/projects/nova-detailing/hero.jpg",
          "A dark luxury coupe in a black studio, traced by a single highlight and reflected in the floor.",
          "The coupe",
        ),
        atmosphere(
          "/projects/nova-detailing/detail.jpg",
          "Close view of glossy black paint, water beads, and the edge of a polished wheel.",
          "Paint and wheel",
        ),
      ],
      liveUrl: liveDemos["nova-detailing"],
      repositoryUrl: null,
    },
  ] satisfies Project[],
}

export type Site = typeof site
