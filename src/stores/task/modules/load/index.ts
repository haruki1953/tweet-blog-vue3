import { adminGetTaskApi } from '@/api'
import type { TaskStoreModuleDependencies } from './dependencies'
import type { BackendTaskCache } from '@/types'
import type { Ref } from 'vue'
import { loadByData_processImportTaskListPart } from './import-task'

export const useLoadModule = (dependencies: TaskStoreModuleDependencies) => {
  const { taskCache } = dependencies

  const load = async () => {
    const res = await adminGetTaskApi()
    const info = loadByData(res.data.data)
    return info
  }

  const loadByData = (data: { taskCache: BackendTaskCache }) => {
    const { taskCache: dataTaskCache } = data

    // taskCache.value 为空则直接赋值
    if (taskCache.value == null) {
      taskCache.value = dataTaskCache
    }

    const refTaskCache = taskCache as Ref<BackendTaskCache>
    // 处理 importTaskList
    const processImportTaskListPartInfo = loadByData_processImportTaskListPart(
      { refTaskCache },
      { dataTaskCache }
    )

    const info = {
      isExistsTask: processImportTaskListPartInfo.isExistsInData
    }
    return info
  }

  // 轮询
  const polling = async () => {
    // 存在任务则轮询
    let isExistsTask = true
    while (isExistsTask) {
      // 轮询间隔
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const info = await load().catch(() => null)
      if (info == null) {
        continue
      }
      isExistsTask = info.isExistsTask
    }
  }

  const pollLoad = async () => {
    // 会等待一次请求
    const info = await load()
    if (info.isExistsTask) {
      // 之后异步轮询
      polling()
    }
    return info
  }

  const pollLoadByData = (data: { taskCache: BackendTaskCache }) => {
    const info = loadByData(data)
    if (info.isExistsTask) {
      // 之后异步轮询
      polling()
    }
    return info
  }

  return {
    pollLoad,
    pollLoadByData
  }
}
