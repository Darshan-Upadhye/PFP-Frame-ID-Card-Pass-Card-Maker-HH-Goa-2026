const SHARE_LINK = 'https://darshan-upadhye-portfolio.vercel.app/'

const OPENERS = {
  pfp: [
    'Just switched my profile picture to my official Hacker House Goa 2026 PFP! 🌴',
    'New avatar unlocked — official Hacker House Goa 2026 frame 🖼️⚡',
    'This is my Hacker House Goa 2026 profile pic now. No going back. 🤙',
    'Rocking my Hacker House Goa 2026 PFP frame — see you in Goa 👀',
    'Freshly framed for Hacker House Goa 2026 🌴🖼️',
    'Swapped my PFP for the official Hacker House Goa 2026 frame 🔥',
    'My timeline now has main-character Hacker House Goa 2026 energy 🌴',
    'Official Hacker House Goa 2026 profile frame, secured ✅',
  ],
  card: [
    'Just generated my official Hacker House Goa 2026 Builder ID card! 🪪⚡',
    'Meet my Hacker House Goa 2026 Builder Pass — see you on the beach 🌴',
    "I'm officially credentialed for Hacker House Goa 2026 🛂🔥",
    'My Builder ID for Hacker House Goa 2026 just dropped 🪪🌴',
    'Badge secured. Bags packed. Hacker House Goa 2026, here I come 🎒',
    'This is my official Hacker House Goa 2026 Builder ID — verified ✅',
    'Print-worthy (but I\'m posting it instead) — Hacker House Goa 2026 🪪',
    'Generated my Hacker House Goa 2026 Builder Pass in seconds ⚡🌴',
  ],
  team: [
    'Just generated our official Hacker House Goa 2026 Squad Pass! 🪪👥',
    'Meet the squad heading to Hacker House Goa 2026 🌴🤝',
    "Our team's official Hacker House Goa 2026 Squad Pass is live 🔥👥",
    'Assembling the crew for Hacker House Goa 2026 — squad pass and all 🌴🛂',
    'We\'re building together at Hacker House Goa 2026 — squad certified ✅',
    'Our Hacker House Goa 2026 Squad Pass just dropped 🪪🔥',
    'The whole crew, one squad pass — Hacker House Goa 2026 🌴👥',
    'Team credentials for Hacker House Goa 2026: secured 🛂🤝',
  ],
}

function footer(siteUrl) {
  return [
    'Dates: Oct 28\u201331 in Goa, India',
    `Generate yours: ${siteUrl}`,
    '#FrameInGoa #HackerHouseGoa @247pmstudio',
  ].join('\n')
}

export function buildCaption(format, opener, siteUrl = SHARE_LINK) {
  return `${opener}\n\n${footer(siteUrl)}`
}

export function randomCaption(format, siteUrl = SHARE_LINK) {
  const list = OPENERS[format] || OPENERS.card
  const opener = list[Math.floor(Math.random() * list.length)]
  return buildCaption(format, opener, siteUrl)
}

export function makeCaptionShuffler(format, siteUrl = SHARE_LINK) {
  const list = [...(OPENERS[format] || OPENERS.card)]
  let bag = []
  function refill() {
    bag = [...list].sort(() => Math.random() - 0.5)
  }
  refill()
  return function next() {
    if (bag.length === 0) refill()
    const opener = bag.pop()
    return buildCaption(format, opener, siteUrl)
  }
}