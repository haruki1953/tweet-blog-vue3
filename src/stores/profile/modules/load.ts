import { profileGetAllApi } from '@/api'
import type { Ref } from 'vue'

export const useLoadModule = (dependencies: {
  postNumber: Ref<number>
  imageNumber: Ref<number>
}) => {
  const { postNumber, imageNumber } = dependencies

  const loadProfile = async () => {
    const res = await profileGetAllApi()
    postNumber.value = res.data.data.data.post
    imageNumber.value = res.data.data.data.image
  }

  return {
    loadProfile
  }
}
