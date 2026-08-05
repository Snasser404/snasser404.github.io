/* ============================================================
   PORTFOLIO CONTENT
   Single source of truth for all copy & data on the site.
   Positioning: Digital Marketing & MarTech Specialist.
   Edit text / links / add image paths here — the UI reads from this.
   ============================================================ */

export type Link = { label: string; href: string }

export type Project = {
  name: string
  category: string
  blurb: string
  /** The marketing / MarTech stack & channels used on this engagement. */
  techStack: string[]
  highlights?: string[]
  status?: string
  accent?: string
  /** Optional screenshot/thumbnail under /public/projects (e.g. "/projects/serene-touch.png"). */
  image?: string
  client?: boolean
  repo?: string
  live?: string
  repoPrivate?: boolean
}

export const profile = {
  name: 'Nasser Saleh',
  roleTitle: 'Digital Marketing & MarTech Specialist',
  tagline: 'Marketing that’s measured. Tech that makes it scale.',
  subheadline:
    'A data-driven digital marketer who builds and runs the technology behind growth — websites, SEO & GEO, marketing automation, analytics, and the booking & CRM funnels that turn traffic into customers.',
  location: 'Toronto, Ontario',
  email: 'nassersaleh156@gmail.com',
  phone: '(438) 988-6709',
  linkedin: 'https://www.linkedin.com/in/nasser-saleh/',
  github: 'https://github.com/Snasser404',
  resume: 'Nasser-Saleh-Resume.pdf',
  languages: 'Bilingual — English & Arabic',
}

export const about = {
  /** Regenerate with: python scripts/make_headshot.py "<path to photo>" */
  headshot: `${import.meta.env.BASE_URL}assets/headshot.jpg`,
  paragraphs: [
    "I'm a digital marketing specialist based in Toronto who works at the intersection of marketing, data, and technology. Over the last four years I've run PPC and SEO campaigns, owned analytics in GA4 and SEMrush, produced competitive and audience research, and led content and brand work across non-profit and for-profit teams — consistently turning data into decisions that move traffic, engagement, and ROI.",
    "What sets me apart is the tech side. I don't just brief the tools — I set them up and run them: marketing websites, local-SEO landing pages, marketing-automation workflows, conversion tracking, and booking/CRM funnels. That lets me launch a campaign end-to-end and measure exactly what's working, without waiting on a dev queue.",
    "I also work at the front edge of search. Beyond classic SEO, I focus on Generative Engine Optimization (GEO) — making sure a brand actually shows up in AI answers from ChatGPT, Perplexity, and Google's AI Overviews, where more and more buying decisions now start.",
    'My foundation is a diploma in IT Management & Data Analytics from the Lebanese American University, plus hands-on credentials in digital marketing, AI, and data from Google, Udacity, and BrainStation. Bilingual in English and Arabic.',
  ],
  stats: [
    { value: '+100%', label: 'Website traffic', sub: 'doubled at GlobalDWS' },
    { value: '+40%', label: 'SEO traffic', sub: 'in 5 months' },
    { value: '−20%', label: 'Cost-per-click', sub: 'on paid search' },
    { value: '4+', label: 'Client engagements', sub: 'strategy · campaigns · growth' },
  ],
}

/* ---- Selected Work: client & freelance MarTech engagements ----
   Framed by the marketing outcome, not the code. Add a real screenshot by
   setting `image` (a path under /public/projects). Add real client names,
   logos, or results where you have them. */
export const featuredProjects: Project[] = [
  {
    name: 'Wai Nui Outrigger Canoe Club',
    category: 'Marketing Strategy & Research',
    accent: '#0891b2',
    status: 'Completed',
    client: true,
    blurb:
      'A full marketing audit for an Oakville community sports club — competitor benchmarking, an audience and content review, and a member-journey analysis, distilled into a prioritized 90-day marketing plan a volunteer-run board could actually execute.',
    techStack: ['Competitive benchmarking', 'Audience & member research', 'Content & channel audit', 'Journey mapping', '90-day roadmap'],
    highlights: [
      'Competitor benchmarking against comparable clubs and community-sport organizations',
      'Member-journey analysis from first search through to signup and retention',
      'Content, channel, and search review tied to how prospective members actually look for a club',
      'Findings prioritized into a 90-day marketing plan, sized for a volunteer team',
    ],
  },
  {
    name: 'Serene Touch Pest Control',
    category: 'Local Marketing & Lead Generation',
    accent: '#2ECC71',
    status: 'Completed',
    client: true,
    blurb:
      'Ran the local marketing program for a Toronto-area pest-control business — search strategy across 20+ service areas, Google Business and reputation management, content and campaign planning, and reporting that ties every enquiry back to its source.',
    techStack: ['Local SEO strategy', 'Google Business', 'Content planning', 'Lead generation', 'Campaign management', 'GA4 reporting'],
    highlights: [
      'Local search strategy across 20+ GTA service areas, aimed at high-intent "near me" demand',
      'Google Business Profile and review management to strengthen local visibility and trust',
      'Conversion tracking so calls, form fills, and bookings are attributed to the right channel',
      'Ongoing reporting and optimization measured against enquiry volume',
    ],
    live: 'https://serenetouch.ca/',
  },
  {
    name: 'BarberBook',
    category: 'Client Marketing & Retention',
    accent: '#6C5CE7',
    status: 'Completed',
    client: true,
    blurb:
      'Marketing and customer-retention program for a barbershop — a promotions calendar built around demand, reputation and review management, and a follow-up journey designed to turn first visits into repeat bookings and cut no-shows.',
    techStack: ['Local marketing', 'Promotions & offers', 'Reputation management', 'Retention campaigns', 'Customer comms'],
    highlights: [
      'Promotions and offers calendar planned around peak and quiet periods',
      'Review and reputation strategy to improve local discovery and trust',
      'Automated reminders and follow-ups to reduce no-shows and win back lapsed clients',
      'Retention journey turning first-time visits into repeat bookings',
    ],
  },
  {
    name: 'Paradise Wellness',
    category: 'Spa Marketing & Business Growth',
    accent: '#FF7AB6',
    status: 'Completed',
    client: true,
    blurb:
      'Marketing and growth management for a Mississauga spa — membership and package campaigns, local customer acquisition, seasonal promotions, and reporting on what actually fills the calendar, including input on how the membership offer was packaged and priced.',
    techStack: ['Local marketing', 'Membership campaigns', 'Promotions & packages', 'Email marketing', 'Business development', 'GA4 reporting'],
    highlights: [
      'Membership and package campaigns to lift repeat visits and prepaid revenue',
      'Local acquisition marketing across search, social, and Google Business',
      'Email and seasonal promotional campaigns tied to demand cycles',
      'Booking and campaign reporting used to steer where budget went next',
    ],
  },
]

/* ---- What I take on for a client, customer-facing ---- */
export type ServiceArea = { name: string; blurb: string; example?: string; accent: string }

export const services: ServiceArea[] = [
  {
    name: 'Marketing strategy',
    accent: '#0891b2',
    blurb:
      'Positioning, audience and competitor research, and a channel plan sized to the budget — so spend goes where it actually returns instead of everywhere at once.',
    example: 'e.g. Wai Nui — audit to 90-day plan',
  },
  {
    name: 'Campaign management',
    accent: '#4f46e5',
    blurb:
      'Day-to-day ownership of search, paid, social, content, and email — planned, launched, optimized, and reported on, so campaigns keep improving rather than just running.',
  },
  {
    name: 'Analytics & reporting',
    accent: '#7c3aed',
    blurb:
      'Tracking set up properly, then plain-English reporting that answers what worked, what it cost, and what to do next month.',
  },
  {
    name: 'Growth & business development',
    accent: '#0d9488',
    blurb:
      'Offers, promotions, memberships, retention, and reputation — the commercial side of marketing that turns first-time customers into repeat revenue.',
    example: 'e.g. Paradise Wellness — membership campaigns',
  },
]

/* Software/dev projects are intentionally not shown on this marketing-focused
   site. Kept as an empty list so the UI + build stay happy. */
export const otherProjects: Project[] = []

/* ---- Campaigns & Results — quantified marketing wins from past roles ---- */
export type MarketingProject = {
  title: string
  org: string
  type: string
  metric: string
  metricLabel: string
  description: string
  accent: string
  tools: string[]
  image?: string
}

export const marketingProjects: MarketingProject[] = [
  {
    title: 'Brand & Website Growth',
    org: 'GlobalDWS',
    type: 'Brand · Web · Social',
    metric: '+100%',
    metricLabel: 'website traffic',
    description:
      'Led a cross-functional team of 3 to build a new company website end-to-end and run a holistic marketing strategy — growing social following & engagement by 50% and website traffic by 100%.',
    accent: '#4f46e5',
    tools: ['Web', 'Brand', 'Social', 'Email', 'Events'],
  },
  {
    title: 'Holistic SEO Strategy',
    org: 'Faster Accessories',
    type: 'SEO',
    metric: '+40%',
    metricLabel: 'traffic in 5 months',
    description:
      'Designed and executed a full SEO strategy that grew website traffic 40% in five months, including a 30% lift in organic traffic.',
    accent: '#0891b2',
    tools: ['SEO', 'SEMrush', 'Ahrefs', 'GA4'],
  },
  {
    title: 'Paid Search & Social (PPC/SEM)',
    org: 'Faster Accessories',
    type: 'PPC / SEM',
    metric: '−20%',
    metricLabel: 'cost-per-click',
    description:
      'Managed a $1,000/mo paid program: cut CPC 20%, lifted CTR 25%, and reached 10,000+ prospects. Budget reallocation from monthly reporting improved ROI by 20%.',
    accent: '#7c3aed',
    tools: ['Google Ads', 'Meta Ads', 'LinkedIn Ads'],
  },
  {
    title: 'BI Reporting & Market Research',
    org: 'Ajjerni Rentals',
    type: 'Analytics',
    metric: '+15%',
    metricLabel: 'marketing ROI',
    description:
      'Built interactive Tableau, Power BI & Excel reports and competitive research that shaped startup strategy — supporting a 15% ROI increase and 20% improvement in customer retention.',
    accent: '#0d9488',
    tools: ['Tableau', 'Power BI', 'Excel', 'Python'],
  },
]

/* Placeholder slots for design / creative work. Drop images into
   /public/marketing and set `image` to show them; otherwise a labelled tile shows. */
export type DesignTile = { label: string; tag: string; image?: string }

export const designGallery: DesignTile[] = [
  { label: 'Social creative', tag: 'Instagram · LinkedIn' },
  { label: 'One-pagers & case studies', tag: 'Sales collateral' },
  { label: 'Newsletters', tag: 'Mailchimp · Brevo' },
]

export type SkillGroup = { group: string; skills: string[] }

export const skillGroups: SkillGroup[] = [
  {
    group: 'Digital Marketing',
    skills: [
      'SEO (technical + local)',
      'GEO (Generative Engine Optimization)',
      'PPC / SEM (Google, Meta, LinkedIn)',
      'Content & brand',
      'Email marketing',
      'Social media',
      'Campaign strategy',
      'Conversion optimization',
    ],
  },
  {
    group: 'Analytics & Data',
    skills: [
      'Google Analytics 4 (GA4)',
      'SEMrush & Ahrefs',
      'Tag & event tracking',
      'Tableau & Power BI',
      'A/B testing',
      'Reporting & dashboards',
      'Excel · data interpretation',
    ],
  },
  {
    group: 'MarTech & Automation',
    skills: [
      'Website development',
      'CMS (Wix · WordPress · Shopify)',
      'Custom-built websites',
      'Marketing automation',
      'CRM & lead funnels',
      'Mailchimp / Brevo',
      'Booking systems',
      'AI content tools',
      'Google Business · local',
    ],
  },
  {
    group: 'Technical Toolkit',
    skills: [
      'HTML & CSS (hands-on)',
      'No-code / low-code platforms',
      'Tracking & tool integrations',
      'Python for marketing data',
      'SQL for reporting',
      'Landing-page builds',
    ],
  },
]

export type Experience = {
  company: string
  role: string
  location: string
  period: string
  bullets: string[]
}

export const experience: Experience[] = [
  {
    company: 'Manara Digital',
    role: 'Digital Marketing & Insights Consultant',
    location: 'Toronto, Ontario',
    period: '2023 – Present',
    bullets: [
      'Deliver competitive reviews and audience research for small-business and non-profit clients, turning category and consumer findings into prioritized, budget-aware recommendations.',
      'Produced a full marketing and website audit for an Oakville community sports club — competitor benchmarking, SEO review, and member-journey analysis distilled into a 90-day action plan.',
      'Manage end-to-end marketing programs for clients — strategy, local SEO and GEO, campaigns, promotions, and reputation management — plus the tracking and automation that measure them.',
      'Build recurring reporting in Excel and Power BI, using Python and AI automation to cut manual data-preparation time.',
      'Client engagements span pest control (Serene Touch), wellness/spa (Paradise Wellness), personal services (BarberBook), and non-profit sport (Wai Nui) — covering strategy, campaign management, retention, and business development.',
    ],
  },
  {
    company: 'GlobalDWS',
    role: 'Digital Marketing Specialist',
    location: 'North York, Ontario',
    period: 'Jun 2023 – Jul 2024',
    bullets: [
      'Led a cross-functional team of 3 (graphic designers, social specialists, web developers) to design and run a holistic marketing strategy.',
      'Owned the end-to-end creation of a new company website, from concept to implementation.',
      'Produced digital assets — graphic design, one-pagers, newsletters, catalogues, banners — plus case studies and event coordination.',
      'Secured 2 partnerships for wider reach and grew social following & engagement by 50% and website traffic by 100%.',
    ],
  },
  {
    company: 'Faster Accessories',
    role: 'Digital Marketing Specialist',
    location: 'Saudi Arabia',
    period: 'Feb 2022 – Aug 2023',
    bullets: [
      'Implemented a holistic SEO strategy that grew website traffic 40% in five months, including a 30% organic boost.',
      'Ran PPC campaigns on a $1,000/month budget — cut cost-per-click 20%, lifted click-through 25%, reached 10,000+ prospects.',
      'Delivered monthly performance reviews to senior management; budget reallocation improved campaign ROI by 20%.',
      'Analyzed performance with Google Analytics and SEMrush to continuously refine strategy.',
    ],
  },
  {
    company: 'Ajjerni Rentals',
    role: 'Data Analyst & Market Research Intern',
    location: 'Lebanon',
    period: 'Sep 2021 – Mar 2022',
    bullets: [
      'Analyzed industry trends, customer preferences, and competitors to shape the startup strategy — contributing to a launch with 100+ new users within 3 months.',
      'Managed large datasets in Python — deduplication, missing-value handling, and consistency correction for downstream analysis.',
      'Built interactive reports in Tableau, Power BI & Excel that supported a 15% ROI increase and 20% retention improvement.',
    ],
  },
]

export type Credential = { title: string; org: string; year: string; kind: 'degree' | 'cert' | 'study' }

export const education: Credential[] = [
  { title: 'Digital Marketing & E-commerce', org: 'Google Career Certificate', year: '2022', kind: 'cert' },
  { title: 'Generative AI — Nanodegree', org: 'Udacity', year: '2024', kind: 'cert' },
  { title: 'AI Automation, Ethics & Responsible AI', org: 'BrainStation', year: '2024', kind: 'cert' },
  { title: 'AI Programming with Python — Nanodegree', org: 'Udacity', year: '2023', kind: 'cert' },
  { title: 'Diploma in IT Management & Data Analytics', org: 'Lebanese American University, Beirut', year: '2022', kind: 'degree' },
  { title: 'International Computer License', org: 'New Horizon Computer Center, Aden', year: '2019', kind: 'cert' },
]

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'marketing', label: 'Campaigns' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

/* ---- UI strings (everything not covered by the data above) ----
   Mirrored 1:1 in content.ar.ts — keep the two in sync when editing. */
export const ui = {
  /** Document <title> / meta description. The prerendered HTML keeps the
      English pair — this only swaps them for a visitor who picks Arabic. */
  meta: {
    title: 'Nasser Saleh — Digital Marketing & MarTech Specialist',
    description:
      'Toronto-based digital marketing & MarTech specialist. SEO & GEO, paid search, GA4 analytics, marketing automation, and the websites and funnels behind them.',
  },

  langName: 'English',
  langSwitchTo: 'العربية',
  langSwitchLabel: 'Switch language to Arabic',

  nav: { menu: 'Menu', resume: 'Resume', downloadResume: 'Download Resume', backToTop: 'Back to top' },

  hero: {
    availability: 'Available for work',
    viewWork: 'View my work',
    getInTouch: 'Get in touch',
    scrollDown: 'Scroll down',
  },

  about: {
    eyebrow: 'About',
    title: 'A marketer who owns the tools, not just the brief.',
    pillMarketing: 'Marketing',
    pillMartech: 'MarTech & Data',
  },

  work: {
    eyebrow: 'Selected Work · Clients',
    title: "Marketing programs I've run for clients.",
    lead: 'I take on the marketing function end to end — strategy and research, the campaigns that run off it, the reporting that proves what worked, and the commercial growth work around it.',
    subhead: 'Selected client work',
    clientTag: 'Client',
    liveSite: 'Live site',
    caseStudyOnRequest: 'Case study on request',
  },

  campaigns: {
    eyebrow: 'Campaigns & Results',
    title: 'Campaigns and creative that moved the numbers.',
    designTitle: 'Design & Content',
    designLead: 'Creative I produce across the funnel — selected samples available on request.',
    samplesOnRequest: 'Samples on request',
  },

  skills: { eyebrow: 'Skills & Stack', title: "A marketer's toolkit, backed by data & tech." },

  experience: { eyebrow: 'Experience', title: 'Where the marketing results were made.' },

  education: {
    eyebrow: 'Education & Certifications',
    title: 'Credentials across marketing, AI, and data.',
    certificate: 'Certificate',
    degree: 'Degree',
    university: 'University',
  },

  contact: {
    eyebrow: 'Contact',
    title: "Let's build something worth marketing.",
    intro: "Open to marketing, insights, and MarTech roles in Toronto. Drop a line and I'll get back to you quickly.",
    calloutStrong: 'Want a fast read on fit?',
    calloutBody:
      "Open the assistant in the corner — ask anything about my background, or paste a job description and it'll tell you how well I match and where I'm strong.",
    name: 'Name',
    email: 'Email',
    message: 'Message',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'you@example.com',
    messagePlaceholder: 'What are you building?',
    send: 'Send message',
    sending: 'Sending…',
    sentButton: 'Message ready ✓',
    errName: 'Please enter your name.',
    errEmail: 'Please enter your email.',
    errEmailInvalid: 'Please enter a valid email address.',
    errMessage: 'Please add a short message.',
    sentOk: 'Thanks! Your message was sent.',
    sentMailto: 'Thanks! Your email app should have opened — if not, write to',
    sendFailed: 'Something went wrong. Please email me directly at',
    letsTalk: "Let's talk",
  },

  assistant: {
    launcher: 'Ask about me',
    open: "Open Nasser's assistant",
    title: "Nasser's Assistant",
    subtitle: 'Ask anything · or paste a job description',
    close: 'Close',
    send: 'Send',
    placeholder: 'Ask about Nasser, or paste a job description…',
    placeholderJD: 'Paste the job description…',
    footLocal: "Automated assistant · answers from Nasser's resume",
    footAI: "AI assistant · answers from Nasser's background",
  },

  footer: { note: 'Designed, built & optimized in-house. Toronto, Canada.' },
}
