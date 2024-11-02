import type { AdminGetInfoRes, ResData } from '@/types'
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
