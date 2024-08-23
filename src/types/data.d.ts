export interface PostBase {
  id: number
  createdAt: Date
  addedAt: Date
  content: string
  isDeleted: boolean
  parentPostId: number | null
  twitterId: string | null
  twitterLink: string | null
  _count: {
    replies: number
  }
}

export interface Post extends PostBase {
  images: Image[]
}

export interface Image {
  id: number
  alt: string | null
  path: string
  addedAt: Date
  smallSize: number
  largeSize: number
  originalSize: number
  originalPath: string | null
  twitterLargeImageLink: string | null
}

export interface PostData extends Post {
  parentPost: PostBase | null
}
