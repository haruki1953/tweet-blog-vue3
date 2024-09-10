import { postGetByCursorApi, postGetByIdApi } from '@/api'
import type {
  InfoForSendType,
  PosPoolItem,
  PostData,
  PostGetByCursorQueryType,
  PostsGetMode
} from '@/types'
import {
  postGetByCursorDataHandle,
  postGetByIdDataHandle,
  sakiMessage
} from '@/utils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSettingStore } from './setting'
import { useRouter } from 'vue-router'
import { postConfig } from '@/config'

export const usePostStore = defineStore(
  'tweet-post',
  () => {
    // home
    const cursor = ref(0)
    const postList = ref<PostData[][]>([])
    const haveMoreMark = ref(false)
    const isHaveMore = computed(() => {
      return haveMoreMark.value
    })
    const isFirstRequest = computed(() => {
      return cursor.value === 0
    })

    // search
    const postGetByCursorQuery = ref<PostGetByCursorQueryType>({})

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
        return false
      }
      settingStore.setPostLoading(true)
      let res
      try {
        res = await postGetByCursorApi(cursor.value, postGetByCursorQuery.value)
      } catch (error) {
        return false
      } finally {
        settingStore.setPostLoading(false)
      }

      const resPosts = res.data.data
      // const resPosts: typeof res.data.data = []
      if (resPosts.length === 0) {
        haveMoreMark.value = false
        return false
      }
      const tempList = postGetByCursorDataHandle(resPosts)

      if (cursor.value === 0) {
        postList.value = tempList
      } else {
        postList.value.push(...tempList)
      }
      cursor.value = resPosts[resPosts.length - 1].id
      return true
    }
    const resetCursorInfo = () => {
      cursor.value = 0
      haveMoreMark.value = true
      postGetByCursorQuery.value = {}
      resetLimited()
    }
    const reGetPosts = async () => {
      resetCursorInfo()
      await getPosts()
    }
    const searchGetPosts = async (content: string) => {
      resetCursorInfo()
      postGetByCursorQuery.value = { content }
      const isFind = await getPosts()
      if (!isFind) {
        postList.value = []
        sakiMessage({
          type: 'warning',
          message: '没有相关推文'
        })
      }
    }
    const deleteGetPosts = async () => {
      resetCursorInfo()
      postGetByCursorQuery.value = { isDelete: 'true' }
      const isFind = await getPosts()
      if (!isFind) {
        postList.value = []
        sakiMessage({
          type: 'warning',
          message: '回收站为空'
        })
      }
    }

    const nowSearchKey = computed(() => {
      if (postGetByCursorQuery.value.content == null) {
        return null
      }
      return postGetByCursorQuery.value.content
    })

    const postsGetMode = computed((): PostsGetMode => {
      if (postGetByCursorQuery.value.content != null) {
        return 'search'
      }
      if (postGetByCursorQuery.value.isDelete != null) {
        return 'delete'
      }
      return 'normal'
    })

    // // GET post to postPool
    const getPostById = async (id: number) => {
      settingStore.setPostIdLoading(id)
      let res
      try {
        res = await postGetByIdApi(id)
      } catch (error) {
        return
      } finally {
        settingStore.setPostIdLoaded(id)
      }

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
    const infoForSend = ref<InfoForSendType>({
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

    // update post in postList to isDeleted=true
    const updatePostListIsDeleted = (id: number, isDeleted: boolean) => {
      postList.value.forEach((group) => {
        const findPost = group.find((post) => post.id === id)
        if (findPost) {
          findPost.isDeleted = isDeleted
        }
      })
    }
    const updatePostListToRemove = (id: number) => {
      postList.value = postList.value
        .map((group) => {
          return group.filter((post) => post.id !== id)
        })
        .filter((group) => group.length > 0)
    }

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
      toUpdateSendPage,
      isFirstRequest,
      postsGetMode,
      searchGetPosts,
      nowSearchKey,
      deleteGetPosts,
      updatePostListIsDeleted,
      updatePostListToRemove
    }
  },
  {
    persist: true // 持久化
  }
)
