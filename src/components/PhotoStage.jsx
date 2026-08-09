import { useEffect, useRef, useCallback } from 'react'
import { renderPfp, PFP_SIZE, PFP_PHOTO_DIAMETER } from '../lib/renderPfp'
import { CARD_PHOTO_W, CARD_PHOTO_H } from '../lib/renderCard'
import { computeCoverGeometry, drawCoverImage, roundRect, FONT_DISPLAY } from '../lib/canvasArt'

function slotSizeFor(format) {
  return format === 'pfp'
    ? { dw: PFP_PHOTO_DIAMETER, dh: PFP_PHOTO_DIAMETER }
    : { dw: CARD_PHOTO_W, dh: CARD_PHOTO_H }
}

export default function PhotoStage({ format, image, transform, onTransformChange, canvasRef }) {
  const dragState = useRef(null)
  const pinchState = useRef(null)
  const renderToken = useRef(0)

  const dims = format === 'pfp' ? { w: PFP_SIZE, h: PFP_SIZE } : { w: CARD_PHOTO_W, h: CARD_PHOTO_H }

  const redraw = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (canvas.width !== dims.w) canvas.width = dims.w
    if (canvas.height !== dims.h) canvas.height = dims.h
    const ctx = canvas.getContext('2d')
    const myToken = ++renderToken.current

    if (format === 'pfp') {
      await renderPfp(ctx, { image, transform })
    } else {
      ctx.clearRect(0, 0, dims.w, dims.h)
      if (image) {
        drawCoverImage(ctx, image, 0, 0, dims.w, dims.h, transform)
      } else {
        roundRect(ctx, 0, 0, dims.w, dims.h, 26)
        ctx.fillStyle = '#0c2417'
        ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.font = `600 26px ${FONT_DISPLAY}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Upload a photo', dims.w / 2, dims.h / 2)
      }
    }
    if (myToken !== renderToken.current) return // a newer render started; drop this one
  }, [format, image, transform, dims.w, dims.h, canvasRef])

  useEffect(() => {
    const rafId = requestAnimationFrame(() => { redraw() })
    return () => cancelAnimationFrame(rafId)
  }, [redraw])

  function clamp(panX, panY, scale) {
    const { dw, dh } = slotSizeFor(format)
    const geo = computeCoverGeometry(image, dw, dh, { scale, panX, panY })
    return { panX: geo.clampedPanX, panY: geo.clampedPanY }
  }

  function handlePointerDown(e) {
    if (!image) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragState.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startPanX: transform.panX || 0,
      startPanY: transform.panY || 0,
    }
  }

  function handlePointerMove(e) {
    if (!dragState.current || !image) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const ratio = canvas.width / rect.width
    const dx = (e.clientX - dragState.current.startClientX) * ratio
    const dy = (e.clientY - dragState.current.startClientY) * ratio
    const { panX, panY } = clamp(
      dragState.current.startPanX + dx,
      dragState.current.startPanY + dy,
      transform.scale
    )
    onTransformChange({ ...transform, panX, panY })
  }

  function endDrag() { dragState.current = null }

  function handleTouchStart(e) {
    if (e.touches.length === 2 && image) {
      const [a, b] = e.touches
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      pinchState.current = { startDist: dist, startScale: transform.scale }
      dragState.current = null
    }
  }
  function handleTouchMove(e) {
    if (e.touches.length === 2 && pinchState.current && image) {
      e.preventDefault()
      const [a, b] = e.touches
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      const ratio = dist / pinchState.current.startDist
      const newScale = Math.min(3, Math.max(1, pinchState.current.startScale * ratio))
      const { panX, panY } = clamp(transform.panX || 0, transform.panY || 0, newScale)
      onTransformChange({ ...transform, scale: newScale, panX, panY })
    }
  }
  function handleTouchEnd(e) {
    if (e.touches.length < 2) pinchState.current = null
  }

  function handleWheel(e) {
    if (!image) return
    e.preventDefault()
    const delta = -e.deltaY * 0.0015
    const newScale = Math.min(3, Math.max(1, transform.scale + delta))
    const { panX, panY } = clamp(transform.panX || 0, transform.panY || 0, newScale)
    onTransformChange({ ...transform, scale: newScale, panX, panY })
  }

  return (
    <canvas
      ref={canvasRef}
      className={[
        'w-full rounded-2xl shadow-2xl shadow-black/50 touch-none select-none',
        image ? 'cursor-grab active:cursor-grabbing' : '',
      ].join(' ')}
      style={{ aspectRatio: `${dims.w} / ${dims.h}` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    />
  )
}