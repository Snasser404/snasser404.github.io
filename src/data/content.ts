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
    'A data-driven digital marketer who builds and runs the technology behind growth — websites, SEO, marketing automation, analytics, and the booking & CRM funnels that turn traffic into customers.',
  location: 'Toronto, Ontario',
  email: 'nassersaleh156@gmail.com',
  phone: '(438) 988-6709',
  linkedin: 'https://www.linkedin.com/in/nasser-saleh/',
  github: 'https://github.com/Snasser404',
  resume: 'Nasser-Saleh-Resume.pdf',
  languages: 'Bilingual — English & Arabic',
}

export const about = {
  /** Replace with a real professional headshot at /public/assets/headshot.jpg */
  headshot: '',
  paragraphs: [
    "I'm a digital marketing specialist based in Toronto who works at the intersection of marketing, data, and technology. Over the last three-plus years I've run PPC and SEO campaigns, owned analytics in GA4 and SEMrush, and led content and brand work across non-profit and for-profit teams — consistently turning data into decisions that move traffic, engagement, and ROI.",
    "What sets me apart is the tech side. I don't just brief the tools — I set them up and run them: marketing websites, local-SEO landing pages, marketing-automation workflows, conversion tracking, and booking/CRM funnels. That lets me launch a campaign end-to-end and measure exactly what's working, without waiting on a dev queue.",
    'I hold a Bachelor of Marketing from the University of Toronto, plus AI and data-analytics credentials from Udacity, BrainStation, Google, and the Lebanese American University. Bilingual in English and Arabic.',
  ],
  stats: [
    { value: '+100%', label: 'Website traffic', sub: 'doubled at GlobalDWS' },
    { value: '+40%', label: 'SEO traffic', sub: 'in 5 months' },
    { value: '−20%', label: 'Cost-per-click', sub: 'on paid search' },
    { value: '4+', label: 'Client builds', sub: 'web · SEO · automation' },
  ],
}

/* ---- Selected Work: client & freelance MarTech engagements ----
   Framed by the marketing outcome, not the code. Add a real screenshot by
   setting `image` (a path under /public/projects). Add real client names,
   logos, or results where you have them. */
export const featuredProjects: Project[] = [
  {
    name: 'Serene Touch Pest Control',
    category: 'Local SEO · Web · Lead Gen',
    accent: '#2ECC71',
    status: 'Live · serenetouch.ca',
    client: true,
    blurb:
      'Built the full digital presence for a Toronto-area pest-control business — a fast marketing site, 20+ location-targeted SEO landing pages, GA4 conversion tracking, and a booking/lead funnel that turns local searches into booked jobs.',
    techStack: ['Local SEO', 'Web build', 'GA4 + tracking', 'Lead funnel', 'Google Business', 'Schema markup'],
    highlights: [
      '25+ pages indexed; 20+ city-specific landing pages targeting GTA "pest control near me" searches',
      'GA4 + event tracking wired to measure calls, form fills, and bookings',
      'LocalBusiness + FAQ schema for rich results and stronger Google Business visibility',
      'A booking & lead funnel connecting search traffic to scheduled service',
    ],
    live: 'https://serenetouch.ca/',
  },
  {
    name: 'BarberBook',
    category: 'Booking & Retention',
    accent: '#6C5CE7',
    status: 'Product',
    client: true,
    blurb:
      'An online booking and customer-retention solution for a barbershop — 24/7 self-serve booking, automated reminders to cut no-shows, and a reviews/SEO loop to grow local visibility.',
    techStack: ['Online booking', 'Automated reminders', 'Reviews / SEO', 'Customer comms', 'Mobile-first'],
    highlights: [
      'Self-serve 24/7 booking that captures appointments outside business hours',
      'Automated SMS/email reminders designed to reduce no-shows',
      'Review-generation + local-SEO loop to lift discovery and trust',
      'Mobile-first flow built around how clients actually book',
    ],
  },
  {
    name: 'Marketing Automation Platform',
    category: 'MarTech · Automation',
    accent: '#3D9DF6',
    status: 'In progress',
    blurb:
      'A marketing-automation system I built (AutoMar) that plans a weekly content calendar, drafts on-brand social posts, SEO articles, and ad copy across channels, schedules them behind approval, and reports on performance — the MarTech backbone that lets a small team market like a big one.',
    techStack: ['Marketing automation', 'Multi-channel content', 'AI copy (Claude)', 'SEO', 'Scheduling', 'Reporting'],
    highlights: [
      'Plans and drafts multi-channel content — social, SEO articles, email, ads — on a weekly cadence',
      'Human approval gates and brand-safety checks before anything publishes',
      'Performance reporting that feeds the next week\'s plan — a closed marketing loop',
      'Hands-on command of the modern MarTech & AI toolset',
    ],
  },
  {
    name: 'Paradise Wellness',
    category: 'Spa · Booking & Growth',
    accent: '#FF7AB6',
    status: 'Live pilot',
    client: true,
    blurb:
      'Digital presence and booking growth for a Mississauga spa — an online booking funnel with memberships and promotions, plus the local marketing and analytics to keep the calendar full.',
    techStack: ['Online booking', 'Memberships / promos', 'Local marketing', 'GA4', 'Email', 'CMS (Wix)'],
    highlights: [
      'Online booking funnel with memberships, packages, and promo codes',
      'Service catalog and scheduling for a 7-day, multi-room operation',
      'Local marketing + analytics to drive and measure bookings',
      'Launched as a live pilot the business can run day-to-day',
    ],
    live: 'https://nassersaleh156.wixsite.com/paradise-wellness',
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
  { label: 'One-pagers', tag: 'Sales collateral' },
  { label: 'Newsletters', tag: 'Mailchimp · Brevo' },
  { label: 'Catalogues', tag: 'Product' },
  { label: 'Banners & ads', tag: 'Display · Social' },
  { label: 'Brand kit', tag: 'Identity & guidelines' },
]

export type SkillGroup = { group: string; skills: string[] }

export const skillGroups: SkillGroup[] = [
  {
    group: 'Digital Marketing',
    skills: [
      'SEO (technical + local)',
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
      'Marketing automation',
      'CRM & lead funnels',
      'Mailchimp / Brevo',
      'CMS (Wix · WordPress · Shopify)',
      'Booking systems',
      'AI content tools (Claude)',
      'Google Business · local',
    ],
  },
  {
    group: 'Technical fluency',
    skills: [
      'HTML & CSS',
      'No-code / low-code',
      'APIs & integrations',
      'Python for data',
      'SQL basics',
      'Git / GitHub',
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
    company: 'Freelance — Digital Marketing & MarTech',
    role: 'Digital Marketing & MarTech Specialist',
    location: 'Toronto · Remote',
    period: '2023 – Present',
    bullets: [
      'Deliver end-to-end digital marketing for small businesses and brands — websites, local SEO, paid & organic campaigns, automation, and analytics.',
      'Engagements span pest control (Serene Touch), wellness/spa (Paradise Wellness), and personal services (BarberBook): web builds, SEO, booking funnels, and conversion tracking.',
      'Build the MarTech behind the marketing — GA4 + event tracking, CRM/lead funnels, and AI-assisted content automation — so campaigns are measurable and scalable.',
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

export type Credential = { title: string; org: string; year: string; kind: 'degree' | 'cert' }

export const education: Credential[] = [
  { title: 'Bachelor of Marketing', org: 'University of Toronto, Mississauga', year: '2024', kind: 'degree' },
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
