"""Assemble the self-contained business-card selector page.

Everything is inlined as data URIs — the Artifact CSP blocks external hosts,
so fonts and files must travel with the page.

The page is a picker, not a document: a rail of all eight concepts on the
left, one card shown large on the right. Each card image appears in the HTML
exactly once; the rail thumbnails and the PNG download links borrow the same
data URI at runtime rather than carrying a second copy.

    python scripts/make_business_cards.py && python scripts/build_cards_page.py
"""
import base64
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
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

AR = "العربية"   # العربية

PLATES = [
    dict(
        key="I", slug="I-keyword-field", name="Keyword Field", group="bold",
        line="His name, cut out of the search.",
        use="The whole card is a wall of what people actually type into a search box — "
            "“does chatgpt know my business”, “why is my traffic down”. His name is cut "
            "out of it, and inside the letters the same queries invert. He sells being the answer "
            "inside that noise, so the card is that, rather than a claim about it.",
        risk="It is texture before it is a name. Some people will take a second to read it — "
             "which is either the point or the problem, depending on the room.",
        stock="16 pt matte — fine reversed text needs a stock that will not spread ink",
    ),
    dict(
        key="J", slug="J-scan-me", name="Scan Me", group="bold",
        line="The QR stops being a footnote.",
        use="Half the card is the code, with the monogram knocked out of its middle. Error "
            "correction level H is what makes that survivable, and this one is decoder-tested at "
            "full size and at 45% of it. The reverse is pure brand — gradient, tagline, nothing else.",
        risk="Only worth it if what sits behind the code is worth scanning.",
        stock="16 pt smooth matte — gloss glare is what defeats scanners",
    ),
    dict(
        key="K", slug="K-the-audit", name="The Audit", group="bold",
        line="The card qualifies the lead for you.",
        use="Four questions no owner answers comfortably, with real tick boxes. Hand it over and "
            "they run their own discovery call; every empty box is a reason to phone him. A "
            "business card that does a job instead of sitting in a drawer.",
        risk="Reads as presumptuous if you hand it to a peer rather than a prospect.",
        stock="Uncoated — so a pen actually works on it, which is the whole point",
    ),
    dict(
        key="L", slug="L-the-receipt", name="The Receipt", group="bold",
        line="Itemised, totalled, free.",
        use="Set as a till receipt: line items, dashed rules, a total of ONE CONVERSATION, and a "
            "merchant copy on the back carrying the numbers. The format is the argument — this is "
            "someone who prices, tracks and reports on everything.",
        risk="Charming or gimmicky depending entirely on the room. Nobody is neutral about it.",
        stock="Uncoated; or trim it narrow at 3.5 × 1.75 in to lean all the way in",
    ),
    dict(
        key="E", slug="E-search-result", name="Search Result", group="concept",
        line="SEO on one side, GEO on the other.",
        use="The front is an organic search listing — query field, his name as the blue link, his "
            "numbers in the snippet. The back is an AI answer box that cites him as a source. He "
            "sells being found, so the card demonstrates it instead of describing it.",
        risk="Reads as clever to marketers; may need a beat of explanation to anyone else.",
        stock="16 pt smooth matte",
    ),
    dict(
        key="F", slug="F-tracked", name="Tracked", group="concept",
        line="The card is a measurable channel.",
        use="The artwork is the URL and its tracking parameters. It reads as a joke until someone "
            "scans it — the QR genuinely carries utm_source=card, so the visit lands in his GA4 "
            "next to every other channel.",
        risk="The wit only lands with people who read UTM parameters for a living.",
        stock="16 pt smooth matte, or soft-touch",
    ),
    dict(
        key="G", slug="G-portrait", name="Portrait", group="concept", vertical=True,
        line="Vertical, and the only one with a face.",
        use="The headshot as a duotone in the brand colours, running to all four edges. In a stack "
            "of landscape cards the orientation alone does half the work, and people remember a "
            "face long after they have forgotten a logo.",
        risk="Ties the card to one photo; reprint when the photo dates.",
        stock="16 pt matte — gloss flattens a duotone",
    ),
    dict(
        key="H", slug="H-one-number", name="One Number", group="concept",
        line="One result, at poster scale.",
        use="+100% fills the front and nothing else competes with it. Everything that qualifies the "
            "claim — which client, which metric, over what period — moves to the back.",
        risk="The loudest card here. Confident in a startup room, brash in a bank.",
        stock="16 pt smooth matte",
    ),
    dict(
        key="A", slug="A-gradient-monogram", name="Gradient Monogram", group="classic",
        line="Matches the website exactly.",
        use="Same white ground, monogram and cyan-to-violet gradient as nassersaleh.ca. Anyone who "
            "visits the site after meeting him sees one continuous brand.",
        risk="Safe by design. It will never be the most interesting card in the pile.",
        stock="16 pt smooth matte",
    ),
    dict(
        key="B", slug="B-dark-signal", name="Dark Signal", group="classic",
        line="The back does the pitching.",
        use="Deep ink with a data-signal line. The reverse lists what he actually runs, so a "
            "contact from a conference knows the offer without having to ask.",
        risk="Dark stock shows fingerprints and scuffs sooner than light.",
        stock="16 pt smooth matte",
    ),
    dict(
        key="C", slug="C-editorial-ledger", name="Editorial Ledger", group="classic",
        line="Quiet, and expensive-looking.",
        use="Warm paper, a serif name, one hairline rule, a single indigo accent. No gradients "
            "anywhere. Built for boardroom and consulting introductions, and it ages well.",
        risk="Signals consultant, not technologist — the opposite of the MarTech positioning.",
        stock="Uncoated textured, e.g. Mohawk Superfine",
    ),
    dict(
        key="D", slug="D-bilingual", name=f"Bilingual — English ⇄ {AR}", short="Bilingual",
        group="classic",
        line="Neither side is the back.",
        use="English one side, Arabic the other. Built for Toronto's Arabic-speaking business "
            "community and any Gulf-market work — hand it over whichever way up suits the room.",
        risk="Only an advantage where the second language is an advantage.",
        stock="16 pt smooth matte",
    ),
]

GROUPS = [
    ("bold", "Out of the box",
     "These break the format rather than decorate it — a card that is a search result, a "
     "questionnaire, a receipt."),
    ("concept", "Concept-led", "Conventional shape, but each argues for something only he can claim."),
    ("classic", "Classic", "Quieter. For when the card just has to be handed over cleanly."),
]

SPEC = [
    ("Trim", "3.5 &times; 2 in &nbsp;/&nbsp; 89 &times; 51 mm"),
    ("Bleed", "0.125 in, four edges"),
    ("Output", "300 dpi, RGB"),
    ("QR", "tagged per card, tracked in GA4"),
]

NOTES = [
    ("Every QR is tagged, so you can tell which card worked.",
     "Each points at nassersaleh.ca with its own campaign parameter — card A carries "
     "<code>utm_campaign=a</code>, card E carries <code>e</code>. Scans arrive in GA4 under source "
     "<code>card</code>. Print two designs and you have a real A/B test on which one people "
     "actually reach for."),
    ("Every code is decoder-tested, not eyeballed.",
     "The build reads each finished card back with a real QR decoder and fails if a code is too "
     "dense, or drawn light-on-dark — an inverted QR looks striking on a dark card and a good "
     "share of phone cameras simply refuse it. All twelve now decode as printed."),
    ("Send the PDF. Keep the PNG for screens.",
     "The PDF carries the 0.125 in bleed every printer asks for. The PNG is cropped to the trim "
     "line — right for an email signature or a deck, wrong for print, where it would leave white "
     "slivers along the edges."),
    ("Expect the gradients to soften.",
     "The files are RGB and printers convert to CMYK at their end. Cyan-to-violet sits outside the "
     "CMYK gamut, so the gradient cards print a little less vivid than they look here. Normal, and "
     "not worth chasing."),
    ("Do not scale the artwork down.",
     "The QR codes are 0.5 in and sized for this trim. Print smaller and they start failing on "
     "older phone cameras."),
]

CSS = """
@font-face { font-family:'SG'; font-weight:300 700; font-display:swap;
  src:url(data:font/woff2;base64,__SG__) format('woff2'); }
@font-face { font-family:'JB'; font-weight:100 800; font-display:swap;
  src:url(data:font/woff2;base64,__JB__) format('woff2'); }
@font-face { font-family:'IN'; font-weight:100 900; font-display:swap;
  src:url(data:font/woff2;base64,__IN__) format('woff2'); }

:root {
  --page:    #e2e4ea;
  --stage:   #f7f8fb;
  --panel:   #ffffff;
  --ink:     #16181f;
  --ink-2:   #565c6c;
  --ink-3:   #5b6172;
  --rule:    #d3d6df;
  --rule-2:  #e6e8ef;
  --accent:  #b4005f;
  --accent-q:#f7e2ec;
  --cyan:    #00606f;
  --btn-bg:  #b4005f;
  --btn-fg:  #ffffff;
  --btn-hov: #8b0049;
  --lift:    0 2px 4px rgba(18,20,32,.06), 0 22px 44px -22px rgba(18,20,32,.45);
  --display:'SG', system-ui, sans-serif;
  --body:   'IN', system-ui, sans-serif;
  --mono:   'JB', ui-monospace, monospace;
}
@media (prefers-color-scheme: dark) {
  :root {
    --page:#0c0e12; --stage:#15181e; --panel:#1c2027;
    --ink:#eef0f5; --ink-2:#a2a9ba; --ink-3:#868da0;
    --rule:#2c313b; --rule-2:#232830;
    --accent:#ff5ea8; --accent-q:#3c1129; --cyan:#4ad2ee;
    --btn-bg:#ff5ea8; --btn-fg:#2b0617; --btn-hov:#ff8bc2;
    --lift:0 2px 4px rgba(0,0,0,.5), 0 24px 50px -22px rgba(0,0,0,.85);
  }
}
:root[data-theme="dark"] {
  --page:#0c0e12; --stage:#15181e; --panel:#1c2027;
  --ink:#eef0f5; --ink-2:#a2a9ba; --ink-3:#868da0;
  --rule:#2c313b; --rule-2:#232830;
  --accent:#ff5ea8; --accent-q:#3c1129; --cyan:#4ad2ee;
  --btn-bg:#ff5ea8; --btn-fg:#2b0617; --btn-hov:#ff8bc2;
  --lift:0 2px 4px rgba(0,0,0,.5), 0 24px 50px -22px rgba(0,0,0,.85);
}
:root[data-theme="light"] {
  --page:#e2e4ea; --stage:#f7f8fb; --panel:#ffffff;
  --ink:#16181f; --ink-2:#565c6c; --ink-3:#5b6172;
  --rule:#d3d6df; --rule-2:#e6e8ef;
  --accent:#b4005f; --accent-q:#f7e2ec; --cyan:#00606f;
  --btn-bg:#b4005f; --btn-fg:#ffffff; --btn-hov:#8b0049;
  --lift:0 2px 4px rgba(18,20,32,.06), 0 22px 44px -22px rgba(18,20,32,.45);
}

* { box-sizing: border-box; }
body {
  margin:0; background:var(--page); color:var(--ink);
  font-family:var(--body); font-size:16px; line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
.lbl {
  font-family:var(--mono); font-size:.66rem; font-weight:500;
  letter-spacing:.14em; text-transform:uppercase; color:var(--ink-3);
}
code {
  font-family:var(--mono); font-size:.86em;
  background:var(--rule-2); padding:.08em .32em; border-radius:2px;
}

/* ---------- top bar ---------- */
.bar {
  position:sticky; top:0; z-index:20;
  display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between;
  gap:.9rem 1.6rem;
  padding:.85rem clamp(1rem,3vw,2rem);
  background:var(--page); border-bottom:1px solid var(--rule);
}
.brand { display:flex; align-items:center; gap:.7rem; min-width:0; }
.regmark { color:var(--accent); flex:none; }
.brand h1 {
  font-family:var(--display); font-size:1.12rem; font-weight:600;
  letter-spacing:-.015em; margin:0; white-space:nowrap;
}
.brand .who { font-family:var(--mono); font-size:.72rem; color:var(--ink-3); white-space:nowrap; }
.bar-right { display:flex; align-items:center; gap:1.4rem; flex-wrap:wrap; }
.spec-inline {
  display:flex; gap:1.3rem; margin:0; flex-wrap:wrap;
  font-family:var(--mono); font-size:.7rem; font-variant-numeric:tabular-nums;
}
.spec-inline div { display:flex; flex-direction:column; gap:.1rem; }
.spec-inline dt { color:var(--ink-3); font-size:.6rem; letter-spacing:.12em; text-transform:uppercase; }
.spec-inline dd { margin:0; color:var(--ink-2); }

.switch { display:inline-flex; align-items:center; gap:.55rem; cursor:pointer;
  font-family:var(--mono); font-size:.72rem; letter-spacing:.05em; color:var(--ink-2); }
.switch input { position:absolute; opacity:0; pointer-events:none; }
.track { width:38px; height:21px; flex:none; border:1px solid var(--rule);
  border-radius:999px; background:var(--rule-2); position:relative;
  transition:background .18s ease, border-color .18s ease; }
.track::after { content:""; position:absolute; inset:3px auto 3px 3px; width:13px;
  border-radius:50%; background:var(--ink-3);
  transition:transform .18s ease, background .18s ease; }
.switch input:checked + .track { background:var(--accent-q); border-color:var(--accent); }
.switch input:checked + .track::after { transform:translateX(17px); background:var(--accent); }
.switch input:focus-visible + .track { outline:2px solid var(--accent); outline-offset:2px; }

/* ---------- shell ---------- */
.shell {
  display:grid; grid-template-columns:266px minmax(0,1fr);
  gap:clamp(1rem,2.4vw,2rem);
  padding:clamp(1rem,2.4vw,2rem) clamp(1rem,3vw,2rem) 4rem;
  max-width:1520px; margin-inline:auto; align-items:start;
}

/* ---------- rail ---------- */
.rail { position:sticky; top:78px; display:flex; flex-direction:column; gap:1.4rem; }
.rail-group { display:flex; flex-direction:column; gap:.5rem; }
.rail-head { display:flex; flex-direction:column; gap:.15rem; padding-inline:.15rem; }
.rail-head p { margin:0; font-size:.78rem; color:var(--ink-3); line-height:1.45; }
.chip {
  display:grid; grid-template-columns:62px minmax(0,1fr); gap:.7rem; align-items:center;
  padding:.45rem; border:1px solid transparent; border-radius:4px;
  background:none; color:inherit; font:inherit; text-align:start; cursor:pointer;
  transition:background .16s ease, border-color .16s ease;
}
.chip:hover { background:var(--stage); border-color:var(--rule); }
.chip:focus-visible { outline:2px solid var(--accent); outline-offset:1px; }
.chip[aria-current="true"] { background:var(--panel); border-color:var(--rule); box-shadow:var(--lift); }
.chip-thumb {
  aspect-ratio:3.5/2; border-radius:2px; overflow:hidden; background:var(--rule-2);
  border:1px solid var(--rule-2);
}
.chip-thumb.tall { aspect-ratio:2/3.5; width:36px; justify-self:center; }
.chip-thumb img { display:block; width:100%; height:100%; object-fit:cover; }
.chip-txt { display:flex; flex-direction:column; gap:.05rem; min-width:0; }
.chip-txt b {
  font-family:var(--display); font-size:.9rem; font-weight:600; letter-spacing:-.01em;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.chip-txt span { font-family:var(--mono); font-size:.62rem; letter-spacing:.1em;
  text-transform:uppercase; color:var(--ink-3);
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.chip[aria-current="true"] .chip-txt span { color:var(--accent); }

/* ---------- stage ---------- */
.stage { display:flex; flex-direction:column; gap:clamp(1rem,2.4vw,1.6rem); min-width:0; }
.view { display:flex; flex-direction:column; gap:clamp(1rem,2.2vw,1.5rem); }
:root.js .view { display:none; }
:root.js .view.is-on { display:flex; }

.view-head { display:flex; flex-direction:column; gap:.45rem; }
.view-head .kicker { display:flex; align-items:center; gap:.6rem; flex-wrap:wrap; }
.key {
  font-family:var(--mono); font-size:.7rem; font-weight:600; color:var(--accent);
  border:1px solid var(--accent); border-radius:2px; padding:.08rem .42rem;
}
.fmt {
  font-family:var(--mono); font-size:.62rem; letter-spacing:.1em; text-transform:uppercase;
  color:var(--ink-3); border:1px solid var(--rule); border-radius:2px; padding:.1rem .42rem;
}
.view-head h2 {
  font-family:var(--display); font-size:clamp(1.7rem,3.6vw,2.4rem); font-weight:600;
  letter-spacing:-.025em; line-height:1.1; margin:0; text-wrap:balance;
}
.view-head .line { margin:0; font-size:1.02rem; color:var(--ink-2); max-width:56ch; }

.sweep {
  background:var(--stage); border:1px solid var(--rule); border-radius:4px;
  padding:clamp(1rem,3vw,2.2rem);
  display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
  gap:clamp(1rem,3vw,2rem); justify-items:center;
}
.sweep.tall { grid-template-columns:repeat(auto-fit,minmax(210px,300px)); justify-content:center; }
figure { margin:0; display:flex; flex-direction:column; gap:.55rem; width:100%; }
.board {
  position:relative; border-radius:3px; overflow:hidden;
  box-shadow:var(--lift); aspect-ratio:3.5/2; background:var(--rule-2);
}
.tall .board { aspect-ratio:2/3.5; }
.board img { display:block; width:100%; height:100%; }
.safe { position:absolute; inset:6.25% 3.571%; border:1px dashed var(--cyan);
  opacity:0; transition:opacity .18s ease; pointer-events:none; }
.tall .safe { inset:3.571% 6.25%; }
:root[data-guides="on"] .safe { opacity:.9; }
figcaption { font-family:var(--mono); font-size:.68rem; letter-spacing:.12em;
  text-transform:uppercase; color:var(--ink-3); }

.detail { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:clamp(1rem,2.6vw,2rem); }
.detail .col { display:flex; flex-direction:column; gap:.4rem; }
.detail p { margin:0; font-size:.94rem; color:var(--ink-2); max-width:62ch; }
.detail .risk { color:var(--ink-2); }

.get { display:flex; flex-wrap:wrap; gap:.55rem; align-items:center;
  border-top:1px solid var(--rule-2); padding-top:1.1rem; }
.btn {
  display:inline-flex; align-items:baseline; gap:.5rem;
  padding:.55rem .9rem; border:1px solid var(--rule); border-radius:2px;
  background:var(--panel); color:var(--ink); text-decoration:none; cursor:pointer;
  font-family:var(--mono); font-size:.76rem; font-weight:500;
  transition:border-color .16s ease, color .16s ease, background .16s ease;
}
.btn:hover { border-color:var(--accent); color:var(--accent); }
.btn:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.btn .meta { color:var(--ink-3); font-size:.66rem; font-weight:400; }
.btn:hover .meta { color:inherit; opacity:.75; }
.btn-primary { background:var(--btn-bg); border-color:var(--btn-bg); color:var(--btn-fg); }
.btn-primary .meta { color:var(--btn-fg); opacity:.72; }
.btn-primary:hover { background:var(--btn-hov); border-color:var(--btn-hov); color:var(--btn-fg); }
.btn-primary:hover .meta { color:var(--btn-fg); opacity:.72; }

/* ---------- press notes ---------- */
.notes {
  background:var(--panel); border:1px solid var(--rule); border-radius:4px;
  padding:clamp(1.1rem,3vw,1.8rem);
  display:flex; flex-direction:column; gap:1.1rem;
}
.notes h2 { font-family:var(--display); font-size:1.08rem; font-weight:600;
  letter-spacing:-.01em; margin:0; }
.notes ol { margin:0; padding:0; list-style:none; counter-reset:n;
  display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:1rem 1.6rem; }
.notes li { counter-increment:n; display:grid; grid-template-columns:1.7rem minmax(0,1fr);
  gap:.1rem .6rem; }
.notes li::before { content:counter(n,decimal-leading-zero); font-family:var(--mono);
  font-size:.7rem; color:var(--accent); padding-top:.3rem; }
/* Both text nodes belong in the second column. Without this the paragraph
   auto-places into the narrow counter column and wraps a word per line. */
.notes b, .notes li p { grid-column:2; }
.notes b { font-weight:600; display:block; }
.notes p { margin:.15rem 0 0; color:var(--ink-2); font-size:.9rem; }

footer { display:flex; flex-wrap:wrap; gap:.35rem 1.2rem;
  font-family:var(--mono); font-size:.7rem; color:var(--ink-3); padding-inline:.15rem; }
footer a { color:var(--accent); text-decoration:none; }
footer a:hover { text-decoration:underline; }

@media (max-width:900px) {
  .shell { grid-template-columns:minmax(0,1fr); }
  .rail { position:static; }
  .rail-group { display:block; }
  .rail-strip { display:flex; gap:.5rem; overflow-x:auto; padding-bottom:.4rem; }
  .rail-strip .chip { flex:0 0 208px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration:.001ms !important; }
}
"""


def view_html(p):
    pdf = CARDS / f"nasser-saleh-card-{p['slug']}.pdf"
    front = CARDS / f"{p['slug']}-front.png"
    back = CARDS / f"{p['slug']}-back.png"
    sides = ("English", AR) if p["key"] == "D" else ("Front", "Back")
    tall = p.get("vertical", False)
    w, h = (600, 1050) if tall else (1050, 600)
    fmt = "2 &times; 3.5 in &middot; vertical" if tall else "3.5 &times; 2 in"

    faces = "".join(
        f"""
          <figure>
            <div class="board">
              <img id="img-{p['key']}-{sfx}" src="data:image/png;base64,{b64(f)}"
                   alt="{p['name']} card, {label.lower()} side" width="{w}" height="{h}">
              <span class="safe" aria-hidden="true"></span>
            </div>
            <figcaption>{label}</figcaption>
          </figure>"""
        for sfx, f, label in (("f", front, sides[0]), ("b", back, sides[1]))
    )

    return f"""
      <section class="view" id="view-{p['key']}" role="tabpanel" aria-labelledby="tab-{p['key']}">
        <div class="view-head">
          <div class="kicker">
            <span class="key">{p['key']}</span>
            <span class="fmt">{fmt}</span>
            <span class="fmt">{p['stock']}</span>
          </div>
          <h2>{p['name']}</h2>
          <p class="line">{p['line']}</p>
        </div>

        <div class="sweep{' tall' if tall else ''}">{faces}</div>

        <div class="detail">
          <div class="col">
            <span class="lbl">Why this one</span>
            <p>{p['use']}</p>
          </div>
          <div class="col">
            <span class="lbl">What it costs you</span>
            <p class="risk">{p['risk']}</p>
          </div>
        </div>

        <div class="get">
          <a class="btn btn-primary" download="{pdf.name}"
             href="data:application/pdf;base64,{b64(pdf)}">
            Print PDF <span class="meta">front + back &middot; {kb(pdf)}</span>
          </a>
          <a class="btn" download="{front.name}" data-src="img-{p['key']}-f">
            {sides[0]} PNG <span class="meta">{kb(front)}</span>
          </a>
          <a class="btn" download="{back.name}" data-src="img-{p['key']}-b">
            {sides[1]} PNG <span class="meta">{kb(back)}</span>
          </a>
        </div>
      </section>"""


def chip_html(p, first):
    tall = p.get("vertical", False)
    return f"""
          <button class="chip" id="tab-{p['key']}" role="tab" data-key="{p['key']}"
                  aria-controls="view-{p['key']}" aria-current="{'true' if first else 'false'}">
            <span class="chip-thumb{' tall' if tall else ''}">
              <img alt="" data-src="img-{p['key']}-f">
            </span>
            <span class="chip-txt">
              <b>{p.get('short', p['name'])}</b>
              <span>{p['key']}{' &middot; vertical' if tall else ''}</span>
            </span>
          </button>"""


rail = ""
for gid, gname, gdesc in GROUPS:
    members = [p for p in PLATES if p["group"] == gid]
    chips = "".join(chip_html(p, p is PLATES[0]) for p in members)
    rail += f"""
      <div class="rail-group">
        <div class="rail-head">
          <span class="lbl">{gname}</span>
          <p>{gdesc}</p>
        </div>
        <div class="rail-strip">{chips}</div>
      </div>"""

HTML = f"""<title>Business Cards — Nasser Saleh</title>
<style>{CSS.replace('__SG__', b64(FONTS['sg'])).replace('__JB__', b64(FONTS['jb'])).replace('__IN__', b64(FONTS['in']))}</style>

<header class="bar">
  <div class="brand">
    <svg class="regmark" width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.3" aria-hidden="true">
      <circle cx="12" cy="12" r="7.4"/><circle cx="12" cy="12" r="2.1"/>
      <path d="M12 0v6.2M12 17.8V24M0 12h6.2M17.8 12H24"/>
    </svg>
    <h1>Business cards</h1>
    <span class="who">Nasser Saleh</span>
  </div>
  <div class="bar-right">
    <dl class="spec-inline">
      {''.join(f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in SPEC)}
    </dl>
    <label class="switch">
      <input type="checkbox" id="guides">
      <span class="track"></span>
      <span>Safe area</span>
    </label>
  </div>
</header>

<div class="shell">
  <nav class="rail" role="tablist" aria-label="Card concepts">{rail}</nav>

  <main class="stage">
    {''.join(view_html(p) for p in PLATES)}

    <section class="notes">
      <h2>Before it goes to the printer</h2>
      <ol>
        {''.join(f'<li><b>{t}</b><p>{d}</p></li>' for t, d in NOTES)}
      </ol>
    </section>

    <footer>
      <span>Nasser Saleh &middot; Digital Marketing &amp; MarTech Specialist</span>
      <span><a href="https://nassersaleh.ca">nassersaleh.ca</a></span>
      <span>(438) 988-6709</span>
    </footer>
  </main>
</div>

<script>
  // Without JS every card stays visible and the page reads as a long proof
  // sheet. This class is what turns it into a one-at-a-time picker.
  document.documentElement.classList.add('js');

  const chips = [...document.querySelectorAll('.chip')];
  const keys = chips.map(c => c.dataset.key);

  // Rail thumbnails and the PNG buttons borrow the images already in the page,
  // so each card's data URI is written into the file exactly once.
  for (const el of document.querySelectorAll('[data-src]')) {{
    const img = document.getElementById(el.dataset.src);
    if (!img) continue;
    if (el.tagName === 'IMG') el.src = img.src; else el.href = img.src;
  }}

  function show(key, push) {{
    if (!keys.includes(key)) key = keys[0];
    for (const c of chips) c.setAttribute('aria-current', String(c.dataset.key === key));
    for (const v of document.querySelectorAll('.view')) v.classList.toggle('is-on', v.id === 'view-' + key);
    if (push && location.hash !== '#' + key) history.replaceState(null, '', '#' + key);
  }}

  chips.forEach((c, i) => {{
    c.addEventListener('click', () => show(c.dataset.key, true));
    c.addEventListener('keydown', e => {{
      const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1
              : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const next = chips[(i + d + chips.length) % chips.length];
      next.focus();
      show(next.dataset.key, true);
    }});
  }});

  addEventListener('hashchange', () => show(location.hash.slice(1), false));
  show(location.hash.slice(1) || keys[0], false);

  const guides = document.getElementById('guides');
  const apply = () => document.documentElement.dataset.guides = guides.checked ? 'on' : 'off';
  guides.addEventListener('change', apply);
  apply();
</script>
"""

OUT.write_text(HTML.encode("ascii", "xmlcharrefreplace").decode("ascii"), encoding="ascii")
print(f"{OUT.name}: {OUT.stat().st_size / 1024:.0f} KB")
