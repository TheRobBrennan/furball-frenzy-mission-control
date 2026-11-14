# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow"]
# ///
"""Rebuilds the favicon set from the plane photo, two pigs and two elephants at the window.

    uv run scripts/assets/make-favicon.py

Writes apps/web/src/app/icon.png (192), apple-icon.png (180), and favicon.ico (16, 32, 48).
Next.js serves all three and adds the link tags itself. To use a different photo or crop, change
SOURCE and BOX, the crop is a square that holds every face. The files are re-encoded from pixels,
so no EXIF or GPS data carries over.
"""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "apps/web/public/images/elephants-at-the-window.jpg"
BOX = (95, 420, 1445, 1770)  # left, top, right, bottom in the 1500x2000 source
OUT = ROOT / "apps/web/src/app"

square = Image.open(SOURCE).convert("RGB").crop(BOX)


def rounded(size: int, radius: float = 0.2) -> Image.Image:
    img = square.resize((size, size), Image.LANCZOS).convert("RGBA")
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * radius), fill=255)
    img.putalpha(mask)
    return img


rounded(192).save(OUT / "icon.png", optimize=True)
# iOS rounds the corners of the touch icon itself, so it stays square
square.resize((180, 180), Image.LANCZOS).save(OUT / "apple-icon.png", optimize=True)
rounded(512).save(OUT / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
print("Wrote icon.png, apple-icon.png, favicon.ico in", OUT)
