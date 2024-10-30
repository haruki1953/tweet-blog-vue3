import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLoadModule } from './modules/load'

// 个人信息模块
export const useProfileStore = defineStore(
  'tweet-profile',
  () => {
    const postNumber = ref(0)
    const imageNumber = ref(0)

    const dependencies = {
      postNumber,
      imageNumber
    }

    const loadModule = useLoadModule(dependencies)

    return {
      ...loadModule,
      postNumber,
      imageNumber
    }
  },
  {
    persist: true // 持久化
  }
)
