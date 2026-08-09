import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode'

export async function makeQRCanvas(text, size = 256) {
  const canvas = document.createElement('canvas')
  await QRCode.toCanvas(canvas, text, {
    width: size,
    margin: 0,
    color: { dark: '#04140d', light: '#00000000' },
    errorCorrectionLevel: 'M',
  })
  return canvas
}

export function makeBarcodeCanvas(text, width = 320, height = 60) {
  const canvas = document.createElement('canvas')
  try {
    JsBarcode(canvas, text, {
      format: 'CODE128',
      width: 2,
      height,
      displayValue: false,
      margin: 0,
      background: 'transparent',
      lineColor: '#04140d',
    })
  } catch {
    canvas.width = width
    canvas.height = height
  }
  return canvas
}

export function makeSerialId() {
  let num
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    num = 1000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 9000)
  } else {
    num = 1000 + Math.floor(Math.random() * 9000)
  }
  return `HHG-2026-${num}`
}