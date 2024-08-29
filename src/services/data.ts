import { useAuthStore, useImageStore, usePostStore } from '@/stores'
import { useRouter } from 'vue-router'

export const dataConfirmLoginService = () => {
  const router = useRouter()
  const authStore = useAuthStore()
  if (authStore.token === '') {
    router.push('/login')
  }
}

export const dataFirstLoadService = async () => {
  const postStore = usePostStore()
  const imageStore = useImageStore()
  await Promise.all([postStore.reGetPosts(), imageStore.reGetImages()])
}
