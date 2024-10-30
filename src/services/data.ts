import { useAuthStore, useImageStore, usePostStore } from '@/stores'
import { useProfileStore } from '@/stores/profile'
import { useRouter } from 'vue-router'

export const dataConfirmLoginService = () => {
  const router = useRouter()
  const authStore = useAuthStore()
  if (authStore.token === '') {
    router.push({ name: 'login' })
  }
}

export const dataFirstLoadService = async () => {
  const postStore = usePostStore()
  const imageStore = useImageStore()
  const profileStore = useProfileStore()
  await Promise.all([
    postStore.reGetPosts(),
    imageStore.reGetImages(),
    profileStore.loadProfile()
  ])
}
