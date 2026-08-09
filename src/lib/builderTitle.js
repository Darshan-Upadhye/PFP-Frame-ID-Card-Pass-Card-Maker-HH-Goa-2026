const PART_A = [
  'Full-Stack', 'Frontend', 'Backend', 'Cloud-Native', 'Chaos-Driven',
  'Offline-First', 'Edge-Case', 'Async', 'Caffeine-Fuelled', 'Serverless',
  'Recursive', 'Pixel-Perfect', 'Zero-Downtime', 'Terminal-Only',
]

const PART_B = [
  'Sunset', 'Beach', 'Monsoon', 'Palm-Tree', 'Tide', 'Coconut',
  'Feni-Fuelled', 'Konkan', 'Low-Tide', 'Late-Night',
]

const PART_C = [
  'Shipper', 'Wizard', 'Whisperer', 'Architect', 'Debugger', 'Alchemist',
  'Sherpa', 'Ninja', 'Slinger', 'Gremlin', 'Summoner', 'Tinkerer',
]

export const TIERS = [
  'ELITE HACKER', 'CORE BUILDER', 'NIGHT SHIFT DEV', 'DEMO DAY READY', 'SHIP-IT SQUAD', 'ROOKIE BUILDER',
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function randomBuilderTitle() {
  return `${pick(PART_A)} ${pick(PART_B)} ${pick(PART_C)}`
}

export function randomTier() {
  return pick(TIERS)
}

export function defaultCardFields() {
  return {
    name: '',
    handle: '',
    tier: randomTier(),
    builderTitle: randomBuilderTitle(),
    stack: '',
  }
}

export function defaultTeamFields() {
  return {
    teamName: '',
    leadHandle: '',
    tier: randomTier(),
    builderTitle: randomBuilderTitle(),
    stack: '',
    members: [{ name: '', image: null }],
  }
}
