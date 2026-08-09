# HH Goa 2026 — Frame Maker

A no-login, upload-to-share graphic generator for Hacker House Goa 2026, built for the
shortlisting task. Two formats:

- **PFP Frame** — circular neon ring badge, ready to use as an X profile picture.
- **Builder ID Card** — full event badge with photo, name, handle, generated "builder
  title," stack, QR code, barcode, and serial ID.

Everything runs client-side: upload → drag/zoom to frame the photo → download or share.
No backend, no signup, nothing leaves the browser except the actual share action.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
```

Node 18+ recommended.

## How it's built

- **React + Vite**, styled with **Tailwind v4** (theme tokens for the brand palette in
  `src/index.css`).
- The actual graphic is drawn with the **Canvas 2D API** — no external image assets, no
  server-rendered images. Everything (gradients, palm silhouettes, the neon ring,
  curved "VERIFIED" stamp text, QR code, barcode) is drawn in code, so it scales to any
  export resolution and never looks like a logo pasted on a template.
- Fonts (Space Grotesk, Baloo 2 for the Devanagari "गोवा," JetBrains Mono) are bundled
  locally via `@fontsource` — no runtime dependency on Google Fonts, so it still works
  offline or on locked-down networks.

### Project structure

```
src/
  lib/
    theme.js          brand color tokens + neon gradient helper
    canvasArt.js       shared drawing primitives (background texture, rounded rects,
                       curved/arc text, verified badge, cover-fit pan/zoom geometry)
    renderPfp.js       Format: circular PFP frame renderer
    renderCard.js      Format: Builder ID Card renderer (+ shared header/footer
                       drawing helpers reused by the team card)
    renderTeamCard.js  Format: horizontal Team/Squad Pass renderer (up to 3 members)
    brandAssets.js     preloads the logo/badge images (with fallback) + static QR
    codes.js           QR code + barcode generation, serial ID
    captions.js         X share caption templates (8+ per format) + shuffler
    builderTitle.js    fun "builder title" / tier generator + default form state
    loadImage.js       HEIC/HEIF -> JPEG conversion + File -> <img> loader
    shareToX.js        download + Share-to-X logic (native share / intent fallback)
  components/
    UploadZone.jsx      drag-and-drop / tap-to-upload
    PhotoStage.jsx      the live interactive canvas (drag-to-pan, pinch/scroll/slider zoom)
    BuilderForm.jsx     solo card fields: name / handle / tier / title / stack
    TeamForm.jsx        team fields: squad name, up to 3 member photo+name slots,
                        team lead handle, tier, title, stack
    StackInput.jsx      shared stack/role input with suggestion chips
    CardCanvas.jsx      non-interactive canvas, used by the showcase mockups
    LanyardDisplay.jsx  lanyard/ID-frame mockup + drag-to-swing (Builder ID Card)
    TiltCardDisplay.jsx 3D tilt "plastic card" mockup (Team/Squad Pass)
    ActionBar.jsx       Download button + "Share to X" (opens the share modal)
    ShareModal.jsx      caption shuffle/copy/direct-share popup
    Footer.jsx          credit + hhgoa.com + apply-now links
  App.jsx               ties it all together
```

`computeCoverGeometry()` in `canvasArt.js` is the single source of truth for how a
photo is cover-fit and clamped inside its frame slot — both the renderer and the
drag-interaction code in `PhotoStage.jsx` call it, so what you see while dragging is
pixel-for-pixel what gets exported.

## What's new in this version

- **Three formats**: PFP Frame, Builder ID Card, and Team/Squad Pass (up to 3 members,
  each with their own photo + name), toggled via a nested format switcher. Builder
  ID Card is the default view.
- **Flow order**: upload/photo-framing → form → live card preview, for every format.
- **Decorative showcases**: the Builder ID Card preview is wrapped in a lanyard/ID-frame
  mockup you can drag to swing; the Team/Squad Pass preview is wrapped in a 3D tilt
  "plastic card" mockup that follows your pointer/drag. Both are purely visual — the
  actual download/share always uses the flat card artwork underneath, not the mockup
  chrome. (`src/components/LanyardDisplay.jsx`, `TiltCardDisplay.jsx`)
- **Stack/role suggestions**: five common stack chips under that field on both forms —
  click to fill, or just type your own. (`src/components/StackInput.jsx`)
- **Share modal**: clicking "Share to X" opens a caption editor with 8 shuffle-able
  templates per format (PFP / solo card / team card), a mandatory dates + link +
  hashtag footer, a Copy-text button, and a direct Share-to-X action.
  (`src/lib/captions.js`, `src/components/ShareModal.jsx`)
- **Brand image slots** — see below, this needs one thing from you.

### ⚠️ Add your two brand images

Two places in the UI now look for image assets instead of drawing text, with a
graceful text fallback if the files aren't there yet (nothing breaks either way):

| What it replaces | Expected path | Used in |
|---|---|---|
| The "HACKER गोवा HOUSE" wordmark | `public/brand/title-logo.png` | Page header, both card formats |
| The "12:00 AM · STUDIO" timestamp badge | `public/brand/studio-badge.png` | Both card formats (top-right corner) |

Drop your PNGs (transparent background recommended) at those exact paths and they'll
show up immediately — no code changes needed. Until then, the app falls back to the
original drawn text/timestamp automatically. If you'd rather use different filenames,
they're both defined as constants at the top of `src/lib/brandAssets.js`.

The QR code on both cards is now fixed (always encodes `https://hhgoa.com`) and is
generated once on load rather than per-card, so it's not tied to the person's name
the way the barcode/serial ID still is.

## Requirement-by-requirement notes

**Upload formats (jpg/png/HEIC).** Handled in `lib/loadImage.js`. HEIC/HEIF (iPhone
default) is detected by MIME type or extension and converted to JPEG client-side via
`heic2any`, which is dynamically imported — so non-iPhone users never download that
code at all (check the network tab: it's a separate ~1.3MB chunk that only loads when
actually needed).

**Real photos, any crop.** The photo is never force-cropped on upload. It's cover-fit
into the frame slot by default, and the user can drag to reposition and zoom
(slider, mouse wheel, or two-finger pinch) before exporting — this covers portrait,
landscape, and off-center faces without asking the user to pre-crop.

**Speed.** There's no "Generate" step or loading screen — the canvas re-renders live
as you type or drag, throttled to one redraw per animation frame. The only genuinely
async step is HEIC conversion on upload, which shows an inline "Reading your photo…"
state for the second it takes.

**Downloadable output.** `canvas.toBlob()` → a real PNG file via a synthetic
`<a download>` click (see `downloadCanvasPNG` in `shareToX.js`). Not a screenshot, not
CSS-only — an actual image file, full export resolution (1080×1080 for the PFP,
1200×1640 for the card).

**Share to X — and the honest caveat.** This is a static, backend-less app, which
shaped the share design:

- On mobile browsers / the X app (anywhere `navigator.canShare({ files })` is
  supported), **Share to X attaches the generated PNG directly** via the native Web
  Share sheet — this is the "image attached" path the brief asks for, and it's the
  primary path most users (mobile-first, per the brief) will hit.
- On desktop, or wherever the native file-share API isn't available, it falls back to
  downloading the PNG *and* opening a pre-filled X compose tab (caption +
  `#FrameInGoa` already in the text box) — the user attaches the just-downloaded image
  in one extra click.
- **What I didn't build:** a dynamic OG-image link-preview flow (share a link whose
  `og:image` shows the actual generated graphic to people who haven't opened the app).
  That requires a backend — somewhere to upload the generated PNG to, a stable URL per
  share, and a page that serves the right `og:image` meta tag for that URL — which
  isn't possible from a pure static frontend. If you want that path instead of/in
  addition to direct-attach sharing, the clean way to add it on top of this codebase:
  1. Swap this to a Next.js app (or add a small serverless function alongside it).
  2. On "Share," POST the canvas PNG (as a blob) to an API route that uploads it to
     object storage (Vercel Blob, S3, Cloudinary, etc.) and returns a short ID.
  3. Serve `/share/[id]` with `og:image` pointing at that stored image, and redirect
     real visitors to a nice view of the graphic.
  4. Point the X intent link at `/share/[id]` instead of using `text`-only intent.
  I didn't want to hand you a half-wired backend with fake/placeholder storage
  credentials, so I built the fully-working direct-attach path instead and documented
  this rather than leaving it silently unbuilt.

**Mobile-friendly.** Single-column, mobile-first layout (max-width column that's
centered on desktop too); the canvas uses Pointer Events for drag (works for mouse and
single-touch) plus dedicated touch handlers for two-finger pinch-zoom; buttons are
full-width and thumb-sized.

**No login wall.** There isn't one. Nothing is uploaded to a server — the photo lives
in the browser tab (`URL.createObjectURL`) and is discarded when you leave the page.

## Deploying

It's a static site — `npm run build` produces `dist/`, deployable anywhere static
(Vercel, Netlify, GitHub Pages, Cloudflare Pages). No environment variables, no server
config needed for the app as shipped.

## Customizing

- Brand colors / gradient stops: `src/lib/theme.js`.
- Event dates, hashtag, domain: search for `28 – 31 OCT`, `#FrameInGoa`, and
  `hhgoa.com` across `src/lib/renderCard.js` and `renderPfp.js`.
- Builder title word banks / tiers: `src/lib/builderTitle.js`.
- Card/PFP layout and proportions: `renderCard.js` / `renderPfp.js` — every position is
  computed from a small number of named constants near the top of each file.
