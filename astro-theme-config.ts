type NavItem = {
  label: string;
  href: string;
};

/**
 * astro-theme-config.ts
 *
 * Central configuration for the Tone theme.
 * Most site-level customization should happen in this file.
 *
 * NOTE: The About, Now, and Projects copy below is intentionally generic
 * placeholder text. Replace it with your real words before launch. Nothing
 * here is invented biography, experience, or opinion.
 */

const config = {
  site: {
    /** Production origin, used for canonical links, sitemap, and Open Graph metadata. */
    url: 'https://blog.ankitmishraofficial.com',
    /** Subpath such as '/repo-name'. Keep empty when deploying at a domain root. */
    base: '',
    lang: 'en',
    locale: 'en_US',
    dateLocale: 'en-US',
    title: 'Ankit Mishra',
    logoLabel: 'Ankit Mishra',
    description:
      "Writing, experiments, observations, and things I'm trying to understand.",
    author: 'Ankit Mishra',
    /** Optional absolute or root-relative image URL for homepage/search/about social previews. */
    defaultOgImage: '/og.png',
  },

  // Header links. The logo already links to `/`.
  nav: [
    { label: 'Posts', href: '/posts' },
    { label: 'Notes', href: '/notes' },
    { label: 'Projects', href: '/projects' },
    { label: 'Now', href: '/now' },
    { label: 'About', href: '/about' },
  ] as NavItem[],

  // Footer links stay visible by default so readers have a stable way to move around.
  footerNav: [
    { label: 'Posts', href: '/posts' },
    { label: 'Notes', href: '/notes' },
    { label: 'Archive', href: '/archive' },
    { label: 'About', href: '/about' },
    { label: 'Search', href: '/search' },
  ] as NavItem[],

  content: {
    categoryOrder: [
      'Essays',
      'AI',
      'Technology',
      'Building',
      'Experiments',
      'Work',
      'Management',
      'Observations',
      'Projects',
      'Notes',
    ] as string[],
  },

  behavior: {
    smoothScroll: true,
  },

  comments: {
    // One-line switch after you fill the giscus values:
    // mode: 'off'           -> no comments
    // mode: 'giscus'        -> original giscus theme
    // mode: 'giscus-custom' -> Tone custom giscus theme
    // Local preview can also use PUBLIC_GISCUS_MODE and PUBLIC_GISCUS_* in .env.local.
    mode: 'off',
    provider: 'giscus',
    giscus: {
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '0',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme',
      customLightTheme: '/giscus-light.css',
      customDarkTheme: '/giscus-dark.css',
      lang: 'en',
      loading: 'eager',
    },
  },

  // Fill these in with your real accounts. Leave a value empty to omit that link.
  social: {
    website: 'https://blog.ankitmishraofficial.com',
    email: '',
    linkedin: '',
    github: '',
  },

  // Placeholder copy. Replace with your own words — nothing here is factual about you.
  about: {
    /** Profile image URL. Leave empty to use the text-only About layout. */
    profileImage: '',
    name: 'Ankit Mishra',
    role: "Writing, experiments, observations and things I'm trying to understand.",
    location: '',
    focus: '',
    lead: 'This is a placeholder About page. Replace this copy with a short introduction in your own words.',
    headline: ['Trying to', 'understand.'],
    statementLabel: 'About',
    statementTitle: 'A short placeholder.',
    statement:
      'This page is intentionally spare. Replace the sections below with real details you want to share, or remove them.',
    careerLabel: 'Work',
    career: [] as { period: string; title: string; description: string }[],
    interests: [] as string[],
    interestsLabel: 'Interests',
    interestsHeading: 'What the work keeps returning to',
  },

  // Placeholder copy for the /now page. Replace with what you are actually working on.
  now: {
    title: 'Now',
    intro:
      'A placeholder Now page. Replace this with what you are currently exploring, learning, or working on.',
    updatedNote: 'Replace this date with the day you last update this page.',
    sections: [] as { title: string; body: string }[],
  },
} as const;

export default config;
