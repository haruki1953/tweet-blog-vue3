import type { TaskStoreModuleDependencies } from './dependencies'

export const useManageModule = (dependencies: TaskStoreModuleDependencies) => {
  const { taskCache } = dependencies

  const manageDeleteImportTask = (uuid: string) => {
    taskCache.value.taskImportList = taskCache.value.taskImportList.filter(
      (i) => i.uuid !== uuid
    )
  }

  return {
    manageDeleteImportTask
  }
}
