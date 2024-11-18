import type { Image, ResData } from './base'

export type AdminGetInfoData = {
  isAuthDefault: boolean
  jwtAdminExpSeconds: number
  loginMaxFailCount: number
  loginLockSeconds: number
}
export type AdminGetInfoRes = ResData<AdminGetInfoData>

export type AdminUpdateInfoJsonType = {
  jwtAdminExpSeconds: number
  loginMaxFailCount: number
  loginLockSeconds: number
}

export type AdminGatImageConfigData = {
  imageLargeMaxLength: number
  imageSmallMaxLength: number
  imageQuality: number
}
export type AdminGatImageConfigRes = ResData<AdminGatImageConfigData>

export type AdminUpdateImageConfigJsonType = {
  imageLargeMaxLength: number
  imageSmallMaxLength: number
  imageQuality: number
}

export type AdminDeleteNotUsedImageData = (Image | null)[]
export type AdminDeleteNotUsedImageRes = ResData<AdminDeleteNotUsedImageData>

export type AdminDeleteAllOriginalImageData = number
export type AdminDeleteAllOriginalImageRes =
  ResData<AdminDeleteAllOriginalImageData>
