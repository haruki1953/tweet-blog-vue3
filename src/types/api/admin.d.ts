import type { ResData } from './base'

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
