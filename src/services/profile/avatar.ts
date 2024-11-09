import { ref, type ComputedRef } from 'vue'
import type { ProfileAddAvatarData } from '@/types'
import type { UploadFile } from 'element-plus'
import {
  imageCropToRatioService,
  imageLoadImageFromFileService,
  imageResizeImageService,
  sakiMessage
} from '@/utils'
import { profileAddAvatarApi } from '@/api'
import { useProfileStore } from '@/stores'

export const useAvatarAddService = (dependencies: {
  propsonUploaded: ComputedRef<(resData: ProfileAddAvatarData) => void>
}) => {
  const { propsonUploaded } = dependencies

  const profileStore = useProfileStore()

  const isUploading = ref(false)
  const uploadImage = async (uploadFile: UploadFile) => {
    if (uploadFile.raw === undefined) {
      throw new Error('没有文件')
    }

    isUploading.value = true
    try {
      // 处理图片
      const imageEl = await imageLoadImageFromFileService(uploadFile)
      const imageCropTo11 = imageCropToRatioService(imageEl, 1, 1)
      const imageResize = imageResizeImageService(imageCropTo11, 400, 400)
      const imageBlob = await new Promise<Blob>((resolve) => {
        imageResize.toBlob((blob) => {
          if (!blob) {
            throw new Error()
          }
          resolve(blob)
        }, 'image/png')
      })
      const res = await profileAddAvatarApi(imageBlob)
      profileStore.loadAvatarArrayByRes(res.data.data)
      propsonUploaded.value(res.data.data)
      sakiMessage({
        type: 'success',
        message: '头像添加成功'
      })
    } catch (error) {
      sakiMessage({
        type: 'error',
        message: '头像处理失败'
      })
    } finally {
      isUploading.value = false
    }
  }

  return {
    isUploading,
    uploadImage
  }
}
