import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltCardDisplay({ children }) {
  const containerRef = useRef(null)
  const px = useMotionValue(0.5) // 0..1 across the card
  const py = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(py, [0, 1], [10, -10]), { stiffness: 220, damping: 18 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-12, 12]), { stiffness: 220, damping: 18 })
  const shineX = useTransform(px, [0, 1], ['0%', '100%'])
  const shineY = useTransform(py, [0, 1], ['0%', '100%'])
  const shineBg = useTransform([shineX, shineY], ([sx, sy]) =>
    `radial-gradient(circle at ${sx} ${sy}, rgba(255,255,255,0.16), transparent 45%)`
  )

  function updateFromPoint(clientX, clientY) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    px.set(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)))
    py.set(Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)))
  }

  function reset() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div style={{ perspective: 1200 }} className="select-none">
      <motion.div
        ref={containerRef}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onPointerMove={(e) => updateFromPoint(e.clientX, e.clientY)}
        onPointerLeave={reset}
        onPointerUp={reset}
        onTouchMove={(e) => {
          const t = e.touches[0]
          if (t) updateFromPoint(t.clientX, t.clientY)
        }}
        onTouchEnd={reset}
        whileTap={{ scale: 0.99 }}
        className="relative rounded-3xl shadow-2xl shadow-black/60 cursor-grab active:cursor-grabbing touch-none"
      >
        <div className="rounded-3xl overflow-hidden relative">
          {children}
          <motion.div className="pointer-events-none absolute inset-0" style={{ background: shineBg }} />
        </div>
      </motion.div>
      <p className="mt-3 text-[11px] text-hh-cream/35 font-mono text-center">
        Move or drag the card to tilt it &middot; download gives you just the card art
      </p>
    </div>
  )
}
