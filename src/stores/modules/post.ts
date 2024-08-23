import { postGetByCursorApi } from '@/api'
import type { PostData } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePostStore = defineStore(
  'tweet-post',
  () => {
    const cursor = 0

    const postList = ref<PostData[][]>([])

    const getPosts = async () => {
      const tempList: PostData[][] = []

      const res = await postGetByCursorApi(cursor)
      const postData = res.data.data

      // first handel data to `PostData[][]`
      postData.forEach((post) => {
        const postGroup: PostData[] = []
        if (post.parentPost != null) {
          postGroup.push({
            ...post.parentPost,
            parentPost: null
          })
        }
        postGroup.push(post)
        tempList.push(postGroup)
      })

      if (cursor === 0) {
        postList.value = tempList
      } else {
        postList.value.push(...tempList)
      }
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
