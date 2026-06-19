/* ============================================================
   PORTFOLIO CONTENT
   Single source of truth for all copy & data on the site.
   Curated from Nasser's resume + analysis of 17 real projects.
   Edit text / links / add image paths here — the UI reads from this.
   ============================================================ */

export type Link = { label: string; href: string }

export type Project = {
  name: string
  category: string
  blurb: string
  techStack: string[]
  highlights?: string[]
  status?: string
  accent?: string
  /** Optional screenshot/thumbnail under /public/projects (e.g. "/projects/automar.png"). */
  image?: string
  client?: boolean
  repo?: string
  live?: string
  /** If the repo is private, note it instead of linking. */
  repoPrivate?: boolean
}

export const profile = {
  name: 'Nasser Saleh',
  roleTitle: 'Digital Marketing Specialist & Software Developer',
  tagline: 'Builder who markets. Marketer who ships.',
  subheadline:
    'I build the products and the growth engines that carry them — three-plus years driving measurable marketing results, now shipping full-stack SaaS, AI systems, and live client websites.',
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
    "I'm a digital marketing specialist and software developer based in Toronto. I spent the last three-plus years running the full marketing playbook — PPC and SEM campaigns, holistic SEO strategies, GA4 and SEMrush analytics, content and brand work — across both non-profit and for-profit teams. Along the way I led a cross-functional team of designers, social specialists, and developers, doubled website traffic, lifted engagement and ROI by double digits, and learned that great marketing is really just great product thinking pointed at an audience.",
    "That realization pulled me into building. I taught myself to ship: full-stack SaaS platforms with multi-tenant architecture and row-level security, AI/LLM systems that orchestrate autonomous agents and retrieval pipelines, live client websites on custom domains, and even embedded firmware for a motion-control hardware project. I hold a Bachelor of Marketing from the University of Toronto plus AI and data credentials from Udacity, BrainStation, Google, and the Lebanese American University.",
    "I think the future belongs to people who can both build the thing and make the world care about it — and that's exactly the hybrid I'm building toward.",
  ],
  stats: [
    { value: '15+', label: 'Projects shipped' },
    { value: '3+', label: 'Years in marketing' },
    { value: '+100%', label: 'Website traffic', sub: 'doubled at GlobalDWS' },
    { value: '2', label: 'Languages', sub: 'English / Arabic' },
  ],
}

export const featuredProjects: Project[] = [
  {
    name: 'AutoMar',
    category: 'AI SaaS Platform',
    accent: '#6C5CE7',
    status: 'In progress · Phase 1 deployed',
    blurb:
      "An AI-orchestrated marketing automation platform where autonomous agents draft, review, and publish social posts, SEO articles, email campaigns, and paid ads at scale — all behind human approval gates and full audit trails. It's the product I wish I'd had as a marketer, built with a developer's rigor.",
    techStack: [
      'Next.js 16',
      'TypeScript',
      'Clerk',
      'Postgres + pgvector',
      'Redis + BullMQ',
      'Claude API',
      'Voyage AI',
      'Drizzle ORM',
    ],
    highlights: [
      'Multi-tenant workspaces with AES-256-GCM credential vaults, kill switches, and a 30-day approval-gate trust window',
      'AI-drafted content across X, LinkedIn, Facebook, Instagram, TikTok & YouTube Shorts with brand-voice ingestion and safety guardrails',
      'Generative Engine Optimization audits tracking share-of-model across Claude, ChatGPT, Perplexity & Gemini',
      '20+ database tables and 12+ scheduled job processors driving a weekly content, SEO, ads & reporting cycle',
    ],
    repo: 'https://github.com/Snasser404/AutoMar',
  },
  {
    name: 'GameOps',
    category: 'AI / Automation',
    accent: '#00E0B8',
    status: 'Complete',
    blurb:
      'An AI-native technical producer that turns a one-line game idea into a complete, playable HTML5 game. It decomposes the concept, sources real marketplace assets, generates glue code, runs automated tests, and delivers a finished project with a transparent bill of materials.',
    techStack: ['Python', 'HTML5 Canvas', 'JavaScript', 'Anthropic API', 'Server-Sent Events', 'pytest'],
    highlights: [
      '11-stage orchestration pipeline with 19+ automated validation checks',
      'Reuse-first, free-first asset selection — 100% asset reuse and ~73% cost savings vs. build-from-scratch',
      '6 playable game archetypes with a live web dashboard and embedded player',
      'Zero runtime dependencies for the core pipeline (Python stdlib only) with graceful LLM fallbacks',
    ],
  },
  {
    name: 'StatCan RAG',
    category: 'AI / ML',
    accent: '#3D9DF6',
    status: 'In progress',
    blurb:
      "A production-grade Retrieval-Augmented Generation system that turns natural-language questions into cited, chart-backed answers over Canada's 8,000+ Statistics Canada datasets — with live retrieval, regression and correlation analysis, and automatic source attribution.",
    techStack: ['Python 3.11', 'FastAPI', 'Streamlit', 'ChromaDB', 'Sentence Transformers', 'Claude API', 'Pandas', 'scikit-learn'],
    highlights: [
      'Agentic RAG pipeline with tool-use over ~8,000 live StatCan tables plus Bank of Canada and World Bank sources',
      'Sub-second retrieval across 40,000+ embedded document chunks',
      'Advanced analytics: trend detection, cross-series correlation, regression & lead-lag detection',
      'Auto-citation with confidence scoring and a dual LLM backend (cloud Claude or local Ollama/Gemma)',
    ],
    repo: 'https://github.com/SuhailSama/statcan-rag',
  },
  {
    name: 'Serene Touch Pest Control',
    category: 'Client Site + Portal',
    accent: '#2ECC71',
    status: 'Live',
    client: true,
    blurb:
      'A live, full-stack platform for a Toronto-area pest control business: an SEO-optimized marketing site with 20+ location pages plus a role-based portal for customers, technicians, and admins — backed by Supabase with server-enforced security.',
    techStack: ['HTML5', 'CSS3', 'Vanilla JS', 'Supabase (Auth + RLS)', 'GitHub Pages', 'Google Analytics 4'],
    highlights: [
      'Live on a custom domain (serenetouch.ca) with 25+ indexed pages',
      'Three role dashboards (customer, technician, admin) with permissions enforced via Supabase Row-Level Security',
      "Context-aware 'Serene Assistant' chatbot answering appointment, treatment & safety questions",
      '20+ location-specific SEO pages with FAQ schema and LocalBusiness rich-results markup',
    ],
    live: 'https://serenetouch.ca/',
    repo: 'https://github.com/Snasser404/serene-touch-pest-control',
  },
  {
    name: 'Paradise Wellness',
    category: 'Full-Stack SaaS',
    accent: '#FF7AB6',
    status: 'Live pilot + verified prototype',
    client: true,
    blurb:
      'A complete booking and management platform for a Mississauga spa — online booking with shared-capacity rooms, membership credits, commission tracking, and revenue analytics — shipped as both a live Wix pilot and a custom Next.js prototype.',
    techStack: ['Next.js 16', 'React 19', 'TypeScript', 'SQLite', 'Tailwind CSS 4', 'Docker', 'Wix APIs', 'Stripe'],
    highlights: [
      'Availability engine handling staff + room allocation with DB-level double-booking prevention (ACID)',
      'Membership system with per-service benefit tracking, credits, promo codes & gift cards',
      'Cancellation-policy engine, commission/tip tracking, and a full revenue analytics dashboard',
      'Live Wix pilot plus a verified custom prototype (18/18 write-layer checks passed)',
    ],
    live: 'https://nassersaleh156.wixsite.com/paradise-wellness',
  },
  {
    name: 'Jobber',
    category: 'AI Tool / Automation',
    accent: '#F5A623',
    status: 'Complete',
    blurb:
      'An AI-powered job-application co-pilot that aggregates listings from 7 sources, ranks each role against your resume with Claude, generates a tailored resume and cover letter, and pre-fills the application form — always keeping the human in control of the final submit.',
    techStack: ['Python', 'Streamlit', 'Claude API', 'Playwright', 'python-docx', 'JSearch / Adzuna', 'Greenhouse / Lever'],
    highlights: [
      'Aggregates and de-duplicates roles across 7 job sources with support for 15+ ATS platforms',
      'Claude-powered 0–100 role scoring with batch ranking that cuts LLM calls 6×',
      'Browser automation pre-fills applications via Playwright with manual review gates',
      'Local-first privacy — API keys and resume never leave the device',
    ],
    repoPrivate: true,
  },
  {
    name: 'Last Contractor',
    category: 'Game / PWA',
    accent: '#E0533D',
    status: 'Complete',
    blurb:
      'A complete survival-extraction roguelite shipped as an installable PWA — procedurally generated ruins, oxygen pressure, squad combat, crafting, and a three-currency economy — built in pure browser JavaScript with zero external dependencies.',
    techStack: ['JavaScript (ES6)', 'Canvas', 'PWA / Service Worker', 'Web Audio API', 'localStorage', 'HTML5'],
    highlights: [
      '~5,000 lines of modular ES6 with seeded procedural world generation across 5 biomes',
      'Deep systems: 20 contracts, 10 enemy archetypes, 4 drones, 30+ items, 20 blueprints, 3 skill trees',
      'Turn-based pathfinding, spatial AI, and a real-time rendering loop with synthesized audio',
      'Fully playable offline, installable on iOS/Android, with 100+ balance tunables',
    ],
  },
  {
    name: 'Production Ops',
    category: 'Full-Stack PWA',
    accent: '#9B6CF7',
    status: 'MVP · In progress',
    blurb:
      'A mobile-first command layer for live film and media shoots that replaces fragmented call sheets and group texts with one real-time operational surface — including AI call-sheet parsing, crew check-in, and push alerts.',
    techStack: ['Next.js 15', 'React 19', 'TypeScript', 'Supabase', 'Claude API', 'Tailwind CSS', 'Web Push', 'Zod'],
    highlights: [
      'AI call-sheet parsing extracts crew, schedule, vendors & contacts from uploaded PDFs via Claude',
      'Real-time crew check-in board and operational event feed synced across all devices',
      'Role-based access (PM, AD, Coordinator, Dept Head, Crew) enforced with Supabase RLS',
      'Offline-first PWA with VAPID web-push for critical on-set events, built for crews of 20–200+',
    ],
    repo: 'https://github.com/Snasser404/production-ops',
  },
]

export const otherProjects: Project[] = [
  {
    name: 'GiftMe',
    category: 'Web App',
    accent: '#22d3ee',
    blurb:
      'A mobile-first social gifting app that solves the duplicate-gift problem: friends reserve gifts privately while the recipient stays surprised, with reservations enforced at the database level.',
    techStack: ['React 19', 'TypeScript', 'Vite', 'Supabase', 'TanStack Query', 'Zustand', 'PWA'],
    repo: 'https://github.com/Snasser404/giftme',
  },
  {
    name: 'The Platform',
    category: 'SaaS Platform',
    accent: '#a855f7',
    blurb:
      'A white-label multi-tenant operations platform for service businesses — scheduling, CRM, payments, and AI orchestration in a modular monolith with row-level tenant isolation across a 5-app monorepo.',
    techStack: ['Next.js 15', 'TypeScript', 'Hono', 'tRPC', 'PostgreSQL', 'Drizzle', 'Inngest', 'Stripe Connect', 'Turborepo'],
  },
  {
    name: 'WaiNui Canoe Club',
    category: 'Client Site + CMS',
    accent: '#34e0c4',
    client: true,
    blurb:
      'A full 12-page club website with a headless admin CMS, role-based team access, and built-in technical SEO — delivered as a zero-dependency Node.js build so non-technical staff can manage everything themselves.',
    techStack: ['Node.js (0 deps)', 'HTML5', 'CSS3', 'Vanilla JS', 'JSON store', 'Scrypt auth', 'JSON-LD SEO'],
  },
  {
    name: 'WaiNui Photo Uploader',
    category: 'Web App',
    accent: '#3D9DF6',
    blurb:
      'A senior-friendly photo & video gallery with passwordless, direct browser-to-OneDrive uploads, embeddable in WordPress and running entirely on free tiers via Microsoft Graph and serverless functions.',
    techStack: ['Node.js', 'Vercel', 'Microsoft Graph API', 'OneDrive', 'Entra ID OAuth', 'PWA'],
    repo: 'https://github.com/Snasser404/wainui-photo-uploader',
  },
  {
    name: 'Records Retention Analyzer',
    category: 'Tool / Automation',
    accent: '#6366f1',
    blurb:
      "A Streamlit compliance dashboard modeling Alberta's ARDA records-retention framework with a closure-based rule engine, disposition forecasting, and two-sided compliance risk analysis.",
    techStack: ['Python', 'Streamlit', 'Pandas', 'Plotly', 'openpyxl'],
  },
  {
    name: 'Wave Platform',
    category: 'Hardware / IoT',
    accent: '#fbbf24',
    blurb:
      'ESP32 firmware for a motorized bed that simulates floating on water via phased linear actuators with closed-loop PID control at 50 Hz — paired with a live interactive web simulator and build guide.',
    techStack: ['ESP32', 'C++', 'Arduino / PlatformIO', 'PID control', 'BTS7960', 'Canvas API'],
    live: 'https://snasser404.github.io/wave-platform-demo/',
    repo: 'https://github.com/Snasser404/wave-platform-demo',
  },
  {
    name: 'Lightweight Fine-Tuning',
    category: 'AI / ML',
    accent: '#00E0B8',
    blurb:
      'A clean, end-to-end notebook fine-tuning GPT-2 on the GLUE MRPC paraphrase benchmark, lifting validation accuracy from 31% to 77% with proper metrics, evaluation, and inference workflows.',
    techStack: ['Python', 'HuggingFace Transformers', 'PyTorch', 'GPT-2', 'scikit-learn'],
  },
]

/* ---- Marketing & Design ----
   Seeded from Nasser's résumé. Add screenshots/mockups by setting `image`
   (a path under /public/marketing) on any entry. */
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
   /public/marketing and set `image` to show them; otherwise a labelled
   "add asset" tile is shown. */
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
    group: 'Front-End & Web',
    skills: [
      'React 19',
      'Next.js (App Router)',
      'TypeScript',
      'Tailwind CSS',
      'Vite',
      'Three.js / R3F',
      'HTML5 & CSS3',
      'Vanilla JS (ES6+)',
      'PWA / Service Workers',
      'Responsive & accessible UI',
    ],
  },
  {
    group: 'Back-End & Data',
    skills: [
      'Node.js',
      'PostgreSQL',
      'Supabase (Auth · RLS · Realtime)',
      'Drizzle ORM',
      'SQLite',
      'Redis + BullMQ',
      'tRPC / Hono',
      'FastAPI',
      'Multi-tenant architecture',
      'Stripe Connect',
    ],
  },
  {
    group: 'AI / ML',
    skills: [
      'Claude API & structured outputs',
      'Retrieval-Augmented Generation',
      'Vector embeddings (pgvector, ChromaDB)',
      'Agent orchestration & tool-use',
      'LLM fine-tuning (HuggingFace)',
      'Generative Engine Optimization',
      'Python (Pandas, scikit-learn)',
      'Generative AI (Udacity)',
    ],
  },
  {
    group: 'Digital Marketing',
    skills: [
      'PPC / SEM (Google, LinkedIn, Meta)',
      'SEO (organic + technical)',
      'Campaign strategy & execution',
      'Content & brand development',
      'Email marketing (Mailchimp, Brevo)',
      'Marketing automation',
    ],
  },
  {
    group: 'Analytics & Data',
    skills: [
      'Google Analytics 4',
      'SEMrush & Ahrefs',
      'Tableau & Power BI',
      'Data interpretation & reporting',
      'A/B & significance testing',
      'Multi-touch attribution',
      'Excel / Microsoft 365',
    ],
  },
  {
    group: 'Tools & Practice',
    skills: [
      'Git & GitHub',
      'Docker',
      'Vercel / Render / Fly.io',
      'CI/CD (GitHub Actions)',
      'Playwright automation',
      'Jupyter Notebooks',
      'Project & client management',
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
  { title: 'Generative AI — Nanodegree', org: 'Udacity', year: '2024', kind: 'cert' },
  { title: 'AI Automation, Ethics & Responsible AI', org: 'BrainStation', year: '2024', kind: 'cert' },
  { title: 'AI Programming with Python — Nanodegree', org: 'Udacity', year: '2023', kind: 'cert' },
  { title: 'Digital Marketing & E-commerce', org: 'Google Career Certificate', year: '2022', kind: 'cert' },
  { title: 'Diploma in IT Management & Data Analytics', org: 'Lebanese American University, Beirut', year: '2022', kind: 'degree' },
  { title: 'International Computer License', org: 'New Horizon Computer Center, Aden', year: '2019', kind: 'cert' },
]

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]
