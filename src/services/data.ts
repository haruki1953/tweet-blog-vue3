import {
  useAuthStore,
  useImageStore,
  usePostStore,
  useStatesStore
} from '@/stores'
import { useAdminStore } from '@/stores/admin'
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
  const adminStore = useAdminStore()

  const statesStore = useStatesStore()
  statesStore.setFirstDataLoading(true)
  await Promise.all([
    postStore.reGetPosts(),
    imageStore.reGetImages(),
    profileStore.loadAll(),
    adminStore.loadInfo()
  ])
  statesStore.setFirstDataLoading(false)
}
