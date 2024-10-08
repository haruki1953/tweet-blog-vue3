import { useWindowSize } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useLayoutStore = defineStore(
  'tweet-layout',
  () => {
    const windowSize = useWindowSize()
    const col2IsShow2Col = computed(() => windowSize.width.value >= 992)
    const col2LeftHeight = computed(() => {
      return windowSize.height.value - 61
    })

    return {
      col2IsShow2Col,
      col2LeftHeight
    }
  },
  {
    persist: true // 持久化
  }
)
