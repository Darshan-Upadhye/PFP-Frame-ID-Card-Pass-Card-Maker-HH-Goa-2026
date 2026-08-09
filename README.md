# 🌴 PFP Frame, ID Card & Pass Card Maker · HH Goa 2026

<img width="1080" height="228" alt="image" src="https://github.com/user-attachments/assets/9161524a-d573-45ba-be24-ab9b8b3ae9ec" />

**Upload a photo. Walk away with a badge.**

A no-login, no-backend graphic generator built for **Hacker House Goa 2026** — drop in a
selfie (or take one on the spot) and get a share-ready **Builder ID Card**, **Squad Pass**,
or **PFP Frame** in seconds, drawn entirely in the browser.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="No backend" src="https://img.shields.io/badge/backend-none-2ea44f">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-lightgrey">
</p>

---

## ✨ What it does

| Format | What you get |
|---|---|
| 🪪 **Builder ID Card** | Full event badge — photo, name, handle, a fun generated "builder title," tech stack, QR code, barcode, and a serial ID that shuffles fresh every time. |
| 👥 **Squad / Team Pass** | The same badge, scaled up for a crew — team name, member roster, and its own shuffled serial. |
| 🖼️ **PFP Frame** | A circular neon-ring badge, cropped and ready to drop straight in as an X profile picture. |

Every format is drawn live on an HTML `<canvas>` — no templates, no server-side
rendering, no image ever leaves your browser until you choose to download or share it.

### The details that make it feel real, not just functional

- **Drag, zoom, reframe** — cover-fit photo placement with pointer-drag panning and
  pinch/scroll/slider zoom, so no face ever gets awkwardly cropped.
- **Upload *or* capture** — every photo slot gives you an explicit **Upload** and
  **Camera** button, so mobile users can shoot a photo on the spot instead of digging
  through their gallery.
- **A badge that actually hangs** — the ID Card preview is clipped to a hand-drawn
  lanyard rope. On load it drops in, swings, and settles over ~3 seconds like it was
  just hung around your neck — then you can grab and swing it yourself.
- **HEIC-proof** — iPhone photos (`.heic`/`.heif`) are converted client-side
  automatically; everyone else never even downloads that conversion code.
- **One tap to X** — Share opens the caption straight in the X app's compose screen
  (or the X App/Play Store if it's not installed) instead of dumping you into a generic
  OS share sheet full of unrelated apps.
- **Real exports** — `canvas.toBlob()` → an actual downloadable PNG, full resolution,
  every time. Not a screenshot.

---

## 🚀 Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run lint       # oxlint
```

Node 18+ recommended. No environment variables and no server needed — it's a fully
static site.

---

## 🧱 How it's built

- **React 19 + Vite**, styled with **Tailwind v4** — brand tokens live in
  `src/index.css`.
- The graphic itself is drawn with the **Canvas 2D API**: gradients, the neon ring, the
  curved "VERIFIED" stamp, the QR code, and the barcode are all generated in code, so
  every export is crisp at full resolution — nothing is a flattened template image.
- Fonts (Space Grotesk, Baloo 2 for the Devanagari "गोवा," JetBrains Mono) are bundled
  locally via `@fontsource`, so the app still renders correctly offline or on
  locked-down networks.

### Project structure

```
src/
  lib/
    brandAssets.js     brand constants — site URL, hashtags, socials, event dates
    theme.js           color tokens + neon gradient helpers
    canvasArt.js        shared drawing primitives (backgrounds, rounded rects,
                        curved/arc text, verified badge, cover-fit pan/zoom geometry)
    renderPfp.js        Format: circular PFP frame renderer
    renderCard.js        Format: Builder ID Card renderer
    renderSquadCard.js   Format: Squad / Team Pass renderer
    codes.js             QR code + barcode generation, shuffled serial IDs
    builderTitle.js      fun "builder title" / tier generator
    loadImage.js         HEIC/HEIF → JPEG conversion + File → <img> loader
    captions.js          per-format tweet caption bank + shuffler
    shareToX.js           PNG export + direct-to-X-app share flow
  components/
    UploadZone.jsx        upload / camera-capture / drag-and-drop photo input
    PhotoStage.jsx         the live interactive canvas (pan, pinch/scroll/slider zoom)
    DisplayFrame.jsx        lanyard rope + drop-in / swing animation wrapper
    SquadDisplayFrame.jsx    tilt-in wrapper for the Squad Pass
    BuilderForm.jsx          name / handle / tier / builder title / stack fields
    TeamForm.jsx             team name + member roster fields
    CardModeToggle.jsx       Builder ID Card ⇄ Squad Pass switch
    ActionBar.jsx            Download + Share to X buttons
    ShareModal.jsx           caption editor + share sheet
  App.jsx                    ties it all together
```

`computeCoverGeometry()` in `canvasArt.js` is the single source of truth for how a photo
is cover-fit and clamped inside its frame slot — both the renderer and the drag
interaction in `PhotoStage.jsx` use it, so what you see while dragging is
pixel-for-pixel what gets exported.

---

## 🎨 Customizing

| Want to change… | Edit |
|---|---|
| Brand colors / gradient stops | `src/lib/theme.js` |
| Site URL, hashtags, socials, event dates | `src/lib/brandAssets.js` |
| The link used in the *shared tweet caption* specifically | `SHARE_LINK` at the top of `src/lib/captions.js` (kept independent from `brandAssets.js` on purpose — update it once you have a live deployment URL, and it won't touch the QR codes or footer) |
| Caption wording | the `OPENERS` bank in `src/lib/captions.js` |
| Builder title word banks / tiers | `src/lib/builderTitle.js` |
| Card / Pass / PFP layout & proportions | `renderCard.js` / `renderSquadCard.js` / `renderPfp.js` — every position is a named constant near the top of each file |

---

## 📦 Deploying

It's a static site — `npm run build` outputs `dist/`, deployable anywhere static:
**Vercel**, **Netlify**, **GitHub Pages**, **Cloudflare Pages**. No server, no secrets,
no config.

---

## 🙌 Credits

Built for **Hacker House Goa 2026**.
`#FrameInGoa` · `#HackerHouseGoa`

---

<p align="center">
  <sub>Made with 🌴, canvas gradients, and a slightly-too-ambitious lanyard animation.</sub>
</p>

---

## 💳 Card Design

<img width="1200" height="1640" alt="image" src="https://github.com/user-attachments/assets/648e04b6-dedd-439c-b4e3-7624aae1e35f" />

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/9728b3b1-3ac0-4b8b-a9f9-84713b70fc04" />

<img width="1080" height="1080" alt="image" src="https://github.com/user-attachments/assets/9ddea041-0a38-41df-a764-e2fe233fdc7c" />

---

## 📸 Screenshots

<img width="806" height="1640" alt="image" src="https://github.com/user-attachments/assets/41ff1413-cf47-4393-97e5-9d427946e39f" />

<img width="806" height="1640" alt="image" src="https://github.com/user-attachments/assets/5f83acd5-565a-4e92-8955-ea997d0f5957" />

<img width="806" height="1640" alt="image" src="https://github.com/user-attachments/assets/71f8f754-50b8-4794-8ca6-4a12f50bedd2" />

<img width="806" height="1640" alt="image" src="https://github.com/user-attachments/assets/ee274cb1-3c5e-42a1-87e0-a77db846ab83" />

<img width="806" height="1640" alt="image" src="https://github.com/user-attachments/assets/8acd0dad-d36b-46e5-87af-972fb2834426" />

<img width="806" height="1640" alt="image" src="https://github.com/user-attachments/assets/e279f7fc-4284-47b7-a9bd-6bad526c8316" />

<img width="806" height="1640" alt="image" src="https://github.com/user-attachments/assets/31a1adf0-aaf5-4332-a984-2376d7110d22" />

<img width="806" height="1640" alt="image" src="https://github.com/user-attachments/assets/b2c69cff-89d7-4c1b-8a6b-557bad55811e" />

<img width="806" height="1640" alt="image" src="https://github.com/user-attachments/assets/b85a6367-572a-4fdb-9f83-54b6089df755" />
