import { useEffect, useRef, useState } from 'react'
import { X, Camera as CameraIcon } from 'lucide-react'

export default function CameraCapture({ open, onClose, onCapture }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setError('')
    setReady(false)

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera isn't available on this device or browser. Upload a photo instead.")
      return
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(() => {
        setError("Couldn't access the camera. Check permissions, or upload a photo instead.")
      })

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [open])

  function handleCanPlay() {
    setReady(true)
  }

  function capture() {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    canvas.toBlob(
      (blob) => {
        if (!blob) return
        const file = new File([blob], `hh-goa-camera-${Date.now()}.jpg`, { type: 'image/jpeg' })
        onCapture(file)
        onClose()
      },
      'image/jpeg',
      0.92
    )
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close camera"
        className="absolute top-4 right-4 text-hh-cream/70 hover:text-hh-cream transition-colors"
      >
        <X size={28} />
      </button>

      <div className="w-full max-w-sm">
        {error ? (
          <p className="text-center text-sm text-red-400 py-10 px-4">{error}</p>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-hh-green-line bg-black aspect-square">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onCanPlay={handleCanPlay}
              className="w-full h-full object-cover -scale-x-100"
            />
            {!ready && (
              <p className="absolute inset-0 flex items-center justify-center text-xs text-hh-cream/50 font-mono">
                Starting camera&hellip;
              </p>
            )}
          </div>
        )}

        {!error && (
          <button
            type="button"
            onClick={capture}
            disabled={!ready}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-black disabled:opacity-40 transition-opacity"
            style={{ background: 'linear-gradient(90deg, #fee101, #ff6fd0, #4dfbff)' }}
          >
            <CameraIcon size={18} /> Capture
          </button>
        )}
      </div>
    </div>
  )
}