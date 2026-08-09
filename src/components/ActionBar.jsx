import { useState } from 'react'
import { downloadCanvasPNG } from '../lib/shareToX'

export default function ActionBar({ canvasRef, disabled, onShareClick, filename }) {
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')

  async function handleDownload() {
    if (!canvasRef.current) return
    setBusy(true)
    setNote('')
    try {
      await downloadCanvasPNG(canvasRef.current, filename)
    } catch {
      setNote('Could not export the image. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled || busy}
          onClick={handleDownload}
          className="rounded-xl border border-hh-green-line bg-hh-green/50 py-3 text-sm font-semibold text-hh-cream disabled:opacity-40 hover:border-hh-cyan hover:bg-hh-cyan/10 transition-colors"
        >
          {busy ? 'Preparing…' : '⬇ Download'}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onShareClick}
          className="rounded-xl py-3 text-sm font-bold text-black disabled:opacity-40 transition-opacity"
          style={{ background: 'linear-gradient(90deg, #fee101, #ff6fd0, #4dfbff)' }}
        >
          𝕏 Share to X
        </button>
      </div>
      {note && <p className="text-xs text-center text-hh-cream/60 font-mono">{note}</p>}
    </div>
  )
}
