import { postGetByCursorApi } from '@/api'
import type { PostData } from '@/types'
import { postGetByCursorDataHandle } from '@/utils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSettingStore } from './setting'
import { useRouter } from 'vue-router'
import { postConfig } from '@/config'

export const usePostStore = defineStore(
  'tweet-post',
  () => {
    let cursor = 0
    const haveMoreMark = ref(false)
    const isHaveMore = computed(() => {
      return haveMoreMark.value
    })
    const postList = ref<PostData[][]>([])

    // limit show amounts
    const startLimitedAmounts = postConfig.limitShow.startAmounts
    const limitedAmounts = ref(startLimitedAmounts)
    const limitedList = computed(() => {
      return postList.value.slice(0, limitedAmounts.value)
    })

    const settingStore = useSettingStore()

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

    const router = useRouter()
    const toPostSendPage = () => {
      router.push('/send')
    }

    const reGetPosts = async () => {
      cursor = 0
      haveMoreMark.value = true
      await getPosts()
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
