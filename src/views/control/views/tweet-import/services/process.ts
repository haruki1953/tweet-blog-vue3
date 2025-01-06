import { platformKeyMap, type PlatformKeyEnumValues } from '@/config'
import { dataProcessXtwitterService } from './data-process'
import type { ImportPostList } from '@/types'
import { z } from 'zod'

export const processJsonToImportPostsByPlatform = (data: {
  jsonData: string
  platform: PlatformKeyEnumValues
}) => {
  const { jsonData, platform } = data
  let importPosts: ImportPostList | null = null
  if (platform === platformKeyMap.X.key) {
    importPosts = dataProcessXtwitterService(jsonData)
  }

  return importPosts
}

// “以 HAR 格式复制全部”
const devtoolsHarSchema = z.object({
  log: z.object({
    entries: z.array(
      z.object({
        response: z.object({
          content: z.object({
            text: z.string().optional()
          })
        })
      })
    )
  })
})
// 从 har 解析出每个响应的 json
// 返回null代表解析失败
export const processHarToJsonList = (data: { harData: string }) => {
  const { harData } = data
  // 尝试解析
  const harResult = devtoolsHarSchema.safeParse(JSON.parse(harData))
  if (!harResult.success) {
    return null
  }
  const entries = harResult.data.log.entries
  const jsonList = entries
    .map((i) => {
      return i.response.content.text
    })
    .filter((i): i is string => i != null)
  return jsonList
}
