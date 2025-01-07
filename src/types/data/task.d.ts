import type { TaskStatusEnumValues } from '@/config'

export type BackendTaskStore = {
  taskImportList: {
    status: TaskStatusEnumValues
    uuid: string
    startedAt: string
    updatedAt: string
    totalCount: number
    completedCount: number
  }[]
}
