import { makeQRCanvas } from './codes'

export const TITLE_LOGO_SRC = '/brand/title-logo.png'
export const STUDIO_BADGE_SRC = '/brand/studio-badge.png'
export const SITE_URL = 'https://hhgoa.com'

function loadOptionalImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

let cached = null

export function loadBrandAssets() {
  if (cached) return cached
  cached = Promise.all([
    loadOptionalImage(TITLE_LOGO_SRC),
    loadOptionalImage(STUDIO_BADGE_SRC),
    makeQRCanvas(SITE_URL, 256),
  ]).then(([titleLogo, studioBadge, siteQrCanvas]) => ({ titleLogo, studioBadge, siteQrCanvas }))
  return cached
}
