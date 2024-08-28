import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSettingStore = defineStore(
  'tweet-setting',
  () => {
    const loadingMark = ref(false)
    const isLoadingData = computed(() => {
      return loadingMark.value
    })
    const setLoading = (isLoading: boolean) => {
      loadingMark.value = isLoading
    }

    return {
      isLoadingData,
      setLoading
    }
  },
  {
    persist: true // 持久化
  }
)
