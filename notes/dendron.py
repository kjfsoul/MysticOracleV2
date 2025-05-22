# !/usr/bin/env python3
"""
Auto-tagger for Mystic Vault
────────────────────────────
• Scans every *.md,*.docx, *.pdf inside the target folder
• Converts .docx / .pdf → Markdown (via Pandoc)
• Adds or updates YAML front-matter:
      id, created, tags (NLTK keywords), summary (first 160 chars)
• Builds docs/dashboard/_index.md – a table of files, tags, summaries
"""

# ── standard libs ───────────────────────────────────────────────────

import sys, json, datetime, re, shutil, subprocess, os
from pathlib import Path

# ── third-party libs ────────────────────────────────────────────────

import pypandoc
import frontmatter
import nltk

# ── ensure NLTK data (punkt & stopwords) is available ──────────────

VENV_DATA = Path("~/vault-tools/nltk_data").expanduser()
nltk.data.path.insert(0, str(VENV_DATA))       # search our v-env first
VENV_DATA.mkdir(parents=True, exist_ok=True)

for pkg, res in [("punkt", "tokenizers/punkt"),
                 ("stopwords", "corpora/stopwords")]:
    try:
        nltk.data.find(res)
    except LookupError:
        nltk.download(pkg, download_dir=str(VENV_DATA), quiet=True)

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
STOP = set(stopwords.words("english"))

# ── globals ─────────────────────────────────────────────────────────

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else ".").expanduser()          # target vault root
TABLE_ROWS = []                                # rows for dashboard

# ── helper functions ────────────────────────────────────────────────

def keywords(text: str, n: int = 5):
    """Return top-n keywords excluding stop words"""
    words = [w.lower() for w in word_tokenize(text)
             if w.isalpha() and w.lower() not in STOP]
    freq = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1
    return [k for k,_ in sorted(freq.items(),
                                 key=lambda kv: kv[1],
                                 reverse=True)[:n]]

def convert_to_md(src: Path) -> Path:
    """Convert .docx or .pdf to Markdown via Pandoc"""
    md_out = src.with_suffix(".md")
    pypandoc.convert_file(str(src), "md", outputfile=str(md_out))
    return md_out

def process_md(md: Path):
    """Read, enrich YAML front-matter, append row for dashboard"""
    post = frontmatter.load(md)
    body = post.content.strip()
    if not body:
        return
    created = (post.get("created") or
               datetime.datetime.fromtimestamp(md.stat().st_mtime)
                        .isoformat())
    tags = set(post.get("tags", []))
    tags.update(keywords(body, 5))
    summary = body[:160].replace("\n", " ")
    if len(body) > 160:
        summary += "…"

    post["id"] = post.get("id") or md.stem
    post["created"] = created
    post["tags"] = sorted(tags)
    post["summary"] = summary

    with md.open("w", encoding="utf-8") as f:
        frontmatter.dump(post, f)

    TABLE_ROWS.append([md.relative_to(ROOT),
                       ", ".join(post["tags"]),
                       summary])

def walk():
    """Traverse ROOT; convert & process files"""
    for p in ROOT.rglob("*"):
        if p.is_dir():
            continue
        try:
            if p.suffix in (".docx", ".pdf"):
                print(f"Converting {p}")
                p = convert_to_md(p)
            if p.suffix == ".md":
                process_md(p)
        except Exception as e:
            print(f"  ⚠️  {p} failed:", e)

def write_index():
    """Write docs/dashboard/_index.md"""
    idx_dir = ROOT / "docs" / "dashboard"
    idx_dir.mkdir(parents=True, exist_ok=True)
    index_md = idx_dir / "_index.md"

    header = (
        "# Vault Dashboard\n\n"
        "| File | Tags | Summary |\n"
        "|------|------|---------|\n"
    )
    table = "\n".join(
        f"| {f} | {t} | {s} |" for f, t, s in TABLE_ROWS
    )
    index_md.write_text(header + table)
    print("✅ Dashboard written →", index_md)

# ── main ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) == 1:
        print("Usage: tagger.py <path/to/Mystic_Vault/Mystic_Arcana>")
        sys.exit(1)
    walk()
    write_index()
