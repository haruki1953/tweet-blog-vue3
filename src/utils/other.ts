import { useRouter } from 'vue-router'

export const sakiGoBack = (router: ReturnType<typeof useRouter>) => {
  if (window.history.length > 2) {
    router.back()
  } else {
    // 如果没有历史记录，则导航到首页
    router.push({ name: 'home' })
  }
}

// 打开链接
export const openLink = (url: string) => {
  window.open(url, '_blank')
}

// 生成随机密钥
export const generateRandomKey = (length?: number) => {
  const array = new Uint8Array(length || 32)
  window.crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
}
// 生成随机类名
export const generateRandomClassName = (length?: number) => {
  return generateRandomKey(length).replace(/[^a-zA-Z]/g, '') // 只保留字母
}
