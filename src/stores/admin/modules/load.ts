import { adminGetImageConfigApi, adminGetInfoApi } from '@/api'
import type { AdminStoreModuleDependencies } from '..'
import { sakiNotification } from '@/utils'
import { computed, ref } from 'vue'

export const useLoadModule = (dependencies: AdminStoreModuleDependencies) => {
  const {
    isAuthDefault,
    jwtAdminExpSeconds,
    loginMaxFailCount,
    loginLockSeconds,
    imageLargeMaxLength,
    imageSmallMaxLength,
    imageQuality
  } = dependencies

  const loadingMark = ref<boolean>(false)
  const isLoading = computed(() => loadingMark.value)

  const loadInfo = async () => {
    loadingMark.value = true
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
    loadingMark.value = false
  }

  const loadingMarkImageConfig = ref<boolean>(false)
  const isLoadingImageConfig = computed(() => loadingMark.value)

  const loadImageConfig = async () => {
    loadingMarkImageConfig.value = true
    const res = await adminGetImageConfigApi()
    imageLargeMaxLength.value = res.data.data.imageLargeMaxLength
    imageSmallMaxLength.value = res.data.data.imageSmallMaxLength
    imageQuality.value = res.data.data.imageQuality
    loadingMarkImageConfig.value = false
  }

  return {
    isLoading,
    loadInfo,
    isLoadingImageConfig,
    loadImageConfig
  }
}
