export interface Image {
  id: number
  alt: string | null
  path: string
  addedAt: string
  smallSize: number
  largeSize: number
  originalSize: number
  originalPath: string | null
  twitterLargeImageLink: string | null
}

export interface PostBase {
  id: number
  createdAt: string
  addedAt: string
  content: string
  isDeleted: boolean
  parentPostId: number | null
  twitterId: string | null
  twitterLink: string | null
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

export interface PosPoolItem {
  id: number
  pushAt: string // Date
  updateAt: string // Date
  mainPost: PostData
  parentPost: PostData | null
  replies: PostData[][]
}
