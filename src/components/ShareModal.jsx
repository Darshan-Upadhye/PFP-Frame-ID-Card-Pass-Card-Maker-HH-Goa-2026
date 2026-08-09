import { useEffect, useRef, useState } from 'react'
import { makeCaptionShuffler } from '../lib/captions'
import { shareToX } from '../lib/shareToX'

function captionFormat(format, cardMode) {
  if (format === 'pfp') return 'pfp'
  if (cardMode === 'squad') return 'team'
  return 'card'
}

export default function ShareModal({ open, onClose, canvasRef, format, cardMode, filename }) {
  const [caption, setCaption] = useState('')
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const shufflerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    shufflerRef.current = makeCaptionShuffler(captionFormat(format, cardMode))
    setCaption(shufflerRef.current())
    setCopied(false)
    setNote('')
  }, [open, format, cardMode])

  if (!open) return null

  function handleShuffle() {
    if (!shufflerRef.current) return
    setCaption(shufflerRef.current())
    setCopied(false)
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(caption)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setNote('Could not copy automatically — select and copy the text manually.')
    }
  }

  async function handleShare() {
    if (!canvasRef.current) return
    setBusy(true)
    setNote('')
    try {
      const result = await shareToX(canvasRef.current, { caption, filename })
      if (result === 'downloaded-fallback') {
        setNote('Image downloaded — this browser can\u2019t attach it directly, so paste it into the X app/tab that just opened.')
      } else if (result === 'shared') {
        onClose()
      }
    } catch {
      setNote('Could not open share. Try again, or use Copy text + Download.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-hh-green-line bg-[#0e2e1e] p-5 space-y-4 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-hh-cream">𝕏 Share to X</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-hh-cream/50 hover:text-hh-cream text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-hh-cream/50">
              Tweet Caption Template
            </span>
            <button
              type="button"
              onClick={handleShuffle}
              className="text-xs font-semibold text-hh-yellow hover:text-hh-cream flex items-center gap-1"
            >
              🔀 Shuffle
            </button>
          </div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={8}
            className="w-full rounded-lg bg-hh-green/40 border border-hh-green-line px-3 py-2.5 text-sm text-hh-cream outline-none focus:border-hh-yellow focus:ring-1 focus:ring-hh-yellow font-mono leading-relaxed resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-xl border border-hh-green-line bg-hh-green/50 py-3 text-sm font-semibold text-hh-cream hover:border-hh-cyan hover:bg-hh-cyan/10 transition-colors"
          >
            {copied ? '✓ Copied' : '⧉ Copy text'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleShare}
            className="rounded-xl py-3 text-sm font-bold text-black disabled:opacity-40 transition-opacity"
            style={{ background: 'linear-gradient(90deg, #fee101, #ff6fd0, #4dfbff)' }}
          >
            {busy ? 'Opening…' : '𝕏 Share to X'}
          </button>
        </div>
        {note && <p className="text-xs text-center text-hh-cream/60 font-mono">{note}</p>}
      </div>
    </div>
  )
}