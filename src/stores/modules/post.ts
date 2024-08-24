import { postGetByCursorApi } from '@/api'
import type { PostData } from '@/types'
import { postGetByCursorDataHandle } from '@/utils'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSettingStore } from './setting'

export const usePostStore = defineStore(
  'tweet-post',
  () => {
    let cursor = 0
    let isHaveMorePost = true

    const postList = ref<PostData[][]>([])

    const settingStore = useSettingStore()

    const getPosts = async () => {
      if (!isHaveMorePost) {
        return
      }
      settingStore.setLoading(true)

      const res = await postGetByCursorApi(cursor)
      const resPosts = res.data.data
      if (resPosts.length === 0) {
        isHaveMorePost = false
        settingStore.setLoading(false)
        return
      }
      const tempList = postGetByCursorDataHandle(resPosts)

      if (cursor === 0) {
        postList.value = tempList
      } else {
        postList.value.push(...tempList)
      }
      cursor = resPosts[resPosts.length - 1].id
      settingStore.setLoading(false)
    }

    return {
      postList,
      getPosts
    }
  },
  {
    persist: true // 持久化
  }
)
