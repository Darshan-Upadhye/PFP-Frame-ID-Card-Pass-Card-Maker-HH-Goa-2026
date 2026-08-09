export const COLORS = {
  bgDeep: '#04140d',
  bgMid: '#0a2318',
  bgPanel: '#0e2e1e',
  green: '#123a24',
  greenLine: '#1c5535',
  yellow: '#fee101',
  yellowSoft: '#f5df6b',
  pink: '#ff2fb8',
  pinkSoft: '#ff6fd0',
  cyan: '#4dfbff',
  cream: '#f4f7ee',
  ink: '#04140d',
}

export const NEON_STOPS = [
  { offset: 0, color: COLORS.yellow },
  { offset: 0.45, color: COLORS.pink },
  { offset: 0.75, color: COLORS.pink },
  { offset: 1, color: COLORS.cyan },
]

export function neonGradient(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1)
  NEON_STOPS.forEach((s) => g.addColorStop(s.offset, s.color))
  return g
}

export const FONT_DISPLAY = 'Space Grotesk'
export const FONT_DEVANAGARI = 'Baloo 2'
export const FONT_MONO = 'JetBrains Mono'