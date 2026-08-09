import { COLORS, neonGradient } from './theme.js'
import {
  roundRect, drawBackground, drawChevronAccent, drawVerifiedBadge,
  drawCoverImage, drawContainImage, fitText, FONT_DISPLAY, FONT_MONO,
} from './canvasArt.js'
import { makeBarcodeCanvas, makeSerialId } from './codes.js'

export const CARD_W = 1200
export const CARD_H = 1640
export const CARD_PHOTO_W = 590
export const CARD_PHOTO_H = 590
export const CARD_PHOTO_X = CARD_W / 2 - CARD_PHOTO_W / 2
export const CARD_PHOTO_Y = 392

export function formatStack(raw, fallback = 'TypeScript / Node / GraphQL') {
  if (!raw) return fallback
  return raw
    .split(/[,/]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(' / ')
}

function formatTimestamp(d) {
  let h = d.getHours()
  const m = d.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`
}

function drawMultiRunLine(ctx, runs, cx, y) {
  let total = 0
  runs.forEach((r) => {
    ctx.font = r.font
    total += ctx.measureText(r.text).width + (r.gap || 0)
  })
  let x = cx - total / 2
  runs.forEach((r) => {
    ctx.font = r.font
    ctx.fillStyle = r.color
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.save()
    if (r.rotate) {
      const w = ctx.measureText(r.text).width
      ctx.translate(x + w / 2, y)
      ctx.rotate(r.rotate)
      ctx.fillText(r.text, -w / 2, 0)
      ctx.restore()
    } else {
      ctx.fillText(r.text, x, y)
      ctx.restore()
    }
    x += ctx.measureText(r.text).width + (r.gap || 0)
  })
}

export function drawCardHeader(ctx, { W, brand, eyebrow = 'BUILDER ID CARD', withLanyard = true }) {
  if (withLanyard) {
    ctx.save()
    ctx.fillStyle = COLORS.green
    roundRect(ctx, W / 2 - 55, -50, 110, 150, 14)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(W / 2, 30, 12, 0, Math.PI * 2)
    ctx.fillStyle = COLORS.bgDeep
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = COLORS.yellowSoft
    ctx.stroke()
    ctx.fillStyle = '#141414'
    roundRect(ctx, W / 2 - 46, 88, 92, 40, 8)
    ctx.fill()
    ctx.restore()
  }

  if (brand?.studioBadge) {
    drawContainImage(ctx, brand.studioBadge, W - 210, 108, 140, 80)
  } else {
    ctx.save()
    ctx.textAlign = 'right'
    ctx.fillStyle = COLORS.yellow
    ctx.font = `700 26px ${FONT_MONO}`
    ctx.fillText(formatTimestamp(new Date()), W - 90, 150)
    ctx.font = `600 16px ${FONT_MONO}`
    ctx.fillStyle = COLORS.yellowSoft
    ctx.fillText('STUDIO', W - 90, 174)
    ctx.restore()
  }

  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = COLORS.yellowSoft
  ctx.font = `700 26px ${FONT_MONO}`
  ctx.textBaseline = 'alphabetic'
  ctx.letterSpacing = '6px'
  ctx.fillText(eyebrow.split('').join('\u200a').toUpperCase(), W / 2, 168)
  ctx.letterSpacing = '0px'
  ctx.restore()

  if (brand?.titleLogo) {
    drawContainImage(ctx, brand.titleLogo, W / 2 - 350, 182, 700, 132)
  } else {
    drawMultiRunLine(ctx, [
      { text: 'HACKER', font: `800 66px ${FONT_DISPLAY}`, color: COLORS.yellow, gap: 18 },
      { text: 'गोवा', font: `800 78px "Baloo 2"`, color: COLORS.pink, gap: 18, rotate: -0.05 },
      { text: 'HOUSE', font: `800 66px ${FONT_DISPLAY}`, color: COLORS.yellow, gap: 0 },
    ], W / 2, 260)

    ctx.save()
    ctx.textAlign = 'center'
    ctx.fillStyle = COLORS.pinkSoft
    ctx.font = `700 20px ${FONT_MONO}`
    ctx.fillText('26', W / 2, 288)
    ctx.restore()
  }

  drawChevronAccent(ctx, 150, 205, 90, 70, COLORS.yellow, false)
  drawChevronAccent(ctx, W - 150, 205, 90, 70, COLORS.pink, true)

  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = COLORS.yellowSoft
  ctx.font = `700 27px ${FONT_MONO}`
  ctx.fillText('GOA, INDIA  \u2022  28 \u2013 31 OCT 2026', W / 2, 356)
  ctx.restore()
}

export function drawCardFooter(ctx, { W, cursorY, brand, serial, leftX = 70, rightX }) {
  rightX = rightX ?? W - 70
  const qrSize = 108
  const boxSize = qrSize + 20

  ctx.save()
  roundRect(ctx, leftX, cursorY, boxSize, boxSize, 12)
  ctx.fillStyle = COLORS.cream
  ctx.fill()
  ctx.strokeStyle = COLORS.pink
  ctx.lineWidth = 2
  ctx.stroke()
  if (brand?.siteQrCanvas) {
    ctx.drawImage(brand.siteQrCanvas, leftX + 10, cursorY + 10, qrSize, qrSize)
  }
  ctx.restore()

  const textX = leftX + boxSize + 24
  ctx.save()
  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(240,244,238,0.7)'
  ctx.font = `600 17px ${FONT_MONO}`
  ctx.fillText('SCAN \u2022 HHGOA.COM', textX, cursorY + 26)
  ctx.fillStyle = COLORS.yellowSoft
  ctx.font = `700 24px ${FONT_MONO}`
  ctx.fillText(`#${serial}`, textX, cursorY + 54)
  ctx.restore()

  const barcodeW = Math.min(230, rightX - textX - 210)
  const barcodeCanvas = makeBarcodeCanvas(serial, barcodeW, 44)
  ctx.save()
  roundRect(ctx, textX, cursorY + 66, barcodeW + 16, 46, 6)
  ctx.fillStyle = COLORS.cream
  ctx.fill()
  ctx.drawImage(barcodeCanvas, textX + 8, cursorY + 69, barcodeW, 40)
  ctx.restore()

  ctx.save()
  ctx.textAlign = 'right'
  ctx.fillStyle = COLORS.cream
  ctx.font = `800 28px ${FONT_DISPLAY}`
  ctx.fillText('#FrameInGoa', rightX, cursorY + 42)
  ctx.fillStyle = COLORS.yellowSoft
  ctx.font = `600 22px ${FONT_MONO}`
  ctx.fillText('hhgoa.com', rightX, cursorY + 72)
  ctx.restore()

  return cursorY + boxSize + 30
}

export function renderIdCard(ctx, { image, transform, name, handle, tier, builderTitle, stack, serial, brand }) {
  const W = CARD_W, H = CARD_H
  ctx.clearRect(0, 0, W, H)

  drawBackground(ctx, W, H)

  const margin = 16
  ctx.save()
  roundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, 46)
  ctx.lineWidth = 6
  ctx.strokeStyle = neonGradient(ctx, margin, margin, W - margin, H - margin)
  ctx.stroke()
  ctx.restore()

  ctx.save()
  roundRect(ctx, margin + 12, margin + 12, W - (margin + 12) * 2, H - (margin + 12) * 2, 36)
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.stroke()
  ctx.restore()

  drawCardHeader(ctx, { W, brand, eyebrow: 'BUILDER ID CARD' })

  const photoW = CARD_PHOTO_W, photoH = CARD_PHOTO_H
  const photoX = CARD_PHOTO_X
  const photoY = CARD_PHOTO_Y

  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 40
  ctx.shadowOffsetY = 18
  roundRect(ctx, photoX, photoY, photoW, photoH, 26)
  ctx.fillStyle = COLORS.bgDeep
  ctx.fill()
  ctx.restore()

  if (image) {
    drawCoverImage(ctx, image, photoX, photoY, photoW, photoH, transform)
  } else {
    ctx.save()
    roundRect(ctx, photoX, photoY, photoW, photoH, 26)
    ctx.fillStyle = '#0c2417'
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.font = `600 24px ${FONT_DISPLAY}`
    ctx.textAlign = 'center'
    ctx.fillText('Upload a photo', photoX + photoW / 2, photoY + photoH / 2)
    ctx.restore()
  }

  ctx.save()
  roundRect(ctx, photoX, photoY, photoW, photoH, 26)
  ctx.lineWidth = 7
  ctx.strokeStyle = neonGradient(ctx, photoX, photoY, photoX + photoW, photoY + photoH)
  ctx.stroke()
  ctx.restore()

  drawVerifiedBadge(ctx, photoX + photoW - 18, photoY + photoH - 8, 78)

  const tierText = (tier || 'ELITE HACKER').toUpperCase()
  ctx.save()
  ctx.font = `700 26px ${FONT_MONO}`
  const tierW = Math.min(500, ctx.measureText(tierText).width + 60)
  const tierX = W / 2 - tierW / 2
  const tierY = photoY + photoH + 34
  roundRect(ctx, tierX, tierY, tierW, 54, 27)
  ctx.fillStyle = 'rgba(18,58,36,0.7)'
  ctx.fill()
  ctx.strokeStyle = COLORS.yellow
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = COLORS.yellow
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(tierText, W / 2, tierY + 29)
  ctx.restore()

  const nameText = (name || 'YOUR NAME').toUpperCase()
  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = COLORS.cream
  const nameSize = fitText(ctx, nameText, W - 140, 62, FONT_DISPLAY, 800)
  ctx.font = `800 ${nameSize}px ${FONT_DISPLAY}`
  ctx.fillText(nameText, W / 2, tierY + 54 + 60)
  ctx.restore()

  const handleText = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : '@yourhandle'
  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = COLORS.yellow
  ctx.font = `600 30px ${FONT_MONO}`
  ctx.fillText(handleText, W / 2, tierY + 54 + 102)
  ctx.restore()

  let cursorY = tierY + 54 + 150

  const titleText = (builderTitle || 'FULL-STACK SUNSET SHIPPER').toUpperCase()
  ctx.save()
  const btW = W - 140
  const btH = 68
  const btX = 70
  roundRect(ctx, btX, cursorY, btW, btH, 14)
  const btGrad = ctx.createLinearGradient(btX, 0, btX + btW, 0)
  btGrad.addColorStop(0, COLORS.pink)
  btGrad.addColorStop(1, '#c400a0')
  ctx.fillStyle = btGrad
  ctx.fill()
  ctx.fillStyle = COLORS.cream
  const btSize = fitText(ctx, titleText, btW - 60, 30, FONT_DISPLAY, 700)
  ctx.font = `700 ${btSize}px ${FONT_DISPLAY}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(titleText, W / 2, cursorY + btH / 2 + 2)
  ctx.restore()

  cursorY += btH + 26

  const stackText = formatStack(stack)
  ctx.save()
  ctx.font = `700 26px ${FONT_MONO}`
  const labelText = 'STACK:'
  const labelPad = 28
  const labelW = ctx.measureText(labelText).width + labelPad * 2
  const rowH = 58
  const rowX = 70
  const rowW = W - 140

  roundRect(ctx, rowX, cursorY, labelW, rowH, 12)
  ctx.strokeStyle = COLORS.yellow
  ctx.lineWidth = 2
  ctx.fillStyle = 'rgba(18,58,36,0.5)'
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = COLORS.yellow
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(labelText, rowX + labelW / 2, cursorY + rowH / 2 + 1)

  const valX = rowX + labelW + 14
  const valW = rowW - labelW - 14
  roundRect(ctx, valX, cursorY, valW, rowH, 12)
  ctx.strokeStyle = COLORS.greenLine
  ctx.fillStyle = 'rgba(255,255,255,0.03)'
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = COLORS.cream
  const stackSize = fitText(ctx, stackText, valW - 40, 26, FONT_MONO, 500)
  ctx.font = `500 ${stackSize}px ${FONT_MONO}`
  ctx.textAlign = 'center'
  ctx.fillText(stackText, valX + valW / 2, cursorY + rowH / 2 + 1)
  ctx.restore()

  cursorY += rowH + 36

  const finalSerial = serial || makeSerialId(name)
  cursorY = drawCardFooter(ctx, { W, cursorY, brand, serial: finalSerial })

  ctx.save()
  roundRect(ctx, W / 2 - 220, cursorY, 440, 6, 3)
  ctx.fillStyle = neonGradient(ctx, W / 2 - 220, 0, W / 2 + 220, 0)
  ctx.fill()
  ctx.restore()
}