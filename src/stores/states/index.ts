import { defineStore } from 'pinia'
import { useLoadingModule } from './modules/loading'
import { useDarkModule } from './modules/dark'

export const useStatesStore = defineStore(
  'tweet-states',
  () => {
    const loadingModule = useLoadingModule()
    const darkModule = useDarkModule()

    return {
      ...loadingModule,
      ...darkModule
    }
  },
  {
    persist: true // 持久化
  }
)
