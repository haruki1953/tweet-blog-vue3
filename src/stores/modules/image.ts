import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSettingStore } from './setting'
import { sakiMessage } from '@/utils'
import type { UploadFile } from 'element-plus'
import { imageRule } from '@/config'
import { imageUploadService } from '@/api'

export const useImageStore = defineStore(
  'tweet-image',
  () => {
    const settingStore = useSettingStore()
    const uploadingImageCount = ref(0)

    const isImageUploading = computed(() => {
      return uploadingImageCount.value > 0 ? true : false
    })

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
      console.log('uploadFile', uploadFile)
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

      // return imagesData
      const resImage = res.data.data
      return resImage
    }

    return {
      isImageUploading,
      uploadImage
    }
  },
  {
    persist: true // 持久化
  }
)
