"""Assemble the self-contained business-card proof page.

Everything is inlined as data URIs — the Artifact CSP blocks external hosts,
so fonts and files must travel with the page.
"""
import base64
import pathlib

ROOT = pathlib.Path(r"C:\Users\Nasser Abdulqawi\Nasser Portfolio")
CARDS = ROOT / "business-cards"
FS = ROOT / "node_modules" / "@fontsource-variable"
OUT = pathlib.Path(__file__).parent / "cards-page.html"


def b64(path):
    return base64.b64encode(pathlib.Path(path).read_bytes()).decode()


def kb(path):
    return f"{pathlib.Path(path).stat().st_size / 1024:.0f} KB"


FONTS = {
    "sg": FS / "space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
    "jb": FS / "jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
    "in": FS / "inter/files/inter-latin-wght-normal.woff2",
}

PLATES = [
    dict(
        key="E", slug="E-search-result", name="Search Result", series=2,
        use="The card is the thing he sells. The front is an organic search listing; the back is "
            "the AI answer that cites him. SEO on one side, GEO on the other.",
        stock="16 pt smooth matte",
    ),
    dict(
        key="F", slug="F-tracked", name="Tracked", series=2,
        use="The joke is also the proof. Scan the QR and the visit lands in his GA4 tagged as "
            "utm_source=card — the business card becomes a measurable channel.",
        stock="16 pt smooth matte, or soft-touch",
    ),
    dict(
        key="G", slug="G-portrait", name="Portrait", series=2, vertical=True,
        use="Vertical, and the only card with his face on it. In a stack of landscape cards the "
            "orientation alone does half the work; people remember a face.",
        stock="16 pt matte — the duotone flattens on gloss",
    ),
    dict(
        key="H", slug="H-one-number", name="One Number", series=2,
        use="The loudest card in the box. One result at poster scale on the front, everything "
            "that qualifies it on the back. Confident, and slightly reckless.",
        stock="16 pt smooth matte",
    ),
    dict(
        key="A", slug="A-gradient-monogram", name="Gradient Monogram", series=1,
        use="Hand it to anyone. Same white ground, monogram and gradient as nassersaleh.ca, "
            "so the card and the site read as one brand.",
        stock="16 pt smooth matte",
    ),
    dict(
        key="B", slug="B-dark-signal", name="Dark Signal", series=1,
        use="When the card has to pitch for you. The back lists what you actually run, so someone "
            "you met at a conference knows the offer without asking.",
        stock="16 pt smooth matte",
    ),
    dict(
        key="C", slug="C-editorial-ledger", name="Editorial Ledger", series=1,
        use="Boardroom and consulting introductions. No gradients, no tech signalling — a name "
            "that looks expensive and ages well.",
        stock="Uncoated textured, e.g. Mohawk Superfine",
    ),
    dict(
        key="D", slug="D-bilingual", name="Bilingual — English ⇄ العربية", series=1,
        use="Toronto's Arabic-speaking business community, and any Gulf-market work. Hand it over "
            "either way up; neither side is the back.",
        stock="16 pt smooth matte",
    ),
]

SPEC = [
    ("Trim", "3.5 × 2 in&nbsp;&nbsp;(89 × 51 mm)<br>plate G is 2 × 3.5 in"),
    ("Bleed", "0.125 in, all four edges"),
    ("Resolution", "300 dpi"),
    ("Colour", "RGB — printer converts to CMYK"),
    ("Sides", "2 — PDF p.1 front, p.2 back"),
    ("QR", "tagged per card — scans land in GA4"),
    ("Faces", "Space Grotesk · Inter · JetBrains Mono · Noto Sans Arabic"),
]

NOTES = [
    ("Every QR is tagged, so you can tell which card worked.",
     "Each one points at nassersaleh.ca with its own campaign parameter — card A carries "
     "utm_campaign=a, card E carries e, and so on. Scans show up in GA4 under source "
     "<em>card</em>, so after a few months of handing them out you will know which design "
     "actually got scanned. Print two designs and you have an A/B test."),
    ("Send the PDF, not the PNG.",
     "The PDF carries the 0.125 in bleed every printer asks for. The PNG is cropped to the trim "
     "line — it is for email signatures, LinkedIn and decks, and would print with white slivers "
     "along the edges."),
    ("Expect gradients to soften.",
     "The files are RGB and every online printer converts to CMYK on their end. Cyan-to-violet is "
     "outside the CMYK gamut, so the gradient plates will print a little less vivid than they "
     "look here. That is normal and not worth fixing."),
    ("Do not scale the file down.",
     "The QR codes are 0.5 in — comfortably scannable, but they are sized for this trim. Printing "
     "smaller than the stated size will start breaking them."),
    ("Ask for the stock listed on each plate.",
     "It changes the card more than any design choice here. Matte for the dark and gradient "
     "plates; uncoated textured for the Editorial Ledger, which is built for it; matte for the "
     "Portrait, because gloss flattens a duotone."),
]

SERIES = {
    2: ("Series 2 — concept-led",
        "These take a position. Each one is built on something only Nasser can claim: that he is "
        "the person you hire to be found, and to prove it worked."),
    1: ("Series 1 — classic",
        "Safer, quieter, and none the worse for it. If the card needs to do nothing but be handed "
        "over cleanly, take one of these."),
}


def plate_html(p):
    pdf = CARDS / f"nasser-saleh-card-{p['slug']}.pdf"
    front = CARDS / f"{p['slug']}-front.png"
    back = CARDS / f"{p['slug']}-back.png"
    side_labels = ("English", "العربية") if p["key"] == "D" else ("Front", "Back")
    tall = p.get("vertical", False)
    cls = "proofs proofs--tall" if tall else "proofs"
    w, h = (600, 1050) if tall else (1050, 600)
    fmt = "2 × 3.5 in, vertical" if tall else ""
    return f"""
    <section class="plate" id="plate-{p['key']}">
      <div class="plate-head">
        <span class="plate-key" aria-hidden="true">{p['key']}</span>
        <div class="plate-id">
          <h2>{p['name']}{f' <span class="fmt">{fmt}</span>' if fmt else ''}</h2>
          <p class="use">{p['use']}</p>
        </div>
      </div>

      <div class="{cls}">
        <figure>
          <div class="board">
            <img id="img-{p['key']}-f" src="data:image/png;base64,{b64(front)}"
                 alt="{p['name']} card, {side_labels[0].lower()} side" width="{w}" height="{h}">
            <span class="safe" aria-hidden="true"></span>
          </div>
          <figcaption>{side_labels[0]}</figcaption>
        </figure>
        <figure>
          <div class="board">
            <img id="img-{p['key']}-b" src="data:image/png;base64,{b64(back)}"
                 alt="{p['name']} card, {side_labels[1].lower()} side" width="{w}" height="{h}">
            <span class="safe" aria-hidden="true"></span>
          </div>
          <figcaption>{side_labels[1]}</figcaption>
        </figure>
      </div>

      <div class="plate-foot">
        <p class="stock"><span class="lbl">Stock</span>{p['stock']}</p>
        <div class="dl">
          <a class="btn btn-primary" download="{pdf.name}"
             href="data:application/pdf;base64,{b64(pdf)}">
            Print PDF <span class="meta">both sides · {kb(pdf)}</span>
          </a>
          <a class="btn" download="{front.name}" data-src="img-{p['key']}-f">
            {side_labels[0]} PNG <span class="meta">300 dpi · {kb(front)}</span>
          </a>
          <a class="btn" download="{back.name}" data-src="img-{p['key']}-b">
            {side_labels[1]} PNG <span class="meta">300 dpi · {kb(back)}</span>
          </a>
        </div>
      </div>
    </section>"""


HTML = f"""<title>Business Cards — Nasser Saleh</title>
<style>
  @font-face {{
    font-family: 'SG'; font-style: normal; font-weight: 300 700; font-display: swap;
    src: url(data:font/woff2;base64,{b64(FONTS['sg'])}) format('woff2');
  }}
  @font-face {{
    font-family: 'JB'; font-style: normal; font-weight: 100 800; font-display: swap;
    src: url(data:font/woff2;base64,{b64(FONTS['jb'])}) format('woff2');
  }}
  @font-face {{
    font-family: 'IN'; font-style: normal; font-weight: 100 900; font-display: swap;
    src: url(data:font/woff2;base64,{b64(FONTS['in'])}) format('woff2');
  }}

  :root {{
    /* Prepress proof room: cool greys biased toward the registration magenta. */
    --ground:  #e5e6ec;
    --surface: #ffffff;
    --sunken:  #dcdee6;
    --ink:     #191b23;
    --ink-2:   #5b6072;
    --ink-3:   #6f7688;
    --rule:    #cfd2dc;
    --rule-2:  #e2e4ec;
    --accent:  #b4005f;   /* registration magenta — the trim-mark colour */
    --accent-q:#f4e0eb;
    --cyan:    #00606f;   /* safe-area reference only */
    /* The solid button needs its own pair: the accent that reads well as text
       on the ground is not the one that reads well as a filled background. */
    --btn-bg:  #b4005f;
    --btn-fg:  #ffffff;
    --btn-hov: #8b0049;
    --shadow:  0 1px 2px rgba(20, 22, 34, .07), 0 18px 38px -20px rgba(20, 22, 34, .35);

    --display: 'SG', system-ui, sans-serif;
    --body:    'IN', system-ui, sans-serif;
    --mono:    'JB', ui-monospace, monospace;
  }}
  @media (prefers-color-scheme: dark) {{
    :root {{
      --ground:  #101216;
      --surface: #191c22;
      --sunken:  #0a0b0e;
      --ink:     #eceef4;
      --ink-2:   #9aa1b3;
      --ink-3:   #838aa0;
      --rule:    #2b303a;
      --rule-2:  #232830;
      --accent:  #ff5ea8;
      --accent-q:#3a1128;
      --cyan:    #4ad2ee;
      --btn-bg:  #ff5ea8;
      --btn-fg:  #2b0617;
      --btn-hov: #ff8bc2;
      --shadow:  0 1px 2px rgba(0, 0, 0, .5), 0 20px 44px -20px rgba(0, 0, 0, .8);
    }}
  }}
  :root[data-theme="dark"] {{
    --ground:  #101216;
    --surface: #191c22;
    --sunken:  #0a0b0e;
    --ink:     #eceef4;
    --ink-2:   #9aa1b3;
    --ink-3:   #838aa0;
    --rule:    #2b303a;
    --rule-2:  #232830;
    --accent:  #ff5ea8;
    --accent-q:#3a1128;
    --cyan:    #4ad2ee;
    --btn-bg:  #ff5ea8;
    --btn-fg:  #2b0617;
    --btn-hov: #ff8bc2;
    --shadow:  0 1px 2px rgba(0, 0, 0, .5), 0 20px 44px -20px rgba(0, 0, 0, .8);
  }}
  :root[data-theme="light"] {{
    --ground:  #e5e6ec;
    --surface: #ffffff;
    --sunken:  #dcdee6;
    --ink:     #191b23;
    --ink-2:   #5b6072;
    --ink-3:   #6f7688;
    --rule:    #cfd2dc;
    --rule-2:  #e2e4ec;
    --accent:  #b4005f;
    --accent-q:#f4e0eb;
    --cyan:    #00606f;
    --btn-bg:  #b4005f;
    --btn-fg:  #ffffff;
    --btn-hov: #8b0049;
    --shadow:  0 1px 2px rgba(20, 22, 34, .07), 0 18px 38px -20px rgba(20, 22, 34, .35);
  }}

  * {{ box-sizing: border-box; }}

  body {{
    margin: 0;
    background: var(--ground);
    color: var(--ink);
    font-family: var(--body);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }}

  .wrap {{
    max-width: 1080px;
    margin-inline: auto;
    padding: clamp(1.25rem, 4vw, 3rem) clamp(1rem, 4vw, 2.5rem) 4rem;
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3vw, 2.25rem);
  }}

  .lbl {{
    font-family: var(--mono);
    font-size: .68rem;
    font-weight: 500;
    letter-spacing: .13em;
    text-transform: uppercase;
    color: var(--ink-3);
  }}

  /* ---------- docket header ---------- */
  .docket {{
    background: var(--surface);
    border: 1px solid var(--rule);
    border-top: 3px solid var(--accent);
    border-radius: 3px;
    padding: clamp(1.25rem, 3vw, 1.9rem);
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: clamp(1.25rem, 3vw, 2.5rem);
    align-items: start;
  }}
  .docket-id {{ display: flex; flex-direction: column; gap: .6rem; }}
  .regmark {{ color: var(--accent); }}
  h1 {{
    font-family: var(--display);
    font-size: clamp(1.65rem, 4.4vw, 2.5rem);
    font-weight: 600;
    letter-spacing: -.022em;
    line-height: 1.08;
    text-wrap: balance;
    margin: 0;
  }}
  .lede {{
    margin: 0;
    max-width: 34ch;
    color: var(--ink-2);
    font-size: .96rem;
  }}
  .spec {{
    margin: 0;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: .42rem 1.1rem;
    font-family: var(--mono);
    font-size: .78rem;
    font-variant-numeric: tabular-nums;
    align-content: start;
  }}
  .spec dt {{
    color: var(--ink-3);
    letter-spacing: .1em;
    text-transform: uppercase;
    font-size: .68rem;
    padding-top: .18rem;
    white-space: nowrap;
  }}
  .spec dd {{ margin: 0; color: var(--ink); }}

  /* ---------- guide toggle ---------- */
  .controls {{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: .8rem 1.4rem;
    padding-inline: .1rem;
  }}
  .switch {{
    display: inline-flex;
    align-items: center;
    gap: .6rem;
    cursor: pointer;
    font-family: var(--mono);
    font-size: .76rem;
    letter-spacing: .06em;
    color: var(--ink-2);
  }}
  .switch input {{ position: absolute; opacity: 0; pointer-events: none; }}
  .track {{
    width: 40px; height: 22px; flex: none;
    border: 1px solid var(--rule);
    border-radius: 999px;
    background: var(--sunken);
    position: relative;
    transition: background .18s ease, border-color .18s ease;
  }}
  .track::after {{
    content: ""; position: absolute; inset: 3px auto 3px 3px;
    width: 14px; border-radius: 50%;
    background: var(--ink-3);
    transition: transform .18s ease, background .18s ease;
  }}
  .switch input:checked + .track {{ background: var(--accent-q); border-color: var(--accent); }}
  .switch input:checked + .track::after {{ transform: translateX(18px); background: var(--accent); }}
  .switch input:focus-visible + .track {{ outline: 2px solid var(--accent); outline-offset: 2px; }}
  .hint {{ font-family: var(--mono); font-size: .72rem; color: var(--ink-3); }}
  .hint b {{ color: var(--cyan); font-weight: 500; }}

  /* ---------- plates ---------- */
  .plate {{
    background: var(--surface);
    border: 1px solid var(--rule);
    border-radius: 3px;
    padding: clamp(1.1rem, 3vw, 1.75rem);
    display: flex;
    flex-direction: column;
    gap: 1.35rem;
  }}
  .plate-head {{ display: flex; gap: 1rem; align-items: baseline; }}
  .plate-key {{
    font-family: var(--mono);
    font-size: .8rem;
    font-weight: 600;
    color: var(--accent);
    border: 1px solid var(--accent);
    border-radius: 2px;
    padding: .12rem .5rem;
    flex: none;
  }}
  .plate-id {{ display: flex; flex-direction: column; gap: .3rem; min-width: 0; }}
  .plate-id h2 {{
    font-family: var(--display);
    font-size: clamp(1.15rem, 2.6vw, 1.45rem);
    font-weight: 600;
    letter-spacing: -.015em;
    margin: 0;
  }}
  .use {{ margin: 0; color: var(--ink-2); font-size: .93rem; max-width: 62ch; }}

  .fmt {{
    font-family: var(--mono);
    font-size: .62rem;
    font-weight: 500;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--accent);
    border: 1px solid var(--accent);
    border-radius: 2px;
    padding: .1rem .38rem;
    margin-inline-start: .5rem;
    vertical-align: middle;
    white-space: nowrap;
  }}

  /* Series divider — the one place the page raises its voice. */
  .series {{
    display: flex;
    flex-direction: column;
    gap: .35rem;
    padding-top: clamp(.75rem, 2vw, 1.5rem);
    border-top: 2px solid var(--ink);
  }}
  .series h2 {{
    font-family: var(--display);
    font-size: clamp(1.3rem, 3.2vw, 1.75rem);
    font-weight: 600;
    letter-spacing: -.02em;
    margin: 0;
  }}
  .series p {{ margin: 0; color: var(--ink-2); font-size: .95rem; max-width: 64ch; }}

  .proofs {{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: clamp(.9rem, 2.5vw, 1.5rem);
  }}
  /* The vertical card would blow up to full column width at 2:3.5, so cap it. */
  .proofs--tall {{ grid-template-columns: repeat(auto-fit, minmax(190px, 260px)); }}
  .proofs--tall .board {{ aspect-ratio: 2 / 3.5; }}
  /* Safe area on the vertical trim: 0.125in of 2in across, of 3.5in down. */
  .proofs--tall .safe {{ inset: 3.571% 6.25%; }}
  figure {{ margin: 0; display: flex; flex-direction: column; gap: .5rem; }}
  .board {{
    position: relative;
    background: var(--sunken);
    border-radius: 2px;
    box-shadow: var(--shadow);
    overflow: hidden;
    aspect-ratio: 3.5 / 2;
  }}
  .board img {{ display: block; width: 100%; height: 100%; }}
  /* Safe area = 0.125in inside a 3.5 x 2in trim: 3.571% across, 6.25% down. */
  .safe {{
    position: absolute;
    inset: 6.25% 3.571%;
    border: 1px dashed var(--cyan);
    opacity: 0;
    transition: opacity .18s ease;
    pointer-events: none;
  }}
  :root[data-guides="on"] .safe {{ opacity: .9; }}
  figcaption {{
    font-family: var(--mono);
    font-size: .7rem;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--ink-3);
  }}

  .plate-foot {{
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--rule-2);
    padding-top: 1.15rem;
  }}
  .stock {{ margin: 0; font-size: .84rem; color: var(--ink-2); display: flex; gap: .6rem; align-items: baseline; }}
  .dl {{ display: flex; flex-wrap: wrap; gap: .55rem; }}

  .btn {{
    display: inline-flex;
    align-items: baseline;
    gap: .5rem;
    padding: .5rem .85rem;
    border: 1px solid var(--rule);
    border-radius: 2px;
    background: var(--surface);
    color: var(--ink);
    font-family: var(--mono);
    font-size: .78rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: border-color .16s ease, color .16s ease, background .16s ease;
  }}
  .btn:hover {{ border-color: var(--accent); color: var(--accent); }}
  .btn:focus-visible {{ outline: 2px solid var(--accent); outline-offset: 2px; }}
  .btn .meta {{ color: var(--ink-3); font-size: .68rem; font-weight: 400; }}
  .btn:hover .meta {{ color: inherit; opacity: .75; }}
  .btn-primary {{ background: var(--btn-bg); border-color: var(--btn-bg); color: var(--btn-fg); }}
  .btn-primary .meta {{ color: var(--btn-fg); opacity: .72; }}
  .btn-primary:hover {{ background: var(--btn-hov); border-color: var(--btn-hov); color: var(--btn-fg); }}
  .btn-primary:hover .meta {{ color: var(--btn-fg); opacity: .72; }}

  /* ---------- press notes ---------- */
  .notes {{
    background: var(--surface);
    border: 1px solid var(--rule);
    border-radius: 3px;
    padding: clamp(1.1rem, 3vw, 1.75rem);
    display: flex;
    flex-direction: column;
    gap: 1.15rem;
  }}
  .notes h2 {{
    font-family: var(--display);
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    letter-spacing: -.01em;
  }}
  .notes ol {{
    margin: 0; padding: 0; list-style: none;
    display: flex; flex-direction: column; gap: .95rem;
    counter-reset: n;
  }}
  .notes li {{
    display: grid;
    grid-template-columns: 1.6rem minmax(0, 1fr);
    gap: .1rem .7rem;
    counter-increment: n;
  }}
  .notes li::before {{
    content: counter(n, decimal-leading-zero);
    font-family: var(--mono);
    font-size: .72rem;
    color: var(--accent);
    padding-top: .28rem;
  }}
  .notes b {{ font-weight: 600; display: block; }}
  .notes p {{ margin: 0; color: var(--ink-2); font-size: .91rem; max-width: 68ch; }}

  footer {{
    font-family: var(--mono);
    font-size: .72rem;
    color: var(--ink-3);
    display: flex; flex-wrap: wrap; gap: .4rem 1.2rem;
    padding-inline: .1rem;
  }}
  footer a {{ color: var(--accent); text-decoration: none; }}
  footer a:hover {{ text-decoration: underline; }}

  @media (max-width: 720px) {{
    .docket {{ grid-template-columns: minmax(0, 1fr); }}
    .plate-foot {{ justify-content: flex-start; }}
  }}
  @media (prefers-reduced-motion: reduce) {{
    *, *::before, *::after {{ transition-duration: .001ms !important; }}
  }}
</style>

<div class="wrap">

  <header class="docket">
    <div class="docket-id">
      <svg class="regmark" width="26" height="26" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.2" aria-hidden="true">
        <circle cx="12" cy="12" r="7.4"/><circle cx="12" cy="12" r="2.1"/>
        <path d="M12 0v6.2M12 17.8V24M0 12h6.2M17.8 12H24"/>
      </svg>
      <h1>Business cards</h1>
      <p class="lede">Eight concepts for Nasser Saleh, front and back. Pick one, download the PDF,
        send it to a printer — the files are already set up the way they will ask for.</p>
    </div>
    <dl class="spec">
      {''.join(f'<dt>{k}</dt><dd>{v}</dd>' for k, v in SPEC)}
    </dl>
  </header>

  <div class="controls">
    <label class="switch">
      <input type="checkbox" id="guides">
      <span class="track"></span>
      <span>Show safe area</span>
    </label>
    <span class="hint">Nothing important should sit outside the <b>dashed line</b> — that margin
      absorbs how far the guillotine drifts.</span>
  </div>

  {''.join(
      (f'<div class="series"><h2>{SERIES[s][0]}</h2><p>{SERIES[s][1]}</p></div>'
       if i == 0 or PLATES[i - 1]['series'] != s else '') + plate_html(p)
      for i, p in enumerate(PLATES) for s in [p['series']]
  )}

  <section class="notes">
    <h2>Before you send it to the printer</h2>
    <ol>
      {''.join(f'<li><b>{t}</b><p>{d}</p></li>' for t, d in NOTES)}
    </ol>
  </section>

  <footer>
    <span>Nasser Saleh · Digital Marketing &amp; MarTech Specialist</span>
    <span><a href="https://nassersaleh.ca">nassersaleh.ca</a></span>
    <span>(438) 988-6709</span>
  </footer>

</div>

<script>
  // The PNG buttons reuse the preview images already in the page rather than
  // carrying a second copy of every file.
  for (const a of document.querySelectorAll('.btn[data-src]')) {{
    const img = document.getElementById(a.dataset.src);
    if (img) a.href = img.src;
  }}

  const guides = document.getElementById('guides');
  const apply = () => document.documentElement.dataset.guides = guides.checked ? 'on' : 'off';
  guides.addEventListener('change', apply);
  apply();
</script>
"""

# Escape every non-ASCII character (em dashes, the Arabic in plate D) to a
# numeric reference. The page then renders identically no matter what charset
# the host serves it as — worth the few extra bytes for the Arabic side.
OUT.write_text(HTML.encode("ascii", "xmlcharrefreplace").decode("ascii"), encoding="ascii")
print(f"{OUT.name}: {OUT.stat().st_size / 1024:.0f} KB")
