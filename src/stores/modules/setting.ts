import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore(
  'tweet-setting',
  () => {
    const isLoadingData = ref(false)
    return {
      isLoadingData
    }
  },
  {
    persist: true // 持久化
  }
)
