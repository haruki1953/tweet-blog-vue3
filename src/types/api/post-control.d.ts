import type { PlatformKeyEnumValues } from '@/config'

export type PostControlImportJsonType = {
  importPosts: {
    importImages: {
      link: string
      alt?: string | undefined
      platform?: PlatformKeyEnumValues | undefined
      platformId?: string | undefined
    }[]
    content?: string | undefined
    // createdAt?: Date | undefined
    createdAt?: string | undefined
    platform?: PlatformKeyEnumValues | undefined
    platformId?: string | undefined
    platformLink?: string | undefined
    platformParentId?: string | null | undefined
    isDeleted?: boolean | undefined
  }[]
}

export type PostControlImportJsonTypeOnDataProcess = {
  importPosts: {
    importImages: {
      link: string
      alt: string
      platform: PlatformKeyEnumValues
      platformId: string
    }[]
    content: string
    createdAt: string
    platform: PlatformKeyEnumValues
    platformId: string
    platformLink: string
    platformParentId: string | null
    isDeleted?: boolean | undefined
  }[]
}
