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

export type ProfileUpdateAvatarData = ProfileResData
export type ProfileUpdateAvatarRes = ResData<ProfileUpdateAvatarData>

export type ProfileDeleteAvatarData = ProfileResData & {
  delAvatar: BackendProfileStore['avatarArray'][number]
}
export type ProfileDeleteAvatarRes = ResData<ProfileDeleteAvatarData>

export type ProfileDeleteAvatarNotUsedData = ProfileResData & {
  delAvatarList: BackendProfileStore['avatarArray']
}
export type ProfileDeleteAvatarNotUsedRes =
  ResData<ProfileDeleteAvatarNotUsedData>

export type ProfileUpdateSocialMediasJsonType = {
  socialMedias: BackendProfileStore['socialMedias']
}
export type ProfileUpdateSocialMediasData = ProfileResData
export type ProfileUpdateSocialMediasRes =
  ResData<ProfileUpdateSocialMediasData>

export type ProfileAddIconData = ProfileResData & {
  newExternalIcon: BackendProfileStore['externalIcons'][number]
}
export type ProfileAddIconRes = ResData<ProfileAddIconData>

export type ProfileDeleteIconData = ProfileResData & {
  delExternalIcon: BackendProfileStore['externalIcons'][number]
}
export type ProfileDeleteIconRes = ResData<ProfileDeleteIconData>

export type ProfileDeleteIconNotUsedData = ProfileResData & {
  delExternalIconList: BackendProfileStore['externalIcons']
}
export type ProfileDeleteIconNotUsedRes = ResData<ProfileDeleteIconNotUsedData>

export type ProfileUpdateExternalLinksJsonType = {
  externalLinks: BackendProfileStore['externalLinks']
}
export type ProfileUpdateExternalLinksData = ProfileResData
export type ProfileUpdateExternalLinksRes =
  ResData<ProfileUpdateExternalLinksData>
