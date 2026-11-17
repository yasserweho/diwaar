#!/usr/bin/env python3
"""Render branded 1200x630 share images into public/og/.

    python3 scripts/og-images.py

Re-run after adding a city, blog post, area guide or tool. Needs Pillow with
libraqm (for Urdu shaping) and the Inter / Noto Sans Arabic fonts; set
OG_FONT_LATIN / OG_FONT_URDU to override the font paths.
"""
import os
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, features

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og"
LATIN = os.environ.get("OG_FONT_LATIN", "/usr/share/fonts/truetype/sand-box/google/Inter/Inter-VariableFont_opsz,wght.ttf")
URDU = os.environ.get("OG_FONT_URDU", "/usr/share/fonts/truetype/sand-box/google/Noto Sans Arabic/NotoSansArabic-VariableFont_wdth,wght.ttf")
W, H = 1200, 630
NAVY, NAVY_2, WHITE, SKY, GREEN = (11, 74, 140), (7, 21, 37), (255, 255, 255), (183, 212, 247), (31, 157, 85)
RAQM = features.check("raqm")


def font(path, size, weight="Bold"):
    f = ImageFont.truetype(path, size, layout_engine=ImageFont.Layout.RAQM if RAQM else ImageFont.Layout.BASIC)
    try:
        f.set_variation_by_name(weight)
    except Exception:
        pass
    return f


def slugify(name):
    s = re.sub(r"[^a-z0-9]+", "-", name.lower().replace("&", " and ")).strip("-")
    return s or "area"


def is_urdu(text):
    return bool(re.search(r"[\u0600-\u06FF]", text))


def wrap(draw, text, f, max_w, rtl):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        kw = {"direction": "rtl", "language": "ur"} if rtl and RAQM else {}
        if draw.textlength(trial, font=f, **kw) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def card(path, kicker, title, sub):
    img = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(img)
    # Soft diagonal bands so the card reads as "Diwaar" at thumbnail size.
    for i in range(-H, W, 220):
        d.polygon([(i, H), (i + 90, H), (i + 90 + H, 0), (i + H, 0)], fill=(13, 80, 150))
    d.rectangle([0, H - 96, W, H], fill=NAVY_2)
    rtl = is_urdu(title)
    pad = 72
    kick_f = font(URDU if is_urdu(kicker) else LATIN, 30, "SemiBold")
    kw = lambda t: {"direction": "rtl", "language": "ur"} if is_urdu(t) and RAQM else {}
    y = 70
    if kicker:
        x = W - pad - d.textlength(kicker, font=kick_f, **kw(kicker)) if is_urdu(kicker) else pad
        d.text((x, y), kicker.upper() if not is_urdu(kicker) else kicker, font=kick_f, fill=SKY, **kw(kicker))
        y += 62
    size = 66 if len(title) < 48 else 56 if len(title) < 80 else 48
    title_f = font(URDU if rtl else LATIN, size, "Bold" if not rtl else "Bold")
    lines = wrap(d, title, title_f, W - 2 * pad, rtl)[:4]
    lh = int(size * (1.55 if rtl else 1.18))
    for line in lines:
        x = W - pad - d.textlength(line, font=title_f, **kw(line)) if rtl else pad
        d.text((x, y), line, font=title_f, fill=WHITE, **kw(line))
        y += lh
    if sub:
        sub_f = font(URDU if is_urdu(sub) else LATIN, 30, "Regular")
        for line in wrap(d, sub, sub_f, W - 2 * pad, is_urdu(sub))[:2]:
            y += 6
            x = W - pad - d.textlength(line, font=sub_f, **kw(line)) if is_urdu(line) else pad
            d.text((x, y), line, font=sub_f, fill=SKY, **kw(line))
            y += 42
    brand_f = font(LATIN, 36, "ExtraBold")
    d.text((pad, H - 70), "Diwaar.com", font=brand_f, fill=WHITE)
    ur_f = font(URDU, 34, "Bold")
    bw = d.textlength("Diwaar.com", font=brand_f)
    d.text((pad + bw + 18, H - 74), "دیوار", font=ur_f, fill=SKY, **kw("دیوار"))
    tag_f = font(LATIN, 24, "SemiBold")
    tag = "Free to post  ·  No commission"
    tw = d.textlength(tag, font=tag_f)
    d.rounded_rectangle([W - pad - tw - 36, H - 74, W - pad, H - 26], radius=24, fill=GREEN)
    d.text((W - pad - tw - 18, H - 66), tag, font=tag_f, fill=WHITE)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.quantize(colors=64, method=Image.Quantize.MEDIANCUT).save(path.with_suffix(".png"), "PNG", optimize=True)


def block(src, name):
    start = src.index(name)
    end = src.find("\nexport ", start + 10)
    nxt = src.find("\nconst ", start + 10)
    ends = [e for e in (end, nxt) if e > 0]
    return src[start : min(ends) if ends else None]


def main():
    loc = (ROOT / "src/lib/locations.ts").read_text()
    cities = re.findall(r'"([^"]+)"', loc[loc.index("export const CITIES") : loc.index("]", loc.index("export const CITIES"))])
    data = (ROOT / "src/lib/data.ts").read_text()
    guides = re.findall(r'slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*city:\s*"([^"]+)"', block(data, "export const GUIDES"))
    short = re.findall(r'slug:\s*"([^"]+)",\s*title:\s*"([^"]+)"', block(data, "const SHORT_POSTS"))
    articles = []
    for md in sorted((ROOT / "src/content/blog").glob("*.md")):
        meta = dict(re.findall(r"^(\w+):\s*(.*)$", md.read_text().split("---")[1], re.M))
        articles.append((meta["slug"], meta["title"], meta.get("lang", "en")))

    seen = {}
    for c in cities:
        s = slugify(c)
        n = seen.get(s, 0)
        seen[s] = n + 1
        if n:
            s = f"{s}-{n + 1}"
        card(OUT / "city" / f"{s}.png", "Pakistan property", f"Property for sale and rent in {c}", "Houses, flats, portions and plots posted by owners")
    for slug, title in short:
        card(OUT / "blog" / f"{slug}.png", "Diwaar journal", title, "")
    for slug, title, lang in articles:
        card(OUT / "blog" / f"{slug}.png", "دیوار گائیڈ" if lang == "ur" else "Diwaar guide", title, "")
    for slug, name, city in guides:
        card(OUT / "guide" / f"{slug}.png", "Area guide", f"{name}, {city}", "What to know before you buy or rent")
    card(OUT / "tool" / "rent-vs-buy.png", "Free calculator  ·  کرایہ یا خریداری؟", "Rent or buy? Run your own numbers", "Instalment, rent and savings compared year by year")
    card(OUT / "tool" / "transfer-cost.png", "Free calculator  ·  Punjab & Islamabad", "Property transfer cost estimator", "FBR 236K/236C advance tax plus the fees your registrar quotes")
    card(OUT / "tool" / "tools.png", "Free tools", "Pakistan property calculators", "Home loan, rent vs buy, transfer cost, Marla converter")
    card(OUT / "site.png", "Pakistan's property portal", "Find a home. Post your property free.", "Houses, flats, portions and plots in 33 cities")
    print(f"wrote {sum(1 for _ in OUT.rglob('*.png'))} images to {OUT}")


if __name__ == "__main__":
    main()
