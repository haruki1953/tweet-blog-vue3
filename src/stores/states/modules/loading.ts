import { computed, ref } from 'vue'

export const useLoadingModule = () => {
  const loadingMark = ref(false)
  const loadingPostMark = ref(false)
  const loadingImageMark = ref(false)
  const loadingPostIds = ref<number[]>([])
  // dataFirstLoadService
  const loadingFirstDataMark = ref(false)

  const isLoadingData = computed(() => {
    if (
      loadingMark.value ||
      loadingPostMark.value ||
      loadingImageMark.value ||
      loadingFirstDataMark.value ||
      loadingPostIds.value.length > 0
    ) {
      return true
    } else {
      return false
    }
  })
  const isLoadingPost = computed(() => {
    return loadingPostMark.value
  })
  const isLoadingImage = computed(() => {
    return loadingImageMark.value
  })
  const setLoading = (isLoading: boolean) => {
    loadingMark.value = isLoading
  }
  const setPostLoading = (isLoading: boolean) => {
    loadingPostMark.value = isLoading
  }
  const setImageLoading = (isLoading: boolean) => {
    loadingImageMark.value = isLoading
  }
  const setPostIdLoading = (id: number) => {
    loadingPostIds.value.push(id)
  }
  const setPostIdLoaded = (id: number) => {
    loadingPostIds.value = loadingPostIds.value.filter((i) => i !== id)
  }
  const isLoadingPostId = (id: number) => {
    const loadingId = loadingPostIds.value.find((i) => i === id)
    if (loadingId === undefined) {
      return false
    } else {
      return true
    }
  }
  // dataFirstLoadService
  const setFirstDataLoading = (isLoading: boolean) => {
    loadingFirstDataMark.value = isLoading
  }

  return {
    isLoadingData,
    isLoadingImage,
    isLoadingPost,
    setLoading,
    setPostLoading,
    setImageLoading,
    setPostIdLoading,
    setPostIdLoaded,
    isLoadingPostId,
    setFirstDataLoading
  }
}
