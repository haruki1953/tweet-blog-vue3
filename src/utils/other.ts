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
