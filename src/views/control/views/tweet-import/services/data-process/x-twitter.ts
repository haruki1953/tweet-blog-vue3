// 原来zod是可以在前端用的啊，那一定是应该用zod

import { platformKeyMap } from '@/config'
import type { PostControlImportJsonTypeOnDataProcess } from '@/types'
import { z } from 'zod'
import he from 'he'

const platform = platformKeyMap.x.key

// 处理推文文字内容，
// 1 将短链接替换为正常的链接
// 2 去掉内容最后可能会有的图片链接
// 3 需要视情况裁剪掉 转贴、回复等字样
// 4 解析HTML字符实体（&gt; &lt;）
const processContent = (data: {
  // "full_text": "RT @harukiO_0: @sirongzi 这一下好心动 https://t.co/c2gZUhfWby"
  // "full_text": "RT @sakiko214: https://t.co/b2xO1VE7SF\n终于给番剧小窝实现了番剧的更新提示，感觉变得活跃了很多 https://t.co/wJ4XMuVDn6"
  // "full_text": "上火了，嘴烂了好难受，炫了10粒维生素c，希望明天能好点\uD83D\uDE07"
  full_text: string
  media: ReturnType<typeof dataProcessXtwitterService_ProcessMediaInMediaList>
  urls: ReturnType<typeof dataProcessXtwitterService_ProcessUrlsInUrlsList>
}) => {
  const { full_text, media, urls } = data
  // 将短链接替换为正常链接
  let processedText = full_text
  urls.forEach((url) => {
    processedText = processedText.replace(url.url, url.expanded_url)
  })

  // 去掉内容最后的图片链接
  media.forEach((mediaItem) => {
    // processedText = processedText.replace(mediaItem.url, '')
    processedText = processedText.replace(new RegExp(` ?${mediaItem.url}$`), '')
  })

  // 处理转贴和回复的字样
  processedText = processedText.replace(/^(RT @\w+: )?(@\w+ )?/, '')

  // 解析HTML字符实体（&gt; &lt;）
  processedText = he.decode(processedText)

  return processedText
}

// 处理时间
const processCreatedAt = (data: {
  // "created_at": "Mon Nov 04 07:52:53 +0000 2024",
  created_at: string
}) => {
  const { created_at } = data
  const date = new Date(created_at)
  return date.toISOString()
}

// 处理帖子链接
const processPlatformLink = (data: {
  //
  id_str: string
  user: ReturnType<typeof dataProcessXtwitterService_ProcessUserInCoreUser>
}) => {
  const { id_str, user } = data
  return `https://x.com/${user?.screen_name || '_'}/status/${id_str}`
}

// 处理图片链接，将其拼接为大图链接
const processImageLink = (data: {
  // "media_url_https": "https://pbs.twimg.com/media/GU1r9eGbsAAPu0K.jpg"
  media_url_https: string
}) => {
  const { media_url_https } = data
  // 转为这个样子 https://pbs.twimg.com/media/GU1r9eGbsAAPu0K?format=jpg&name=large
  // 自动通过 media_url_https 的 .xxx 来判断 format=xxx，没有 .xxx 时默认jpg
  const formatMatch = media_url_https.match(/\.(\w+)$/)
  let format
  let baseurl
  if (formatMatch) {
    format = formatMatch[1]
    // 在media_url_https的末尾去掉 `.${format}`，
    baseurl = media_url_https.slice(0, -`.${format}`.length)
  } else {
    format = 'jpg'
    baseurl = media_url_https
  }
  return `${baseurl}?format=${format}&name=large`
}

const xtwitterResSchema = z.object({
  data: z.object({
    user: z.object({
      result: z.object({
        timeline_v2: z.object({
          timeline: z.object({
            instructions: z.array(z.any())
          })
        })
      })
    })
  })
})

const xtwitterInstructionsItemSchema = z.object({
  entries: z.array(z.any())
})

const xtwitterEntriesItemHaveItemContentSchema = z.object({
  content: z.object({
    itemContent: z.record(z.any())
  })
})

const xtwitterEntriesItemHaveItemsSchema = z.object({
  content: z.object({
    items: z.array(
      z.object({
        item: z.object({
          itemContent: z.record(z.any())
        })
      })
    )
  })
})

const xtwitterTweetResultsSchema = z.object({
  result: z.object({
    core: z.any().optional(),
    legacy: z.object({
      created_at: z.string(),
      full_text: z.string(),
      id_str: z.string(),
      in_reply_to_status_id_str: z.string().optional(),
      retweeted_status_result: z.any().optional(),
      entities: z
        .object({
          media: z.array(z.any()).optional(),
          urls: z.array(z.any()).optional()
        })
        .optional()
    })
  })
})

const xtwitterItemContentSchema = z.object({
  tweet_results: xtwitterTweetResultsSchema
})

const xtwitterCoreUserSchema = z.object({
  user_results: z.object({
    result: z.object({
      legacy: z.object({
        screen_name: z.string()
      })
    })
  })
})

const xtwitterMediaItemSchema = z.object({
  id_str: z.string(),
  ext_alt_text: z.string().optional(),
  media_url_https: z.string(),
  url: z.string()
})

const xtwitterUrlsItemSchema = z.object({
  expanded_url: z.string(),
  url: z.string()
})

export const dataProcessXtwitterService = (
  jsonData: string
): PostControlImportJsonTypeOnDataProcess['importPosts'] | null => {
  const dataAny = JSON.parse(jsonData)
  const xtwitterResResult = xtwitterResSchema.safeParse(dataAny)
  if (!xtwitterResResult.success) {
    return null
  }

  // instructions 是一个数组，entries 在其中的某一项中，需要找一下
  const instructions_list =
    xtwitterResResult.data.data.user.result.timeline_v2.timeline.instructions

  // 寻找 instructions 包含 entries 的项
  let entries_list
  for (const instructions_item of instructions_list) {
    const xtwitterInstructionsItemResult =
      xtwitterInstructionsItemSchema.safeParse(instructions_item)
    if (xtwitterInstructionsItemResult.success) {
      entries_list = xtwitterInstructionsItemResult.data.entries
    }
  }
  if (entries_list == null) {
    return null
  }

  // 整理帖子数据
  const importPosts: PostControlImportJsonTypeOnDataProcess['importPosts'] = []
  // entries_item 中 itemContent 包含帖子数据，而 itemContent 的位置不固定
  // 可能直接存在 entries_item 中，也可能存在于 entries_item 中的 items 数组中
  for (const entries_item of entries_list) {
    // 尝试找到 itemContent
    const xtwitterEntriesItemHaveItemContentResult =
      xtwitterEntriesItemHaveItemContentSchema.safeParse(entries_item)
    if (xtwitterEntriesItemHaveItemContentResult.success) {
      const itemContent_obj =
        xtwitterEntriesItemHaveItemContentResult.data.content.itemContent
      const post = dataProcessXtwitterService_ProcessPostInItemcontent({
        itemContent_obj
      })
      if (post != null) {
        importPosts.push(post)
      }
      continue
    }
    // 未找到 itemContent，那么在 items 数组中寻找
    const xtwitterEntriesItemHaveItemsResult =
      xtwitterEntriesItemHaveItemsSchema.safeParse(entries_item)
    if (xtwitterEntriesItemHaveItemsResult.success) {
      const items_list = xtwitterEntriesItemHaveItemsResult.data.content.items
      for (const items_item of items_list) {
        const itemContent_obj = items_item.item.itemContent
        const post = dataProcessXtwitterService_ProcessPostInItemcontent({
          itemContent_obj
        })
        if (post != null) {
          importPosts.push(post)
        }
      }
      continue
    }
  }
  return importPosts
}

// 在 itemContent_obj 中解析推文数据
const dataProcessXtwitterService_ProcessPostInItemcontent = (data: {
  itemContent_obj: any
}) => {
  const { itemContent_obj } = data
  const xtwitterItemContentResult =
    xtwitterItemContentSchema.safeParse(itemContent_obj)
  if (!xtwitterItemContentResult.success) {
    return null
  }
  const itemContent = xtwitterItemContentResult.data
  const result = (() => {
    const result = itemContent.tweet_results.result
    // 如果有转贴则以转贴为准
    const xtwitterTweetResultsResult = xtwitterTweetResultsSchema.safeParse(
      result.legacy.retweeted_status_result
    )
    if (xtwitterTweetResultsResult.success) {
      const retweeted_status_result = xtwitterTweetResultsResult.data
      return retweeted_status_result.result
    }
    return result
  })()
  const legacy = result.legacy

  // user 用户信息 将用于拼接帖子链接
  const user = dataProcessXtwitterService_ProcessUserInCoreUser({
    core_obj: result.core
  })

  // 媒体信息
  const media = (() => {
    // 尝试使用 legacy.entities?.media
    if (legacy.entities?.media != null && legacy.entities.media.length > 0) {
      return dataProcessXtwitterService_ProcessMediaInMediaList({
        media_list: legacy.entities.media
      })
    }
    // 默认返回空数组
    return []
  })()

  // 链接信息
  const urls = (() => {
    if (legacy.entities?.urls != null && legacy.entities.urls.length > 0) {
      return dataProcessXtwitterService_ProcessUrlsInUrlsList({
        urls_list: legacy.entities.urls
      })
    }
    return []
  })()

  // 整理帖子信息
  const { created_at, full_text, id_str, in_reply_to_status_id_str } = legacy
  const content = processContent({ full_text, media, urls })
  const createdAt = processCreatedAt({ created_at })
  // const platform = platformKeyMap.x.key
  const platformId = id_str
  const platformLink = processPlatformLink({ id_str, user })
  const platformParentId = in_reply_to_status_id_str || null
  const isDeleted = false
  // 整理图片信息
  const importImages = media.map((i) => {
    const { id_str, ext_alt_text, media_url_https } = i
    const link = processImageLink({ media_url_https })
    const alt = ext_alt_text
    // const platform = platformKeyMap.x.key
    const platformId = id_str
    return {
      link,
      alt,
      platform,
      platformId
    }
  })
  return {
    content,
    createdAt,
    platform,
    platformId,
    platformLink,
    platformParentId,
    isDeleted,
    importImages
  }
}

// 在 core user_results 中获取用户信息
const dataProcessXtwitterService_ProcessUserInCoreUser = (data: {
  core_obj: any
}) => {
  const { core_obj } = data
  const xtwitterCoreUserResult = xtwitterCoreUserSchema.safeParse(core_obj)
  if (!xtwitterCoreUserResult.success) {
    return null
  }
  const core = xtwitterCoreUserResult.data
  const legacy = core.user_results.result.legacy
  return {
    screen_name: legacy.screen_name
  }
}

// 在 media 中获取媒体信息
const dataProcessXtwitterService_ProcessMediaInMediaList = (data: {
  media_list: any[]
}) => {
  const { media_list } = data
  const media = []
  for (const media_item of media_list) {
    const xtwitterMediaItemResult =
      xtwitterMediaItemSchema.safeParse(media_item)
    if (!xtwitterMediaItemResult.success) {
      continue
    }
    const {
      id_str,
      ext_alt_text = '',
      media_url_https,
      url
    } = xtwitterMediaItemResult.data
    media.push({
      id_str,
      ext_alt_text,
      media_url_https,
      url
    })
  }
  return media
}

// 在 urls 中获取链接信息
const dataProcessXtwitterService_ProcessUrlsInUrlsList = (data: {
  urls_list: any[]
}) => {
  const { urls_list } = data
  const urls = []
  for (const urls_item of urls_list) {
    //
    const xtwitterUrlsItemResult = xtwitterUrlsItemSchema.safeParse(urls_item)
    if (!xtwitterUrlsItemResult.success) {
      continue
    }
    const { expanded_url, url } = xtwitterUrlsItemResult.data
    urls.push({
      expanded_url,
      url
    })
  }
  return urls
}
