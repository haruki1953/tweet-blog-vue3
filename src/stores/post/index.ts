import type { PosPoolItem, PostData } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  useControlModule,
  useListModule,
  useManageModule,
  usePoolModule,
  useReadModule
} from './modules'

export const usePostStore = defineStore(
  'tweet-post',
  () => {
    // 多Module共享数据
    const postList = ref<PostData[][]>([])
    const postPool = ref<PosPoolItem[]>([])

    // listModule
    const listModule = useListModule({
      postList
    })

    // poolModule, for PostPage
    const poolModule = usePoolModule({
      postPool
    })

    // manageModule, for manage data
    const manageModule = useManageModule({
      postList,
      postPool
    })

    // controlModule
    const controlModule = useControlModule()

    // readModule
    const readModule = useReadModule({
      postList
    })

    return {
      ...listModule,
      ...poolModule,
      ...controlModule,
      ...manageModule,
      ...readModule,
      postList,
      postPool
    }
  },
  {
    persist: true // 持久化
  }
)
