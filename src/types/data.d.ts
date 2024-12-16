import type { PlatformKeyEnumValues } from '@/config'

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
  forwardAt: Date
  forwardConfigId: string
  postId: string
}

export interface PostImportData {
  id: string
  platform: PlatformKeyEnumValues
  platformPostId: string
  link: string
  importedAt: Date
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
