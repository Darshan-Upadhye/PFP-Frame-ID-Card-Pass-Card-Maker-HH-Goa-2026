import { randomBuilderTitle, TIERS } from '../lib/builderTitle'
import StackInput from './StackInput.jsx'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-wider text-hh-cream/50 mb-1">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-lg bg-hh-green/40 border border-hh-green-line px-3 py-2.5 text-sm text-hh-cream ' +
  'placeholder:text-hh-cream/30 outline-none focus:border-hh-yellow focus:ring-1 focus:ring-hh-yellow transition-colors'

export default function BuilderForm({ fields, onChange }) {
  function set(key, value) {
    onChange({ ...fields, [key]: value })
  }

  return (
    <div className="space-y-3">
      <Field label="Name">
        <input
          className={inputCls}
          value={fields.name}
          maxLength={40}
          placeholder="Darshan Upadhye"
          onChange={(e) => set('name', e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="X / Twitter handle">
          <input
            className={inputCls}
            value={fields.handle}
            maxLength={24}
            placeholder="@yourhandle"
            onChange={(e) => set('handle', e.target.value)}
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
