import type {
  ProfileGetAllRes,
  ProfileUpdateNameBioJsonType,
  ProfileUpdateNameBioRes
} from '@/types'
import { http } from '@/utils'

export const profileGetAllApi = (): ProfileGetAllRes => {
  return http.get('/profile/all')
}

export const profileUpdateNameBioApi = ({
  name,
  bio
}: ProfileUpdateNameBioJsonType): ProfileUpdateNameBioRes => {
  return http.put('/profile/name-bio', { name, bio })
}
