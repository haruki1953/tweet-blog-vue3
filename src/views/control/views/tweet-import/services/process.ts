import { platformKeyMap, type PlatformKeyEnumValues } from '@/config'
import { dataProcessXtwitterService } from './data-process'
import type { PostControlImportJsonTypeOnDataProcess } from '@/types'

export const processJsonToImportPostsByPlatform = (data: {
  jsonData: string
  platform: PlatformKeyEnumValues
}) => {
  const { jsonData, platform } = data
  let importPosts:
    | PostControlImportJsonTypeOnDataProcess['importPosts']
    | null = null
  if (platform === platformKeyMap.X.key) {
    importPosts = dataProcessXtwitterService(jsonData)
  }

  return importPosts
}
