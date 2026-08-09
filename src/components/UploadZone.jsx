import { useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import CameraCapture from './CameraCapture.jsx'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif'

export default function UploadZone({ onFile, compact = false }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)

  function handleFiles(fileList) {
    const file = fileList && fileList[0]
    if (file) onFile(file)
  }

  return (
    <div className={compact ? 'flex items-stretch gap-2' : 'space-y-2'}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        className={[
          'cursor-pointer select-none rounded-2xl border-2 border-dashed transition-colors',
          'flex flex-col items-center justify-center text-center gap-2',
          compact ? 'flex-1 p-4' : 'p-10',
          dragOver
            ? 'border-hh-yellow bg-hh-yellow/10'
            : 'border-hh-green-line bg-hh-green/30 hover:border-hh-pink/70 hover:bg-hh-green/50',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className={compact ? 'text-hh-yellow' : 'text-hh-yellow'}>
          <Camera size={compact ? 22 : 34} strokeWidth={1.75} />
        </div>
        <p className={compact ? 'text-sm font-semibold text-hh-cream' : 'text-base font-semibold text-hh-cream'}>
          {compact ? 'Change photo' : 'Drop a photo or tap to upload'}
        </p>
        {!compact && (
          <p className="text-xs text-hh-cream/50 font-mono">JPG · PNG · HEIC (iPhone) · any aspect ratio</p>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setCameraOpen(true) }}
        className={[
          'shrink-0 select-none rounded-2xl border-2 border-dashed transition-colors',
          'flex items-center justify-center gap-2 text-hh-yellow',
          'border-hh-green-line bg-hh-green/30 hover:border-hh-cyan/70 hover:bg-hh-green/50',
          compact ? 'w-16' : 'w-full py-3',
        ].join(' ')}
      >
        <Camera size={compact ? 22 : 18} strokeWidth={1.75} />
        {!compact && <span className="text-sm font-semibold text-hh-cream">Use camera</span>}
      </button>

      <CameraCapture open={cameraOpen} onClose={() => setCameraOpen(false)} onCapture={onFile} />
    </div>
  )
}