<script setup lang="ts">
import type { ImageStoreData, ImageUpdateJsonType } from '@/types'
import { computed } from 'vue'
import { openLink, imgLargeUrl, imgSamllUrl, imgOriginalUrl } from '@/utils'
import { imageConfig } from '@/config'
import { useImageEditCardController } from '../store'
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
    <!-- 修改alt -->
    <div class="update-alt-box">
      <div class="lable">修改alt</div>
      <div class="input-box">
        <el-input
          v-model="formModel.alt"
          placeholder="添加描述"
          :autosize="{ minRows: 2, maxRows: 20 }"
          resize="none"
          type="textarea"
          size="large"
          class="textarea"
          :maxlength="imageConfig.maxAltCharactersOnSend"
          show-word-limit
          suffix-icon="Calendar"
        />
      </div>
      <div class="update-button-box">
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
    <template v-if="!imageSelect">
      <!-- 各版本图片 -->
      <div class="row top">
        <div class="lable">各版本图片</div>
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
      <!-- 删除图片 -->
      <div class="row bottom">
        <div class="lable">删除图片</div>
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
      <!-- 帖子 -->
      <div class="post-list-box" v-if="imageByIndex.posts.length > 0">
        <IECPostList
          :notPreview="notPreview"
          :imageSelect="imageSelect"
          v-model:selectedImages="selectedImages"
          v-model:formModel="formModel"
          v-model:imgIndex="imgIndex"
        ></IECPostList>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.update-alt-box {
  margin-bottom: 15px;
}

.post-list-box {
  margin-top: 20px;
}

.row {
  margin-bottom: 2px;
  background-color: var(--color-background-soft);
  padding: 8px;
  transition: all 0.5s;
  &.top {
    border-radius: 20px 20px 0 0;
  }
  &.bottom {
    border-radius: 0 0 20px 20px;
  }
  .lable {
    margin: 0 0 2px 8px;
  }
}
.lable {
  margin: 0 0 2px 16px;
  font-size: 12px;
  color: var(--color-text-soft);
}

.update-button-box {
  margin: 5px 10px 0 0;
  display: flex;
  align-items: center;
  justify-content: right;
}
.center-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.button-box {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: right;
}
.input-box {
  // margin: 0 5px;
  .textarea {
    padding: 8px 8px 15px 8px;
    border-radius: 20px;
    background-color: var(--color-background-soft);
    transition: all 0.5s;
    :deep() {
      .el-textarea__inner {
        // color: var(--color-text);
        // font-weight: bold;
        border: none;
        box-shadow: none;
        background-color: transparent;
        transition:
          background-color 0.5s,
          color 0.2s;
      }
      .el-input__count {
        background-color: transparent;
        color: var(--color-text-soft);
        transition: all 0.5s;
        right: 15px;
        // bottom: 15px;
        user-select: none;
      }
    }
  }
}
</style>
