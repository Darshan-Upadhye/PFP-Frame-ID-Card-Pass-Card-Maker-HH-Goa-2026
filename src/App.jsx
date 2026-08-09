import { useEffect, useRef, useState } from 'react'
import UploadZone from './components/UploadZone.jsx'
import PhotoStage from './components/PhotoStage.jsx'
import BuilderForm from './components/BuilderForm.jsx'
import TeamForm from './components/TeamForm.jsx'
import CardCanvas from './components/CardCanvas.jsx'
import LanyardDisplay from './components/LanyardDisplay.jsx'
import TiltCardDisplay from './components/TiltCardDisplay.jsx'
import ActionBar from './components/ActionBar.jsx'
import ShareModal from './components/ShareModal.jsx'
import Footer from './components/Footer.jsx'
import { fileToImage } from './lib/loadImage.js'
import { makeSerialId } from './lib/codes.js'
import { defaultCardFields, defaultTeamFields } from './lib/builderTitle.js'
import { loadBrandAssets, TITLE_LOGO_SRC, SITE_URL } from './lib/brandAssets.js'
import { renderIdCard, CARD_W, CARD_H } from './lib/renderCard.js'
import { renderTeamCard, TEAM_W, TEAM_H } from './lib/renderTeamCard.js'

const DEFAULT_TRANSFORM = { scale: 1, panX: 0, panY: 0 }

function GroupToggle({ group, onChange }) {
  const opts = [
    { id: 'pfp', label: 'PFP Frame', emoji: '🖼️' },
    { id: 'id', label: 'Builder ID / Squad', emoji: '🪪' },
  ]
  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl bg-hh-green/30 border border-hh-green-line p-1">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={[
            'rounded-lg py-2.5 text-sm font-semibold transition-colors',
            group === o.id
              ? 'bg-gradient-to-r from-hh-yellow via-hh-pink to-hh-cyan text-black'
              : 'text-hh-cream/70 hover:text-hh-cream',
          ].join(' ')}
        >
          {o.emoji} {o.label}
        </button>
      ))}
    </div>
  )
}

function IdModeToggle({ idMode, onChange }) {
  const opts = [
    { id: 'card', label: 'Builder ID Card' },
    { id: 'team', label: 'Team / Squad Pass' },
  ]
  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg bg-hh-green/15 border border-hh-green-line/60 p-1 ml-3">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={[
            'rounded-md py-2 text-xs font-semibold transition-colors',
            idMode === o.id
              ? 'bg-hh-green/70 text-hh-yellow border border-hh-yellow/40'
              : 'text-hh-cream/50 hover:text-hh-cream',
          ].join(' ')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function BrandHeader() {
  const [logoOk, setLogoOk] = useState(true)
  return (
    <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className="inline-block mb-1">
      {logoOk ? (
        <img
          src={TITLE_LOGO_SRC}
          alt="Hacker House Goa"
          className="h-12 sm:h-16 w-auto max-w-[85vw] mx-auto"
          onError={() => setLogoOk(false)}
        />
      ) : (
        <p className="font-mono text-xs tracking-[0.3em] text-hh-yellow/80">HACKER गोवा HOUSE</p>
      )}
    </a>
  )
}

export default function App() {
  const [group, setGroup] = useState('id') 
  const [idMode, setIdMode] = useState('card')
  const mode = group === 'pfp' ? 'pfp' : idMode

  const [brand, setBrand] = useState(null)
  useEffect(() => { loadBrandAssets().then(setBrand) }, [])

  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [loadingPhoto, setLoadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [transform, setTransform] = useState(DEFAULT_TRANSFORM)
  const [cardFields, setCardFields] = useState(defaultCardFields)

  const [teamFields, setTeamFields] = useState(defaultTeamFields)

  const stageCanvasRef = useRef(null)
  const cardCanvasRef = useRef(null)
  const teamCanvasRef = useRef(null)
  const activeCanvasRef = mode === 'team' ? teamCanvasRef : mode === 'card' ? cardCanvasRef : stageCanvasRef

  const [shareOpen, setShareOpen] = useState(false)

  const [cardSerial, setCardSerial] = useState(() => makeSerialId())
  const [teamSerial, setTeamSerial] = useState(() => makeSerialId())

  useEffect(() => { setTransform(DEFAULT_TRANSFORM) }, [mode, image])
  useEffect(() => {
    return () => { if (imageUrl) URL.revokeObjectURL(imageUrl) }
  }, [imageUrl])

  async function handleFile(file) {
    setPhotoError('')
    setLoadingPhoto(true)
    try {
      const { img, url } = await fileToImage(file)
      if (imageUrl) URL.revokeObjectURL(imageUrl)
      setImage(img)
      setImageUrl(url)
      setCardSerial(makeSerialId())
    } catch (err) {
      console.error(err)
      setPhotoError("Couldn't read that photo. Try a JPG, PNG, or HEIC file.")
    } finally {
      setLoadingPhoto(false)
    }
  }

  function handleTeamFieldsChange(next) {
    const prevImages = teamFields.members.map((m) => m.image)
    const changedPhoto = next.members.some((m, i) => m.image && m.image !== prevImages[i])
    setTeamFields(next)
    if (changedPhoto) setTeamSerial(makeSerialId())
  }

  const hasPhoto = !!image
  const hasTeamPhoto = teamFields.members.some((m) => m.image)

  const serial = mode === 'team' ? teamSerial : cardSerial

  const filename =
    mode === 'pfp' ? 'hh-goa-2026-pfp.png' :
    mode === 'card' ? `hh-goa-2026-badge-${serial}.png` :
    `hh-goa-2026-squad-${serial}.png`

  const canAct = mode === 'team' ? hasTeamPhoto : hasPhoto

  return (
    <div className="min-h-full py-8 px-4">
      <div className="mx-auto w-full max-w-md">
        <header className="text-center mb-6">
          <BrandHeader />
          <h1 className="text-2 font-bold text-hh-cream">PFP Frame, ID Card & Pass Card Maker · HH Goa 2026</h1>
          <p className="text-sm text-hh-cream/50 mt-1">Upload a photo, get your badge, share it. That's it.</p>
        </header>

        <div className="space-y-4">
          <GroupToggle group={group} onChange={setGroup} />
          {group === 'id' && <IdModeToggle idMode={idMode} onChange={setIdMode} />}

          {mode !== 'team' && (
            <>
              {!hasPhoto && <UploadZone onFile={handleFile} />}

              <div className="rounded-2xl overflow-hidden">
                <PhotoStage
                  format={mode}
                  image={image}
                  transform={transform}
                  onTransformChange={setTransform}
                  canvasRef={stageCanvasRef}
                />
              </div>

              {hasPhoto && (
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-xs text-hh-cream/50 font-mono">
                    <span>ZOOM</span>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.01}
                      value={transform.scale}
                      onChange={(e) => setTransform((t) => ({ ...t, scale: parseFloat(e.target.value) }))}
                      className="flex-1"
                    />
                  </label>
                  <p className="text-center text-xs text-hh-cream/35">Drag the photo to reposition · pinch or scroll to zoom</p>
                </div>
              )}

              {hasPhoto && <UploadZone onFile={handleFile} compact />}
              {loadingPhoto && <p className="text-center text-sm text-hh-yellow font-mono animate-pulse">Reading your photo…</p>}
              {photoError && <p className="text-center text-sm text-red-400">{photoError}</p>}
            </>
          )}

          {mode === 'card' && (
            <>
              <div className="rounded-2xl border border-hh-green-line bg-hh-green/20 p-4">
                <BuilderForm fields={cardFields} onChange={setCardFields} />
              </div>

              <LanyardDisplay>
                <CardCanvas
                  innerRef={cardCanvasRef}
                  width={CARD_W}
                  height={CARD_H}
                  className="w-full"
                  render={(ctx) => renderIdCard(ctx, {
                    image, transform,
                    name: cardFields.name, handle: cardFields.handle, tier: cardFields.tier,
                    builderTitle: cardFields.builderTitle, stack: cardFields.stack,
                    serial, brand,
                  })}
                />
              </LanyardDisplay>
            </>
          )}

          {mode === 'team' && (
            <>
              <div className="rounded-2xl border border-hh-green-line bg-hh-green/20 p-4">
                <TeamForm fields={teamFields} onChange={handleTeamFieldsChange} />
              </div>

              <TiltCardDisplay>
                <CardCanvas
                  innerRef={teamCanvasRef}
                  width={TEAM_W}
                  height={TEAM_H}
                  className="w-full"
                  render={(ctx) => renderTeamCard(ctx, {
                    members: teamFields.members,
                    teamName: teamFields.teamName, leadHandle: teamFields.leadHandle, tier: teamFields.tier,
                    builderTitle: teamFields.builderTitle, stack: teamFields.stack,
                    serial, brand,
                  })}
                />
              </TiltCardDisplay>
            </>
          )}

          <ActionBar
            canvasRef={activeCanvasRef}
            disabled={!canAct}
            onShareClick={() => setShareOpen(true)}
            filename={filename}
          />

          <p className="text-center text-[11px] text-hh-cream/30 font-mono pt-2">
            No login. Nothing uploaded anywhere — your photo stays on this device.
          </p>
        </div>

        <Footer />
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        format={mode}
        canvasRef={activeCanvasRef}
        filename={filename}
      />
    </div>
  )
}