import type { TaskStoreModuleDependencies } from './dependencies'

export const useManageModule = (dependencies: TaskStoreModuleDependencies) => {
  const { taskCache } = dependencies

  const manageDeleteImportTask = (uuid: string) => {
    taskCache.value.importTaskList = taskCache.value.importTaskList.filter(
      (i) => i.uuid !== uuid
    )
  }

  return {
    manageDeleteImportTask
  }
}
