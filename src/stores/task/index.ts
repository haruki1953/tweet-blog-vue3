import type { BackendTaskStore } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useLoadModule } from './modules/load'
import { useManageModule } from './modules/manage'

export type TaskStoreModuleDependencies = {
  store: Ref<BackendTaskStore>
}

// 任务模块
export const useTaskStore = defineStore(
  'tweblog-task',
  () => {
    const store = ref<BackendTaskStore>({
      taskImportList: []
    })
    const taskImportList = computed(() => {
      return store.value.taskImportList
        .slice()
        .sort(
          (a, b) =>
            new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
        )
    })

    const dependencies = {
      store
    }

    const loadModule = useLoadModule(dependencies)
    const manageModule = useManageModule(dependencies)

    return {
      ...loadModule,
      ...manageModule,
      store,
      taskImportList
    }
  },
  {
    persist: true // 持久化
  }
)
