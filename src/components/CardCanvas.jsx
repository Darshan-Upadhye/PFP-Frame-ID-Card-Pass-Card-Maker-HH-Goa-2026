import { useEffect, useRef } from 'react'

export default function CardCanvas({ render, width, height, className, innerRef }) {
  const localRef = useRef(null)
  const canvasRef = innerRef || localRef

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (canvas.width !== width) canvas.width = width
    if (canvas.height !== height) canvas.height = height
    const ctx = canvas.getContext('2d')
    render(ctx)
  })

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ aspectRatio: `${width} / ${height}` }}
    />
  )
}
