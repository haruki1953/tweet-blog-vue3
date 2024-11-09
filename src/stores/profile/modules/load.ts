import { profileGetAllApi } from '@/api'
import { computed, ref, type Ref } from 'vue'
import type { ProfileStoreModuleDependencies } from '..'
import type { ProfileResData } from '@/types'

export const useLoadModule = (dependencies: ProfileStoreModuleDependencies) => {
  const { postNumber, imageNumber, profile } = dependencies

  const loadingMark = ref<boolean>(false)
  const isLoading = computed(() => loadingMark.value)

  const loadAll = async () => {
    loadingMark.value = true
    const res = await profileGetAllApi()
    postNumber.value = res.data.data.data.post
    imageNumber.value = res.data.data.data.image
    profile.value = res.data.data.store
    loadingMark.value = false
  }

  const loadProfileByRes = (resData: ProfileResData) => {
    profile.value = resData.store
  }

  const loadAvatarArrayByRes = (resData: ProfileResData) => {
    if (!profile.value) {
      loadProfileByRes(resData)
      return
    }
    profile.value.avatarArray = resData.store.avatarArray
  }

  return {
    isLoading,
    loadAll,
    loadProfileByRes,
    loadAvatarArrayByRes
  }
}
