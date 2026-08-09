import { COLORS, neonGradient } from './theme.js'
import {
  roundRect, drawBackground, drawCoverImage, fitText, FONT_DISPLAY, FONT_MONO,
} from './canvasArt.js'
import { makeSerialId } from './codes.js'
import { drawCardHeader, drawCardFooter, formatStack } from './renderCard.js'

export const TEAM_W = 1920
export const TEAM_H = 1200

export const TEAM_MEMBER_SLOT = 220

export function teamMemberSlots(count) {
  const gap = 34
  const totalW = count * TEAM_MEMBER_SLOT + (count - 1) * gap
  const startX = TEAM_W * 0.5 - 435 - totalW / 2
  const y = 580
  return Array.from({ length: count }, (_, i) => ({
    x: startX + i * (TEAM_MEMBER_SLOT + gap),
    y,
  }))
}

export function renderTeamCard(ctx, { members, transform, teamName, leadHandle, tier, builderTitle, stack, serial, brand }) {
  const W = TEAM_W, H = TEAM_H
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

  drawCardHeader(ctx, { W, brand, eyebrow: 'SQUAD PASS' })

  const dividerX = W * 0.5 + 40
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(dividerX, 392)
  ctx.lineTo(dividerX, H - 70)
  ctx.stroke()
  ctx.restore()

  const leftX0 = 70
  const leftX1 = dividerX - 40
  const rightX0 = dividerX + 40
  const rightX1 = W - 70

  ctx.save()
  ctx.textAlign = 'left'
  ctx.fillStyle = COLORS.yellowSoft
  ctx.font = `700 22px ${FONT_MONO}`
  ctx.fillText('SQUAD / TEAM NAME', leftX0, 420)
  ctx.restore()

  const teamText = (teamName || 'UNNAMED SQUAD').toUpperCase()
  ctx.save()
  ctx.textAlign = 'left'
  ctx.fillStyle = COLORS.cream
  const teamSize = fitText(ctx, teamText, leftX1 - leftX0, 54, FONT_DISPLAY, 800)
  ctx.font = `800 ${teamSize}px ${FONT_DISPLAY}`
  ctx.fillText(teamText, leftX0, 472)
  ctx.restore()

  const tierText = (tier || 'ELITE HACKER').toUpperCase()
  ctx.save()
  ctx.font = `700 22px ${FONT_MONO}`
  const tierW = ctx.measureText(tierText).width + 50
  roundRect(ctx, leftX0, 498, tierW, 46, 23)
  ctx.fillStyle = 'rgba(18,58,36,0.7)'
  ctx.fill()
  ctx.strokeStyle = COLORS.yellow
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = COLORS.yellow
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(tierText, leftX0 + tierW / 2, 498 + 24)
  ctx.restore()

  const handleText = leadHandle ? (leadHandle.startsWith('@') ? leadHandle : `@${leadHandle}`) : '@teamlead'
  ctx.save()
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = COLORS.cream
  ctx.font = `600 24px ${FONT_MONO}`
  ctx.fillText(`Lead: ${handleText}`, leftX0 + tierW + 20, 498 + 24)
  ctx.restore()

  const roster = (members && members.length > 0) ? members.slice(0, 3) : [null]
  const slots = teamMemberSlots(roster.length)

  roster.forEach((member, i) => {
    const { x, y } = slots[i]
    const size = TEAM_MEMBER_SLOT

    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur = 24
    ctx.shadowOffsetY = 10
    roundRect(ctx, x, y, size, size, 20)
    ctx.fillStyle = COLORS.bgDeep
    ctx.fill()
    ctx.restore()

    if (member && member.image) {
      drawCoverImage(ctx, member.image, x, y, size, size, member.transform || transform || {})
    } else {
      ctx.save()
      roundRect(ctx, x, y, size, size, 20)
      ctx.fillStyle = '#0c2417'
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.font = `600 40px ${FONT_DISPLAY}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('+', x + size / 2, y + size / 2 - 4)
      ctx.restore()
    }

    ctx.save()
    roundRect(ctx, x, y, size, size, 20)
    ctx.lineWidth = 5
    ctx.strokeStyle = neonGradient(ctx, x, y, x + size, y + size)
    ctx.stroke()
    ctx.restore()

    const memberName = (member && member.name) ? member.name.toUpperCase() : `MEMBER ${i + 1}`
    ctx.save()
    ctx.textAlign = 'center'
    ctx.fillStyle = COLORS.cream
    const nSize = fitText(ctx, memberName, size + 20, 22, FONT_MONO, 700)
    ctx.font = `700 ${nSize}px ${FONT_MONO}`
    ctx.fillText(memberName, x + size / 2, y + size + 34)
    ctx.restore()
  })

  let cursorY = 420

  const titleText = (builderTitle || 'FULL-STACK SUNSET SHIPPER').toUpperCase()
  ctx.save()
  const btW = rightX1 - rightX0
  const btH = 66
  roundRect(ctx, rightX0, cursorY, btW, btH, 14)
  const btGrad = ctx.createLinearGradient(rightX0, 0, rightX0 + btW, 0)
  btGrad.addColorStop(0, COLORS.pink)
  btGrad.addColorStop(1, '#c400a0')
  ctx.fillStyle = btGrad
  ctx.fill()
  ctx.fillStyle = COLORS.cream
  const btSize = fitText(ctx, titleText, btW - 50, 28, FONT_DISPLAY, 700)
  ctx.font = `700 ${btSize}px ${FONT_DISPLAY}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(titleText, rightX0 + btW / 2, cursorY + btH / 2 + 2)
  ctx.restore()

  cursorY += btH + 24

  const stackText = formatStack(stack)
  ctx.save()
  ctx.font = `700 24px ${FONT_MONO}`
  const labelText = 'STACK:'
  const labelW = ctx.measureText(labelText).width + 50
  const rowH = 54
  roundRect(ctx, rightX0, cursorY, labelW, rowH, 12)
  ctx.strokeStyle = COLORS.yellow
  ctx.lineWidth = 2
  ctx.fillStyle = 'rgba(18,58,36,0.5)'
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = COLORS.yellow
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(labelText, rightX0 + labelW / 2, cursorY + rowH / 2 + 1)

  const valX = rightX0 + labelW + 14
  const valW = rightX1 - valX
  roundRect(ctx, valX, cursorY, valW, rowH, 12)
  ctx.strokeStyle = COLORS.greenLine
  ctx.fillStyle = 'rgba(255,255,255,0.03)'
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = COLORS.cream
  const stackSize = fitText(ctx, stackText, valW - 36, 24, FONT_MONO, 500)
  ctx.font = `500 ${stackSize}px ${FONT_MONO}`
  ctx.textAlign = 'center'
  ctx.fillText(stackText, valX + valW / 2, cursorY + rowH / 2 + 1)
  ctx.restore()

  cursorY += rowH + 50

  const finalSerial = serial || makeSerialId(teamName)
  drawCardFooter(ctx, { W, cursorY, brand, serial: finalSerial, leftX: rightX0, rightX: rightX1 })

  ctx.save()
  roundRect(ctx, W / 2 - 260, H - 46, 520, 6, 3)
  ctx.fillStyle = neonGradient(ctx, W / 2 - 260, 0, W / 2 + 260, 0)
  ctx.fill()
  ctx.restore()
}