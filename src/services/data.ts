import {
  useAuthStore,
  useImageStore,
  usePostStore,
  useStatesStore,
  useAdminStore,
  useProfileStore
} from '@/stores'
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
    adminStore.loadInfo(),
    adminStore.loadImageConfig()
  ])
  statesStore.setFirstDataLoading(false)
}
