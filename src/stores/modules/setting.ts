import { defineStore } from 'pinia'
import { ref } from 'vue'

// 番剧数据模块
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
