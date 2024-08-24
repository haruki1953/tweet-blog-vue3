import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkStore = defineStore(
  'tweet-work',
  () => {
    const toPostSendPage = () => {}
    return {
      toPostSendPage
    }
  },
  {
    persist: true // 持久化
  }
)
