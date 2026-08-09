import { useRef, useState } from 'react'
import { Camera, X, Plus } from 'lucide-react'
import { randomBuilderTitle, TIERS } from '../lib/builderTitle'
import { fileToImage } from '../lib/loadImage'
import StackInput from './StackInput.jsx'
import CameraCapture from './CameraCapture.jsx'

const inputCls =
  'w-full rounded-lg bg-hh-green/40 border border-hh-green-line px-3 py-2.5 text-sm text-hh-cream ' +
  'placeholder:text-hh-cream/30 outline-none focus:border-hh-yellow focus:ring-1 focus:ring-hh-yellow transition-colors'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-wider text-hh-cream/50 mb-1">{label}</span>
      {children}
    </label>
  )
}

function MemberSlot({ member, index, onChange, onRemove, removable }) {
  const inputRef = useRef(null)
  const [cameraOpen, setCameraOpen] = useState(false)

  async function handleFile(file) {
    if (!file) return
    try {
      const { img } = await fileToImage(file)
      onChange({ ...member, image: img })
    } catch {
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0 w-16 h-16">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-16 h-16 rounded-xl border-2 border-dashed border-hh-green-line bg-hh-green/40 overflow-hidden flex items-center justify-center hover:border-hh-pink/70 transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {member.image ? (
            <img src={member.image.src} alt="" className="w-full h-full object-cover" />
          ) : (
            <Camera size={20} strokeWidth={1.75} className="text-hh-yellow" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setCameraOpen(true)}
          title="Take a photo"
          className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-hh-green border border-hh-yellow/60 flex items-center justify-center text-hh-yellow hover:bg-hh-pink/20 hover:border-hh-pink transition-colors"
        >
          <Camera size={12} strokeWidth={2} />
        </button>
        <CameraCapture open={cameraOpen} onClose={() => setCameraOpen(false)} onCapture={handleFile} />
      </div>
      <input
        className={inputCls}
        value={member.name}
        maxLength={30}
        placeholder={`Member ${index + 1} name`}
        onChange={(e) => onChange({ ...member, name: e.target.value })}
      />
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-hh-cream/40 hover:text-hh-pink hover:bg-hh-pink/10 transition-colors"
          title="Remove member"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

export default function TeamForm({ fields, onChange }) {
  function set(key, value) {
    onChange({ ...fields, [key]: value })
  }

  function updateMember(i, updated) {
    const members = [...fields.members]
    members[i] = updated
    set('members', members)
  }

  function addMember() {
    if (fields.members.length >= 3) return
    set('members', [...fields.members, { name: '', image: null }])
  }

  function removeMember(i) {
    const members = fields.members.filter((_, idx) => idx !== i)
    set('members', members)
  }

  return (
    <div className="space-y-3">
      <Field label="Squad / Team name">
        <input
          className={inputCls}
          value={fields.teamName}
          maxLength={40}
          placeholder="Night Owls"
          onChange={(e) => set('teamName', e.target.value)}
        />
      </Field>

      <div>
        <span className="block text-xs font-mono uppercase tracking-wider text-hh-cream/50 mb-1.5">
          Team members (up to 3)
        </span>
        <div className="space-y-2">
          {fields.members.map((m, i) => (
            <MemberSlot
              key={i}
              member={m}
              index={i}
              onChange={(updated) => updateMember(i, updated)}
              onRemove={() => removeMember(i)}
              removable={fields.members.length > 1}
            />
          ))}
        </div>
        {fields.members.length < 3 && (
          <button
            type="button"
            onClick={addMember}
            className="mt-2 flex items-center gap-1.5 text-xs font-mono text-hh-yellow/80 hover:text-hh-yellow transition-colors"
          >
            <Plus size={14} /> Add member
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Team Lead / X Handle">
          <input
            className={inputCls}
            value={fields.leadHandle}
            maxLength={24}
            placeholder="@teamlead"
            onChange={(e) => set('leadHandle', e.target.value)}
          />
        </Field>
        <Field label="Tier">
          <select
            className={inputCls}
            value={fields.tier}
            onChange={(e) => set('tier', e.target.value)}
          >
            {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Builder title">
        <div className="flex gap-2">
          <input
            className={inputCls}
            value={fields.builderTitle}
            maxLength={50}
            placeholder="Full-Stack Sunset Shipper"
            onChange={(e) => set('builderTitle', e.target.value)}
          />
          <button
            type="button"
            onClick={() => set('builderTitle', randomBuilderTitle())}
            title="Generate a random title"
            className="shrink-0 rounded-lg border border-hh-green-line bg-hh-green/40 px-3 text-lg hover:border-hh-pink hover:bg-hh-pink/10 transition-colors"
          >
            🎲
          </button>
        </div>
      </Field>

      <Field label="Stack / role">
        <StackInput value={fields.stack} onChange={(v) => set('stack', v)} />
      </Field>
    </div>
  )
}