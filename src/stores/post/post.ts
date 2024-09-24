import type { PostData } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useControlModule, useListModule, usePoolModule } from './modules'

export const usePostStore = defineStore(
  'tweet-post',
  () => {
    // 其实postList完全可以打包进listModule
    // 这里通过参数传递，是为了演示实现多Module共享数据
    const postList = ref<PostData[][]>([])

    // listModule
    const listModule = useListModule({
      postList
    })

    // poolModule, for PostPage
    const poolModule = usePoolModule()

    // controlModule
    const controlModule = useControlModule()

    return {
      postList,
      ...listModule,
      ...poolModule,
      ...controlModule
    }
  },
  {
    persist: true // 持久化
  }
)
