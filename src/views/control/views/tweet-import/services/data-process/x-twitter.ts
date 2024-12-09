import type { PlatformKeyEnumValues } from '@/config'
// type PlatformKeyEnumValues = 'X'

import { platformKeyMap } from '@/config'
// const platformKeyMap: {
//   readonly x: {
//     readonly key: 'X'
//     readonly name: 'X / Twitter'
//   }
// }

import type { PostControlImportJsonType } from '@/types'
// type PostControlImportJsonType = {
//   importPosts: {
//     // 图片数组
//     importImages: {
//       // 图片链接
//       link: string
//       // 图片alt
//       alt?: string | undefined
//       // 平台，这里填为 platformKeyMap.x.key
//       platform?: PlatformKeyEnumValues | undefined
//       // 图片id
//       platformId?: string | undefined
//     }[]
//     // 帖子内容
//     content?: string | undefined
//     // 帖子时间
//     createdAt?: Date | undefined
//     // 平台，这里填为 platformKeyMap.x.key
//     platform?: PlatformKeyEnumValues | undefined
//     // 帖子id
//     platformId?: string | undefined
//     // 帖子链接
//     platformLink?: string | undefined
//     // 帖子父贴的id
//     platformParentId?: string | null | undefined
//     // 默认为false
//     isDeleted?: boolean | undefined
//   }[]
// }

import { get } from 'lodash'

// const processContent = (data: {
//   // "full_text": "RT @harukiO_0: @sirongzi 这一下好心动 https://t.co/c2gZUhfWby"
//   // "full_text": "@sirongzi 这一下好心动 https://t.co/c2gZUhfWby"
//   // "full_text": "上火了，嘴烂了好难受，炫了10粒维生素c，希望明天能好点\uD83D\uDE07"
//   // "full_text": "RT @sakiko214: https://t.co/b2xO1VE7SF\n终于给番剧小窝实现了番剧的更新提示，感觉变得活跃了很多 https://t.co/wJ4XMuVDn6"
//   full_text: string
// }) => {}

// export const dataProcessXtwitterService = (
//   jsonData: string
// ): PostControlImportJsonType['importPosts'] => {
//   const data = JSON.parse(jsonData)

//   // instructions 是一个数组，entries 在其中的某一项中，需要找一下
//   const instructions_list = get(
//     data,
//     'data.user.result.timeline_v2.timeline.instructions'
//   )
//   if (!Array.isArray(instructions_list)) {
//     throw new Error()
//   }
//   // 寻找 instructions 包含 entries 的项
//   const instructions_item_have_entries = instructions_list.find(
//     (i: any) => get(i, 'entries') != null
//   )
//   if (instructions_item_have_entries == null) {
//     throw new Error()
//   }

//   // entries 是一个数组，其中保存所有帖子的数据
//   const entries_list = get(instructions_item_have_entries, 'entries')
//   if (!Array.isArray(entries_list)) {
//     throw new Error()
//   }

//   const importPosts = entries_list.map((entries_item: any) => {
//     // result 中保存则所有所需的数据
//     const result_obj = get(
//       entries_item,
//       'content.itemContent.tweet_results.result',
//       {}
//     )

//     // core legacy 中保存着用户信息
//     const core_legacy_obj = get(
//       result_obj,
//       'core.user_results.result.legacy',
//       {}
//     )

//     // legacy 中保存着帖子信息
//     const legacy_obj = get(result_obj, 'legacy', {})

//     // media 中保存着图片信息
//     const media_list = get(legacy_obj, 'entities.media', [])

//     // 开始整理帖子内容
//     // const content =
//   })
// }
