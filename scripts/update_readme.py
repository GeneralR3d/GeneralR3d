#!/usr/bin/env python3
"""
Scans all repos (public + private) for GeneralR3d and auto-updates the
<!-- TECH_STACK_START --> ... <!-- TECH_STACK_END --> section in README.md.

Languages  : detected from repo primary language (sorted by repo count)
Frameworks : detected by scanning package.json / go.mod / requirements.txt
             in each repo
Infra      : left as static (always relevant, hard to auto-detect)

Requires GH_TOKEN with 'repo' scope to access private repos.
"""

import base64
import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request

USERNAME = "GeneralR3d"
README_PATH = os.path.join(os.path.dirname(__file__), "..", "README.md")

TOKEN = os.environ.get("GH_TOKEN", "")
HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}
if TOKEN:
    HEADERS["Authorization"] = f"Bearer {TOKEN}"

# ── Badge configs ─────────────────────────────────────────────────────────────

LANGUAGE_BADGES = {
    "Go":               ("00ADD8", "go",           "white"),
    "Python":           ("3776AB", "python",        "white"),
    "JavaScript":       ("F7DF1E", "javascript",    "black"),
    "TypeScript":       ("3178C6", "typescript",    "white"),
    "Java":             ("ED8B00", "openjdk",       "white"),
    "C":                ("00599C", "c",             "white"),
    "C++":              ("00599C", "cplusplus",     "white"),
    "Rust":             ("000000", "rust",          "white"),
    "Swift":            ("FA7343", "swift",         "white"),
    "Kotlin":           ("7F52FF", "kotlin",        "white"),
    "HTML":             ("E34F26", "html5",         "white"),
    "CSS":              ("1572B6", "css3",          "white"),
    "Shell":            ("4EAA25", "gnubash",       "white"),
    "Jupyter Notebook": ("F37626", "jupyter",       "white"),
}

# (label, color, logo, logo_color, category)
# category: "backend" | "frontend" | "data"
FRAMEWORK_RULES = {
    # JS/TS — scanned from package.json
    "js": [
        ('"react"',           "React",        "61DAFB", "react",        "black",  "frontend"),
        ('"next"',            "Next.js",      "000000", "nextdotjs",    "white",  "frontend"),
        ('"vue"',             "Vue.js",       "4FC08D", "vuedotjs",     "white",  "frontend"),
        ('"svelte"',          "Svelte",       "FF3E00", "svelte",       "white",  "frontend"),
        ('"tailwindcss"',     "Tailwind",     "06B6D4", "tailwindcss",  "white",  "frontend"),
        ('"three"',           "Three.js",     "000000", "threedotjs",   "white",  "frontend"),
        ('"@nestjs/core"',    "NestJS",       "E0234E", "nestjs",       "white",  "backend"),
        ('"express"',         "Express",      "000000", "express",      "white",  "backend"),
        ('"fastify"',         "Fastify",      "000000", "fastify",      "white",  "backend"),
        ('"socket.io"',       "Socket.io",    "010101", "socketdotio",  "white",  "backend"),
        ('"typeorm"',         "TypeORM",      "FE0803", "typeorm",      "white",  "backend"),
        ('"prisma"',          "Prisma",       "2D3748", "prisma",       "white",  "backend"),
        ('"@apollo/server"',  "Apollo",       "311C87", "apollographql","white",  "backend"),
        ('"graphql"',         "GraphQL",      "E10098", "graphql",      "white",  "backend"),
    ],
    # Python — scanned from requirements.txt / pyproject.toml
    "py": [
        ("fastapi",        "FastAPI",      "009688", "fastapi",      "white",  "backend"),
        ("django",         "Django",       "092E20", "django",       "white",  "backend"),
        ("flask",          "Flask",        "000000", "flask",        "white",  "backend"),
        ("streamlit",      "Streamlit",    "FF4B4B", "streamlit",    "white",  "frontend"),
        ("torch",          "PyTorch",      "EE4C2C", "pytorch",      "white",  "data"),
        ("tensorflow",     "TensorFlow",   "FF6F00", "tensorflow",   "white",  "data"),
        ("pandas",         "Pandas",       "150458", "pandas",       "white",  "data"),
        ("scikit-learn",   "scikit-learn", "F7931E", "scikitlearn",  "white",  "data"),
        ("sklearn",        "scikit-learn", "F7931E", "scikitlearn",  "white",  "data"),
        ("numpy",          "NumPy",        "013243", "numpy",        "white",  "data"),
        ("redis",          "Redis",        "DC382D", "redis",        "white",  "backend"),
    ],
    # Go — scanned from go.mod
    "go": [
        ("github.com/gin-gonic/gin",    "Gin",    "00ADD8", "go",    "white",  "backend"),
        ("github.com/go-chi/chi",       "Chi",    "00ADD8", "go",    "white",  "backend"),
        ("github.com/gofiber/fiber",    "Fiber",  "00ADD8", "go",    "white",  "backend"),
        ("github.com/labstack/echo",    "Echo",   "00ADD8", "go",    "white",  "backend"),
        ("github.com/go-redis/redis",   "Redis",  "DC382D", "redis", "white",  "backend"),
        ("github.com/redis/go-redis",   "Redis",  "DC382D", "redis", "white",  "backend"),
        ("gorm.io/gorm",                "GORM",   "00ADD8", "go",    "white",  "backend"),
    ],
}

# ── GitHub API helpers ────────────────────────────────────────────────────────

def gh_get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def fetch_file(repo, path):
    """Return decoded text of a file in a repo, or None if not found."""
    url = f"https://api.github.com/repos/{USERNAME}/{repo}/contents/{path}"
    try:
        data = gh_get(url)
        return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
    except urllib.error.HTTPError:
        return None


def fetch_all_repos():
    """
    Use /user/repos (authenticated) to get public + private repos.
    Falls back to /users/{username}/repos (public only) if no token.
    """
    repos = []
    page = 1
    base = (
        "https://api.github.com/user/repos?affiliation=owner&per_page=100"
        if TOKEN
        else f"https://api.github.com/users/{USERNAME}/repos?per_page=100"
    )
    while True:
        batch = gh_get(f"{base}&page={page}")
        if not batch:
            break
        repos.extend(batch)
        page += 1
    return repos

# ── Detection logic ───────────────────────────────────────────────────────────

def detect_languages(repos):
    """Return languages sorted by number of repos where they are primary."""
    counts = {}
    for repo in repos:
        lang = repo.get("language")
        if lang and lang in LANGUAGE_BADGES:
            counts[lang] = counts.get(lang, 0) + 1
    return [lang for lang, _ in sorted(counts.items(), key=lambda x: -x[1])]


def detect_frameworks(repos):
    """
    Scan manifest files in each repo and return a dict:
      { "backend": set, "frontend": set, "data": set }
    where each set contains (label, color, logo, logo_color) tuples.
    """
    found = {"backend": set(), "frontend": set(), "data": set()}

    for repo in repos:
        name = repo["name"]
        lang = repo.get("language") or ""

        if lang in ("JavaScript", "TypeScript", None):
            content = fetch_file(name, "package.json")
            if content:
                for keyword, label, color, logo, logo_color, category in FRAMEWORK_RULES["js"]:
                    if keyword in content:
                        found[category].add((label, color, logo, logo_color))

        if lang == "Python":
            for manifest in ("requirements.txt", "pyproject.toml", "setup.py"):
                content = fetch_file(name, manifest)
                if content:
                    for keyword, label, color, logo, logo_color, category in FRAMEWORK_RULES["py"]:
                        if keyword.lower() in content.lower():
                            found[category].add((label, color, logo, logo_color))

        if lang == "Go":
            content = fetch_file(name, "go.mod")
            if content:
                for keyword, label, color, logo, logo_color, category in FRAMEWORK_RULES["go"]:
                    if keyword in content:
                        found[category].add((label, color, logo, logo_color))

    return found

# ── Badge rendering ───────────────────────────────────────────────────────────

def make_badge(label, color, logo, logo_color="white"):
    enc = urllib.parse.quote(label.replace("-", "--").replace(" ", "_"), safe="")
    return f'<img src="https://img.shields.io/badge/{enc}-{color}?style=flat-square&logo={logo}&logoColor={logo_color}"/>'


def render_section(languages, frameworks):
    lines = []

    # Languages row
    lang_badges = " ".join(make_badge(l, *LANGUAGE_BADGES[l]) for l in languages)
    lines.append(f"**Languages** &nbsp;\n{lang_badges}")

    # Backend row
    if frameworks["backend"]:
        badges = " ".join(
            make_badge(*b) for b in sorted(frameworks["backend"], key=lambda x: x[0])
        )
        lines.append(f"**Backend** &nbsp;\n{badges}")

    # Frontend row
    if frameworks["frontend"]:
        badges = " ".join(
            make_badge(*b) for b in sorted(frameworks["frontend"], key=lambda x: x[0])
        )
        lines.append(f"**Frontend** &nbsp;\n{badges}")

    # Data / AI row
    if frameworks["data"]:
        badges = " ".join(
            make_badge(*b) for b in sorted(frameworks["data"], key=lambda x: x[0])
        )
        lines.append(f"**Data / AI** &nbsp;\n{badges}")

    return "\n\n".join(lines)

# ── README update ─────────────────────────────────────────────────────────────

def update_readme(new_section):
    with open(README_PATH, "r") as f:
        content = f.read()

    pattern = r"(<!-- TECH_STACK_START -->).*?(<!-- TECH_STACK_END -->)"
    replacement = f"<!-- TECH_STACK_START -->\n{new_section}\n<!-- TECH_STACK_END -->"
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    if new_content == content:
        print("No changes detected.")
        return

    with open(README_PATH, "w") as f:
        f.write(new_content)
    print("README.md updated.")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print(f"Fetching repos for {USERNAME}...")
    repos = fetch_all_repos()
    print(f"  Found {len(repos)} repos")

    languages = detect_languages(repos)
    print(f"  Languages: {languages}")

    frameworks = detect_frameworks(repos)
    print(f"  Frameworks: { {k: [x[0] for x in v] for k, v in frameworks.items()} }")

    section = render_section(languages, frameworks)
    update_readme(section)


if __name__ == "__main__":
    main()
