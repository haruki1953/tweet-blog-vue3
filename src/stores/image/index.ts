import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useListModule, useManageModule, useUploadModule } from './modules'
import type { ImageStoreData } from '@/types'

export const useImageStore = defineStore(
  'tweet-image',
  () => {
    // data
    const imageList = ref<ImageStoreData[]>([])

    // needRegetMark for when image change
    const needRegetMark = ref(false)
    const isNeedReget = computed(() => needRegetMark.value)
    const setNeedReget = (value?: boolean) => {
      needRegetMark.value = value !== undefined ? value : true
    }

    // useModules
    const listModule = useListModule({
      imageList
    })
    const manageModule = useManageModule({
      imageList
    })
    const uploadModule = useUploadModule({
      manageAfterUploadImage: manageModule.manageAfterUploadImage
    })

    return {
      imageList,
      isNeedReget,
      setNeedReget,
      ...listModule,
      ...uploadModule,
      ...manageModule
    }
  },
  {
    persist: true // 持久化
  }
)
