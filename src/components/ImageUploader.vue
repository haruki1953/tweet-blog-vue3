<script setup lang="ts">
import type { Image } from '@/types'
import { Upload } from '@element-plus/icons-vue'
import type { UploadFile, UploadFiles, UploadUserFile } from 'element-plus'
import { useImageStore } from '@/stores'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    onUploaded?: (resImage: Image) => void
  }>(),
  {
    onUploaded: () => {}
  }
)

const imageStroe = useImageStore()

const uploadImage = async (
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  // console.log('uploadFile', uploadFile)
  // console.log('uploadFiles', uploadFiles, uploadFiles.length)
  // if have images are uploading, wait a little
  if (uploadFiles.length > 1) {
    await new Promise((resolve) =>
      setTimeout(resolve, (uploadFiles.length - 1) * 500)
    )
  }
  const resImage = await imageStroe.uploadImage(uploadFile)
  props.onUploaded(resImage)
  files.value.shift()
}
// help to mark uploading count
const files = ref<UploadUserFile[]>([])
</script>
<template>
  <div class="image-uploader">
    <div class="upload-box style-box">
      <el-upload
        :auto-upload="false"
        accept="image/*"
        :on-change="uploadImage"
        :show-file-list="false"
        v-model:file-list="files"
        drag
        multiple
      ></el-upload>
      <div class="mask">
        <el-icon class="icon"><Upload /></el-icon>
        <span class="text">上传图片</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-uploader {
  --height: 80px;
  .upload-box {
    :deep() {
      .el-upload {
        width: 100%;
        height: var(--height);
        .el-upload-dragger {
          height: 100%;
          // visibility: hidden;
          border: none;
          background-color: transparent;
          &.is-dragover {
            background-color: var(--el-color-primary-light-9);
          }
        }
      }
    }
  }
  .style-box {
    height: var(--height);
    border: 2px dashed var(--el-border-color);
    border-radius: 20px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition:
      border var(--el-transition-duration),
      background-color 0.5s;
    &:hover {
      border-color: var(--el-color-primary);
    }
    .mask {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #8c939d;
      user-select: none;
      pointer-events: none; /* 允许点击穿透 */
      .icon {
        font-size: 28px;
      }
      .text {
        font-weight: bold;
        margin-left: 10px;
      }
    }
  }
}
</style>
