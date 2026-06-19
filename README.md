# Nasser Saleh — Portfolio & Personal Website

A dynamic, interactive, 3D, futuristic personal portfolio for **Nasser Saleh** —
Digital Marketing Specialist & Software Developer.

Built with React + TypeScript + Vite, an interactive **Three.js / React Three Fiber**
hero scene, smooth **Framer Motion** scroll animations, and self-hosted fonts. Clean,
**light**, airy, glassmorphic, vibrant-accented — and fully responsive.

![Hero preview](public/assets/og-image.png)
<!-- ^ Replace public/assets/og-image.png with a real screenshot for the social preview -->

---

## ✨ Highlights

- **Interactive 3D hero** — a morphing core, orbiting data rings, drifting satellites,
  and a particle starfield that subtly tracks your cursor (React Three Fiber + Three.js).
  The render loop auto-pauses when scrolled out of view to save battery/GPU.
- **Nine sections** — Hero · About · Featured Work · **Marketing & Design** · More Projects ·
  Skills · Experience · Education & Certifications · Contact.
- **Marketing & Design section** — campaign/SEO/PPC/analytics case-study cards (seeded with
  real résumé metrics) plus a design gallery with labelled placeholder slots for creative work.
- **Curated from real work** — 8 flagship projects + 7 more, pulled from Nasser's actual
  builds (AutoMar, GameOps, StatCan RAG, Serene Touch, Paradise Wellness, Jobber,
  Last Contractor, Production Ops, and more).
- **Polished motion** — scroll-reveal, magnetic 3D card tilt, scroll-progress bar,
  animated nav. Respects `prefers-reduced-motion`.
- **Zero external runtime dependencies** — fonts are self-hosted (works offline),
  no Google Fonts request.
- **Working contact form** — opens the visitor's email client out of the box; drop in a
  free Web3Forms key to enable true no-backend submissions.

---

## 🚀 Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server  → http://localhost:5173
npm run build    # type-check + production build → /dist
npm run preview  # preview the production build  → http://localhost:4173
```

> Requires Node 18+.

---

## 🗂 Project structure

```
src/
  data/content.ts        ← ⭐ ALL site text, projects, skills, experience, links
  components/
    Scene3D.tsx          ← the interactive 3D hero scene
    Hero.tsx             ← hero copy + CTAs over the 3D scene
    Nav.tsx              ← sticky nav + mobile menu
    About.tsx            ← bio, portrait/monogram, stats
    Projects.tsx         ← featured project grid
    ProjectCard.tsx      ← single featured card (3D tilt on hover)
    ProjectVisual.tsx    ← generated card artwork (or your screenshot)
    Marketing.tsx        ← marketing case studies + design gallery
    MoreProjects.tsx     ← condensed secondary projects
    Skills.tsx           ← grouped skill clusters
    Experience.tsx       ← work-history timeline
    Education.tsx        ← degrees & certifications
    Contact.tsx          ← contact links + form
    Footer.tsx
    Reveal.tsx           ← reusable scroll-reveal wrapper
    icons.tsx            ← inline SVG icons
  index.css              ← design system (CSS variables, components, responsive)
public/
  Nasser-Saleh-Resume.pdf  ← downloadable résumé (already included)
  favicon.svg
  projects/                ← drop software-project screenshots here
  marketing/               ← drop marketing/design assets here
  assets/                  ← drop your headshot + og-image here
```

---

## ✏️ How to customize

**Almost everything lives in [`src/data/content.ts`](src/data/content.ts).** Edit that one
file to change copy, projects, skills, experience, education, and links — no component
changes needed.

### Add a project screenshot
1. Save the image to `public/projects/` (e.g. `public/projects/automar.png`).
2. In `content.ts`, set the project's `image` field: `image: '/projects/automar.png'`.
   The card automatically swaps the generated artwork for your screenshot.

### Add your headshot
1. Save it to `public/assets/headshot.jpg`.
2. In `content.ts`, set `about.headshot = '/assets/headshot.jpg'`.

### Enable real contact-form submissions (no backend)
1. Get a free access key at <https://web3forms.com>.
2. Paste it into `WEB3FORMS_ACCESS_KEY` near the top of
   [`src/components/Contact.tsx`](src/components/Contact.tsx).
   Until then, the form opens the visitor's email client (works fine, just manual).

### Social share image + favicon
- Replace `public/assets/og-image.png` (referenced in `index.html`) with a 1200×630 image.
- The favicon (`public/favicon.svg`) is an "NS" monogram — swap if you like.

---

## 📋 Placeholders to fill in (recommended)

These are intentionally left as editable space — the site looks complete without them,
but they'll make it shine:

- [ ] Professional **headshot** (`public/assets/headshot.jpg`)
- [ ] **Screenshots / GIFs** for featured projects (AutoMar dashboard, StatCan RAG modes,
      GameOps generation, Serene Touch portal, Paradise Wellness booking, Jobber ranking,
      Last Contractor gameplay, Production Ops board)
- [ ] **Marketing & design assets** — campaign screenshots + creative samples (social, one-pagers,
      newsletters, catalogues, banners, brand kit) into `public/marketing/`, referenced in `content.ts`
- [ ] **Live demo links** where missing (GameOps, Last Contractor, AutoMar once deployed)
- [ ] Verify the **GitHub / live links** in `content.ts` (some repos may be private)
- [ ] **Web3Forms key** for the contact form
- [ ] **OG / social share image** (`public/assets/og-image.png`)
- [ ] Optional: **client testimonials** (Serene Touch, Paradise Wellness)
- [ ] A **custom domain** for the portfolio itself

---

## 🌐 Live site & deploying

**Live at → https://nassersaleh.ca**  *(`snasser404.github.io` and `www.` redirect here; HTTPS enforced)*

Hosted on **GitHub Pages** from the `Snasser404/snasser404.github.io` repo. The custom domain is
configured via [public/CNAME](public/CNAME) (`nassersaleh.ca`) with DNS at GoDaddy (apex `A` records
→ GitHub Pages IPs, `www` `CNAME` → `snasser404.github.io`). A GitHub Actions
workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) rebuilds and redeploys
**automatically on every push to `main`** — just commit and push your changes:

```bash
git add -A
git commit -m "Update portfolio"
git push        # → site rebuilds & goes live in ~1 minute
```

`vite.config.ts` uses a relative `base: './'`, so the build also works from any sub-path or
other host (Vercel/Netlify: import the repo, framework "Vite", build `npm run build`, output `dist`).

---

## 🛠 Tech stack

| Area        | Tech |
|-------------|------|
| Framework   | React 18 + TypeScript + Vite 5 |
| 3D          | Three.js · @react-three/fiber · @react-three/drei |
| Animation   | Framer Motion |
| Styling     | Tailwind CSS + a custom CSS design system |
| Fonts       | Space Grotesk · Inter · JetBrains Mono (self-hosted via Fontsource) |

---

Built with React, Three.js, and a marketer's eye. 🚀
