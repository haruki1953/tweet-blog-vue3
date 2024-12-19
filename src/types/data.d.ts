import type { PlatformKeyEnumValues, platformKeyMap } from '@/config'

export interface Image {
  id: string
  alt: string | null
  path: string
  addedAt: string
  smallSize: number
  largeSize: number
  originalSize: number
  originalPath: string | null
  // twitterLargeImageLink: string | null
}

export interface PostBase {
  id: string
  createdAt: string
  addedAt: string
  content: string
  isDeleted: boolean
  parentPostId: string | null
  // twitterId: string | null
  // twitterLink: string | null
  imagesOrder: string | null
  _count: {
    replies: number
  }
}

export interface Post extends PostBase {
  images: Image[]
}

export interface PostData extends Post {
  parentPost: Post | null
}

export interface ImageStoreData extends Image {
  posts: PostBase[]
  _count: {
    posts: number
  }
}

export interface PostForwardData {
  id: string
  platform: PlatformKeyEnumValues
  platformPostId: string
  link: string
  // forwardAt: Date
  forwardAt: string
  forwardConfigId: string
  postId: string
}

export interface PostImportData {
  id: string
  platform: PlatformKeyEnumValues
  platformPostId: string
  link: string
  // importedAt: Date
  importedAt: string
  postId: string
}

export interface PostPoolItem {
  id: string
  pushAt: string // Date
  updateAt: string // Date
  mainPost: PostData & {
    postForwards: PostForwardData[]
    postImports: PostImportData[]
  }
  parentPost: PostData | null
  replies: PostData[][]
}

export type BackendProfileStore = {
  avatar: string | null
  avatarArray: {
    path: string
    uuid: string
    size: number
    // addAt: Date
    addAt: string
  }[]
  name: string
  bio: string
  socialMedias: {
    uuid: string
    name: string
    description: string
    link: string
    fontawesomeClass: string
  }[]
  aboutMarkdown: string
  externalLinks: {
    type: 'contact' | 'friend'
    uuid: string
    name: string
    description: string
    link: string
    icon: string
    isCircle: boolean
  }[]
  externalIcons: {
    path: string
    uuid: string
    size: number
    // addAt: Date
    addAt: string
  }[]
}

export type BackendTaskCache = {
  importTaskList: {
    uuid: string
    startAt: string
    totalCount: number
    completedCount: number
  }[]
}

// BackendForwardStore ForwardSetting 转发配置
export type ForwardSettingBase = {
  uuid: string
  name: string
}
export type ForwardSettingX = {
  platform: typeof platformKeyMap.X.key
  data: {
    token1: string
  }
} & ForwardSettingBase
export type ForwardSettingT = {
  platform: typeof platformKeyMap.T.key
  data: {
    token2: string
  }
} & ForwardSettingBase
export type ForwardSettingItem = ForwardSettingX | ForwardSettingT
export type ForwardSettingList = ForwardSettingItem[]
// BackendForwardStore
export type BackendForwardStore = {
  forwardSettingList: ForwardSettingList
}

// 在转发配置设置页面的表单中
// export type ForwardSettingBaseInForm = {
//   isDeleted: boolean
// } & ForwardSettingBase
// export type ForwardSettingXInForm = ForwardSettingX & ForwardSettingBaseInForm
// export type ForwardSettingTInForm = ForwardSettingT & ForwardSettingBaseInForm
// export type ForwardSettingItemInForm =
//   | ForwardSettingXInForm
//   | ForwardSettingTInForm
// 试试这样行不行
export type ForwardSettingItemInForm = ForwardSettingItem & {
  isDeleted: boolean
}
export type ForwardSettingListInForm = ForwardSettingItemInForm
