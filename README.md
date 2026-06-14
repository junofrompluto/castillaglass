# Castilla Glass — South Florida Glass Installation Website

A fast, modern, **interactive** marketing site for Castilla Glass with a built-in
**AI glass estimator** that expedites quoting — it gathers the job type,
measurements, finishes, location and contact info, then returns an instant price
range and emails the request straight to the owner.

**Owner:** Daniel Castilla · 📞 305-219-0308 · ✉️ Dcastilla89@yahoo.com
Serving Miami-Dade, Broward & Palm Beach.

---

## ✨ Features

- **Built-in chatbot estimator** — guided, conversational flow for all six job types:
  - 🚨 Broken / emergency glass
  - 🔧 Repair & service
  - 🚿 Shower doors & enclosures
  - 🛡️ Glass railings
  - 🪟 Window & door installation
  - 🏢 Commercial & storefront
- **Instant estimates** — transparent price ranges from measurements you provide.
- **Lead capture** — name, phone, email, ZIP; one tap to email the full request.
- **Leading-edge design** — glassmorphism, animated stats, scroll reveals, South
  Florida architectural imagery (via Unsplash).
- **Zero build step** — plain HTML/CSS/JS. Deploys anywhere static.
- **Hybrid AI ready** — drop in a Claude API key to unlock free-form chat (below).

---

## 🗂 Project structure

```
castillaglass/
├── index.html              # the whole page
├── assets/
│   ├── css/styles.css      # styles + responsive + animations
│   └── js/app.js           # dynamic content + chatbot estimator
├── api/chat.js             # OPTIONAL AI backend (Vercel format)
├── netlify/functions/chat.js  # OPTIONAL AI backend (Netlify format)
├── netlify.toml            # Netlify config (publish + function routing)
└── README.md
```

---

## 🚀 Deploy to Netlify (from GitHub)

This repo is wired for Netlify out of the box.

1. Push this repo to GitHub (already done if you're reading this there).
2. In Netlify: **Add new site → Import an existing project → GitHub** and pick
   this repo.
3. Build settings are read from `netlify.toml`:
   - **Publish directory:** `.`
   - **Build command:** *(none — static site)*
   - **Functions directory:** `netlify/functions`
4. Click **Deploy**. Every push to `main` auto-deploys. 🎉

The site is fully functional immediately in **guided mode** (no API key needed).

### Optional: turn on free-form AI chat

The chatbot ships in guided mode (rule-based, runs in the browser). To enable
natural-language answers powered by Claude:

1. In Netlify → **Site settings → Environment variables**, add:
   ```
   ANTHROPIC_API_KEY = sk-ant-...
   ```
2. In [`assets/js/app.js`](assets/js/app.js), set:
   ```js
   const CONFIG = { aiEnabled: true, ... }
   ```
3. Commit & push. The function at `netlify/functions/chat.js` handles requests
   to `/api/chat` using model `claude-sonnet-4-6`.

> Guided mode is the recommended default for reliable lead capture; AI mode adds
> conversational flexibility on top.

---

## 🧪 Run locally

It's a static site — just open `index.html`, or serve it:

```bash
# Python
python3 -m http.server 8080
# then visit http://localhost:8080
```

To test the AI function locally, install the Netlify CLI and run `netlify dev`.

---

## 🖼 Imagery & video

The site uses the Castilla Glass branded media kit (red/black/white):

- `assets/img/services/*.jpg` — the six branded service posters (Broken, Repair/
  Emergency, Shower, Railings, Windows & Doors, Commercial). These are the
  clickable service cards.
- `assets/img/gallery/*.jpg` — real project stills (storefronts, showers,
  railings, the CG Glass van, crews on site).
- `assets/video/hero.mp4` — cinematic hero background loop.
- `assets/video/showcase.mp4` — the "See it in motion" feature video.
- `assets/img/logo.png` / `logo.jpg` — the CG castle-shield badge.

To swap any asset, drop a replacement at the same path (or update the `SERVICES`
and `GALLERY` arrays in [`assets/js/app.js`](assets/js/app.js)).

---

## 📄 License

MIT — see [LICENSE](LICENSE).
