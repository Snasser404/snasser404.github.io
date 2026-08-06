"""
Nasser Saleh — print-ready business cards.

Four concepts, front + back, rendered at 300 dpi with a 0.125" bleed on every
edge. Outputs a two-page PDF per concept (page 1 = front, page 2 = back) plus
PNG proofs and a single contact sheet.

Fonts come from the site itself: the Fontsource .woff2 files in node_modules
are decompressed to .ttf on first run, so the cards and nassersaleh.ca use
identical typefaces.

    pip install pillow fonttools brotli arabic-reshaper python-bidi qrcode
    python scripts/make_business_cards.py

Output lands in business-cards/ (gitignored — regenerate rather than commit).
"""
import pathlib
import arabic_reshaper
import qrcode
from bidi.algorithm import get_display
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = ROOT / "business-cards" / ".fonts"
OUT = ROOT / "business-cards"
OUT.mkdir(exist_ok=True)

# Fontsource ships subset variable woff2; fontTools + brotli decompress them
# back to plain TTF, which is what Pillow can load.
WOFF2 = {
    "space-grotesk": "space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
    "inter": "inter/files/inter-latin-wght-normal.woff2",
    "jetbrains-mono": "jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
    "noto-arabic": "noto-sans-arabic/files/noto-sans-arabic-arabic-wght-normal.woff2",
}


def ensure_fonts():
    FONTS.mkdir(parents=True, exist_ok=True)
    src_root = ROOT / "node_modules" / "@fontsource-variable"
    for stem, rel in WOFF2.items():
        dst = FONTS / f"{stem}.ttf"
        if dst.exists():
            continue
        src = src_root / rel
        if not src.exists():
            raise SystemExit(f"Missing {src} — run `npm install` first.")
        f = TTFont(str(src))
        f.flavor = None  # drop woff2 compression -> plain TTF
        f.save(str(dst))
        print(f"converted {stem}")

# ---------------------------------------------------------------- geometry
DPI = 300
TRIM_W, TRIM_H = 3.5, 2.0          # inches, standard NA business card
BLEED = 0.125                      # per edge
SAFE = 0.125                       # keep content this far inside the trim

W = int((TRIM_W + 2 * BLEED) * DPI)   # 1125
H = int((TRIM_H + 2 * BLEED) * DPI)   # 675
B = int(BLEED * DPI)                  # 37 — trim line offset from canvas edge
M = B + int(SAFE * DPI)               # 75 — safe-area offset

# Baselines for the bottom contact block. Descenders need headroom, so the
# last line sits a little above the safe line rather than on it.
BASE_1 = H - M - 8                    # bottom-most line
BASE_2 = BASE_1 - 46                  # line above it

# ---------------------------------------------------------------- palette
INK        = (23, 26, 34)
INK_DEEP   = (13, 15, 22)
MUTED      = (92, 98, 115)
FAINT      = (150, 157, 175)
WHITE      = (255, 255, 255)
PAPER      = (247, 249, 253)
CREAM      = (250, 248, 243)
CYAN       = (34, 211, 238)
ELECTRIC   = (79, 70, 229)
VIOLET     = (168, 85, 247)
TEAL       = (52, 224, 196)
INDIGO_DK  = (49, 46, 129)

# ---------------------------------------------------------------- content
NAME       = "Nasser Saleh"
TITLE      = "Digital Marketing & MarTech Specialist"
PHONE      = "(438) 988-6709"
EMAIL      = "nassersaleh156@gmail.com"
CITY       = "Toronto, ON"
CITY_LONG  = "Toronto, Canada"
SITE       = "nassersaleh.ca"
LINKEDIN   = "linkedin.com/in/nasser-saleh"
TAG_1      = "Marketing that's measured."
TAG_2      = "Tech that makes it scale."

AR_NAME    = "ناصر صالح"
AR_TITLE   = "أخصائي تسويق رقمي وتقنيات تسويق"
# Separator is the Arabic comma — the Latin middle dot has no glyph in the
# Arabic subset and would print as a .notdef box.
AR_SERVICE = "تحسين محركات البحث، أتمتة التسويق، تحليلات"
AR_CITY    = "تورونتو، كندا"

SERVICES = [
    (CYAN,     "SEO & GEO — found in search and AI answers"),
    (ELECTRIC, "Marketing automation & lead funnels"),
    (VIOLET,   "Analytics, tracking & reporting"),
    (TEAL,     "Websites — custom, WordPress, Wix"),
]

QUERIES = [
    "digital marketing toronto", "seo specialist near me", "google ads management",
    "marketing automation setup", "ga4 conversion tracking", "local seo gta",
    "generative engine optimization", "does chatgpt know my business",
    "martech consultant toronto", "how do i lower cost per lead",
    "google business profile help", "wordpress site not ranking",
    "why is my traffic down", "how to rank in ai answers", "ppc management agency",
    "email marketing setup", "book more appointments online", "marketing dashboard",
]

CHECKS = [
    "You show up for your service + your city",
    "ChatGPT and Google's AI know you exist",
    "You can name your cost per lead",
    "Something follows up when a lead goes cold",
]

# Every literal drawn by concepts E–H, so check_coverage() sees them too.
# The en-dashes, the true minus in "−20%" and "·" are the ones that bite.
SERIES_2_COPY = [
    "digital marketing specialist toronto",
    "Nasser Saleh — Digital Marketing", "& MarTech Specialist",
    "Toronto. SEO & GEO, paid search, GA4 analytics and the automation behind them. "
    "+100% traffic, −20% cost-per-click.",
    "AI ANSWER", "CITED SOURCE",
    "Nasser Saleh is a Toronto digital marketer who builds and runs the technology "
    "behind growth — so campaigns launch, and get measured, without waiting on a dev team.",
    "MEASURED, LIKE EVERYTHING ELSE I RUN", "utm_source", "utm_medium", "utm_campaign",
    "card", "print", "Scan it.",
    "It lands in my analytics next to every other channel. That is the whole point.",
    "DIGITAL MARKETING · MARTECH", "+100%",
    "WEBSITE TRAFFIC  ·  GLOBALDWS  ·  12 MONTHS",
    "+40%", "−20%", "+20%",
    "SEO traffic, 5 months", "cost-per-click, paid search", "campaign ROI",
    "THE ANSWER IN THE NOISE", "Scan", "me.", "MERCHANT COPY",
    "TICK WHAT'S TRUE OF YOUR MARKETING", "Any box empty? That's the conversation.",
    "I fix the", "empty boxes.", "TOTAL", "ONE CONVERSATION", "incl.",
    "SEO & GEO", "PAID SEARCH & SOCIAL", "ANALYTICS & TRACKING",
    "AUTOMATION & FUNNELS", "TRAFFIC", "SEO TRAFFIC", "COST PER CLICK",
    "CAMPAIGN ROI", "NASSER SALEH", "DIGITAL MARKETING & MARTECH",
    *QUERIES, *CHECKS,
]

# ---------------------------------------------------------------- fonts
_cache = {}


def font(stem, size, weight=400):
    key = (stem, size, weight)
    if key not in _cache:
        f = ImageFont.truetype(str(FONTS / f"{stem}.ttf"), size)
        try:
            f.set_variation_by_axes([weight])
        except OSError:
            pass  # static font
        _cache[key] = f
    return _cache[key]


def serif(size):
    """Georgia if Windows has it, else Inter — only Concept C uses it."""
    for p in (r"C:\Windows\Fonts\georgia.ttf", r"C:\Windows\Fonts\times.ttf"):
        if pathlib.Path(p).exists():
            return ImageFont.truetype(p, size)
    return font("inter", size, 400)


def check_coverage():
    """Fail loudly rather than silently printing .notdef boxes."""
    latin = set()
    for t in (NAME, TITLE, PHONE, EMAIL, CITY, CITY_LONG, SITE, LINKEDIN,
              TAG_1, TAG_2, *(s for _, s in SERVICES), *SERIES_2_COPY):
        latin |= set(t)
    problems = []
    for stem in ("space-grotesk", "inter", "jetbrains-mono"):
        cmap = TTFont(str(FONTS / f"{stem}.ttf")).getBestCmap()
        missing = {c for c in latin if ord(c) not in cmap and c != " "}
        if missing:
            problems.append(f"{stem}: {sorted(missing)}")
    # Check the *shaped* Arabic — reshaping maps to presentation forms, and a
    # subset font can carry the base letter but not the form we actually draw.
    ar_cmap = TTFont(str(FONTS / "noto-arabic.ttf")).getBestCmap()
    ar = set("".join(shape(t) for t in (AR_NAME, AR_TITLE, AR_SERVICE, AR_CITY, "العربية")))
    missing_ar = {c for c in ar if ord(c) not in ar_cmap and c != " "}
    if missing_ar:
        problems.append("noto-arabic: " + ", ".join(f"{c!r} U+{ord(c):04X}" for c in sorted(missing_ar)))
    return problems


# ---------------------------------------------------------------- helpers
def shape(txt):
    """Arabic needs contextual shaping + bidi reordering before Pillow sees it."""
    return get_display(arabic_reshaper.reshape(txt))


def canvas(bg):
    return Image.new("RGB", (W, H), bg)


def lin_grad(w, h, stops, vertical=False):
    """stops: [(pos 0..1, (r,g,b)), ...]"""
    n = h if vertical else w
    strip = Image.new("RGB", (1, n) if vertical else (n, 1))
    px = strip.load()
    for i in range(n):
        t = i / max(n - 1, 1)
        for j in range(len(stops) - 1):
            p0, c0 = stops[j]
            p1, c1 = stops[j + 1]
            if p0 <= t <= p1:
                k = (t - p0) / max(p1 - p0, 1e-6)
                c = tuple(round(c0[m] + (c1[m] - c0[m]) * k) for m in range(3))
                break
        else:
            c = stops[-1][1]
        px[(0, i) if vertical else (i, 0)] = c
    return strip.resize((w, h), Image.BILINEAR)


BRAND = [(0.0, CYAN), (0.5, ELECTRIC), (1.0, VIOLET)]


def grad_text(img, xy, text, fnt, stops=BRAND, anchor="ls", tracking=0):
    """Paint text with a horizontal gradient by using the glyphs as a mask."""
    mask = Image.new("L", img.size, 0)
    d = ImageDraw.Draw(mask)
    if tracking:
        draw_tracked(d, xy, text, fnt, 255, tracking, anchor)
    else:
        d.text(xy, text, font=fnt, fill=255, anchor=anchor)
    img.paste(lin_grad(img.width, img.height, stops), (0, 0), mask)


def text_w(text, fnt, tracking=0):
    return fnt.getlength(text) + tracking * max(len(text) - 1, 0)


def draw_tracked(d, xy, text, fnt, fill, tracking, anchor="ls"):
    """Letter-spaced text. Horizontal anchor honoured; vertical passed through."""
    x, y = xy
    total = text_w(text, fnt, tracking)
    h_anchor = anchor[0]
    if h_anchor == "m":
        x -= total / 2
    elif h_anchor == "r":
        x -= total
    v = anchor[1]
    for ch in text:
        d.text((x, y), ch, font=fnt, fill=fill, anchor="l" + v)
        x += fnt.getlength(ch) + tracking


QR_PX = 170  # 0.57in at 300dpi, quiet zone included


def card_url(slug):
    """Every card's QR carries its own campaign tag, so GA4 shows which design
    actually got scanned. Marketing that's measured, including the card."""
    return f"https://{SITE}/?utm_source=card&utm_medium=print&utm_campaign={slug[0].lower()}"


def qr_image(data, size, fg, bg, border=4):
    """`size` is the whole symbol *including* its quiet zone.

    Two things this enforces, both learned the hard way:

    - The quiet zone is built in (border=4, the spec minimum). Drawing a QR
      flush against other artwork is a common way to make one that photographs
      but never decodes.
    - `fg` must be the DARK colour and `bg` the light one. A light-on-dark
      "inverted" QR looks great on a dark card and is unreadable to a good
      share of phone cameras, which assume dark modules on a light field. On a
      dark card, pass a light `bg` — the quiet zone then reads as a deliberate
      light plate under the code.
    """
    q = qrcode.QRCode(version=None, box_size=10, border=border,
                      error_correction=qrcode.constants.ERROR_CORRECT_L)
    q.add_data(data)
    q.make(fit=True)
    pitch = size / (q.modules_count + 2 * border)
    if pitch < 3.6:  # ~0.012in per module; below this, scans get flaky
        raise SystemExit(f"QR too dense: {pitch:.2f}px per module in {size}px for {data}")
    if _luma(fg) > _luma(bg):
        raise SystemExit(f"QR is inverted (light modules on dark): fg={fg} bg={bg}")
    img = q.make_image(fill_color=fg, back_color=bg).convert("RGB")
    return img.resize((size, size), Image.NEAREST)


def _luma(hex_or_rgb):
    if isinstance(hex_or_rgb, str):
        h = hex_or_rgb.lstrip("#")
        r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    else:
        r, g, b = hex_or_rgb
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def wrap(text, fnt, max_w):
    """Greedy word wrap measured in the actual font."""
    words, lines, line = text.split(), [], ""
    for w in words:
        trial = f"{line} {w}".strip()
        if fnt.getlength(trial) <= max_w or not line:
            line = trial
        else:
            lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines


def grad_ring(img, box, radius, width, stops=BRAND):
    """A rounded-rectangle border painted with a gradient."""
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(box, radius=radius, outline=255, width=width)
    img.paste(lin_grad(img.width, img.height, stops), (0, 0), mask)


def duotone(src, shadow, highlight, size):
    """Map a photo onto a two-colour ramp, cropped to fill `size`.
    Keeps the portrait on-brand instead of dropping a raw snapshot on the card."""
    w, h = size
    im = Image.open(src).convert("L")
    scale = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    left, top = (im.width - w) // 2, 0  # bias to the top: keep the head in frame
    im = im.crop((left, top, left + w, top + h))
    im = ImageOps.autocontrast(im, cutoff=1)
    return ImageOps.colorize(im, black=shadow, white=highlight)


def trimmed(img):
    """Crop the bleed away — the card exactly as it looks once cut.
    This is the version to use digitally (email signature, LinkedIn, decks).
    Sized from the trim dimensions so it lands on exactly 1050x600, not on
    whatever the rounded bleed offset happens to leave."""
    tw, th = int(TRIM_W * DPI), int(TRIM_H * DPI)
    x, y = (W - tw) // 2, (H - th) // 2
    return img.crop((x, y, x + tw, y + th))


def trim_guides(img):
    """Proof-only overlay showing the trim line and safe area."""
    p = img.copy()
    d = ImageDraw.Draw(p)
    d.rectangle([B, B, W - B - 1, H - B - 1], outline=(255, 0, 90), width=3)
    d.rectangle([M, M, W - M - 1, H - M - 1], outline=(0, 190, 255), width=2)
    return p


# ================================================================ CONCEPT A
# "Gradient Monogram" — same light ground, monogram and cyan->violet gradient
# as the live site. The cohesive choice.
def a_front(url):
    img = canvas(WHITE)
    d = ImageDraw.Draw(img)

    # monogram tile, top-left
    tile = 126
    tx, ty = M, M
    d.rounded_rectangle([tx, ty, tx + tile - 1, ty + tile - 1], radius=29,
                        fill=(246, 247, 253), outline=(223, 227, 241), width=3)
    grad_text(img, (tx + tile / 2, ty + tile / 2 + 3), "NS",
              font("space-grotesk", 56, 700), anchor="mm")

    # name + title — the visual centre of the card, with air above and below
    d.text((M, 356), NAME, font=font("space-grotesk", 84, 600), fill=INK, anchor="ls")
    d.text((M, 406), TITLE, font=font("inter", 29, 450), fill=MUTED, anchor="ls")

    # contact row
    mono = font("jetbrains-mono", 24, 400)
    d.text((M, BASE_1), f"{PHONE}  ·  {EMAIL}  ·  {CITY}",
           font=mono, fill=(72, 78, 94), anchor="ls")

    # full-bleed gradient foot — extends past the trim so a shifted cut is invisible
    img.paste(lin_grad(W, 26, BRAND), (0, H - 26))
    return img


def a_back(url):
    img = canvas(PAPER)
    d = ImageDraw.Draw(img)
    for gx in range(0, W, 54):
        d.line([(gx, 0), (gx, H)], fill=(236, 239, 247), width=2)
    for gy in range(0, H, 54):
        d.line([(0, gy), (W, gy)], fill=(236, 239, 247), width=2)

    grad_text(img, (W / 2, 262), "NS", font("space-grotesk", 178, 700), anchor="mm")
    d.text((W / 2, 420), TAG_1, font=font("inter", 30, 500), fill=INK, anchor="ms")
    d.text((W / 2, 464), TAG_2, font=font("inter", 30, 500), fill=INK, anchor="ms")
    d.text((W / 2, BASE_1), SITE, font=font("jetbrains-mono", 27, 500),
           fill=ELECTRIC, anchor="ms")

    qr = qr_image(url, QR_PX, "#171a22", "#f7f9fd")
    img.paste(qr, (W - M - QR_PX, M))
    return img


# ================================================================ CONCEPT B
# "Dark Signal" — MarTech voice. Deep ink, a data-signal line, services read
# like a capability readout.
def b_front(url):
    img = canvas(INK_DEEP)
    d = ImageDraw.Draw(img)

    # signal polyline, bottom right
    pts = [(0, 470), (150, 470), (215, 430), (275, 500), (350, 385),
           (440, 450), (545, 288), (635, 372), (720, 245), (840, 310),
           (930, 200), (1125, 235)]
    line = Image.new("L", (W, H), 0)
    ImageDraw.Draw(line).line(pts, fill=110, width=5, joint="curve")
    img.paste(lin_grad(W, H, [(0.0, CYAN), (0.6, ELECTRIC), (1.0, VIOLET)]), (0, 0), line)

    # Left spine, full-bleed: it runs off the canvas edge so a shifted cut
    # narrows it instead of slicing a floating bar in half.
    img.paste(lin_grad(64, H, BRAND, vertical=True), (0, 0))

    x = M + 34
    d.text((x, M + 96), "Nasser", font=font("space-grotesk", 88, 600), fill=WHITE, anchor="ls")
    d.text((x, M + 190), "Saleh", font=font("space-grotesk", 88, 600), fill=WHITE, anchor="ls")
    draw_tracked(d, (x, M + 246), "DIGITAL MARKETING · MARTECH",
                 font("jetbrains-mono", 22, 500), CYAN, 4.5)

    mono = font("jetbrains-mono", 23, 400)
    d.text((x, BASE_2), f"{PHONE} · {EMAIL}", font=mono, fill=(176, 183, 201), anchor="ls")
    d.text((x, BASE_1), f"{CITY} · {SITE}", font=mono, fill=(176, 183, 201), anchor="ls")
    return img


def b_back(url):
    img = canvas(INK_DEEP)
    d = ImageDraw.Draw(img)
    for gx in range(M, W - M, 26):
        for gy in range(M, H - M, 26):
            d.point((gx, gy), fill=(42, 47, 62))

    draw_tracked(d, (M, M + 34), "WHAT I RUN", font("jetbrains-mono", 21, 500), FAINT, 5)

    y = M + 96
    body = font("inter", 27, 420)
    for color, label in SERVICES:
        d.ellipse([M, y - 15, M + 15, y], fill=color)
        d.text((M + 34, y), label, font=body, fill=(226, 230, 240), anchor="ls")
        y += 54

    d.text((M, BASE_1), LINKEDIN, font=font("jetbrains-mono", 23, 400),
           fill=(140, 148, 168), anchor="ls")
    qr = qr_image(url, QR_PX, "#0d0f16", "#f4f6fb")
    img.paste(qr, (W - M - QR_PX, H - M - QR_PX))
    return img


# ================================================================ CONCEPT C
# "Editorial Ledger" — the quiet, premium consultant card. No gradients.
def c_front(url):
    img = canvas(CREAM)
    d = ImageDraw.Draw(img)
    d.line([(M, M + 30), (M + 96, M + 30)], fill=INDIGO_DK, width=4)

    d.text((M, 330), NAME, font=serif(84), fill=(34, 32, 40), anchor="ls")
    draw_tracked(d, (M, 386), "DIGITAL MARKETING · MARTECH",
                 font("inter", 23, 500), (110, 106, 120), 4)

    d.line([(M, BASE_1 - 62), (W - M, BASE_1 - 62)], fill=(216, 210, 198), width=2)
    small = font("inter", 26, 400)
    d.text((M, BASE_1), PHONE, font=small, fill=(96, 92, 106), anchor="ls")
    d.text((M + 296, BASE_1), EMAIL, font=small, fill=(96, 92, 106), anchor="ls")
    d.text((W - M, BASE_1), "Toronto", font=small, fill=INDIGO_DK, anchor="rs")
    return img


def c_back(url):
    img = canvas(CREAM)
    d = ImageDraw.Draw(img)
    cx, cy = W / 2, M + 74
    d.polygon([(cx, cy - 26), (cx + 26, cy), (cx, cy + 26), (cx - 26, cy)], fill=INDIGO_DK)

    d.text((cx, 372), TAG_1, font=serif(42), fill=(34, 32, 40), anchor="ms")
    d.text((cx, 430), TAG_2, font=serif(42), fill=(34, 32, 40), anchor="ms")
    draw_tracked(d, (cx, BASE_1), "SEO & GEO · AUTOMATION · ANALYTICS · WEB",
                 font("inter", 21, 500), (130, 125, 140), 3.4, anchor="ms")
    return img


# ================================================================ CONCEPT D
# "Bilingual" — English one side, Arabic the other. The card is the
# differentiator; hand it over either way up.
def d_side(url, arabic):
    img = canvas(INK)
    d = ImageDraw.Draw(img)
    img.paste(lin_grad(W, 90, BRAND), (0, 0))

    # frosted language chip, top-right (top-left on the Arabic side)
    chip_w, chip_h = 150, 46
    chip_x = W - M - chip_w if not arabic else M
    d.rounded_rectangle([chip_x, M + 40, chip_x + chip_w, M + 40 + chip_h],
                        radius=23, outline=(96, 104, 126), width=3)
    if arabic:
        f = font("noto-arabic", 25, 500)
        d.text((chip_x + chip_w / 2, M + 40 + chip_h / 2 + 2), shape("العربية"),
               font=f, fill=(198, 205, 222), anchor="mm")
    else:
        draw_tracked(d, (chip_x + chip_w / 2, M + 40 + chip_h / 2 + 9),
                     "ENGLISH", font("jetbrains-mono", 21, 500), (198, 205, 222), 3,
                     anchor="ms")

    if arabic:
        x = W - M
        d.text((x, 396), shape(AR_NAME), font=font("noto-arabic", 78, 600),
               fill=WHITE, anchor="rs")
        d.text((x, 452), shape(AR_TITLE), font=font("noto-arabic", 29, 400),
               fill=(174, 182, 203), anchor="rs")
        d.text((x, BASE_2), shape(AR_SERVICE), font=font("noto-arabic", 24, 400),
               fill=(140, 148, 170), anchor="rs")
        d.text((x, BASE_1), f"{PHONE} · {EMAIL}",
               font=font("jetbrains-mono", 23, 400), fill=(140, 148, 170), anchor="rs")
    else:
        d.text((M, 396), NAME, font=font("space-grotesk", 84, 600), fill=WHITE, anchor="ls")
        d.text((M, 452), TITLE, font=font("inter", 29, 420), fill=(174, 182, 203), anchor="ls")
        mono = font("jetbrains-mono", 23, 400)
        d.text((M, BASE_2), f"{PHONE} · {EMAIL}", font=mono, fill=(140, 148, 170), anchor="ls")
        d.text((M, BASE_1), f"{CITY_LONG} · {SITE}", font=mono, fill=(140, 148, 170), anchor="ls")

    qr = qr_image(url, QR_PX, "#171a22", "#f4f6fb")
    qx = M if arabic else W - M - QR_PX
    img.paste(qr, (qx, M + 118))
    return img


# ================================================================ CONCEPT E
# "Search Result" — the card IS the thing he sells. Front is an organic search
# listing; back is the AI answer that cites him. SEO on one side, GEO on the
# other. No real search engine is named or branded.
SERP_LINK = (26, 13, 171)
SERP_URL = (26, 115, 61)
SERP_BODY = (77, 81, 86)
SERP_HEAD = (32, 33, 36)


def e_front(url):
    img = canvas(WHITE)
    d = ImageDraw.Draw(img)

    # search field
    fx0, fy0, fx1, fy1 = M, M, W - M, M + 78
    d.rounded_rectangle([fx0, fy0, fx1, fy1], radius=39, outline=(223, 225, 229), width=3)
    cx, cy = fx0 + 46, (fy0 + fy1) / 2
    d.ellipse([cx - 13, cy - 13, cx + 13, cy + 13], outline=(140, 146, 156), width=4)
    d.line([(cx + 9, cy + 9), (cx + 19, cy + 19)], fill=(140, 146, 156), width=4)
    d.text((fx0 + 84, cy + 10), "digital marketing specialist toronto",
           font=font("inter", 28, 400), fill=SERP_BODY, anchor="ls")

    # result
    y = fy0 + 148
    chip = 34
    d.rounded_rectangle([M, y - chip + 4, M + chip, y + 4], radius=10, fill=(244, 245, 250),
                        outline=(226, 229, 240), width=2)
    grad_text(img, (M + chip / 2, y - chip / 2 + 5), "NS", font("space-grotesk", 18, 700), anchor="mm")
    d.text((M + chip + 16, y), SITE, font=font("inter", 24, 400), fill=SERP_URL, anchor="ls")

    d.text((M, y + 66), NAME + " — Digital Marketing", font=font("inter", 40, 400),
           fill=SERP_LINK, anchor="ls")
    d.text((M, y + 114), "& MarTech Specialist", font=font("inter", 40, 400),
           fill=SERP_LINK, anchor="ls")

    snippet = ("Toronto. SEO & GEO, paid search, GA4 analytics and the automation "
               "behind them. +100% traffic, −20% cost-per-click.")
    yy = y + 168
    for line in wrap(snippet, font("inter", 25, 400), W - 2 * M)[:2]:
        d.text((M, yy), line, font=font("inter", 25, 400), fill=SERP_BODY, anchor="ls")
        yy += 38

    d.text((W - M, BASE_1), f"{PHONE}  ·  {EMAIL}", font=font("jetbrains-mono", 21, 400),
           fill=(150, 156, 168), anchor="rs")
    return img


def e_back(url):
    img = canvas(WHITE)
    d = ImageDraw.Draw(img)

    # The panel stops well short of the bottom — the citation row and QR live
    # outside it, the way a real answer box separates body from sources.
    box = [M - 22, M - 14, W - M + 22, 408]
    d.rounded_rectangle(box, radius=26, fill=(250, 251, 255))
    grad_ring(img, box, radius=26, width=3)

    # sparkle mark + label
    sx, sy = M + 8, M + 26
    d.polygon([(sx, sy - 15), (sx + 5, sy - 5), (sx + 15, sy), (sx + 5, sy + 5),
               (sx, sy + 15), (sx - 5, sy + 5), (sx - 15, sy), (sx - 5, sy - 5)], fill=ELECTRIC)
    draw_tracked(d, (sx + 30, sy + 8), "AI ANSWER", font("jetbrains-mono", 20, 500), ELECTRIC, 4)

    body = font("inter", 28, 400)
    answer = ("Nasser Saleh is a Toronto digital marketer who builds and runs the technology "
              "behind growth — so campaigns launch, and get measured, without waiting on a dev team.")
    yy = M + 90
    for line in wrap(answer, body, W - 2 * M - 20)[:4]:
        d.text((M, yy), line, font=body, fill=SERP_HEAD, anchor="ls")
        yy += 42

    draw_tracked(d, (M, 470), "CITED SOURCE", font("jetbrains-mono", 18, 500), FAINT, 4)
    d.rounded_rectangle([M, 486, M + 250, 540], radius=27,
                        fill=WHITE, outline=(219, 223, 236), width=3)
    d.text((M + 26, 526), SITE, font=font("inter", 24, 500), fill=SERP_LINK, anchor="ls")

    img.paste(qr_image(url, QR_PX, "#202124", "#ffffff"), (W - M - QR_PX, 424))
    return img


# ================================================================ CONCEPT F
# "Tracked" — the joke is the proof. The QR really does carry UTM parameters,
# so scans of this card show up in his GA4 alongside every other channel.
def f_front(url):
    img = canvas((250, 250, 252))
    d = ImageDraw.Draw(img)
    # Tall enough that ~10px still shows after the bleed is trimmed off — a bar
    # thinner than the bleed would simply disappear on the cut card.
    img.paste(lin_grad(W, B + 10, BRAND), (0, 0))

    draw_tracked(d, (M, M + 40), "MEASURED, LIKE EVERYTHING ELSE I RUN",
                 font("jetbrains-mono", 20, 500), FAINT, 4.2)

    mono_b = font("jetbrains-mono", 44, 600)
    mono_q = font("jetbrains-mono", 44, 400)
    d.text((M, M + 148), SITE, font=mono_b, fill=INK, anchor="ls")
    x = M + mono_b.getlength(SITE)
    d.text((x, M + 148), "/?", font=mono_q, fill=(178, 184, 198), anchor="ls")

    q = font("jetbrains-mono", 30, 400)
    for i, (k, v) in enumerate([("utm_source", "card"), ("utm_medium", "print"),
                                ("utm_campaign", "f")]):
        yy = M + 216 + i * 46
        d.text((M + 26, yy), k, font=q, fill=(126, 133, 150), anchor="ls")
        xk = M + 26 + q.getlength(k)
        d.text((xk, yy), "=", font=q, fill=(190, 195, 208), anchor="ls")
        d.text((xk + q.getlength("="), yy), v, font=q, fill=ELECTRIC, anchor="ls")

    d.text((M, BASE_1), f"{NAME}  ·  {TITLE}", font=font("inter", 25, 450),
           fill=MUTED, anchor="ls")
    return img


def f_back(url):
    img = canvas(INK_DEEP)
    d = ImageDraw.Draw(img)

    qs = 268
    img.paste(qr_image(url, qs, "#0d0f16", "#ffffff"), (M, (H - qs) // 2))

    tx = M + qs + 54
    d.text((tx, 250), "Scan it.", font=font("space-grotesk", 54, 600), fill=WHITE, anchor="ls")
    body = font("inter", 26, 400)
    yy = 306
    for line in wrap("It lands in my analytics next to every other channel. That is the whole point.",
                     body, W - M - tx)[:3]:
        d.text((tx, yy), line, font=body, fill=(168, 176, 196), anchor="ls")
        yy += 38

    d.text((tx, BASE_1), f"{PHONE} · {EMAIL}", font=font("jetbrains-mono", 21, 400),
           fill=(122, 130, 150), anchor="ls")
    return img


# ================================================================ CONCEPT G
# "Portrait" — vertical, and the only card with his face on it. In a stack of
# landscape cards, the orientation alone does half the work.
GW = int((TRIM_H + 2 * BLEED) * DPI)   # 675 — portrait swaps the axes
GH = int((TRIM_W + 2 * BLEED) * DPI)   # 1125
GM = B + int(SAFE * DPI)


def g_front(url):
    img = Image.new("RGB", (GW, GH), INK_DEEP)
    photo_h = 720
    img.paste(duotone(ROOT / "public" / "assets" / "headshot.jpg",
                      shadow=(11, 13, 20), highlight=(150, 214, 245), size=(GW, photo_h)), (0, 0))

    # fade the photo into the panel below it
    fade_h = 190
    fade = lin_grad(GW, fade_h, [(0.0, INK_DEEP), (1.0, INK_DEEP)], vertical=True)
    mask = Image.new("L", (GW, fade_h))
    mp = mask.load()
    for y in range(fade_h):
        for x in range(0, GW, 1):
            mp[x, y] = int(255 * (y / (fade_h - 1)) ** 1.5)
    img.paste(fade, (0, photo_h - fade_h), mask)

    d = ImageDraw.Draw(img)
    img.paste(lin_grad(GW, 7, BRAND), (0, photo_h - 4))

    d.text((GM, photo_h + 96), "Nasser", font=font("space-grotesk", 74, 600), fill=WHITE, anchor="ls")
    d.text((GM, photo_h + 176), "Saleh", font=font("space-grotesk", 74, 600), fill=WHITE, anchor="ls")
    draw_tracked(d, (GM, photo_h + 226), "DIGITAL MARKETING · MARTECH",
                 font("jetbrains-mono", 19, 500), CYAN, 3.4)

    mono = font("jetbrains-mono", 21, 400)
    d.text((GM, GH - GM - 46), PHONE, font=mono, fill=(160, 168, 188), anchor="ls")
    d.text((GM, GH - GM - 8), EMAIL, font=mono, fill=(160, 168, 188), anchor="ls")
    return img


def g_back(url):
    img = Image.new("RGB", (GW, GH), WHITE)
    d = ImageDraw.Draw(img)
    img.paste(lin_grad(GW, B + 10, BRAND), (0, 0))  # survives the trim; see f_front

    grad_text(img, (GW / 2, 250), "NS", font("space-grotesk", 150, 700), anchor="mm")

    d.text((GW / 2, 400), TAG_1, font=font("inter", 27, 500), fill=INK, anchor="ms")
    d.text((GW / 2, 442), TAG_2, font=font("inter", 27, 500), fill=INK, anchor="ms")

    y = 540
    for color, label in SERVICES:
        d.ellipse([GM, y - 13, GM + 13, y], fill=color)
        for i, line in enumerate(wrap(label, font("inter", 24, 420), GW - 2 * GM - 30)):
            d.text((GM + 30, y + i * 34), line, font=font("inter", 24, 420),
                   fill=MUTED, anchor="ls")
        y += 34 * max(1, len(wrap(label, font("inter", 24, 420), GW - 2 * GM - 30))) + 22

    img.paste(qr_image(url, QR_PX, "#171a22", "#ffffff"), ((GW - QR_PX) // 2, GH - GM - QR_PX - 44))
    d.text((GW / 2, GH - GM - 8), SITE, font=font("jetbrains-mono", 24, 500),
           fill=ELECTRIC, anchor="ms")
    return img


# ================================================================ CONCEPT H
# "One Number" — the loudest card in the box. The front is a single result at
# poster scale; everything that qualifies it moves to the back.
def h_front(url):
    img = canvas(WHITE)
    d = ImageDraw.Draw(img)
    grad_text(img, (W / 2, H / 2 - 18), "+100%", font("space-grotesk", 250, 700), anchor="mm")
    draw_tracked(d, (W / 2, BASE_1), "WEBSITE TRAFFIC  ·  GLOBALDWS  ·  12 MONTHS",
                 font("jetbrains-mono", 20, 500), MUTED, 4, anchor="ms")
    return img


def h_back(url):
    img = canvas(INK_DEEP)
    d = ImageDraw.Draw(img)

    d.text((M, M + 62), NAME, font=font("space-grotesk", 62, 600), fill=WHITE, anchor="ls")
    d.text((M, M + 110), TITLE, font=font("inter", 26, 420), fill=(166, 174, 194), anchor="ls")

    rows = [("+40%", "SEO traffic, 5 months"), ("−20%", "cost-per-click, paid search"),
            ("+20%", "campaign ROI")]
    y = M + 192
    num = font("space-grotesk", 40, 600)
    lab = font("inter", 24, 400)
    for metric, label in rows:
        d.text((M, y), metric, font=num, fill=CYAN, anchor="ls")
        d.text((M + 132, y), label, font=lab, fill=(150, 158, 178), anchor="ls")
        y += 56

    mono = font("jetbrains-mono", 21, 400)
    d.text((M, BASE_2), f"{PHONE} · {EMAIL}", font=mono, fill=(132, 140, 160), anchor="ls")
    d.text((M, BASE_1), f"{CITY} · {SITE}", font=mono, fill=(132, 140, 160), anchor="ls")
    img.paste(qr_image(url, QR_PX, "#0d0f16", "#f4f6fb"), (W - M - QR_PX, H - M - QR_PX))
    return img


# ================================================================ CONCEPT I
# "Keyword Field" — the card is a wall of the things people actually type into
# a search box, and his name is the part that lights up inside it. Literal, for
# someone whose job is being the answer in that noise.


def _field(img, color, size=17, lh=25):
    """Fill the whole card with running search queries."""
    d = ImageDraw.Draw(img)
    f = font("jetbrains-mono", size, 400)
    i = 0
    y = 8
    while y < img.height:
        line, x = "", 0
        # each row starts further into the list, so columns never line up
        while x < img.width + 240:
            q = QUERIES[i % len(QUERIES)]
            line += q + "   ·   "
            x = f.getlength(line)
            i += 1
        d.text((-((i * 37) % 190), y), line, font=f, fill=color, anchor="ls")
        y += lh
        i += 3
    return img


def i_front(url):
    img = canvas(INK_DEEP)
    _field(img, (44, 50, 66))                    # the noise

    # Inside the letters everything inverts: bright gradient ground with the
    # very same query text knocked out of it. _field is deterministic, so the
    # lines run straight through the letterforms and flip polarity at the edge
    # — which is what makes the name read hard instead of glowing vaguely.
    letters = lin_grad(W, H, BRAND)
    _field(letters, INK_DEEP)

    mask = Image.new("L", (W, H), 0)
    md = ImageDraw.Draw(mask)
    nf = font("space-grotesk", 176, 700)
    md.text((M, 306), "NASSER", font=nf, fill=255, anchor="ls")
    md.text((M, 476), "SALEH", font=nf, fill=255, anchor="ls")
    img.paste(letters, (0, 0), mask)

    d = ImageDraw.Draw(img)
    draw_tracked(d, (M, BASE_1), "THE ANSWER IN THE NOISE",
                 font("jetbrains-mono", 19, 500), (128, 136, 156), 4)
    return img


def i_back(url):
    img = canvas(INK_DEEP)
    d = ImageDraw.Draw(img)
    _field(img, (28, 33, 44))

    panel = [M - 26, 150, W - M + 26, 470]
    d.rounded_rectangle(panel, radius=8, fill=(16, 19, 27), outline=(48, 54, 70), width=2)

    d.text((M, 246), NAME, font=font("space-grotesk", 58, 600), fill=WHITE, anchor="ls")
    d.text((M, 296), TITLE, font=font("inter", 26, 420), fill=(168, 176, 196), anchor="ls")
    mono = font("jetbrains-mono", 22, 400)
    d.text((M, 376), f"{PHONE} · {EMAIL}", font=mono, fill=(140, 148, 170), anchor="ls")
    d.text((M, 418), f"{CITY} · {SITE}", font=mono, fill=(140, 148, 170), anchor="ls")

    img.paste(qr_image(url, QR_PX, "#101319", "#f4f6fb"), (W - M - QR_PX, 296))
    return img


# ================================================================ CONCEPT J
# "Scan Me" — the QR stops being a footnote and becomes the card. Error
# correction level H is what lets the monogram sit in the middle of it.
def qr_knockout(data, size, fg, bg, label=None):
    """High-redundancy QR with an optional knocked-out centre. border=4 keeps
    the mandatory quiet zone inside the image, so it survives any background."""
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H,
                      box_size=10, border=4)
    q.add_data(data)
    q.make(fit=True)
    img = q.make_image(fill_color=fg, back_color=bg).convert("RGB").resize(
        (size, size), Image.NEAREST)
    if label:
        d = ImageDraw.Draw(img)
        bw, bh = int(size * 0.30), int(size * 0.30)
        x, y = (size - bw) // 2, (size - bh) // 2
        d.rounded_rectangle([x, y, x + bw, y + bh], radius=int(bw * 0.18), fill=bg)
        d.rounded_rectangle([x, y, x + bw, y + bh], radius=int(bw * 0.18),
                            outline=fg, width=max(2, size // 90))
        d.text((size / 2, size / 2 + int(size * 0.045)), label,
               font=font("space-grotesk", int(size * 0.15), 700), fill=fg, anchor="mm")
    return img


def j_front(url):
    img = canvas(WHITE)
    d = ImageDraw.Draw(img)

    qs = 470
    img.paste(qr_knockout(url, qs, "#12141b", "#ffffff", label="NS"), (M - 14, (H - qs) // 2))

    x = M + qs + 34
    d.text((x, 250), "Scan", font=font("space-grotesk", 96, 600), fill=INK, anchor="ls")
    d.text((x, 344), "me.", font=font("space-grotesk", 96, 600), fill=ELECTRIC, anchor="ls")
    d.text((x, 404), TITLE, font=font("inter", 23, 450), fill=MUTED, anchor="ls")
    mono = font("jetbrains-mono", 21, 400)
    d.text((x, BASE_2), f"{NAME} · {PHONE}", font=mono, fill=(110, 118, 136), anchor="ls")
    d.text((x, BASE_1), f"{EMAIL}", font=mono, fill=(110, 118, 136), anchor="ls")
    return img


def j_back(url):
    img = canvas(INK_DEEP)
    img.paste(lin_grad(W, H, BRAND), (0, 0))
    d = ImageDraw.Draw(img)
    d.text((M, 300), TAG_1, font=font("space-grotesk", 62, 600), fill=WHITE, anchor="ls")
    d.text((M, 376), TAG_2, font=font("space-grotesk", 62, 600), fill=(255, 255, 255), anchor="ls")
    mono = font("jetbrains-mono", 22, 500)
    d.text((M, BASE_1), f"{EMAIL} · {SITE}", font=mono, fill=(255, 255, 255), anchor="ls")
    return img


# ================================================================ CONCEPT K
# "The Audit" — the card does a job instead of sitting in a drawer. Four
# questions a business owner cannot answer comfortably, and every unticked box
# is the reason to call him.


def k_front(url):
    img = canvas((252, 252, 250))
    d = ImageDraw.Draw(img)

    draw_tracked(d, (M, M + 32), "TICK WHAT'S TRUE OF YOUR MARKETING",
                 font("jetbrains-mono", 19, 500), (128, 132, 142), 3.6)

    y = M + 112
    body = font("inter", 26, 420)
    for line in CHECKS:
        d.rounded_rectangle([M, y - 26, M + 30, y + 4], radius=4,
                            outline=(150, 156, 168), width=3)
        d.text((M + 52, y), line, font=body, fill=(38, 40, 48), anchor="ls")
        y += 76

    d.line([(M, BASE_1 - 46), (W - M, BASE_1 - 46)], fill=(220, 222, 228), width=2)
    d.text((M, BASE_1), "Any box empty? That's the conversation.",
           font=font("inter", 24, 500), fill=ELECTRIC, anchor="ls")
    d.text((W - M, BASE_1), NAME, font=font("jetbrains-mono", 21, 500),
           fill=(120, 126, 138), anchor="rs")
    return img


def k_back(url):
    img = canvas(INK_DEEP)
    d = ImageDraw.Draw(img)

    d.text((M, M + 74), "I fix the", font=font("space-grotesk", 58, 600), fill=WHITE, anchor="ls")
    d.text((M, M + 142), "empty boxes.", font=font("space-grotesk", 58, 600), fill=CYAN, anchor="ls")

    d.text((M, M + 208), TITLE, font=font("inter", 25, 420), fill=(170, 178, 198), anchor="ls")

    mono = font("jetbrains-mono", 22, 400)
    d.text((M, BASE_2), f"{PHONE} · {EMAIL}", font=mono, fill=(140, 148, 170), anchor="ls")
    d.text((M, BASE_1), f"{CITY} · {SITE}", font=mono, fill=(140, 148, 170), anchor="ls")
    img.paste(qr_image(url, QR_PX, "#0d0f16", "#f4f6fb"), (W - M - QR_PX, H - M - QR_PX))
    return img


# ================================================================ CONCEPT L
# "The Receipt" — itemised, totalled, and free. The format is the argument:
# this is someone who prices, tracks and reports on everything.
def _dashes(d, y, x0, x1, color, dash=9, gap=8, width=2):
    x = x0
    while x < x1:
        d.line([(x, y), (min(x + dash, x1), y)], fill=color, width=width)
        x += dash + gap


def l_front(url):
    img = canvas((253, 252, 248))
    d = ImageDraw.Draw(img)
    ink = (36, 36, 40)
    faint = (150, 150, 156)

    x0, x1 = M, W - M
    mono = font("jetbrains-mono", 23, 400)
    monob = font("jetbrains-mono", 27, 600)

    draw_tracked(d, (W / 2, M + 34), "NASSER SALEH", monob, ink, 6, anchor="ms")
    draw_tracked(d, (W / 2, M + 68), "DIGITAL MARKETING & MARTECH",
                 font("jetbrains-mono", 17, 400), faint, 3.4, anchor="ms")

    _dashes(d, M + 96, x0, x1, (196, 196, 200))

    items = [("1", "SEO & GEO"), ("1", "PAID SEARCH & SOCIAL"),
             ("1", "ANALYTICS & TRACKING"), ("1", "AUTOMATION & FUNNELS")]
    y = M + 136
    for qty, name in items:
        d.text((x0, y), qty, font=mono, fill=faint, anchor="ls")
        d.text((x0 + 40, y), name, font=mono, fill=ink, anchor="ls")
        dots_from = x0 + 40 + mono.getlength(name) + 14
        _dashes(d, y - 7, dots_from, x1 - 92, (214, 214, 218), dash=3, gap=7, width=2)
        d.text((x1, y), "incl.", font=mono, fill=faint, anchor="rs")
        y += 42

    _dashes(d, y + 8, x0, x1, (196, 196, 200))
    d.text((x0, y + 54), "TOTAL", font=monob, fill=ink, anchor="ls")
    d.text((x1, y + 54), "ONE CONVERSATION", font=monob, fill=ELECTRIC, anchor="rs")

    _dashes(d, y + 78, x0, x1, (196, 196, 200))
    draw_tracked(d, (W / 2, BASE_1), f"{PHONE}   ·   {SITE}",
                 font("jetbrains-mono", 19, 400), faint, 2.6, anchor="ms")
    return img


def l_back(url):
    img = canvas((253, 252, 248))
    d = ImageDraw.Draw(img)
    ink = (36, 36, 40)
    faint = (150, 150, 156)
    x0, x1 = M, W - M

    draw_tracked(d, (W / 2, M + 40), "MERCHANT COPY",
                 font("jetbrains-mono", 19, 500), faint, 5, anchor="ms")
    _dashes(d, M + 64, x0, x1, (196, 196, 200))

    rows = [("TRAFFIC", "+100%"), ("SEO TRAFFIC", "+40%"),
            ("COST PER CLICK", "−20%"), ("CAMPAIGN ROI", "+20%")]
    mono = font("jetbrains-mono", 23, 400)
    monob = font("jetbrains-mono", 23, 600)
    y = M + 108
    for label, val in rows:
        d.text((x0, y), label, font=mono, fill=ink, anchor="ls")
        d.text((x1 - 210, y), val, font=monob, fill=ELECTRIC, anchor="rs")
        y += 40

    _dashes(d, y + 6, x0, x1, (196, 196, 200))
    draw_tracked(d, (x0, y + 56), "PAID IN FULL, IN RESULTS",
                 font("jetbrains-mono", 19, 500), ink, 2.4)
    draw_tracked(d, (x0, y + 96), EMAIL, font("jetbrains-mono", 19, 400), faint, 2)
    _dashes(d, y + 128, x0, x1, (196, 196, 200))
    draw_tracked(d, (W / 2, BASE_1), f"THANK YOU   ·   {SITE}",
                 font("jetbrains-mono", 19, 400), faint, 2.6, anchor="ms")
    img.paste(qr_image(url, QR_PX, "#242428", "#fdfcf8"), (x1 - QR_PX, M + 84))
    return img


# ================================================================ build
def d_side_front(url):
    return d_side(url, False)


def d_side_back(url):
    return d_side(url, True)


CONCEPTS = [
    ("A-gradient-monogram", "Gradient Monogram", a_front, a_back),
    ("B-dark-signal",       "Dark Signal",       b_front, b_back),
    ("C-editorial-ledger",  "Editorial Ledger",  c_front, c_back),
    ("D-bilingual",         "Bilingual EN / AR", d_side_front, d_side_back),
    ("E-search-result",     "Search Result",     e_front, e_back),
    ("F-tracked",           "Tracked",           f_front, f_back),
    ("G-portrait",          "Portrait",          g_front, g_back),
    ("H-one-number",        "One Number",        h_front, h_back),
    ("I-keyword-field",     "Keyword Field",     i_front, i_back),
    ("J-scan-me",           "Scan Me",           j_front, j_back),
    ("K-the-audit",         "The Audit",         k_front, k_back),
    ("L-the-receipt",       "The Receipt",       l_front, l_back),
]

# Concept G is the only vertical card, so it needs its own trim geometry.
PORTRAIT = {"G-portrait"}


def crop_for(slug, img):
    """Crop to the trim box using whichever orientation this concept uses."""
    tw, th = (int(TRIM_H * DPI), int(TRIM_W * DPI)) if slug in PORTRAIT \
        else (int(TRIM_W * DPI), int(TRIM_H * DPI))
    x, y = (img.width - tw) // 2, (img.height - th) // 2
    return img.crop((x, y, x + tw, y + th))


def save_png(img, path):
    """Photographic cards (the duotone portrait) carry a couple of thousand
    colours and balloon as truecolour PNG. Palette them — a duotone ramp fits
    inside 256 entries with no visible loss. Flat/gradient art is left alone,
    where paletting would band. The print PDFs always keep full colour."""
    colors = img.getcolors(1 << 16)
    if colors is None or len(colors) > 1200:
        img = img.quantize(colors=256, method=Image.MEDIANCUT,
                           dither=Image.FLOYDSTEINBERG)
    img.save(path, dpi=(DPI, DPI), optimize=True)


def guides_for(img):
    """Proof-only overlay showing the trim line and safe area, any orientation."""
    p = img.copy()
    d = ImageDraw.Draw(p)
    d.rectangle([B, B, img.width - B - 1, img.height - B - 1], outline=(255, 0, 90), width=3)
    d.rectangle([M, M, img.width - M - 1, img.height - M - 1], outline=(0, 190, 255), width=2)
    return p


def main():
    ensure_fonts()
    problems = check_coverage()
    if problems:
        raise SystemExit("Missing glyphs:\n  " + "\n  ".join(problems))

    proofs = []
    for slug, label, mk_front, mk_back in CONCEPTS:
        url = card_url(slug)
        front, back = mk_front(url), mk_back(url)

        pdf = OUT / f"nasser-saleh-card-{slug}.pdf"
        front.save(pdf, "PDF", resolution=DPI, save_all=True, append_images=[back])

        # Digital use: cropped to the trim, so there is no bleed hanging off.
        for side, im in (("front", front), ("back", back)):
            save_png(crop_for(slug, im), OUT / f"{slug}-{side}.png")
        proofs.append((label, guides_for(front), guides_for(back)))
        print(f"{label:22} -> {pdf.name}   {front.width}x{front.height}")

    # contact sheet: every concept, front and back, with trim + safe guides
    scale = 0.4
    colw, rowh = int(W * scale), int(GH * scale)   # tallest card sets the row
    pad, gap, head, foot = 46, 30, 54, 70
    sheet_w = pad * 2 + colw * 2 + gap
    sheet_h = pad + len(proofs) * (head + rowh + gap) + foot
    sheet = Image.new("RGB", (sheet_w, sheet_h), (238, 240, 246))
    sd = ImageDraw.Draw(sheet)
    y = pad
    for label, f_img, b_img in proofs:
        sd.text((pad, y + 14), label, font=font("space-grotesk", 30, 600), fill=INK, anchor="ls")
        sd.text((pad + colw + gap, y + 14), "back", font=font("inter", 24, 400),
                fill=MUTED, anchor="ls")
        y += head
        for i, im in enumerate((f_img, b_img)):
            k = min(colw / im.width, rowh / im.height)
            w2, h2 = int(im.width * k), int(im.height * k)
            sheet.paste(im.resize((w2, h2), Image.LANCZOS),
                        (pad + i * (colw + gap) + (colw - w2) // 2, y))
        y += rowh + gap
    sd.text((pad, sheet_h - foot + 30),
            "pink = trim line   ·   blue = safe area   ·   art extends past trim = bleed",
            font=font("inter", 24, 400), fill=MUTED, anchor="ls")
    sheet.save(OUT / "ALL-concepts-proof.png")
    print(f"\ncontact sheet -> ALL-concepts-proof.png ({sheet_w}x{sheet_h})")


if __name__ == "__main__":
    main()
