import type {
  AdminDeleteAllOriginalImageRes,
  AdminDeleteNotUsedImageRes,
  AdminGatImageConfigRes,
  AdminGetInfoRes,
  AdminUpdateImageConfigJsonType,
  AdminUpdateInfoJsonType,
  AdminUpdateProxyJsonType,
  ResData
} from '@/types'
import { http } from '@/utils'

type AdminLoginJsonType = {
  username: string
  password: string
}
export const adminLoginApi = ({
  username,
  password
}: AdminLoginJsonType): ResData<string> => {
  return http.post('/public/admin-login', { username, password })
}

export const adminUpdateAuthApi = ({
  username,
  password
}: AdminLoginJsonType) => {
  return http.put('/admin/auth', { username, password })
}

export const adminGetInfoApi = (): AdminGetInfoRes => {
  return http.get('/admin/info')
}

export const adminUpdateInfoApi = (
  json: AdminUpdateInfoJsonType
): AdminGetInfoRes => {
  return http.put('/admin/info', json)
}

export const adminUpdateProxyApi = (
  json: AdminUpdateProxyJsonType
): AdminGetInfoRes => {
  return http.put('/admin/proxy', json)
}

// export const adminGetImageConfigApi = (): AdminGatImageConfigRes => {
//   return http.get('/image/config')
// }

// export const adminUpdateImageConfigApi = (
//   json: AdminUpdateImageConfigJsonType
// ) => {
//   return http.put('/image/config', json)
// }

export const adminUpdateImageConfigApi = (
  json: AdminUpdateImageConfigJsonType
): AdminGetInfoRes => {
  return http.put('/admin/image', json)
}

export const adminDeleteNotUsedImageApi = (): AdminDeleteNotUsedImageRes => {
  return http.delete('/image/all')
}

export const adminDeleteAllOriginalImageApi =
  (): AdminDeleteAllOriginalImageRes => {
    return http.delete('/image/original/all')
  }
