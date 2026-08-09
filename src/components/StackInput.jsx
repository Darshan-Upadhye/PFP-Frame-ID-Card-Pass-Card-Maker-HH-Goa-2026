const SUGGESTIONS = [
  'Rust / Solana / Anchor',
  'Python / PyTorch / LLMs',
  'React / Next.js / Tailwind',
  'TypeScript / Node / GraphQL',
  'Solidity / Foundry / EVM',
]

const inputCls =
  'w-full rounded-lg bg-hh-green/40 border border-hh-green-line px-3 py-2.5 text-sm text-hh-cream ' +
  'placeholder:text-hh-cream/30 outline-none focus:border-hh-yellow focus:ring-1 focus:ring-hh-yellow transition-colors'

export default function StackInput({ value, onChange }) {
  return (
    <div>
      <input
        className={inputCls}
        value={value}
        maxLength={60}
        placeholder="TypeScript, Node, GraphQL"
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex flex-wrap gap-1.5 mt-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className="flex items-center gap-1 rounded-full border border-hh-green-line bg-hh-green/30 px-2.5 py-1 text-[11px] font-mono text-hh-cream/70 hover:border-hh-yellow hover:text-hh-yellow transition-colors"
          >
            <span className="text-hh-yellow/70">+</span>{s}
          </button>
        ))}
      </div>
    </div>
  )
}
