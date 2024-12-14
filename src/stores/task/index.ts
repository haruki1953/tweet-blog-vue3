import type { BackendTaskCache } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export type TaskStoreModuleDependencies = {
  taskCache: Ref<BackendTaskCache | null>
}

// 鉴权模块
export const useAuthStore = defineStore(
  'tweet-auth',
  () => {
    const taskCache = ref<BackendTaskCache | null>(null)
    const importTaskList = computed(() => taskCache.value?.importTaskList || [])
    return {
      taskCache,
      importTaskList
    }
  },
  {
    persist: true // 持久化
  }
)
