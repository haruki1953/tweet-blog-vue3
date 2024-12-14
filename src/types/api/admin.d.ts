import type { BackendTaskCache, Image, ResData } from './base'

export type AdminGetInfoData = {
  imageLargeMaxLength: number
  imageSmallMaxLength: number
  imageQuality: number
  proxyAddressHttp: string
  jwtAdminExpSeconds: number
  loginMaxFailCount: number
  loginLockSeconds: number
  isAuthDefault: boolean
}
export type AdminGetInfoRes = ResData<AdminGetInfoData>

export type AdminUpdateInfoJsonType = {
  jwtAdminExpSeconds: number
  loginMaxFailCount: number
  loginLockSeconds: number
}

export type AdminUpdateProxyJsonType = {
  proxyAddressHttp: string
}

export type AdminProxyTestJsonType = {
  testAddress: string
}
export type AdminProxyTestData = {
  address: string
  latency: number
}
export type AdminProxyTestRes = ResData<AdminProxyTestData>

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

export type AdminGetTaskData = {
  taskCache: BackendTaskCache
}
export type AdminGetTaskRes = ResData<AdminGetTaskData>
