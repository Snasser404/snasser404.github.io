# Generates public/assets/og-image.png (1200x630) — the social preview card
# shown when nassersaleh.ca is pasted into LinkedIn, email, Slack, WhatsApp.
# Uses public/assets/headshot.jpg if present (a face lifts click-through a lot).
# Run:  python scripts/make_og_image.py
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
OUT = os.path.join("public", "assets", "og-image.png")
HEADSHOT = os.path.join("public", "assets", "headshot.jpg")

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


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for wd in words:
        trial = (cur + " " + wd).strip()
        if draw.textbbox((0, 0), trial, font=fnt)[2] <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = wd
    if cur:
        lines.append(cur)
    return lines


img = Image.new("RGB", (W, H), (245, 247, 252))
d = ImageDraw.Draw(img)

for y in range(H):
    d.line([(0, y), (W, y)], fill=lerp((246, 248, 253), (233, 237, 249), y / H))

glow = Image.new("RGB", (W, H), (246, 248, 253))
gd = ImageDraw.Draw(glow)
gd.ellipse([W - 560, -320, W + 240, 400], fill=(222, 226, 250))
gd.ellipse([-260, H - 300, 320, H + 220], fill=(219, 238, 245))
img = Image.blend(img, glow, 0.55)
d = ImageDraw.Draw(img)

# top accent bar (brand gradient)
for x in range(W):
    t = x / W
    c = lerp(CYAN, INDIGO, t * 2) if t < 0.5 else lerp(INDIGO, VIOLET, (t - 0.5) * 2)
    d.line([(x, 0), (x, 10)], fill=c)

PAD = 82
has_photo = os.path.exists(HEADSHOT)
TEXT_W = 680 if has_photo else 1000

# ---- headshot, circular, right side ----
if has_photo:
    D = 330
    cx, cy = W - PAD - D // 2, H // 2 + 8
    photo = Image.open(HEADSHOT).convert("RGB")
    s = min(photo.size)
    photo = photo.crop(((photo.width - s) // 2, (photo.height - s) // 2,
                        (photo.width - s) // 2 + s, (photo.height - s) // 2 + s))
    photo = photo.resize((D, D), Image.LANCZOS)

    mask = Image.new("L", (D * 4, D * 4), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, D * 4, D * 4], fill=255)
    mask = mask.resize((D, D), Image.LANCZOS)

    # soft ring behind the photo
    d.ellipse([cx - D // 2 - 9, cy - D // 2 - 9, cx + D // 2 + 9, cy + D // 2 + 9], fill=CARD)
    img.paste(photo, (cx - D // 2, cy - D // 2), mask)
    d.ellipse([cx - D // 2 - 1, cy - D // 2 - 1, cx + D // 2 + 1, cy + D // 2 + 1],
              outline=(214, 220, 238), width=3)

# ---- text block ----
y = 168 if has_photo else 246

f_name = font(["segoeuib.ttf"], 84 if has_photo else 92, bold=True)
d.text((PAD, y), "Nasser Saleh", font=f_name, fill=INK)
y += 104

f_role = font(["seguisb.ttf"], 34 if has_photo else 39, bold=True)
for line in wrap(d, "Digital Marketing & MarTech Specialist", f_role, TEXT_W):
    d.text((PAD, y), line, font=f_role, fill=INDIGO)
    y += 44
y += 8

f_sub = font(["segoeui.ttf"], 27)
for line in wrap(d, "Campaigns, analytics, and the marketing technology behind them.", f_sub, TEXT_W):
    d.text((PAD, y), line, font=f_sub, fill=MUTED)
    y += 36
y += 18

# capability chips (wrap within the text column)
f_chip = font(["seguisb.ttf"], 22, bold=True)
x = PAD
for label in ["SEO & GEO", "GA4 & Analytics", "Marketing Automation", "Websites"]:
    tw = d.textbbox((0, 0), label, font=f_chip)[2]
    if x + tw + 36 > PAD + TEXT_W:
        x = PAD
        y += 58
    d.rounded_rectangle([x, y, x + tw + 36, y + 46], radius=23, fill=CARD,
                        outline=(214, 220, 238), width=2)
    d.text((x + 18, y + 11), label, font=f_chip, fill=(60, 68, 92))
    x += tw + 36 + 12

# ---- footer ----
f_dom = font(["seguisb.ttf"], 27, bold=True)
d.text((PAD, 566), "nassersaleh.ca", font=f_dom, fill=INDIGO)
f_loc = font(["segoeui.ttf"], 25)
loc = "Toronto, Canada  ·  EN / AR"
lb = d.textbbox((0, 0), loc, font=f_loc)
d.text((W - PAD - (lb[2] - lb[0]), 568), loc, font=f_loc, fill=MUTED)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT, "PNG", optimize=True)
print(f"WROTE {OUT}  ({os.path.getsize(OUT)/1024:.0f} KB, {W}x{H}, photo={'yes' if has_photo else 'no'})")
