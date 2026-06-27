import { profile } from '../data/content'

/* ============================================================
   PORTFOLIO ASSISTANT — in-browser, no backend, no API key.
   Answers common employer questions about Nasser and analyzes a
   pasted job description for fit. Grounded only in real résumé data.

   UPGRADE PATH → real AI (Claude): replace the body of getResponse()
   with a fetch() to a serverless proxy that holds your Anthropic key.
   See README "AI upgrade" for the Cloudflare Worker snippet.
   ============================================================ */

export type ChatMsg = { role: 'user' | 'bot'; html: string }

const RESUME = `${import.meta.env.BASE_URL}${profile.resume}`
const EMAIL = profile.email
const mailto = (subject = 'Opportunity for Nasser') => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`

/* ---------------------------------------------------------------
   REAL AI (Claude) — optional upgrade.
   Paste your deployed Cloudflare Worker URL here to switch the
   assistant from the built-in engine to real Claude AI. Leave it
   empty to keep the free, offline, in-browser engine.
   See worker/SETUP.md for how to deploy the Worker.
----------------------------------------------------------------*/
export const ASSISTANT_API_URL: string = '' // e.g. 'https://nasser-assistant.<your-subdomain>.workers.dev'

export type ApiTurn = { role: 'user' | 'assistant'; content: string }

/** Calls the Claude proxy. Throws an Error with `.status` on failure so the
 *  caller can show a friendly message or fall back to the local engine. */
export async function askClaude(history: ApiTurn[]): Promise<string> {
  const res = await fetch(ASSISTANT_API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-portfolio': '1' },
    body: JSON.stringify({ messages: history }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(`assistant_${res.status}`) as Error & { status?: number; reply?: string }
    err.status = res.status
    err.reply = (data && (data as { reply?: string }).reply) || ''
    throw err
  }
  return String((data as { reply?: string }).reply || '')
}

/** Convert the lightweight markup used in answers (**bold**, [text](url)) to HTML.
 *  <br>/<em> are already HTML and pass through. Content is from this module only. */
function formatMarkup(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

/** Format a real-AI (Claude) reply for display. Model output is untrusted, so
 *  escape HTML FIRST, then apply only light markdown + line breaks. */
export function formatReply(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}

const WELCOME_RAW =
  `Hi! 👋 I'm Nasser's assistant. Ask me anything about his background — or **paste a job description** and I'll check how well he fits.<br><br>` +
  `Try: <em>"What's his experience?"</em> · <em>"What tools does he use?"</em> · <em>"Is he a fit for my role?"</em>`

export const WELCOME_HTML = formatMarkup(WELCOME_RAW)

export const SUGGESTIONS = [
  'What is his experience?',
  'What are his skills?',
  'Check my fit for a role',
  'How do I contact him?',
]

/* ---------- intent knowledge base (grounded in the résumé) ---------- */
type Intent = { keys: string[]; answer: string }

const intents: Intent[] = [
  {
    keys: ['experience', 'work history', 'background', 'career', 'worked', 'employment', 'roles', 'jobs'],
    answer:
      `Nasser has **3+ years in digital marketing** across non-profit and for-profit teams:<br>` +
      `• **GlobalDWS** — Digital Marketing Specialist (2023–24): led a team of 3, built a new company website end-to-end, and grew social engagement **+50%** and website traffic **+100%**.<br>` +
      `• **Faster Accessories** — Digital Marketing Specialist (2022–23): **+40%** traffic via SEO; ran PPC that cut CPC **20%** and lifted CTR **25%**.<br>` +
      `• **Ajjerni Rentals** — Data Analyst & Market Research Intern (2021–22): BI reporting that supported **+15% ROI** and **+20%** retention.<br><br>` +
      `Full history is in his [résumé](${RESUME}).`,
  },
  {
    keys: ['skill', 'tech stack', 'stack', 'technolog', 'tools', 'know how', 'can he do', 'capable', 'proficient'],
    answer:
      `Nasser works across **marketing, data, and the tools that connect them**:<br>` +
      `• **Marketing:** SEO (technical + local), PPC/SEM (Google/Meta/LinkedIn Ads), content & brand, email<br>` +
      `• **Analytics & data:** GA4, SEMrush, Ahrefs, Tableau, Power BI, A/B testing, reporting<br>` +
      `• **MarTech & automation:** marketing automation, CRM & lead funnels, Mailchimp/Brevo, CMS (Wix/WordPress/Shopify), booking systems, AI content (Claude)<br>` +
      `• **Technical fluency:** HTML/CSS, APIs, Python for data, SQL basics<br>` +
      `• **Languages:** English & Arabic`,
  },
  {
    keys: ['result', 'metric', 'achievement', 'impact', 'number', 'kpi', 'roi', 'traffic', 'grew', 'growth'],
    answer:
      `A few measurable wins:<br>` +
      `• **+100%** website traffic & **+50%** social engagement (GlobalDWS)<br>` +
      `• **+40%** traffic via SEO; **−20%** cost-per-click & **+25%** CTR on paid (Faster Accessories)<br>` +
      `• **+20%** campaign ROI from budget reallocation; reached **10,000+** prospects<br>` +
      `• **+15% ROI** and **+20%** customer retention from BI reporting (Ajjerni Rentals)`,
  },
  {
    keys: ['develop', 'software', 'build', 'code', 'coding', 'programming', 'technical', 'web app', 'apps', 'ai', 'automation', 'martech'],
    answer:
      `Nasser is a **technical marketer** — he builds and runs the technology behind campaigns: marketing websites, local-SEO landing pages, **marketing automation**, GA4 conversion tracking, and booking/CRM funnels. He's comfortable with HTML/CSS, no-code/low-code tools, APIs, a bit of Python for data, and AI content tools (Claude) — backed by **Generative AI** and **AI Programming** credentials from Udacity. Enough tech to ship and measure a campaign end-to-end without waiting on a dev queue.`,
  },
  {
    keys: ['education', 'degree', 'study', 'studied', 'university', 'school', 'certif', 'qualif', 'nanodegree', 'credential'],
    answer:
      `• **Bachelor of Marketing** — University of Toronto, Mississauga (2024)<br>` +
      `• **Generative AI** — Nanodegree, Udacity (2024)<br>` +
      `• **AI Programming with Python** — Nanodegree, Udacity (2023)<br>` +
      `• **AI Automation, Ethics & Responsible AI** — BrainStation (2024)<br>` +
      `• **Digital Marketing & E-commerce** — Google Career Certificate (2022)<br>` +
      `• **Diploma in IT Management & Data Analytics** — Lebanese American University (2022)`,
  },
  {
    keys: ['available', 'availability', 'open to', 'hiring', 'looking for work', 'job search', 'start', 'freelance', 'contract'],
    answer:
      `Yes — Nasser is **open to opportunities**: digital marketing, MarTech, and growth/analytics roles, plus freelance engagements. He's based in **Toronto, Ontario**. The fastest way to start a conversation is to [email him](${mailto()}) or use the contact form on this page.`,
  },
  {
    keys: ['location', 'based', 'where', 'remote', 'relocat', 'toronto', 'canada', 'timezone'],
    answer:
      `Nasser is based in **Toronto, Ontario, Canada**. For specifics on remote/hybrid/relocation, [reach out directly](${mailto()}) — he's happy to discuss what works for the role.`,
  },
  {
    keys: ['language', 'bilingual', 'arabic', 'english', 'speak'],
    answer: `Nasser is **bilingual in English and Arabic**.`,
  },
  {
    keys: ['why', 'strength', 'stand out', 'unique', 'hire him', 'good fit', 'sell', 'pitch', 'special'],
    answer:
      `His edge is being a **marketer who's genuinely technical**. He runs the campaigns *and* builds the MarTech behind them — websites, automation, GA4 tracking, lead funnels — so work ships fast and everything is measurable. Three-plus years of results (doubled traffic, −20% cost-per-click, +20% ROI), with the data and analytics chops to prove it. Bilingual EN/AR, fast-moving, detail-oriented.`,
  },
  {
    keys: ['contact', 'reach', 'email', 'hire', 'get in touch', 'connect', 'linkedin', 'message', 'talk', 'resume', 'résumé', 'cv'],
    answer:
      `Easiest ways to reach Nasser:<br>` +
      `• **Email:** [${EMAIL}](${mailto()})<br>` +
      `• **LinkedIn:** [linkedin.com/in/nasser-saleh](${profile.linkedin})<br>` +
      `• **Résumé:** [download the PDF](${RESUME})<br>` +
      `• Or use the **contact form** in the Contact section.`,
  },
  {
    keys: ['salary', 'rate', 'compensation', 'pay', 'budget', 'expectation', 'cost'],
    answer:
      `Compensation is best discussed directly — it depends on the role, scope, and arrangement. [Email Nasser](${mailto('Role & compensation')}) and he'll be glad to talk specifics.`,
  },
]

/* ---------- skill taxonomy for job-description matching ---------- */
type Cat = 'dev' | 'ai' | 'data' | 'marketing' | 'soft'
type Skill = { label: string; cat: Cat; keys: string[] }

const SKILLS: Skill[] = [
  // dev
  { label: 'React', cat: 'dev', keys: ['react'] },
  { label: 'Next.js', cat: 'dev', keys: ['next.js', 'nextjs', 'next js'] },
  { label: 'TypeScript', cat: 'dev', keys: ['typescript'] },
  { label: 'JavaScript', cat: 'dev', keys: ['javascript', 'es6'] },
  { label: 'Node.js', cat: 'dev', keys: ['node.js', 'nodejs', 'node js'] },
  { label: 'HTML & CSS', cat: 'dev', keys: ['html', 'css'] },
  { label: 'Tailwind', cat: 'dev', keys: ['tailwind'] },
  { label: 'Front-end', cat: 'dev', keys: ['front-end', 'frontend', 'front end'] },
  { label: 'Full-stack', cat: 'dev', keys: ['full-stack', 'fullstack', 'full stack'] },
  { label: 'Web development', cat: 'dev', keys: ['web develop', 'web application', 'web app'] },
  { label: 'PWA', cat: 'dev', keys: ['pwa', 'progressive web'] },
  { label: 'Responsive UI', cat: 'dev', keys: ['responsive', 'ui/ux', 'user interface'] },
  // ai
  { label: 'AI', cat: 'ai', keys: ['artificial intelligence', ' ai ', 'ai-', 'ai/', 'genai', 'generative ai'] },
  { label: 'LLMs', cat: 'ai', keys: ['llm', 'large language model', 'claude', 'gpt', 'openai', 'anthropic', 'gemini'] },
  { label: 'RAG / retrieval', cat: 'ai', keys: ['rag', 'retrieval-augmented', 'retrieval augmented', 'vector', 'embedding'] },
  { label: 'Machine learning', cat: 'ai', keys: ['machine learning', 'ml ', 'ml,', 'ml.'] },
  { label: 'Prompt engineering', cat: 'ai', keys: ['prompt'] },
  { label: 'Automation', cat: 'ai', keys: ['automation', 'automate'] },
  { label: 'Chatbots', cat: 'ai', keys: ['chatbot', 'conversational'] },
  // data
  { label: 'Python', cat: 'data', keys: ['python', 'pandas', 'scikit'] },
  { label: 'SQL / Postgres', cat: 'data', keys: ['sql', 'postgres', 'postgresql', 'database'] },
  { label: 'Supabase', cat: 'data', keys: ['supabase'] },
  { label: 'Analytics (GA4)', cat: 'data', keys: ['google analytics', 'ga4', 'analytics'] },
  { label: 'Tableau', cat: 'data', keys: ['tableau'] },
  { label: 'Power BI', cat: 'data', keys: ['power bi', 'powerbi'] },
  { label: 'Excel', cat: 'data', keys: ['excel', 'spreadsheet'] },
  { label: 'Data analysis', cat: 'data', keys: ['data analy', 'data-driven', 'reporting', 'dashboard'] },
  // marketing
  { label: 'SEO', cat: 'marketing', keys: ['seo', 'search engine optimization', 'organic search'] },
  { label: 'PPC / SEM', cat: 'marketing', keys: ['ppc', 'sem', 'paid search', 'paid media', 'google ads', 'adwords', 'paid ads'] },
  { label: 'Social media', cat: 'marketing', keys: ['social media', 'instagram', 'linkedin ads', 'facebook ads', 'tiktok', 'meta ads'] },
  { label: 'Content & copy', cat: 'marketing', keys: ['content marketing', 'content creation', 'copywriting', 'copywriter', 'content strategy'] },
  { label: 'Email marketing', cat: 'marketing', keys: ['email marketing', 'mailchimp', 'klaviyo', 'brevo', 'newsletter'] },
  { label: 'Brand', cat: 'marketing', keys: ['brand', 'branding'] },
  { label: 'Campaigns', cat: 'marketing', keys: ['campaign'] },
  { label: 'SEMrush / Ahrefs', cat: 'marketing', keys: ['semrush', 'ahrefs', 'moz'] },
  { label: 'Digital marketing', cat: 'marketing', keys: ['digital marketing', 'marketing specialist', 'growth marketing'] },
  { label: 'CRM', cat: 'marketing', keys: ['crm', 'hubspot', 'salesforce'] },
  // soft
  { label: 'Communication', cat: 'soft', keys: ['communication', 'presentation', 'stakeholder'] },
  { label: 'Project management', cat: 'soft', keys: ['project management', 'project manager', 'manage projects'] },
  { label: 'Team leadership', cat: 'soft', keys: ['team lead', 'leadership', 'lead a team', 'manage a team', 'mentor'] },
  { label: 'Bilingual (EN/AR)', cat: 'soft', keys: ['bilingual', 'arabic'] },
  { label: 'Client management', cat: 'soft', keys: ['client', 'customer-facing', 'account management'] },
]

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
}

/** Detect whether a message is likely a pasted job description. */
export function looksLikeJobDescription(text: string): boolean {
  const t = text.toLowerCase()
  const signals = [
    'responsibilit', 'requirement', 'qualificat', 'you will', 'we are looking', 'looking for',
    'experience in', 'experience with', 'proficient', 'must have', 'nice to have',
    'years of experience', 'about the role', 'about you', 'who you are', 'what you', 'job description',
    'we’re hiring', "we're hiring", 'the role', 'skills:', 'preferred',
  ]
  const hits = signals.filter((s) => t.includes(s)).length
  return text.length > 280 || hits >= 2
}

/** Analyze a job description against Nasser's profile. */
export function analyzeJobDescription(text: string): string {
  const t = ` ${text.toLowerCase()} `
  const matched: Skill[] = []
  for (const s of SKILLS) {
    if (s.keys.some((k) => t.includes(k))) matched.push(s)
  }
  // dedupe by label
  const seen = new Set<string>()
  const uniq = matched.filter((s) => (seen.has(s.label) ? false : (seen.add(s.label), true)))

  if (uniq.length < 2) {
    return (
      `I couldn't pick out many overlapping keywords from that. Paste a fuller description (responsibilities + required skills), ` +
      `or tell me the 3–4 must-haves and I'll map them to Nasser's background. You can also just [email him](${mailto('Role for Nasser')}).`
    )
  }

  const catCount = (c: Cat) => uniq.filter((s) => s.cat === c).length
  const mkt = catCount('marketing')
  const tech = catCount('dev') + catCount('ai') + catCount('data')

  let focus: string
  if (mkt >= 2 && tech >= 2) focus = 'hybrid (marketing + tech)'
  else if (mkt > tech) focus = 'marketing-focused'
  else if (tech > mkt) focus = 'technical / MarTech'
  else focus = 'mixed'

  const n = uniq.length
  const level = n >= 8 ? 'Strong fit' : n >= 5 ? 'Good fit' : 'Worth a conversation'

  const pitchByFocus: Record<string, string> = {
    'hybrid (marketing + tech)':
      `This role wants someone who can **market *and* build the tech to execute it** — Nasser's sweet spot. He runs campaigns and owns the MarTech behind them (websites, automation, GA4, lead funnels), so he closes the usual gap between marketing and the tools.`,
    'marketing-focused':
      `Nasser brings **3+ years of hands-on marketing** — SEO, PPC, GA4 analytics, content & brand — with proven results (doubled site traffic, −20% CPC, +20% ROI). Bonus: he also builds the sites, tracking, and automation behind campaigns, so he executes end-to-end.`,
    'technical / MarTech':
      `Nasser is a **marketer with strong technical fluency** — he builds marketing sites, automation, conversion tracking, and lead funnels (HTML/CSS, no-code/low-code, APIs, a bit of Python). A strong fit for technical-marketing / MarTech roles, backed by real campaign and analytics experience.`,
    mixed:
      `Nasser pairs **3+ years of measurable marketing** with real **MarTech & data fluency** — a rare build-and-measure combination.`,
  }

  const list = uniq.map((s) => s.label)
  const shown = list.slice(0, 12)
  const more = list.length > shown.length ? ` …and ${list.length - shown.length} more` : ''

  return (
    `Here's how Nasser lines up with this role 👇<br><br>` +
    `**Fit: ${level}** — this reads like a **${focus}** role.<br><br>` +
    `**Matched strengths** (found in your description):<br>${shown.map((l) => `• ${l}`).join('<br>')}${more}<br><br>` +
    `${pitchByFocus[focus]}<br><br>` +
    `Want to take it further? [Email Nasser](${mailto('Role that fits Nasser')}) or [download his résumé](${RESUME}).<br>` +
    `<em>Note: this is an automated keyword check — Nasser will give you the real, detailed answer.</em>`
  )
}

/**
 * Main entry. Returns an HTML string (safe — bot content is from this module;
 * user text is never echoed as HTML).
 * @param forceJD when true, treat the message as a job description regardless of length.
 */
export function getResponse(text: string, forceJD = false): string {
  const raw = text.trim()
  if (!raw) return WELCOME_HTML

  if (forceJD || looksLikeJobDescription(raw)) {
    return formatMarkup(analyzeJobDescription(raw))
  }

  const t = ` ${raw.toLowerCase()} `

  // greetings
  if (/^(hi|hey|hello|yo|sup|good (morning|afternoon|evening))\b/.test(raw.toLowerCase())) {
    return `Hey! 👋 ${WELCOME_HTML}`
  }

  // score intents by keyword hits
  let best: Intent | null = null
  let bestScore = 0
  for (const intent of intents) {
    const score = intent.keys.reduce((acc, k) => (t.includes(k) ? acc + 1 : acc), 0)
    if (score > bestScore) {
      bestScore = score
      best = intent
    }
  }
  if (best && bestScore > 0) return formatMarkup(best.answer)

  // fallback
  return formatMarkup(
    `I'm best at questions about **Nasser's experience, skills, results, education, availability, and how to reach him** — ` +
    `or paste a **job description** and I'll check the fit.<br><br>` +
    `You can also [email him directly](${mailto()}) or [grab his résumé](${RESUME}). What would you like to know?`,
  )
}

export { escapeHtml }
