import { postGetByCursorApi, postGetByIdApi } from '@/api'
import type { PostByIdData, PostData } from '@/types'
import { postGetByCursorDataHandle } from '@/utils'
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
    const requestedPostIds = ref<number[]>([])
    const postPool = ref<PostByIdData[]>([])

    // useSomething
    const settingStore = useSettingStore()
    const router = useRouter()

    // GET post
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

    const getPostById = async (id: number) => {
      settingStore.setPostIdLoading(id)
      const res = await postGetByIdApi(id)
      settingStore.setPostIdLoaded(id)

      const resPostByIdData = res.data.data
      // TODO
    }

    const toPostSendPage = () => {
      router.push('/send')
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
      toPostSendPage,
      reGetPosts,
      limitedList,
      loadLimited,
      resetLimited,
      isHaveMore,
      isHaveMoreLimited,
      isLoadingLimited
    }
  },
  {
    persist: true // 持久化
  }
)
