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
    createdAt?: Date | undefined
    platform?: PlatformKeyEnumValues | undefined
    platformId?: string | undefined
    platformLink?: string | undefined
    platformParentId?: string | null | undefined
    isDeleted?: boolean | undefined
  }[]
}
