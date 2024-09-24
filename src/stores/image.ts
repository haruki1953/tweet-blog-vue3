import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSettingStore } from './setting'
import { sakiMessage } from '@/utils'
import type { UploadFile } from 'element-plus'
import { imageConfig, imageRule } from '@/config'
import { imageGetByCursorApi, imageUploadService } from '@/api'
import type { ImageStoreData } from '@/types'

export const useImageStore = defineStore(
  'tweet-image',
  () => {
    let cursor = 0
    const haveMoreMark = ref(false)
    const isHaveMore = computed(() => {
      return haveMoreMark.value
    })
    const imageList = ref<ImageStoreData[]>([])
    const needRegetMark = ref(false)
    const isNeedReget = computed(() => needRegetMark.value)
    const setNeedReget = () => {
      needRegetMark.value = true
    }

    // limit show amounts
    const startLimitedAmounts = imageConfig.limitShow.startAmounts
    const limitedAmounts = ref(startLimitedAmounts)
    const limitedList = computed(() => {
      return imageList.value.slice(0, limitedAmounts.value)
    })

    // GET image
    const settingStore = useSettingStore()
    const getImages = async () => {
      if (!haveMoreMark.value) {
        return
      }
      settingStore.setImageLoading(true)
      let res
      try {
        res = await imageGetByCursorApi(cursor)
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

      if (cursor === 0) {
        imageList.value = resImages
      } else {
        imageList.value.push(...resImages)
      }
      cursor = resImages[resImages.length - 1].id
      return true
    }

    const uploadingImageCount = ref(0)
    const isImageUploading = computed(() => {
      return uploadingImageCount.value > 0 ? true : false
    })
    const reGetImages = async () => {
      cursor = 0
      haveMoreMark.value = true
      resetLimited()
      await getImages()
    }

    const setUploading = () => {
      uploadingImageCount.value += 1
      settingStore.setLoading(true)
      sakiMessage({
        type: 'info',
        message: '图片上传中'
      })
    }
    const setUploaded = (isSuccess: boolean = true) => {
      uploadingImageCount.value -= 1
      if (uploadingImageCount.value <= 0) {
        uploadingImageCount.value = 0
        settingStore.setLoading(false)
      }
      if (isSuccess) {
        sakiMessage({
          type: 'success',
          message: '图片上传成功'
        })
      }
    }

    const uploadImage = async (uploadFile: UploadFile) => {
      if (uploadFile.raw === undefined) {
        throw new Error('没有文件')
      }

      // check file type and size
      const { allowedTypes, typeError, maxSize, sizeError } = imageRule
      if (!allowedTypes.includes(uploadFile.raw.type)) {
        sakiMessage({
          type: 'error',
          message: typeError
        })
        throw new Error(typeError)
      }
      if (uploadFile.raw.size > maxSize) {
        sakiMessage({
          type: 'error',
          message: sizeError
        })
        throw new Error(sizeError)
      }

      // upload image
      setUploading()
      const res = await imageUploadService(uploadFile.raw).catch((e) => {
        setUploaded(false)
        throw e
      })
      setUploaded()
      reGetImages()

      // return imagesData
      const resImage = res.data.data
      return resImage
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
      isImageUploading,
      uploadImage,
      limitedList,
      loadLimited,
      resetLimited,
      isHaveMore,
      isHaveMoreLimited,
      isLoadingLimited,
      isNeedReget,
      setNeedReget
    }
  },
  {
    persist: true // 持久化
  }
)
