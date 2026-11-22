# Meme Caption Maker 😂

Your caption, instant meme — pick an original hand-drawn template, add top and bottom text, and download your meme as a PNG.

## Features

- **4 original templates** — all drawn with canvas shapes, made for this app: Cat on a Laptop, Two Robots, Sun vs Cloud, and Mountain Climb. No copyrighted meme photos, no external images.
- **Top / bottom text inputs** — classic meme captions in bold white text with a black outline, with word-wrap and auto-shrink so long captions still fit.
- **Live preview** — the canvas redraws as you type. A text-size slider scales the captions.
- **Download image** — exports the meme as a clean 800×800 PNG via canvas export.
- **Random caption** — one click loads a random top/bottom caption pair for inspiration.

## Run locally

No build step, no dependencies — just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Deploy anywhere that serves static files (GitHub Pages, Netlify, Vercel…). Upload the whole folder as-is.

## Tech

Pure HTML, CSS, and vanilla JavaScript (Canvas 2D). Google Fonts only (Bricolage Grotesque, Inter, JetBrains Mono).
