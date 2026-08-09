import { COLORS, neonGradient, FONT_DISPLAY, FONT_MONO } from './theme.js'

export function roundRect(ctx, x, y, w, h, r) {
  const rr = typeof r === 'number' ? { tl: r, tr: r, br: r, bl: r } : r
  ctx.beginPath()
  ctx.moveTo(x + rr.tl, y)
  ctx.lineTo(x + w - rr.tr, y)
  ctx.arcTo(x + w, y, x + w, y + rr.tr, rr.tr)
  ctx.lineTo(x + w, y + h - rr.br)
  ctx.arcTo(x + w, y + h, x + w - rr.br, y + h, rr.br)
  ctx.lineTo(x + rr.bl, y + h)
  ctx.arcTo(x, y + h, x, y + h - rr.bl, rr.bl)
  ctx.lineTo(x, y + rr.tl)
  ctx.arcTo(x, y, x + rr.tl, y, rr.tl)
  ctx.closePath()
}

function drawPalm(ctx, x, y, scale = 1, opacity = 0.10) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.fillStyle = `rgba(180, 240, 190, ${opacity})`

  ctx.beginPath()
  ctx.moveTo(-4, 0)
  ctx.bezierCurveTo(-10, -40, 6, -70, 2, -110)
  ctx.lineTo(10, -110)
  ctx.bezierCurveTo(16, -70, 2, -40, 6, 0)
  ctx.closePath()
  ctx.fill()

  const frondAngles = [-70, -35, -5, 25, 55, 85]
  frondAngles.forEach((deg) => {
    const a = (deg * Math.PI) / 180
    ctx.save()
    ctx.translate(6, -110)
    ctx.rotate(a)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(45, -6, 90, 10)
    ctx.quadraticCurveTo(48, 4, 0, 6)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  })
  ctx.restore()
}

export function drawBackground(ctx, W, H, opts = {}) {
  const { palms = true, grid = true } = opts

  const rg = ctx.createRadialGradient(W * 0.5, H * 0.32, H * 0.05, W * 0.5, H * 0.55, H * 0.85)
  rg.addColorStop(0, COLORS.bgPanel)
  rg.addColorStop(0.55, COLORS.bgMid)
  rg.addColorStop(1, COLORS.bgDeep)
  ctx.fillStyle = rg
  ctx.fillRect(0, 0, W, H)

  if (grid) {
    ctx.save()
    ctx.strokeStyle = 'rgba(120, 220, 160, 0.06)'
    ctx.lineWidth = 1
    const step = Math.max(28, Math.floor(W / 26))
    for (let gx = 0; gx <= W; gx += step) {
      ctx.beginPath()
      ctx.moveTo(gx, 0)
      ctx.lineTo(gx, H)
      ctx.stroke()
    }
    for (let gy = 0; gy <= H; gy += step) {
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.lineTo(W, gy)
      ctx.stroke()
    }
    ctx.restore()
  }

  if (palms) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    drawPalm(ctx, W * 0.06, H * 0.99, (W / 1200) * 1.1, 0.09)
    drawPalm(ctx, W * 0.97, H * 1.0, (W / 1200) * 0.85, 0.07)
    drawPalm(ctx, W * -0.02, H * 0.55, (W / 1200) * 0.6, 0.05)
    ctx.restore()
  }

  const vg = ctx.createRadialGradient(W * 0.5, H * 0.5, H * 0.35, W * 0.5, H * 0.5, H * 0.75)
  vg.addColorStop(0, 'rgba(0,0,0,0)')
  vg.addColorStop(1, 'rgba(0,0,0,0.45)')
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, W, H)
}

export function drawChevronAccent(ctx, x, y, w, h, color, mirrored = false) {
  ctx.save()
  ctx.translate(x, y)
  if (mirrored) ctx.scale(-1, 1)
  ctx.strokeStyle = color
  ctx.lineWidth = Math.max(2, w * 0.045)
  ctx.lineCap = 'round'
  ctx.globalAlpha = 0.85
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(w * 0.65, h * 0.5)
  ctx.lineTo(0, h)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(w * 0.65, h * 0.5, Math.max(2.5, w * 0.06), 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}

export function arcTextTop(ctx, text, cx, cy, radius, opts = {}) {
  const { font, color = COLORS.cream, letterSpacing = 0 } = opts
  ctx.save()
  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.translate(cx, cy)

  let total = 0
  for (const ch of text) total += ctx.measureText(ch).width + letterSpacing
  ctx.rotate(-total / (2 * radius))

  for (const ch of text) {
    const w = ctx.measureText(ch).width + letterSpacing
    const theta = w / radius
    ctx.rotate(theta / 2)
    ctx.save()
    ctx.translate(0, -radius)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
    ctx.rotate(theta / 2)
  }
  ctx.restore()
}

export function arcTextBottom(ctx, text, cx, cy, radius, opts = {}) {
  const { font, color = COLORS.cream, letterSpacing = 0 } = opts
  ctx.save()
  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.translate(cx, cy)

  let total = 0
  for (const ch of text) total += ctx.measureText(ch).width + letterSpacing
  ctx.rotate(total / (2 * radius))

  for (const ch of text) {
    const w = ctx.measureText(ch).width + letterSpacing
    const theta = w / radius
    ctx.rotate(-theta / 2)
    ctx.save()
    ctx.translate(0, radius)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
    ctx.rotate(-theta / 2)
  }
  ctx.restore()
}

export function drawVerifiedBadge(ctx, cx, cy, r) {
  ctx.save()
  // outer ring
  const ringGrad = neonGradient(ctx, cx - r, cy - r, cx + r, cy + r)
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(6, 24, 16, 0.92)'
  ctx.fill()
  ctx.lineWidth = r * 0.08
  ctx.strokeStyle = ringGrad
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2)
  ctx.lineWidth = r * 0.03
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.stroke()

  arcTextTop(ctx, '\u2605 VERIFIED \u2605', cx, cy, r * 0.6, {
    font: `700 ${Math.round(r * 0.15)}px ${FONT_MONO}`,
    color: COLORS.cream,
    letterSpacing: r * 0.02,
  })
  arcTextBottom(ctx, 'HH GOA 2026', cx, cy, r * 0.6, {
    font: `700 ${Math.round(r * 0.13)}px ${FONT_MONO}`,
    color: COLORS.cream,
    letterSpacing: r * 0.02,
  })

  ctx.save()
  ctx.translate(cx, cy)
  const s = r * 0.34
  ctx.beginPath()
  ctx.moveTo(0, -s)
  ctx.lineTo(s * 0.85, -s * 0.55)
  ctx.lineTo(s * 0.85, s * 0.25)
  ctx.quadraticCurveTo(s * 0.85, s * 0.95, 0, s * 1.15)
  ctx.quadraticCurveTo(-s * 0.85, s * 0.95, -s * 0.85, s * 0.25)
  ctx.lineTo(-s * 0.85, -s * 0.55)
  ctx.closePath()
  ctx.fillStyle = COLORS.cream
  ctx.fill()
  ctx.strokeStyle = COLORS.pink
  ctx.lineWidth = s * 0.09
  ctx.stroke()

  ctx.beginPath()
  ctx.strokeStyle = COLORS.bgDeep
  ctx.lineWidth = s * 0.18
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.moveTo(-s * 0.42, 0)
  ctx.lineTo(-s * 0.1, s * 0.35)
  ctx.lineTo(s * 0.48, -s * 0.35)
  ctx.stroke()
  ctx.restore()

  ctx.restore()
}

export function computeCoverGeometry(img, dw, dh, transform = {}) {
  const { scale = 1, panX = 0, panY = 0 } = transform
  const iw = img.width
  const ih = img.height

  const baseScale = Math.max(dw / iw, dh / ih)
  const renderScale = baseScale * Math.max(1, scale)
  const rw = iw * renderScale
  const rh = ih * renderScale

  const maxPanX = Math.max(0, (rw - dw) / 2)
  const maxPanY = Math.max(0, (rh - dh) / 2)

  const clampedPanX = Math.min(Math.max(panX, -maxPanX), maxPanX)
  const clampedPanY = Math.min(Math.max(panY, -maxPanY), maxPanY)

  const x = -rw / 2 + dw / 2 + clampedPanX
  const y = -rh / 2 + dh / 2 + clampedPanY

  return { rw, rh, x, y, maxPanX, maxPanY, clampedPanX, clampedPanY }
}

export function drawCoverImage(ctx, img, dx, dy, dw, dh, transform = {}) {
  const geo = computeCoverGeometry(img, dw, dh, transform)
  ctx.save()
  roundRect(ctx, dx, dy, dw, dh, Math.min(dw, dh) * 0.04)
  ctx.clip()
  ctx.drawImage(img, dx + geo.x, dy + geo.y, geo.rw, geo.rh)
  ctx.restore()
}

export function drawContainImage(ctx, img, boxX, boxY, boxW, boxH) {
  const scale = Math.min(boxW / img.width, boxH / img.height)
  const w = img.width * scale
  const h = img.height * scale
  const x = boxX + (boxW - w) / 2
  const y = boxY + (boxH - h) / 2
  ctx.drawImage(img, x, y, w, h)
  return { x, y, w, h }
}

export function pill(ctx, x, y, w, h, r, fill) {
  roundRect(ctx, x, y, w, h, r)
  if (typeof fill === 'string') {
    ctx.fillStyle = fill
    ctx.fill()
  } else {
    ctx.fillStyle = fill
    ctx.fill()
  }
}

export function fitText(ctx, text, maxWidth, baseSize, family, weight = 700) {
  let size = baseSize
  ctx.font = `${weight} ${size}px ${family}`
  while (ctx.measureText(text).width > maxWidth && size > 10) {
    size -= 1
    ctx.font = `${weight} ${size}px ${family}`
  }
  return size
}

export { FONT_DISPLAY, FONT_MONO }