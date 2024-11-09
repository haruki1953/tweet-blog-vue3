import type { ResData, BackendProfileStore } from './base'

export type ProfileGetAllData = {
  data: {
    post: number
    image: number
  }
  store: BackendProfileStore
}
export type ProfileGetAllRes = ResData<ProfileGetAllData>

export type ProfileUpdateNameBioJsonType = {
  name: string
  bio: string
}

export type ProfileResData = {
  store: BackendProfileStore
}

export type ProfileUpdateNameBioData = ProfileResData
export type ProfileUpdateNameBioRes = ResData<ProfileUpdateNameBioData>

export type ProfileAddAvatarData = ProfileResData & {
  newAvatar: BackendProfileStore['avatarArray'][number]
}
export type ProfileAddAvatarRes = ResData<ProfileAddAvatarData>
