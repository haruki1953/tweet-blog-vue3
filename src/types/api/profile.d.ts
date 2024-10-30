import type { ResData } from './base'

export type ProfileGetAllData = {
  data: {
    post: number
    image: number
  }
  store: BackendProfileStore
}
export type ProfileGetAllRes = ResData<ProfileGetAllData>

export type BackendProfileStore = {
  avatar: string | null
  avatarArray: {
    path: string
    uuid: string
    size: number
    addAt: Date
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
    isRadiu: boolean
  }[]
  externalIcons: {
    path: string
    uuid: string
    size: number
    addAt: Date
  }[]
}
