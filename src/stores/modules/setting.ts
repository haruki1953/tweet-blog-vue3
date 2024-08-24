import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore(
  'tweet-setting',
  () => {
    const isLoadingData = ref(false)
    const setLoading = (isLoading: boolean) => {
      isLoadingData.value = isLoading
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
