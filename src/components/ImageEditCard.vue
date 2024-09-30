<script setup lang="ts">
import { imageDeleteApi, imageDeleteOriginalApi, imageUpdateApi } from '@/api'
import { useImageStore } from '@/stores'
import type { ImageStoreData, ImageUpdateJsonType } from '@/types'
import {
  formatDate,
  manageRefDataImageAfterDeleteImage,
  manageRefDataImageAfterUpdateImage,
  sakiMessage
} from '@/utils'
import { computed, watch } from 'vue'
import { ref } from 'vue'
import { openLink, imgLargeUrl, imgSamllUrl, imgOriginalUrl } from '@/utils'
import { ChatSquare } from '@element-plus/icons-vue'

const selectedImages = defineModel<ImageStoreData[]>({ required: true })

withDefaults(
  defineProps<{
    notPreview?: boolean
    imageSelect?: boolean
  }>(),
  {
    notPreview: false,
    imageSelect: false
  }
)

const formModel = ref<Omit<ImageUpdateJsonType, 'id'>>({})

const imgIndex = ref(0)
const handleIndex = () => {
  if (imgIndex.value < 0) {
    imgIndex.value = 0
  }
  if (imgIndex.value >= selectedImages.value.length) {
    imgIndex.value = Math.max(0, selectedImages.value.length - 1)
  }
}

const isIndexAble = computed(() => {
  if (imgIndex.value < 0) {
    return false
  }
  if (imgIndex.value >= selectedImages.value.length) {
    return false
  }
  return true
})

const imageByIndex = computed(() => {
  return selectedImages.value[imgIndex.value]
})

const initFormModel = () => {
  if (!isIndexAble.value) return
  formModel.value.alt = imageByIndex.value.alt
}

watch(
  () => ({
    imgIds: selectedImages.value.map((i) => i.id),
    imgIndex: imgIndex.value
  }),
  () => {
    handleIndex()
    initFormModel()
  },
  { immediate: true }
)

const cancelSelectedImg = () => {
  selectedImages.value.splice(imgIndex.value, 1)
}

const isMultiple = computed(() => {
  if (selectedImages.value.length > 1) {
    return true
  } else {
    return false
  }
})

const imageStore = useImageStore()

// 修改图片信息
const isSending = ref(false)
const updateImage = async () => {
  if (!isIndexAble.value) {
    return
  }
  isSending.value = true
  try {
    const imgId = imageByIndex.value.id
    const res = await imageUpdateApi({
      ...formModel.value,
      id: imgId
    })
    const resImage = res.data.data
    // 修改图片后，利用返回的图片，管理store中的数据
    imageStore.manageAfterUpdateImage(resImage)
    // 还要修改selectedImages
    manageRefDataImageAfterUpdateImage({ imageList: selectedImages }, resImage)

    sakiMessage({
      type: 'success',
      message: '修改成功'
    })
  } finally {
    isSending.value = false
  }
}

// 删除图片相关
const disableDeleteImage = computed(() => {
  if (imageByIndex.value._count.posts > 0) {
    return true
  }
  return false
})
const disableDeleteOriginal = computed(() => {
  if (imageByIndex.value.originalSize === 0) {
    return true
  }
  return false
})
const isImageDeleting = ref(false)
const deleteImage = async () => {
  if (!isIndexAble.value) {
    return
  }
  isImageDeleting.value = true
  try {
    const imgId = imageByIndex.value.id
    const res = await imageDeleteApi(imgId)
    // const resImgIndex = selectedImages.value.findIndex((i) => i.id === imgId)
    // if (resImgIndex >= 0) {
    //   selectedImages.value.splice(resImgIndex, 1)
    // }
    const resImage = res.data.data
    // 删除图片后，利用返回的图片，管理store中的数据
    imageStore.manageAfterDeleteImage(resImage)
    // 还要修改selectedImages
    manageRefDataImageAfterDeleteImage({ imageList: selectedImages }, resImage)

    sakiMessage({
      type: 'success',
      message: '删除成功'
    })
    // await imageStore.reGetImages()
  } finally {
    isImageDeleting.value = false
  }
}
const isOriginalDeleting = ref(false)
const deleteOriginal = async () => {
  if (!isIndexAble.value) {
    return
  }
  isOriginalDeleting.value = true
  try {
    const imgId = imageByIndex.value.id
    const res = await imageDeleteOriginalApi(imgId)
    const resImage = res.data.data
    // 删除原图其实也差不多是修改图片信息
    // 修改图片后，利用返回的图片，管理store中的数据
    imageStore.manageAfterUpdateImage(resImage)
    // 还要修改selectedImages
    manageRefDataImageAfterUpdateImage({ imageList: selectedImages }, resImage)

    sakiMessage({
      type: 'success',
      message: '删除成功'
    })
  } finally {
    isOriginalDeleting.value = false
  }
}
</script>
<template>
  <div class="image-edit-card">
    <div v-if="selectedImages.length > 0">
      <!-- 图片预览 -->
      <div class="image-box">
        <ImageGroup
          :data="selectedImages"
          v-model:index="imgIndex"
          :notPreview="notPreview"
        ></ImageGroup>
        <div class="image-select-box row" v-if="imageSelect">
          <div class="lable">
            <template v-if="isMultiple">
              第 {{ imgIndex + 1 }} 个图片
            </template>
          </div>
          <el-button
            round
            type="danger"
            size="small"
            @click="cancelSelectedImg"
          >
            取消选择
          </el-button>
        </div>
      </div>
      <!-- 修改alt -->
      <div class="row">
        <div class="lable center-box">修改alt</div>
        <div class="input-box">
          <el-input
            v-model="formModel.alt"
            placeholder="添加描述"
            :rows="2"
            type="textarea"
            size="large"
            class="textarea"
            :maxlength="500"
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
        <div class="row">
          <div class="lable center-box">各版本图片</div>
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
        <div class="row">
          <div class="lable center-box">删除图片</div>
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
        <div class="row" v-if="imageByIndex.posts.length > 0">
          <div class="lable center-box">推文</div>
          <div class="post-link-list">
            <div
              class="post-link-item"
              v-for="item in imageByIndex.posts"
              :key="item.id"
              @click="$router.push({ name: 'post', params: { id: item.id } })"
            >
              <div class="content">
                <el-icon :size="15">
                  <ChatSquare />
                </el-icon>
                <div class="text">
                  {{ item.content }}
                </div>
              </div>
              <div class="date">{{ formatDate(item.createdAt) }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="image-card-skeleton" v-else>
      <el-skeleton>
        <template #template>
          <el-skeleton-item variant="image" />
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-box {
  margin: 10px 0;
}
.row {
  margin-bottom: 10px;
  .lable {
    margin-bottom: 4px;
    font-size: 12px;
    color: var(--color-text-soft);
  }
}
.image-select-box {
  margin: 5px 10px -5px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  justify-content: center;
  align-content: center;
}
.input-box {
  .textarea {
    padding: 10px;
    border-radius: 20px;
    background-color: var(--color-background-soft);
    transition: all 0.5s;
    :deep() {
      .el-textarea__inner {
        // color: var(--color-text);
        // font-weight: bold;
        border: none;
        box-shadow: none;
        background-color: var(--color-background-soft);
        transition:
          background-color 0.5s,
          color 0.2s;
      }
      .el-input__count {
        background-color: var(--color-background-soft);
        color: var(--color-text-soft);
        transition: all 0.5s;
        right: 20px;
        bottom: 15px;
        user-select: none;
      }
    }
  }
}

.image-card-skeleton {
  margin: 10px 0;
  .el-skeleton__image {
    width: 100%;
    height: 400px;
    border-radius: 20px;
    background-color: var(--color-background-soft);
    transition: all 0.5s;
    :deep() {
      svg {
        transition: all 0.2s;
      }
    }
  }
}

.post-link-list {
  .post-link-item {
    height: 30px;
    margin-bottom: 5px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-background-soft);
    border-radius: 10px;
    transition:
      background-color 0.5s,
      color 0.2s,
      transform 0.2s;
    cursor: pointer;
    &:hover {
      transform: scale(1.04, 1.04);
      background-color: var(--color-background-mute);
    }
    .content {
      width: 60%;
      display: flex;
      align-items: center;
      font-size: 12px;
      // color: var(--color-text-soft);
      .el-icon {
        margin-right: 5px;
      }
      .text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .date {
      display: flex;
      align-items: center;
      font-size: 12px;
      // color: var(--color-text-soft);
    }
  }
}
</style>
