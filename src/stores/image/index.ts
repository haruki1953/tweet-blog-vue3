import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useListModule, useUploadModule } from './modules'

export const useImageStore = defineStore(
  'tweet-image',
  () => {
    // needRegetMark for when image change
    const needRegetMark = ref(false)
    const isNeedReget = computed(() => needRegetMark.value)
    const setNeedReget = () => {
      needRegetMark.value = true
    }

    // useModules
    const listModule = useListModule()
    const uploadModule = useUploadModule({
      reGetImages: listModule.reGetImages
    })

    return {
      isNeedReget,
      setNeedReget,
      ...listModule,
      ...uploadModule
    }
  },
  {
    persist: true // 持久化
  }
)
