export function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not export image from canvas'))
    }, 'image/png', 0.95)
  })
}

export async function downloadCanvasPNG(canvas, filename) {
  const blob = await canvasToBlob(canvas)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

const APP_STORE_URL = 'https://apps.apple.com/app/x/id333903271'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.twitter.android'

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}
function isAndroid() {
  return /Android/.test(navigator.userAgent)
}

function openXApp(caption) {
  const text = encodeURIComponent(caption)

  if (isAndroid()) {
    const intentUrl =
      `intent://post?message=${text}#Intent;scheme=twitter;package=com.twitter.android;` +
      `S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`
    window.location.href = intentUrl
    return
  }

  if (isIOS()) {
    let leftPage = false
    const onVisibilityChange = () => { if (document.hidden) leftPage = true }
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.location.href = `twitter://post?message=${text}`
    setTimeout(() => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (!leftPage) window.location.href = APP_STORE_URL
    }, 1200)
    return
  }

  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer')
}

export async function shareToX(canvas, { caption, filename }) {
  await downloadCanvasPNG(canvas, filename)
  openXApp(caption)
  return 'downloaded-fallback'
}