import { postGetByCursorApi } from '@/api'
import { postConfig } from '@/config'
import { useSettingStore } from '@/stores'
import type { PostData, PostGetByCursorQueryType, PostsGetMode } from '@/types'
import { postGetByCursorDataHandle, sakiMessage } from '@/utils'
import { computed, ref, type Ref } from 'vue'
import { useListManageModule } from './list-manage'

export const useListModule = (setupData: {
  //
  postList: Ref<PostData[][]>
}) => {
  // data
  const { postList } = setupData

  // cursor for pagination query
  const cursor = ref(0)
  const isFirstRequest = computed(() => {
    return cursor.value === 0
  })
  const haveMoreMark = ref(false)
  const isHaveMore = computed(() => {
    return haveMoreMark.value
  })
  // postGetByCursorQuery for postGetByCursorApi
  const postGetByCursorQuery = ref<PostGetByCursorQueryType>({})

  // limitedAmounts for infinite-scroll
  const startLimitedAmounts = postConfig.limitShow.startAmounts
  const limitedAmounts = ref(startLimitedAmounts)
  const limitedList = computed(() => {
    return postList.value.slice(0, limitedAmounts.value)
  })
  const loadingLimitedMark = ref(false)
  const isLoadingLimited = computed(() => {
    return loadingLimitedMark.value || settingStore.isLoadingPost
  })

  // use modules
  const listManageModule = useListManageModule({
    postList
  })

  // use something
  const settingStore = useSettingStore()

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

  // reset an get post by any mode
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

  // post get mode
  const postsGetMode = computed((): PostsGetMode => {
    if (postGetByCursorQuery.value.content != null) {
      return 'search'
    }
    if (postGetByCursorQuery.value.isDelete != null) {
      return 'delete'
    }
    return 'normal'
  })
  const nowSearchKey = computed(() => {
    if (postGetByCursorQuery.value.content == null) {
      return null
    }
    return postGetByCursorQuery.value.content
  })

  // scroll to load more
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
    getPosts,
    reGetPosts,
    limitedList,
    loadLimited,
    resetLimited,
    isHaveMore,
    isHaveMoreLimited,
    isLoadingLimited,
    isFirstRequest,
    postsGetMode,
    searchGetPosts,
    nowSearchKey,
    deleteGetPosts,
    ...listManageModule
  }
}
