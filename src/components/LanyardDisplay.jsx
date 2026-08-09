import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'

export default function LanyardDisplay({ children }) {
  const rotate = useMotionValue(0)
  const y = useMotionValue(-260)
  const x = useMotionValue(0)
  const [settled, setSettled] = useState(false)
  const dragging = useRef(false)

  useEffect(() => {
    let cancelled = false

    async function dropAndSwing() {
      await animate(y, 0, { type: 'spring', stiffness: 130, damping: 11, mass: 0.9 })
      if (cancelled) return
      await animate(
        rotate,
        [0, 13, -10, 7, -5, 3, -1.5, 0.6, 0],
        {
          duration: 3,
          times: [0, 0.09, 0.24, 0.4, 0.55, 0.68, 0.8, 0.91, 1],
          ease: 'easeInOut',
        }
      )
      if (cancelled) return
      setSettled(true)
    }

    dropAndSwing()
    return () => { cancelled = true }
  }, [rotate, y])

  function handleDrag(_e, info) {
    dragging.current = true
    const r = Math.max(-16, Math.min(16, (info.offset.x / 130) * 16))
    rotate.set(r)
  }

  function handleDragEnd() {
    dragging.current = false
    animate(x, 0, { type: 'spring', stiffness: 260, damping: 16 })
    animate(rotate, 0, { type: 'spring', stiffness: 220, damping: 14 })
  }

  return (
    <div className="flex flex-col items-center select-none" style={{ perspective: 800 }}>
      <svg width="150" height="80" viewBox="0 0 150 80" className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
        <defs>
          <linearGradient id="ropeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fee101" />
            <stop offset="50%" stopColor="#ff2fb8" />
            <stop offset="100%" stopColor="#4dfbff" />
          </linearGradient>
        </defs>
        <path d="M18 2 C 40 2, 60 30, 71 46" stroke="url(#ropeGrad)" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.92" />
        <path d="M132 2 C 110 2, 90 30, 79 46" stroke="url(#ropeGrad)" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.92" />
        <rect x="66" y="42" width="18" height="26" rx="4" fill="url(#ropeGrad)" opacity="0.95" />
        <circle cx="75" cy="62" r="9" fill="#04140d" stroke="#f5df6b" strokeWidth="2.5" />
      </svg>

      <motion.div
        drag={settled ? 'x' : false}
        dragElastic={0.6}
        dragConstraints={{ left: 0, right: 0 }}
        dragSnapToOrigin
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileTap={settled ? { scale: 0.985 } : undefined}
        style={{ x, y, rotate, transformOrigin: '50% -20px' }}
        className={['-mt-1 touch-none', settled ? 'cursor-grab active:cursor-grabbing' : ''].join(' ')}
      >
        <div className="mx-auto w-11 h-7 rounded-b-md bg-neutral-900 border border-white/10 relative z-10 -mb-1" />
        <div className="rounded-[28px] p-1.5 bg-gradient-to-b from-white/10 to-black/40 shadow-2xl shadow-black/60">
          <div className="rounded-[24px] overflow-hidden">
            {children}
          </div>
        </div>
      </motion.div>

      <p className="mt-3 text-[11px] text-hh-cream/35 font-mono text-center">
        {settled
          ? <>Drag the badge to swing it &middot; download gives you just the card art</>
          : <>Clipping in&hellip;</>}
      </p>
    </div>
  )
}