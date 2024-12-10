import type { PlatformKeyEnumValues } from '@/config'

import { platformKeyMap } from '@/config'

import type {
  PostControlImportJsonType,
  PostControlImportJsonTypeOnDataProcess
} from '@/types'

import { get } from 'lodash'

// 处理推文文字内容，需要视情况裁剪掉 转贴、回复、最后的图片链接等内容
const processContent = (data: {
  // "full_text": "RT @harukiO_0: @sirongzi 这一下好心动 https://t.co/c2gZUhfWby"
  // "full_text": "@sirongzi 这一下好心动 https://t.co/c2gZUhfWby"
  // "full_text": "上火了，嘴烂了好难受，炫了10粒维生素c，希望明天能好点\uD83D\uDE07"
  // "full_text": "RT @sakiko214: https://t.co/b2xO1VE7SF\n终于给番剧小窝实现了番剧的更新提示，感觉变得活跃了很多 https://t.co/wJ4XMuVDn6"
  full_text: string
}) => {}

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

export const dataProcessXtwitterService = (
  jsonData: string
): PostControlImportJsonTypeOnDataProcess['importPosts'] | null => {
  const data = JSON.parse(jsonData)

  // instructions 是一个数组，entries 在其中的某一项中，需要找一下
  const instructions_list = get(
    data,
    'data.user.result.timeline_v2.timeline.instructions'
  )
  if (!Array.isArray(instructions_list)) {
    return null
  }
  // 寻找 instructions 包含 entries 的项
  let entries_list
  for (const instructions_item of instructions_list) {
    const entries = get(instructions_item, 'entries')
    if (Array.isArray(entries)) {
      entries_list = entries
      break
    }
  }
  // entries 是一个数组，其中保存所有帖子的数据
  if (!Array.isArray(entries_list)) {
    return null
  }

  // 整理帖子数据
  const importPosts: PostControlImportJsonTypeOnDataProcess['importPosts'] = []
  // entries_item 中 itemContent 包含帖子数据，而 itemContent 的位置不固定
  // 可能直接存在 entries_item 中，也可能存在于 entries_item 中的 items 数组中
  for (const entries_item of entries_list) {
    const itemContent_obj = get(entries_item, 'content.itemContent')
    if (itemContent_obj != null) {
      // 找到 itemContent
      const post = dataProcessXtwitterService_ProcessPostInItemcontent({
        itemContent_obj
      })
      if (post == null) {
        continue
      }
      importPosts.push(post)
    } else {
      // 未找到 itemContent，那么在 items 数组中寻找
      const items_list = get(entries_item, 'content.items')
      if (!Array.isArray(items_list)) {
        continue
      }
      for (const items_item of items_list) {
        const itemContent_obj = get(items_item, 'item.itemContent')
        if (itemContent_obj == null) {
          continue
        }
        // 在 items_item 中找到 itemContent
        const post = dataProcessXtwitterService_ProcessPostInItemcontent({
          itemContent_obj
        })
        if (post == null) {
          continue
        }
        importPosts.push(post)
      }
    }
  }
  return importPosts
}

export const dataProcessXtwitterService_ProcessPostInItemcontent = (data: {
  itemContent_obj: any
}) =>
  // : PostControlImportJsonTypeOnDataProcess['importPosts'][number] | null
  {
    const { itemContent_obj } = data
    // result 中保存则所有所需的数据
    const result_obj = get(itemContent_obj, 'tweet_results.result')
    if (result_obj == null) {
      return null
    }

    // username 将用于拼接帖子链接
    const username = dataProcessXtwitterService_ProcessUsernameInTweetResults({
      result_obj
    })

    // legacy 中保存着帖子信息
    const tweet_legacy_obj = get(result_obj, 'legacy')
    if (tweet_legacy_obj == null) {
      return null
    }

    // 图片信息
    const media = dataProcessXtwitterService_ProcessMediaListInTweetLegacy({
      tweet_legacy_obj
    })

    // 链接信息
    const urls = dataProcessXtwitterService_ProcessUrlsListInTweetLegacy({
      tweet_legacy_obj
    })

    // 整理图片数据
    const importImages = media.map((i) => {
      return {
        link: processImageLink({ media_url_https: i.media_url_https }),
        alt: i.ext_alt_text
      }
    })

    // 整理帖子数据
    // const content
  }

// 在 tweet_results.result 中获取用户名
export const dataProcessXtwitterService_ProcessUsernameInTweetResults = (data: {
  result_obj: any
}) => {
  const { result_obj } = data
  // core 中保存着用户信息
  const user_legacy_obj = get(result_obj, 'core.user_results.result.legacy')
  if (user_legacy_obj == null) {
    return ''
  }
  // username 将用于拼接帖子链接
  const screen_name_str = get(user_legacy_obj, 'screen_name')
  if (typeof screen_name_str !== 'string') {
    return ''
  }
  return screen_name_str
}

// 在 tweet_legacy_obj 中获取图片信息
export const dataProcessXtwitterService_ProcessMediaListInTweetLegacy = (data: {
  tweet_legacy_obj: any
}) => {
  const { tweet_legacy_obj } = data
  // entities.media 中保存着图片信息
  let media_list: any[] = get(tweet_legacy_obj, 'entities.media')
  if (!Array.isArray(media_list)) {
    media_list = []
  }

  const media = []
  for (const media_item of media_list) {
    // 获取id
    const id_str = (() => {
      const id_str_str = get(media_item, 'id_str')
      if (typeof id_str_str !== 'string') {
        return null
      }
      return id_str_str
    })()
    if (id_str == null) {
      continue
    }

    // 获取图片链接
    // "media_url_https": "https://pbs.twimg.com/media/GY3gM7SacAAHZvM.jpg"
    const media_url_https = (() => {
      const media_url_https_str = get(media_item, 'media_url_https')
      if (typeof media_url_https_str !== 'string') {
        return null
      }
      return media_url_https_str
    })()
    if (media_url_https == null) {
      continue
    }

    // 获取短链接
    // "url": "https://t.co/2GJeOs6smm"
    const url = (() => {
      const url_str = get(media_item, 'url')
      if (typeof url_str !== 'string') {
        return null
      }
      return url_str
    })()
    if (url == null) {
      continue
    }

    // 获取alt
    const ext_alt_text = (() => {
      const ext_alt_text_str = get(media_item, 'ext_alt_text')
      if (typeof ext_alt_text_str !== 'string') {
        return ''
      }
      return ext_alt_text_str
    })()

    media.push({
      id_str,
      media_url_https,
      url,
      ext_alt_text
    })
  }
  return media
}

// 在 tweet_legacy_obj 中获取链接信息
export const dataProcessXtwitterService_ProcessUrlsListInTweetLegacy = (data: {
  tweet_legacy_obj: any
}) => {
  const { tweet_legacy_obj } = data
  // entities.urls 中保存着链接信息
  let urls_list: any[] = get(tweet_legacy_obj, 'entities.urls')
  if (!Array.isArray(urls_list)) {
    urls_list = []
  }

  const urls = []
  for (const urls_item of urls_list) {
    // 链接
    const expanded_url = (() => {
      const expanded_url_str = get(urls_item, 'expanded_url')
      if (typeof expanded_url_str !== 'string') {
        return null
      }
      return expanded_url_str
    })()
    if (expanded_url == null) {
      continue
    }

    // 短链接
    const url = (() => {
      const url_str = get(urls_item, 'url')
      if (typeof url_str !== 'string') {
        return null
      }
      return url_str
    })()
    if (url == null) {
      continue
    }

    urls.push({
      expanded_url,
      url
    })
    return urls
  }
}
