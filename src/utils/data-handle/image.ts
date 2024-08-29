import { imageConfig } from '@/config'
import type { Image } from '@/types'

export const imgSamllUrl = (imgData: Image) => {
  return `${imageConfig.smallBaseUrl}${imgData.path}`
}
export const imgLargeUrl = (imgData: Image) => {
  if (imgData.largeSize > 0) {
    return `${imageConfig.largeBaseUrl}${imgData.path}`
  } else {
    return imgSamllUrl(imgData)
  }
}
