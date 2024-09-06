import { postGetByCursorApi, postGetByIdApi } from '@/api'
import type { PosPoolItem, PostData } from '@/types'
import { postGetByCursorDataHandle, postGetByIdDataHandle } from '@/utils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSettingStore } from './setting'
import { useRouter } from 'vue-router'
import { postConfig } from '@/config'

export const usePostStore = defineStore(
  'tweet-post',
  () => {
    // home
    let cursor = 0
    const postList = ref<PostData[][]>([])
    const haveMoreMark = ref(false)
    const isHaveMore = computed(() => {
      return haveMoreMark.value
    })

    // limit show amounts
    const startLimitedAmounts = postConfig.limitShow.startAmounts
    const limitedAmounts = ref(startLimitedAmounts)
    const limitedList = computed(() => {
      return postList.value.slice(0, limitedAmounts.value)
    })

    // post page
    const postPool = ref<PosPoolItem[]>([])
    const getPostPoolItem = (id: number): PosPoolItem | undefined => {
      return postPool.value.find((i) => i.id === id)
    }
    const requestedPostIds = ref<number[]>([])
    const isPostRequested = (id: number) => {
      const find = requestedPostIds.value.find((i) => i === id)
      if (find == null) {
        return false
      } else {
        return true
      }
    }
    const resetPostRequested = () => {
      requestedPostIds.value = []
    }

    // useSomething
    const settingStore = useSettingStore()
    const router = useRouter()

    // GET post to postList
    const getPosts = async () => {
      if (!isHaveMore.value) {
        return
      }
      settingStore.setPostLoading(true)
      const res = await postGetByCursorApi(cursor)
      settingStore.setPostLoading(false)

      const resPosts = res.data.data
      if (resPosts.length === 0) {
        haveMoreMark.value = false
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
    const reGetPosts = async () => {
      cursor = 0
      haveMoreMark.value = true
      await getPosts()
    }

    // // GET post to postPool
    const getPostById = async (id: number) => {
      settingStore.setPostIdLoading(id)
      const res = await postGetByIdApi(id)
      settingStore.setPostIdLoaded(id)

      const resPostGetByIdData = res.data.data
      const newPostPoolItem = postGetByIdDataHandle(resPostGetByIdData)
      requestedPostIds.value.push(newPostPoolItem.id)

      const index = postPool.value.findIndex((p) => p.id === newPostPoolItem.id)
      if (index >= 0) {
        const oldPostPoolItem = postPool.value[index]
        postPool.value[index] = newPostPoolItem
        postPool.value[index].pushAt = oldPostPoolItem.pushAt
      } else {
        postPool.value.push(newPostPoolItem)
      }

      tryLimitPostPoolSize()
    }
    const tryLimitPostPoolSize = () => {
      // limit postPool size
      if (postPool.value.length > 150) {
        // Sort the postPool by updateAt date in ascending order
        postPool.value.sort(
          (a, b) =>
            new Date(a.updateAt).getTime() - new Date(b.updateAt).getTime()
        )
        // Remove the oldest 50 items
        postPool.value.splice(0, 50)
      }
    }

    // info to control SendPage
    const infoForSend = ref<{
      type: 'post' | 'reply' | 'update'
      data: PostData | null
    }>({
      type: 'post',
      data: null
    })

    const toPostSendPage = () => {
      infoForSend.value.type = 'post'
      router.push({ name: 'send' })
    }
    const toReplySendPage = (data: PostData) => {
      infoForSend.value.type = 'reply'
      infoForSend.value.data = data
      router.push({ name: 'send' })
    }
    const toUpdateSendPage = (data: PostData) => {
      infoForSend.value.type = 'update'
      infoForSend.value.data = data
      router.push({ name: 'send' })
    }

    // scroll to load more
    const loadingLimitedMark = ref(false)
    const isLoadingLimited = computed(() => {
      return loadingLimitedMark.value || settingStore.isLoadingPost
    })
    const loadLimited = async () => {
      if (isLoadingLimited.value) {
        return
      }
      loadingLimitedMark.value = true
      limitedAmounts.value += postConfig.limitShow.limitAmounts
      if (limitedAmounts.value > postList.value.length) {
        await getPosts()
      }
      loadingLimitedMark.value = false
    }
    const resetLimited = () => {
      limitedAmounts.value = startLimitedAmounts
    }
    const isHaveMoreLimited = computed(() => {
      return isHaveMore.value || postList.value.length > limitedAmounts.value
    })

    return {
      postList,
      getPosts,
      reGetPosts,
      limitedList,
      loadLimited,
      resetLimited,
      isHaveMore,
      isHaveMoreLimited,
      isLoadingLimited,
      isPostRequested,
      resetPostRequested,
      postPool,
      getPostPoolItem,
      getPostById,
      infoForSend,
      toPostSendPage,
      toReplySendPage,
      toUpdateSendPage
    }
  },
  {
    persist: true // 持久化
  }
)
