import type { ResData } from '@/types/api'
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
