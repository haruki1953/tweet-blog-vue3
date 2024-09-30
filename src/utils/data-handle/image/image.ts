import { imageConfig } from '@/config'
import type { Image, ImageStoreData } from '@/types'

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
export const imgOriginalUrl = (imgData: Image) => {
  return `${imageConfig.originalBaseUrl}${imgData.originalPath}`
}

// export const imageToImageStoreData = (
//   imgData: Image,
//   imageStoreData?: ImageStoreData
// ): ImageStoreData => {
//   let posts
//   let _count
//   if ('posts' in imgData) {
//     posts = imgData.posts as ImageStoreData['posts']
//   } else if (imageStoreData) {
//     posts = imageStoreData.posts
//   } else {
//     posts = [] as ImageStoreData['posts']
//   }
//   if ('_count' in imgData) {
//     _count = imgData._count as ImageStoreData['_count']
//   } else if (imageStoreData) {
//     _count = imageStoreData._count
//   } else {
//     _count = {
//       posts: 0
//     }
//   }
//   return {
//     ...imgData,
//     posts,
//     _count
//   }
// }

export const imageToImageStoreData = (
  imgData: Image,
  imageStoreData?: ImageStoreData
): ImageStoreData => {
  const defaultAddData: {
    posts: ImageStoreData['posts']
    _count: ImageStoreData['_count']
  } = {
    posts: [],
    _count: {
      posts: 0
    } as ImageStoreData['_count']
  }
  return {
    ...(imageStoreData || defaultAddData),
    ...imgData
  }
}
