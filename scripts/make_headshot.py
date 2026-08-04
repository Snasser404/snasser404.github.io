# Prepares a headshot for the About section.
#   python scripts/make_headshot.py "C:\path\to\your-photo.jpg"
#
# Fixes EXIF rotation, crops to a square centred on the face area (biased
# slightly toward the top, which is right for portraits), resizes, and writes
# an optimized public/assets/headshot.jpg.
import os
import sys
from PIL import Image, ImageOps

SIZE = 900  # final square, plenty for a ~420px display slot on retina
OUT = os.path.join("public", "assets", "headshot.jpg")


def main() -> int:
    if len(sys.argv) < 2:
        print('Usage: python scripts/make_headshot.py "C:\\path\\to\\photo.jpg"')
        return 1
    src = sys.argv[1]
    if not os.path.exists(src):
        print(f"Not found: {src}")
        return 1

    im = Image.open(src)
    im = ImageOps.exif_transpose(im)  # honour phone/camera rotation
    im = im.convert("RGB")
    w, h = im.size

    # Square crop. For portraits the subject sits above centre, so bias upward
    # instead of taking the exact middle (which tends to cut the top of the head).
    side = min(w, h)
    left = (w - side) // 2
    top = int((h - side) * 0.30) if h > w else (h - side) // 2
    im = im.crop((left, top, left + side, top + side))

    # Never upscale — enlarging a smaller source just softens it.
    target = min(SIZE, side)
    if target != side:
        im = im.resize((target, target), Image.LANCZOS)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    im.save(OUT, "JPEG", quality=92, optimize=True, progressive=True)
    print(f"WROTE {OUT}  ({os.path.getsize(OUT)/1024:.0f} KB, {target}x{target}, from {w}x{h})")
    print("Next: set about.headshot = '/assets/headshot.jpg' in src/data/content.ts")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
