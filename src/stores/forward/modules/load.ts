import { postControlGetForwardApi } from '@/api'
import type { ForwardStoreModuleDependencies } from '..'
import type { PostControlGetForwardData } from '@/types'
import { computed, ref } from 'vue'

export const useLoadModule = (dependencies: ForwardStoreModuleDependencies) => {
  const { store } = dependencies

  const loadingMark = ref<boolean>(false)
  const isLoading = computed(() => loadingMark.value)

  const loadFirst = async () => {
    loadingMark.value = true
    await load()
    loadingMark.value = false
  }

  const load = async () => {
    const res = await postControlGetForwardApi()
    loadByData(res.data.data)
  }

  const loadByData = (data: PostControlGetForwardData) => {
    store.value = data.forwardStore
  }

  return {
    isLoading,
    loadFirst,
    load,
    loadByData
  }
}
