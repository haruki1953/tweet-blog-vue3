import { imageGetByCursorApi } from '@/api'
import { imageConfig } from '@/config'
import { useSettingStore } from '@/stores'
import type { ImageStoreData } from '@/types'
import { computed, ref } from 'vue'

export const useListModule = () => {
  // data
  const imageList = ref<ImageStoreData[]>([])

  const cursor = ref(0)
  const haveMoreMark = ref(false)
  const isHaveMore = computed(() => {
    return haveMoreMark.value
  })

  // limit show amounts
  const startLimitedAmounts = imageConfig.limitShow.startAmounts
  const limitedAmounts = ref(startLimitedAmounts)
  const limitedList = computed(() => {
    return imageList.value.slice(0, limitedAmounts.value)
  })

  // useSomething
  const settingStore = useSettingStore()

  // GET image
  const getImages = async () => {
    if (!haveMoreMark.value) {
      return
    }
    settingStore.setImageLoading(true)
    let res
    try {
      res = await imageGetByCursorApi(cursor.value)
    } catch (error) {
      return false
    } finally {
      settingStore.setImageLoading(false)
    }

    const resImages = res.data.data
    // const resImages: typeof res.data.data = []
    if (resImages.length === 0) {
      haveMoreMark.value = false
      return false
    }

    if (cursor.value === 0) {
      imageList.value = resImages
    } else {
      imageList.value.push(...resImages)
    }
    cursor.value = resImages[resImages.length - 1].id
    return true
  }

  const reGetImages = async () => {
    cursor.value = 0
    haveMoreMark.value = true
    resetLimited()
    await getImages()
  }

  // scroll to load more
  const loadingLimitedMark = ref(false)
  const isLoadingLimited = computed(() => {
    return loadingLimitedMark.value || settingStore.isLoadingImage
  })
  const loadLimited = async () => {
    if (isLoadingLimited.value) {
      return
    }
    loadingLimitedMark.value = true
    limitedAmounts.value += imageConfig.limitShow.limitAmounts
    if (limitedAmounts.value > imageList.value.length) {
      await getImages()
    }
    loadingLimitedMark.value = false
  }
  const resetLimited = () => {
    limitedAmounts.value = startLimitedAmounts
  }
  const isHaveMoreLimited = computed(() => {
    return isHaveMore.value || imageList.value.length > limitedAmounts.value
  })

  return {
    imageList,
    getImages,
    reGetImages,
    limitedList,
    loadLimited,
    resetLimited,
    isHaveMore,
    isHaveMoreLimited,
    isLoadingLimited
  }
}
