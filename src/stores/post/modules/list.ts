import { postGetByCursorApi } from '@/api'
import { postConfig } from '@/config'
import { useSettingStore } from '@/stores'
import type { PostData, PostGetByCursorQueryType, PostsGetMode } from '@/types'
import { postGetByCursorDataHandle, sakiMessage } from '@/utils'
import { computed, ref, type Ref } from 'vue'
import { useListFavoriteModule } from './list-favorite'
// import { useListManageModule } from './list-manage'

export const useListModule = (dependencies: {
  //
  postList: Ref<PostData[][]>
}) => {
  // data
  const { postList } = dependencies

  // cursor for pagination query
  const cursor = ref(0)
  const isFirstRequest = computed(() => {
    return cursor.value === 0
  })
  const haveMoreMark = ref(false)
  const isHaveMore = computed(() => {
    return haveMoreMark.value
  })

  const isHaveMoreLimited = computed(() => {
    if (postsGetMode.value === 'favorite') {
      return limitedList.value.length < favoriteModule.favoriteList.value.length
    } else {
      return (
        isHaveMore.value || limitedList.value.length > postList.value.length
      )
    }
  })

  // postGetByCursorQuery for postGetByCursorApi
  const postGetByCursorQuery = ref<PostGetByCursorQueryType>({})
  // control favorite mode
  const isFavoriteMode = ref(false)
  // post get mode
  const postsGetMode = computed((): PostsGetMode => {
    if (isFavoriteMode.value) {
      return 'favorite'
    }
    if (postGetByCursorQuery.value.content != null) {
      return 'search'
    }
    if (postGetByCursorQuery.value.isDelete != null) {
      return 'delete'
    }
    return 'normal'
  })
  // nowSearchKey for search mode
  const nowSearchKey = computed(() => {
    if (postGetByCursorQuery.value.content == null) {
      return null
    }
    return postGetByCursorQuery.value.content
  })

  // limitedAmounts for infinite-scroll
  const startLimitedAmounts = postConfig.limitShow.startAmounts
  const limitedAmounts = ref(startLimitedAmounts)
  const limitedList = computed(() => {
    let data
    if (postsGetMode.value === 'favorite') {
      data = favoriteModule.favoriteList
    } else {
      data = postList
    }
    return data.value.slice(0, limitedAmounts.value)
  })
  const loadingLimitedMark = ref(false)
  const isLoadingLimited = computed(() => {
    return loadingLimitedMark.value || settingStore.isLoadingPost
  })

  // use modules
  const favoriteModule = useListFavoriteModule()

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
    isFavoriteMode.value = false
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
  const favoriteGetPosts = () => {
    isFavoriteMode.value = true
    if (!favoriteModule.favoriteBaseList.value.length) {
      sakiMessage({
        type: 'warning',
        message: '收藏夹为空'
      })
    }
  }

  // scroll to load more
  const loadLimited = async () => {
    if (isLoadingLimited.value) {
      return
    }
    loadingLimitedMark.value = true
    limitedAmounts.value += postConfig.limitShow.limitAmounts
    if (postsGetMode.value === 'favorite') {
      // favorite
    } else {
      // normal search delete
      if (limitedAmounts.value > postList.value.length) {
        await getPosts()
      }
    }
    loadingLimitedMark.value = false
  }
  const resetLimited = () => {
    limitedAmounts.value = startLimitedAmounts
  }

  return {
    ...favoriteModule,
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
    favoriteGetPosts
    // ...listManageModule
  }
}
