import { platformKeyMap, type PlatformKeyEnumValues } from '@/config'
import { dataProcessXtwitterService } from './data-process'

export const processJsonToImportPostsByPlatform = (data: {
  jsonData: string
  platform: PlatformKeyEnumValues
}) => {
  const { jsonData, platform } = data
  let importPosts
  if (platform === platformKeyMap.X.key) {
    importPosts = dataProcessXtwitterService(jsonData)
  }

  return importPosts
}
