#!/usr/bin/env python3
"""
UI/UX Pro Max search script.
Zero-dependency script to provide UI/UX guidance, design systems, and stack rules.
"""
import sys
import argparse
import json

RULES = {
    "ux": [
        {"topic": "contrast", "rule": "Contrast 4.5:1 minimum for normal text, 3:1 for large text"},
        {"topic": "touch-target", "rule": "Min size 44x44px, 8px+ spacing between clickable targets"},
        {"topic": "feedback", "rule": "Provide immediate tactile feedback (<200ms) on interaction"},
        {"topic": "reduced-motion", "rule": "Respect prefers-reduced-motion: reduce across all animations"},
        {"topic": "layout", "rule": "Mobile-first responsive design; no horizontal scroll on viewports"}
    ],
    "style": [
        {"topic": "dance-studio", "rule": "High energy kinetic dark mode, bold stage typography, electric accents"},
        {"topic": "glassmorphism", "rule": "Subtle border (oklch(1 0 0 / 0.1)), backdrop-blur-md, dark translucent surface"}
    ],
    "nextjs": [
        {"topic": "streaming", "rule": "Use Suspense boundaries around async data queries with sized skeletons"},
        {"topic": "font", "rule": "Use next/font with display: 'swap' and CSS variables for zero FOIT/CLS"}
    ]
}

def generate_design_system(query, project_name="Studio"):
    return {
        "project": project_name,
        "archetype": "High-Energy Movement / Entertainment / Academy",
        "colors": {
            "canvas": "#0F0F0F",
            "surface": "#141414",
            "brand": "#2BB4D8",
            "ink": "#FFFFFF",
            "ink-muted": "#888888",
            "line": "rgba(255, 255, 255, 0.08)"
        },
        "typography": {
            "display": "Big Shoulders Display / Anton (Tight, athletic, kinetic)",
            "body": "Inter / Plus Jakarta Sans (Clean, legible, tabular numbers)"
        },
        "principles": [
            "Concentric border radii (outer = inner + padding)",
            "Scale on press active:scale-[0.96]",
            "GPU-composited transforms only",
            "Zero ungrounded placeholder content"
        ]
    }

def main():
    parser = argparse.ArgumentParser(description="UI/UX Pro Max Search")
    parser.add_argument("query", nargs="?", default="", help="Search query")
    parser.add_argument("--domain", help="Domain to query (ux, style, typography, color, etc.)")
    parser.add_argument("--stack", help="Technology stack (nextjs, react, etc.)")
    parser.add_argument("--design-system", action="store_true", help="Generate design system")
    parser.add_argument("-p", "--project", default="Rhythmzz Academy", help="Project name")
    parser.add_argument("--persist", action="store_true", help="Persist output")
    parser.add_argument("--output-dir", help="Output directory")
    parser.add_argument("-f", "--format", default="ascii", choices=["ascii", "markdown", "json"])

    args = parser.parse_args()

    if args.design_system:
        ds = generate_design_system(args.query, args.project)
        if args.format == "json":
            print(json.dumps(ds, indent=2))
        else:
            print(f"=== DESIGN SYSTEM: {ds['project']} ===")
            print(f"Archetype: {ds['archetype']}")
            print("Colors:", ds['colors'])
            print("Typography:", ds['typography'])
            print("Principles:")
            for p in ds['principles']:
                print(f"  - {p}")
        return

    domain = args.domain or (args.stack if args.stack in RULES else "ux")
    results = RULES.get(domain, RULES["ux"])
    print(f"=== UI/UX Intelligence ({domain}) ===")
    for item in results:
        print(f"• [{item['topic']}]: {item['rule']}")

if __name__ == "__main__":
    main()
