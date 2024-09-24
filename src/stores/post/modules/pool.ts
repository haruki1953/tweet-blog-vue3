import { postGetByIdApi } from '@/api'
import { useSettingStore } from '@/stores'
import type { PosPoolItem } from '@/types'
import { postGetByIdDataHandle } from '@/utils'
import { ref } from 'vue'

export const usePoolModule = () => {
  // data
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

  // GET post to postPool
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

  return {
    isPostRequested,
    resetPostRequested,
    postPool,
    getPostPoolItem,
    getPostById
  }
}
