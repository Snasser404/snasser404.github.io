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
from PIL import Image, ImageDraw, ImageFont

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
              TAG_1, TAG_2, *(s for _, s in SERVICES)):
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


QR_PX = 126  # 0.42in at 300dpi — comfortably above the ~0.4in scan floor


def qr_image(data, size, fg, bg):
    # Level L keeps the module count low, so each cell stays large enough to
    # scan at this physical size.
    q = qrcode.QRCode(version=None, box_size=10, border=0,
                      error_correction=qrcode.constants.ERROR_CORRECT_L)
    q.add_data(data)
    q.make(fit=True)
    img = q.make_image(fill_color=fg, back_color=bg).convert("RGB")
    return img.resize((size, size), Image.NEAREST)


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
def a_front():
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


def a_back():
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

    qr = qr_image(f"https://{SITE}", QR_PX, "#171a22", "#f7f9fd")
    img.paste(qr, (W - M - QR_PX, M))
    return img


# ================================================================ CONCEPT B
# "Dark Signal" — MarTech voice. Deep ink, a data-signal line, services read
# like a capability readout.
def b_front():
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


def b_back():
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
    qr = qr_image(f"https://{SITE}", QR_PX, "#e6eaf4", "#0d0f16")
    img.paste(qr, (W - M - QR_PX, H - M - QR_PX))
    return img


# ================================================================ CONCEPT C
# "Editorial Ledger" — the quiet, premium consultant card. No gradients.
def c_front():
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


def c_back():
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
def d_side(arabic):
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

    qr = qr_image(f"https://{SITE}", QR_PX, "#e8ecf6", "#171a22")
    qx = M if arabic else W - M - QR_PX
    img.paste(qr, (qx, M + 118))
    return img


# ================================================================ build
CONCEPTS = [
    ("A-gradient-monogram", "Gradient Monogram", a_front, a_back),
    ("B-dark-signal",       "Dark Signal",       b_front, b_back),
    ("C-editorial-ledger",  "Editorial Ledger",  c_front, c_back),
    ("D-bilingual",         "Bilingual EN / AR", lambda: d_side(False), lambda: d_side(True)),
]


def main():
    ensure_fonts()
    problems = check_coverage()
    if problems:
        raise SystemExit("Missing glyphs:\n  " + "\n  ".join(problems))

    proofs = []
    for slug, label, mk_front, mk_back in CONCEPTS:
        front, back = mk_front(), mk_back()

        pdf = OUT / f"nasser-saleh-card-{slug}.pdf"
        front.save(pdf, "PDF", resolution=DPI, save_all=True, append_images=[back])

        front.save(OUT / f"{slug}-front.png", dpi=(DPI, DPI))
        back.save(OUT / f"{slug}-back.png", dpi=(DPI, DPI))
        proofs.append((label, trim_guides(front), trim_guides(back)))
        print(f"{label:22} -> {pdf.name}")

    # contact sheet: every concept, front and back, with trim + safe guides
    scale = 0.46
    cw, ch = int(W * scale), int(H * scale)
    pad, gap, head, foot = 46, 30, 54, 70
    sheet_w = pad * 2 + cw * 2 + gap
    sheet_h = pad + len(proofs) * (head + ch + gap) + foot
    sheet = Image.new("RGB", (sheet_w, sheet_h), (238, 240, 246))
    sd = ImageDraw.Draw(sheet)
    y = pad
    for label, f_img, b_img in proofs:
        sd.text((pad, y + 14), label, font=font("space-grotesk", 30, 600), fill=INK, anchor="ls")
        sd.text((pad + cw + gap, y + 14), "back", font=font("inter", 24, 400),
                fill=MUTED, anchor="ls")
        y += head
        sheet.paste(f_img.resize((cw, ch), Image.LANCZOS), (pad, y))
        sheet.paste(b_img.resize((cw, ch), Image.LANCZOS), (pad + cw + gap, y))
        y += ch + gap
    sd.text((pad, sheet_h - foot + 30),
            "pink = trim line   ·   blue = safe area   ·   art extends past trim = bleed",
            font=font("inter", 24, 400), fill=MUTED, anchor="ls")
    sheet.save(OUT / "ALL-concepts-proof.png")
    print(f"\ncontact sheet         -> ALL-concepts-proof.png  ({sheet_w}x{sheet_h})")
    print(f"card canvas {W}x{H}px @ {DPI}dpi = {TRIM_W + 2 * BLEED}x{TRIM_H + 2 * BLEED}in with bleed")


if __name__ == "__main__":
    main()
