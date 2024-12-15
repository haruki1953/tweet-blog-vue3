import type { BackendTaskCache } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useLoadModule } from './modules/load'
import { useManageModule } from './modules/manage'

export type TaskStoreModuleDependencies = {
  taskCache: Ref<BackendTaskCache>
}

// 任务模块
export const useTaskStore = defineStore(
  'tweblog-task',
  () => {
    const taskCache = ref<BackendTaskCache>({
      importTaskList: []
    })
    const importTaskList = computed(() => {
      return taskCache.value.importTaskList
        .slice()
        .sort(
          (a, b) =>
            new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
        )
    })

    const dependencies = {
      taskCache
    }

    const loadModule = useLoadModule(dependencies)
    const manageModule = useManageModule(dependencies)

    return {
      ...loadModule,
      ...manageModule,
      taskCache,
      importTaskList
    }
  },
  {
    persist: true // 持久化
  }
)
