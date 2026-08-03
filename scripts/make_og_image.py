# Generates public/assets/og-image.png (1200x630) — the social preview card
# shown when nassersaleh.ca is pasted into LinkedIn, email, Slack, WhatsApp.
# Run:  python scripts/make_og_image.py
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
OUT = os.path.join("public", "assets", "og-image.png")

INK = (15, 23, 42)
MUTED = (74, 85, 104)
CYAN = (8, 145, 178)
INDIGO = (79, 70, 229)
VIOLET = (124, 58, 237)
CARD = (255, 255, 255)


def font(names, size, bold=False):
    base = r"C:\Windows\Fonts"
    cands = names + (["segoeuib.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"])
    for n in cands:
        p = n if os.path.isabs(n) else os.path.join(base, n)
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except OSError:
                pass
    return ImageFont.load_default()


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


img = Image.new("RGB", (W, H), (245, 247, 252))
d = ImageDraw.Draw(img)

# soft diagonal wash so the card doesn't read as flat white
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=lerp((246, 248, 253), (233, 237, 249), t))

# corner glow (accent, very light)
glow = Image.new("RGB", (W, H), (246, 248, 253))
gd = ImageDraw.Draw(glow)
gd.ellipse([W - 520, -300, W + 220, 380], fill=(222, 226, 250))
gd.ellipse([-260, H - 300, 320, H + 220], fill=(219, 238, 245))
img = Image.blend(img, glow, 0.55)
d = ImageDraw.Draw(img)

# top accent bar (brand gradient)
for x in range(W):
    t = x / W
    c = lerp(CYAN, INDIGO, t * 2) if t < 0.5 else lerp(INDIGO, VIOLET, (t - 0.5) * 2)
    d.line([(x, 0), (x, 10)], fill=c)

PAD = 82

# monogram tile
box = [PAD, 118, PAD + 96, 214]
d.rounded_rectangle(box, radius=26, fill=CARD, outline=(224, 228, 240), width=2)
f_mono = font(["seguisb.ttf"], 44, bold=True)
mw = d.textbbox((0, 0), "NS", font=f_mono)
d.text((box[0] + (96 - (mw[2] - mw[0])) / 2, box[1] + (96 - (mw[3] - mw[1])) / 2 - 6),
       "NS", font=f_mono, fill=INDIGO)

# name
f_name = font(["segoeuib.ttf"], 92, bold=True)
d.text((PAD, 246), "Nasser Saleh", font=f_name, fill=INK)

# role
f_role = font(["seguisb.ttf"], 39, bold=True)
d.text((PAD, 352), "Digital Marketing & MarTech Specialist", font=f_role, fill=INDIGO)

# supporting line
f_sub = font(["segoeui.ttf"], 29)
d.text((PAD, 408), "Campaigns, analytics, and the marketing technology behind them.",
       font=f_sub, fill=MUTED)

# capability chips
f_chip = font(["seguisb.ttf"], 24, bold=True)
x = PAD
for label in ["SEO & GEO", "GA4 & Analytics", "Marketing Automation", "Websites"]:
    tb = d.textbbox((0, 0), label, font=f_chip)
    w = tb[2] - tb[0]
    d.rounded_rectangle([x, 472, x + w + 40, 524], radius=26, fill=CARD,
                        outline=(214, 220, 238), width=2)
    d.text((x + 20, 484), label, font=f_chip, fill=(60, 68, 92))
    x += w + 40 + 14

# footer: domain + location
f_dom = font(["seguisb.ttf"], 27, bold=True)
d.text((PAD, 566), "nassersaleh.ca", font=f_dom, fill=INDIGO)
f_loc = font(["segoeui.ttf"], 25)
loc = "Toronto, Canada  ·  EN / AR"
lb = d.textbbox((0, 0), loc, font=f_loc)
d.text((W - PAD - (lb[2] - lb[0]), 568), loc, font=f_loc, fill=MUTED)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT, "PNG", optimize=True)
print(f"WROTE {OUT}  ({os.path.getsize(OUT)/1024:.0f} KB, {W}x{H})")
