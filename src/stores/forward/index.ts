import type { BackendForwardStore, ForwardSettingPostCount } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useLoadModule } from './modules/load'

export type ForwardStoreModuleDependencies = {
  store: Ref<BackendForwardStore>
  forwardSettingPostCount: Ref<ForwardSettingPostCount | null>
}

export const useForwardStore = defineStore(
  'tweblog-forward',
  () => {
    const store = ref<BackendForwardStore>({
      forwardSettingList: []
    })
    const forwardSettingList = computed(() => store.value.forwardSettingList)
    const forwardSettingPostCount = ref<ForwardSettingPostCount | null>(null)

    const dependencies = {
      store,
      forwardSettingPostCount
    }

    const loadModule = useLoadModule(dependencies)

    return {
      ...loadModule,
      store,
      forwardSettingList
    }
  },
  {
    persist: true // 持久化
  }
)
