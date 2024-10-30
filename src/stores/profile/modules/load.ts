import { profileGetAllApi } from '@/api'
import type { Ref } from 'vue'
import type { ProfileStoreModuleDependencies } from '..'

export const useLoadModule = (dependencies: ProfileStoreModuleDependencies) => {
  const { postNumber, imageNumber, profile } = dependencies

  const loadAll = async () => {
    const res = await profileGetAllApi()
    postNumber.value = res.data.data.data.post
    imageNumber.value = res.data.data.data.image
    profile.value = res.data.data.store
  }

  return {
    loadAll
  }
}
