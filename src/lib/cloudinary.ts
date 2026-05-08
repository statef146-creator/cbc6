export const getCloudinaryUrl = (publicId: string, opts: any = {}) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    throw new DOMException('VITE_CLOUDINARY_CLOUD_NAME not set in environment variables', 'InvalidStateError')
  }
  
  const { w = 800, h = 600, c = 'fill', q = 'auto', f = 'webp' } = opts
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${w},h_${h},c_${c},q_${q},f_${f}/${publicId}`
}

export const uploadToCloudinary = async (file: File, folder: string) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    throw new DOMException('VITE_CLOUDINARY_CLOUD_NAME not set', 'InvalidStateError')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'brighter-minds')
  formData.append('folder', `brighter-minds/${folder}`)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )
  
  if (!response.ok) {
    throw new DOMException(`Cloudinary upload failed: ${response.statusText}`, 'NetworkError')
  }
  
  return response.json()
}