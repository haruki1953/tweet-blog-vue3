import { adminGetInfoApi } from '@/api'
import type { AdminStoreModuleDependencies } from '..'
import { sakiNotification } from '@/utils'

export const useLoadModule = (dependencies: AdminStoreModuleDependencies) => {
  const {
    isAuthDefault,
    jwtAdminExpSeconds,
    loginMaxFailCount,
    loginLockSeconds
  } = dependencies

  const loadInfo = async () => {
    const res = await adminGetInfoApi()
    isAuthDefault.value = res.data.data.isAuthDefault
    jwtAdminExpSeconds.value = res.data.data.jwtAdminExpSeconds
    loginMaxFailCount.value = res.data.data.loginMaxFailCount
    loginLockSeconds.value = res.data.data.loginLockSeconds
    if (isAuthDefault.value === true) {
      sakiNotification({
        type: 'warning',
        title: '请修改账号密码',
        message: '当前账号密码为默认值，请尽快修改'
      })
    }
  }

  return {
    //
    loadInfo
  }
}
