import { useImageStore } from '@/stores/image'
import { usePostStore } from '@/stores/post'
import { useProfileStore } from '@/stores/profile'
import type { BackendTaskCache } from '@/types'
import type { Ref } from 'vue'

const postStore = usePostStore()
const imageStore = useImageStore()
const profileStore = useProfileStore()

// 在 导入任务完成时，更新数据
const handleImportTaskComplete = () => {
  postStore.setNeedReget(true)
  imageStore.setNeedReget(true)
  profileStore.load()
}

// 处理请求数据中的 importTaskList
export const loadByData_processImportTaskListPart = (
  dependencies: {
    refTaskCache: Ref<BackendTaskCache>
  },
  data: {
    dataTaskCache: BackendTaskCache
  }
) => {
  const { refTaskCache } = dependencies
  const { dataTaskCache } = data
  // 遍历 将本地的与请求的合并
  for (const dataItem of dataTaskCache.importTaskList) {
    const findItemIndex = refTaskCache.value.importTaskList.findIndex(
      (i) => i.uuid === dataItem.uuid
    )
    // 请求中的 importTask 未在本地中找到，进行添加，并继续下一个
    if (findItemIndex === -1) {
      refTaskCache.value.importTaskList.push(dataItem)
      continue
    }
    // 请求中的 importTask 可以在本地中找到，进行更新
    refTaskCache.value.importTaskList[findItemIndex] = dataItem
  }
  // 遍历 处理本地中有，而请求中没有的。即为已完成
  for (const valueItem of refTaskCache.value.importTaskList) {
    const findItemIndex = dataTaskCache.importTaskList.findIndex(
      (i) => i.uuid === valueItem.uuid
    )
    if (findItemIndex === -1) {
      refTaskCache.value.importTaskList[findItemIndex].completedCount =
        refTaskCache.value.importTaskList[findItemIndex].totalCount
      handleImportTaskComplete()
    }
  }

  // 判断请求中是否有importTask
  const isExistsInData = (() => {
    if (dataTaskCache.importTaskList.length === 0) {
      return false
    }
    return true
  })()
  return {
    isExistsInData
  }
}
