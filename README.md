# JD Infotech — Website

This is a static, single-page website for **JD Infotech** (Ahmedabad), covering CCTV, video door phones, EPABX, CCTV AMC, fire alarms, GPS, access control and IT/network work.

It is plain HTML, CSS and JavaScript. There is **no build step and no npm packages**, so it runs as-is on a free Vercel account.

```
index.html            the whole site
404.html              "page not found" page
vercel.json           clean URLs, caching and security headers
robots.txt, sitemap.xml, site.webmanifest
assets/css/style.css  all styling
assets/js/main.js     animations, parallax, video player, WhatsApp form
assets/img/           favicon and photos (brand is text-only: "JD Infotech")
assets/video/         hero + showcase clips (.mp4)
```

---

## Deploy on Vercel (free)

**Option A: drag & drop (no tools needed)**
1. Sign in at <https://vercel.com> (the free "Hobby" plan is fine).
2. Click **Add New… → Project**. Scroll down to **"Deploy without Git"**, or use <https://vercel.com/new> and drop the folder.
3. Drag this whole `JD-Infotech` folder in.
4. Framework preset: **Other**. Leave Build Command and Output Directory **empty**.
5. Click **Deploy**. You'll get a URL like `jd-infotech.vercel.app`.

**Option B: Vercel CLI** (needs Node.js)
```bash
npx vercel          # first time: log in, accept defaults, framework = Other
npx vercel --prod   # publish to production
```

**Option C: GitHub** — push this folder to a repo, then import the repo in Vercel. Every push redeploys automatically.

### After the first deploy
- Replace `https://jdinfotech.vercel.app` with your real URL in these places:
  - `index.html`: the canonical link and the JSON-LD `@id` / `image`
  - `sitemap.xml`
  - `robots.txt`
- Optional: add a custom domain (e.g. `jdinfotech.in`) under **Project → Settings → Domains**.

---

## Editing content

| What | Where |
|---|---|
| Phone / WhatsApp number | Search `7405814582` in `index.html` and `WA_NUMBER` in `assets/js/main.js` |
| Email | Search `jdinfotech209@gmail.com` in `index.html` |
| Address / map | "Contact" section in `index.html` (the map is a Google Maps `iframe`, so no API key is needed) |
| Services text | "SERVICES" section in `index.html` |
| FAQ answers | "FAQ" section in `index.html` |
| Colours | CSS variables at the top of `assets/css/style.css` (`--signal` is the orange CTA colour) |

## Swapping in real photos & videos

The site currently uses royalty-free stock media (Pexels/Unsplash). Real job-site photos will look more trustworthy. To replace one, **keep the same filename** and overwrite the file:

| File | Used in |
|---|---|
| `assets/img/cctv.jpg` | CCTV feature card + hero console "CAM 02" |
| `assets/img/monitoring.jpg` | Hero console "CAM 03" + live-demo poster |
| `assets/img/cams-pole.jpg` | Hero console "CAM 04" + gallery |
| `assets/img/city-dusk.jpg` | Hero console main-feed poster + "After dark" poster |
| `assets/img/network.jpg` | IT & Network card background + gallery |
| `assets/img/install.jpg` | "Installation" tab poster |
| `assets/img/hero-poster.jpg`, `doorphone.jpg`, `fire.jpg`, `access.jpg` | Gallery |
| `assets/video/hero.mp4` | Hero console main feed (muted loop) |
| `assets/video/monitoring.mp4`, `night.mp4`, `install.mp4` | "See it in action" tabs |

Tips:
- Photos: about 1600px wide, JPG quality ~75, under 400 KB each.
- Videos: 720p, H.264 MP4, 10–20 seconds, no audio, **under ~5 MB** each (use <https://handbrake.fr> or an online compressor).
- If a photo is missing, its glass frame simply shows empty instead of a broken-image icon.

## How the contact form works

A static host has no server, so the form **doesn't email anything**. When a visitor presses "Send on WhatsApp", it opens WhatsApp with their name, number, service and message already typed to +91 74058 14582. Nothing is stored anywhere.

## Local preview

Open the folder with any static server, for example:
```bash
npx serve .
```
or, on Windows without Node: `powershell -ExecutionPolicy Bypass -File .claude/serve.ps1` → <http://localhost:5173>

(The `.claude/` folder and this README are excluded from deploys via `.vercelignore`.)

## Media credits

Stock media is from [Pexels](https://www.pexels.com/license/): free for commercial use, attribution not required.

| File | Pexels ID | Creator |
|---|---|---|
| img/hero-poster.jpg | 10233086 | Marek Piwnicki |
| img/cctv.jpg | 430208 | Scott Webb |
| img/cams-pole.jpg | 4740157 | Paul Oor |
| img/monitoring.jpg | 30692441 | AMORIE SAM |
| img/install.jpg | 27928761 | ranjeet |
| img/fire.jpg | 39183052 | Caleb Oquendo |
| img/doorphone.jpg | 13007861 | Joshua Brown |
| img/access.jpg | 17155842 | panumas nikhomkhai |
| img/network.jpg | 2881232 | Brett Sayles |
| img/city-dusk.jpg | 11839273 | Alexander Mayak |
| video/hero.mp4 | 34180809 | Altaf Shah |
| video/monitoring.mp4 | 38779098 | Kiwi and Camera |
| video/night.mp4 | 10433645 | Ming Z |
| video/install.mp4 | 34572318 | Sergei Starostin |
