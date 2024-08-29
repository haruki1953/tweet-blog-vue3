import { postGetByCursorApi } from '@/api'
import type { PostData } from '@/types'
import { postGetByCursorDataHandle } from '@/utils'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSettingStore } from './setting'
import { useRouter } from 'vue-router'

export const usePostStore = defineStore(
  'tweet-post',
  () => {
    let cursor = 0
    let isHaveMore = true

    const postList = ref<PostData[][]>([])

    const settingStore = useSettingStore()

    const getPosts = async () => {
      if (!isHaveMore) {
        return
      }
      settingStore.setPostLoading(true)
      const res = await postGetByCursorApi(cursor)
      settingStore.setPostLoading(false)

      const resPosts = res.data.data
      if (resPosts.length === 0) {
        isHaveMore = false
        return
      }
      const tempList = postGetByCursorDataHandle(resPosts)

      if (cursor === 0) {
        postList.value = tempList
      } else {
        postList.value.push(...tempList)
      }
      cursor = resPosts[resPosts.length - 1].id
    }

    const router = useRouter()
    const toPostSendPage = () => {
      router.push('/send')
    }

    const reGetPosts = async () => {
      cursor = 0
      isHaveMore = true
      await getPosts()
    }

    return {
      postList,
      getPosts,
      toPostSendPage,
      reGetPosts
    }
  },
  {
    persist: true // 持久化
  }
)
