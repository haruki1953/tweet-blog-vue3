import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useLoadModule } from './modules/load'

export type AdminStoreModuleDependencies = {
  isAuthDefault: Ref<boolean | null>
  jwtAdminExpSeconds: Ref<number | null>
  loginMaxFailCount: Ref<number | null>
  loginLockSeconds: Ref<number | null>
}

export const useAdminStore = defineStore(
  'tweet-admin',
  () => {
    const isAuthDefault = ref<boolean | null>(null)
    const jwtAdminExpSeconds = ref<number | null>(null)
    const loginMaxFailCount = ref<number | null>(null)
    const loginLockSeconds = ref<number | null>(null)

    const dependencies = {
      isAuthDefault,
      jwtAdminExpSeconds,
      loginMaxFailCount,
      loginLockSeconds
    }

    const loadModule = useLoadModule(dependencies)

    return {
      ...loadModule,
      isAuthDefault,
      jwtAdminExpSeconds,
      loginMaxFailCount,
      loginLockSeconds
    }
  },
  {
    persist: true // 持久化
  }
)
