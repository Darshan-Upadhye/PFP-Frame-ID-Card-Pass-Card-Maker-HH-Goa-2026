import { COLORS, neonGradient } from './theme.js'
import { drawBackground, drawCoverImage, arcTextTop, arcTextBottom, FONT_DISPLAY, FONT_MONO } from './canvasArt.js'

export const PFP_SIZE = 1080
export const PFP_OUTER_R = PFP_SIZE * 0.478
export const PFP_RING_WIDTH = PFP_SIZE * 0.09
export const PFP_PHOTO_R = PFP_OUTER_R - PFP_RING_WIDTH
export const PFP_PHOTO_DIAMETER = PFP_PHOTO_R * 2

export async function renderPfp(ctx, { image, transform }) {
  const W = PFP_SIZE, H = PFP_SIZE
  const cx = W / 2, cy = H / 2

  ctx.clearRect(0, 0, W, H)
  drawBackground(ctx, W, H, { palms: true, grid: true })

  const outerR = PFP_OUTER_R
  const photoR = PFP_PHOTO_R

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(8, 30, 20, 0.9)'
  ctx.fill()
  ctx.restore()

  if (image) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, photoR, 0, Math.PI * 2)
    ctx.clip()
    drawCoverImage(ctx, image, cx - photoR, cy - photoR, photoR * 2, photoR * 2, transform)
    ctx.restore()
  } else {
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, photoR, 0, Math.PI * 2)
    ctx.fillStyle = '#0c2417'
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = `600 26px ${FONT_DISPLAY}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Upload a photo', cx, cy)
    ctx.restore()
  }

  const textR = (outerR + photoR) / 2
  arcTextTop(ctx, 'HACKER HOUSE GOA \u2605 2026 \u2605', cx, cy, textR + 6, {
    font: `800 ${Math.round(W * 0.034)}px ${FONT_DISPLAY}`,
    color: COLORS.yellow,
    letterSpacing: 4,
  })
  arcTextBottom(ctx, '#FRAMEINGOA \u2022 28\u201331 OCT', cx, cy, textR + 2, {
    font: `700 ${Math.round(W * 0.028)}px ${FONT_MONO}`,
    color: COLORS.cream,
    letterSpacing: 3,
  })

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
  ctx.lineWidth = 8
  ctx.strokeStyle = neonGradient(ctx, cx - outerR, cy - outerR, cx + outerR, cy + outerR)
  ctx.shadowColor = 'rgba(255, 47, 184, 0.55)'
  ctx.shadowBlur = 22
  ctx.stroke()
  ctx.restore()

  function sparkle(px, py, r, color) {
    ctx.save()
    ctx.translate(px, py)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(0, -r); ctx.lineTo(r * 0.28, -r * 0.28)
    ctx.lineTo(r, 0); ctx.lineTo(r * 0.28, r * 0.28)
    ctx.lineTo(0, r); ctx.lineTo(-r * 0.28, r * 0.28)
    ctx.lineTo(-r, 0); ctx.lineTo(-r * 0.28, -r * 0.28)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
  sparkle(cx - textR, cy, W * 0.014, COLORS.cyan)
  sparkle(cx + textR, cy, W * 0.014, COLORS.yellow)

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, photoR, 0, Math.PI * 2)
  ctx.lineWidth = 6
  ctx.strokeStyle = neonGradient(ctx, cx - photoR, cy - photoR, cx + photoR, cy + photoR)
  ctx.stroke()
  ctx.restore()

}