import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useWorkStore = defineStore(
  'tweet-work',
  () => {
    const router = useRouter()
    const toPostSendPage = () => {
      router.push('/send')
    }
    return {
      toPostSendPage
    }
  },
  {
    persist: true // 持久化
  }
)
