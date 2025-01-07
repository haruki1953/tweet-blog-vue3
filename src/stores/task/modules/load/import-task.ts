import { taskStatusMap } from '@/config'
import { useImageStore } from '@/stores/image'
import { useLogStore } from '@/stores/log'
import { usePostStore } from '@/stores/post'
import { useProfileStore } from '@/stores/profile'
import type { BackendTaskStore } from '@/types'

// 在 导入任务完成时，更新数据
const handleImportTaskComplete = () => {
  const postStore = usePostStore()
  const imageStore = useImageStore()
  const profileStore = useProfileStore()
  const logStore = useLogStore()

  logStore.setNeedReget(true)
  postStore.setNeedReget(true)
  imageStore.setNeedReget(true)
  profileStore.load()
}

// 在 导入任务更新时，进行一些处理
const handleImportTaskUpdate = () => {
  const postStore = usePostStore()
  const imageStore = useImageStore()

  postStore.setNeedReget(true)
  imageStore.setNeedReget(true)
}

// 处理请求数据中的 taskImportList
export const loadByData_handleImportTaskListPart = (data: {
  oldStore: BackendTaskStore
  newStore: BackendTaskStore
}) => {
  const { oldStore, newStore } = data

  const oldTaskImportList = oldStore.taskImportList
  const newTaskImportList = newStore.taskImportList

  // 判断新数据中是否有 running 的任务
  const isHaveRunning = Boolean(
    newTaskImportList.find((i) => i.status === taskStatusMap.running.key)
  )

  // 判断新数据中是否有更新的任务
  const isHaveUpdated = Boolean(
    newTaskImportList.find((itemNew) => {
      const itemOld = oldTaskImportList.find((i) => i.uuid === itemNew.uuid)
      if (!itemOld) {
        return true
      }
      if (itemNew.updatedAt !== itemOld.updatedAt) {
        return true
      }
    })
  )

  // 判断新数据中是否有刚完成的任务
  const isNewlyCompleted = Boolean(
    newTaskImportList.find((itemNew) => {
      const itemOld = oldTaskImportList.find((i) => i.uuid === itemNew.uuid)
      if (!itemOld) {
        return false
      }
      if (
        itemNew.status === taskStatusMap.completed.key &&
        itemOld.status !== taskStatusMap.completed.key
      ) {
        return true
      }
    })
  )

  if (isHaveUpdated) {
    handleImportTaskUpdate()
  }
  if (isNewlyCompleted) {
    handleImportTaskComplete()
  }

  return {
    isHaveRunning,
    isHaveUpdated,
    isNewlyCompleted
  }
}
