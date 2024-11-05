<script setup lang="ts">
import type { ImageStoreData, ImageUpdateJsonType } from '@/types'
import { computed } from 'vue'
import { openLink, imgLargeUrl, imgSamllUrl, imgOriginalUrl } from '@/utils'
import { imageConfig } from '@/config'
import { useImageEditCardController } from '../controller'
import { useImageEditService } from '@/services'

const props = withDefaults(
  defineProps<{
    notPreview?: boolean
    imageSelect?: boolean
  }>(),
  {
    notPreview: false,
    imageSelect: false
  }
)
const propsnotPreview = computed(() => props.notPreview)
const propsimageSelect = computed(() => props.imageSelect)

const selectedImages = defineModel<ImageStoreData[]>('selectedImages', {
  required: true
})
const formModel = defineModel<Omit<ImageUpdateJsonType, 'id'>>('formModel', {
  required: true
})
const imgIndex = defineModel<number>('imgIndex', { required: true })

const { isIndexAble, imageByIndex, initFormModel } = useImageEditCardController(
  {
    propsnotPreview,
    propsimageSelect,
    selectedImages,
    formModel,
    imgIndex
  }
)

const {
  isSending,
  updateImage,
  disableDeleteImage,
  disableDeleteOriginal,
  isImageDeleting,
  deleteImage,
  isOriginalDeleting,
  deleteOriginal
} = useImageEditService({
  selectedImages,
  formModel,
  isIndexAble,
  imageByIndex
})
</script>
<template>
  <div class="i-e-c-control-box">
    <div class="control-box">
      <div class="control-row">
        <!-- 修改alt -->
        <div class="update-alt-box">
          <div class="control-lable">修改alt</div>
          <div class="input-box">
            <el-input
              v-model="formModel.alt"
              placeholder="添加描述"
              :autosize="{ minRows: 2, maxRows: 10 }"
              resize="none"
              type="textarea"
              size="large"
              class="textarea"
              :maxlength="imageConfig.maxAltCharactersOnSend"
              show-word-limit
              suffix-icon="Calendar"
            />
          </div>
          <div class="button-box">
            <el-button
              round
              type="info"
              size="small"
              @click="initFormModel"
              :disabled="isSending"
            >
              重置
            </el-button>
            <el-button
              round
              type="primary"
              size="small"
              @click="updateImage"
              :loading="isSending"
            >
              修改
            </el-button>
          </div>
        </div>
      </div>
      <template v-if="!imageSelect">
        <div class="control-divider"></div>
        <!-- 各版本图片 -->
        <div class="control-row">
          <div class="control-lable">各版本图片</div>
          <div class="button-box">
            <el-button
              round
              type="info"
              size="small"
              :disabled="imageByIndex.smallSize === 0"
              @click="openLink(imgSamllUrl(imageByIndex))"
            >
              查看小图
            </el-button>
            <el-button
              round
              type="success"
              size="small"
              :disabled="imageByIndex.largeSize === 0"
              @click="openLink(imgLargeUrl(imageByIndex))"
            >
              查看大图
            </el-button>
            <el-button
              round
              type="warning"
              size="small"
              :disabled="imageByIndex.originalSize === 0"
              @click="openLink(imgOriginalUrl(imageByIndex))"
            >
              查看原图
            </el-button>
          </div>
        </div>
        <div class="control-divider"></div>
        <!-- 删除图片 -->
        <div class="control-row">
          <div class="control-lable">删除图片</div>
          <div class="button-box">
            <el-button
              round
              type="danger"
              size="small"
              :disabled="disableDeleteImage"
              :loading="isImageDeleting"
              @click="deleteImage"
            >
              删除图片
            </el-button>
            <el-button
              round
              type="warning"
              size="small"
              :disabled="disableDeleteOriginal"
              :loading="isOriginalDeleting"
              @click="deleteOriginal"
            >
              删除原图
            </el-button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-box {
  .textarea {
    // background-color: var(--color-background-soft);
    // transition: all 0.5s;
    margin-bottom: -5px;
    :deep() {
      .el-textarea__inner {
        // color: var(--color-text);
        // font-weight: bold;
        border: none;
        box-shadow: none;
        background-color: transparent;
        // transition:
        //   background-color 0.5s,
        //   color 0.2s;
      }
      .el-input__count {
        background-color: transparent;
        color: var(--color-text-soft);
        transition: all 0.5s;
        left: 10px;
        bottom: -20px;
        user-select: none;
      }
    }
  }
}

.button-box {
  margin-right: 2px;
  display: flex;
  justify-content: right;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  .el-button {
    margin-bottom: 2px;
  }
}
.control-box {
  background-color: var(--color-background-soft);
  transition: background-color 0.5s;
  border-radius: 20px;
}
.control-row {
  padding: 8px;
}
.control-lable {
  font-size: 12px;
  color: var(--color-text-soft);
  margin: 0 0 2px 8px;
}
.control-divider {
  height: 2px;
  background-color: var(--color-background);
  transition: background-color 0.5s;
}
</style>
