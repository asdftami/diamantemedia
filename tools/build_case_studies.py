#!/usr/bin/env python3
"""Build the case-study pages for the portfolio site.

Reads content/case-studies/*.md and writes site/case-studies/<slug>.html,
copying and optimizing every referenced image into site/assets/ (WebP, max 1600px wide).

Usage:  python3 tools/build_case_studies.py
Needs:  pip install markdown pillow
"""
import html
import re
from pathlib import Path

import markdown
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "content" / "case-studies"
OUT = ROOT / "site" / "case-studies"
ASSET_OUT = ROOT / "site" / "assets"
MAX_W = 1600

# Same order and numbering as the homepage journey.
PAGES = [
    {"src": "04-dental-websites.md", "slug": "dental", "num": "01", "planet": "p-dental", "year": "2020–2022 · AUSTIN"},
    {"src": "01-project-insight.md", "slug": "project-insight", "num": "02", "planet": "p-insight", "year": "2022–2024 · COMPUTERSHARE"},
    {"src": "02-israel-bond-centre.md", "slug": "bond-centre", "num": "03", "planet": "p-bond", "year": "2023–2024 · COMPUTERSHARE"},
    {"src": "03-fridays-off.md", "slug": "fridays-off", "num": "04", "planet": "p-fridays", "year": "OCT 2026–NOW · CO-FOUNDER"},
]


def parse(text):
    meta = {}
    if text.startswith("---"):
        _, fm, text = text.split("---", 2)
        for line in fm.strip().splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip().strip('"')
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)          # drafting notes never ship
    text = re.sub(r"(?m)^[ \t]*[-*][ \t]*\n", "", text)              # bullets left empty by removed notes
    text = re.sub(r"^# .*\n", "", text.lstrip(), count=1)        # title is rendered in the hero
    text = re.sub(r"^\*\*.*\*\*\s*\n", "", text.lstrip(), count=1)  # subtitle too
    return meta, text


def optimize(src_rel):
    """Copy ../../assets/x.png -> site/assets/x.webp (resized). Returns the page-relative URL."""
    src = ROOT / src_rel.replace("../../", "")
    rel = Path(src_rel.replace("../../assets/", ""))
    dst = ASSET_OUT / rel.with_suffix(".webp")
    if not src.exists():
        print("  ! missing image:", src_rel)
        return src_rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    if not dst.exists() or dst.stat().st_mtime < src.stat().st_mtime:
        im = Image.open(src)
        im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
        if im.width > MAX_W:
            im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
        if im.height > 16000:                      # WebP's size limit: fall back to JPEG
            dst = dst.with_suffix(".jpg")
            im.convert("RGB").save(dst, quality=82, optimize=True)
        else:
            im.save(dst, "WEBP", quality=82, method=6)
    return "../assets/" + str(dst.relative_to(ASSET_OUT)).replace("\\", "/")


def figures(body):
    """Turn <p><img></p> (one or several) into accessible figures with captions."""
    def one(m):
        alt, src = m.group("alt"), m.group("src")
        return (f'<figure><img src="{optimize(html.unescape(src))}" alt="{alt}" loading="lazy" decoding="async">'
                f"<figcaption>{alt}</figcaption></figure>")
    img = r'<img alt="(?P<alt>[^"]*)" src="(?P<src>[^"]+)"\s*/?>'
    body = re.sub(img, one, body)
    body = re.sub(r"<p>((?:\s*<figure>.*?</figure>\s*)+)</p>", r'<div class="gallery">\1</div>', body, flags=re.S)
    return body


TEMPLATE = (ROOT / "tools" / "case_study_template.html").read_text()


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    for i, page in enumerate(PAGES):
        meta, text = parse((SRC / page["src"]).read_text())
        body = markdown.markdown(text, extensions=["tables", "fenced_code", "sane_lists", "md_in_html"])
        body = figures(body)
        body = re.sub(r"<thead>\s*<tr>(\s*<th[^>]*>\s*</th>)+\s*</tr>\s*</thead>", "", body)  # blank header rows
        body = body.replace("<table>", '<div class="table-wrap"><table>').replace("</table>", "</table></div>")
        prev_p = PAGES[i - 1] if i > 0 else None
        next_p = PAGES[i + 1] if i < len(PAGES) - 1 else None

        def link(p, label):
            if not p:
                return f'<a class="pager" href="../index.html#start">{label}<strong>Back to the galaxy</strong></a>'
            t, _ = parse((SRC / p["src"]).read_text())
            return f'<a class="pager" href="{p["slug"]}.html">{label}<strong>{html.escape(t.get("title", ""))}</strong></a>'

        out = (TEMPLATE
               .replace("{{TITLE}}", html.escape(meta.get("title", "")))
               .replace("{{SUBTITLE}}", html.escape(meta.get("subtitle", "")))
               .replace("{{ROLE}}", html.escape(meta.get("role", "")))
               .replace("{{NUM}}", page["num"])
               .replace("{{YEAR}}", page["year"])
               .replace("{{PLANET}}", page["planet"])
               .replace("{{BODY}}", body)
               .replace("{{PREV}}", link(prev_p, "← Previous planet"))
               .replace("{{NEXT}}", link(next_p, "Next planet →")))
        (OUT / f'{page["slug"]}.html').write_text(out)
        print("built", page["slug"])


if __name__ == "__main__":
    build()
