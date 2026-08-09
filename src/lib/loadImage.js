export async function fileToImage(file) {
  let blob = file
  const isHeic =
    /heic|heif/i.test(file.type) || /\.heic$|\.heif$/i.test(file.name || '')

  if (isHeic) {
    const heic2any = (await import('heic2any')).default
    const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 })
    blob = Array.isArray(converted) ? converted[0] : converted
  }

  const url = URL.createObjectURL(blob)
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = url
    })
    return { img, url }
  } catch (err) {
    URL.revokeObjectURL(url)
    throw err
  }
}
