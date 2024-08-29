import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSettingStore = defineStore(
  'tweet-setting',
  () => {
    const loadingMark = ref(false)
    const loadingPostMark = ref(false)
    const loadingImageMark = ref(false)

    const isLoadingData = computed(() => {
      if (
        loadingMark.value ||
        loadingPostMark.value ||
        loadingImageMark.value
      ) {
        return true
      } else {
        return false
      }
    })
    const setLoading = (isLoading: boolean) => {
      loadingMark.value = isLoading
    }
    const setPostLoading = (isLoading: boolean) => {
      loadingPostMark.value = isLoading
    }
    const setImageLoading = (isLoading: boolean) => {
      loadingImageMark.value = isLoading
    }

    return {
      isLoadingData,
      setLoading,
      setPostLoading,
      setImageLoading
    }
  },
  {
    persist: true // 持久化
  }
)
