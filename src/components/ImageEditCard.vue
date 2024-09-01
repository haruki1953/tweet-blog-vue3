<script setup lang="ts">
import { imageUpdateApi } from '@/api'
import { useImageStore, useSettingStore } from '@/stores'
import type { Image, ImageUpdateJsonType } from '@/types'
import { sakiMessage } from '@/utils'
import { computed, watch } from 'vue'
import { ref } from 'vue'

const selectedImages = defineModel<Image[]>({ required: true })
withDefaults(
  defineProps<{
    notPreview?: boolean
  }>(),
  {
    notPreview: false
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

const settingStore = useSettingStore()
const imageStore = useImageStore()

const isSending = ref(false)
const updateImage = async () => {
  if (!isIndexAble.value) {
    return
  }
  isSending.value = true
  settingStore.setLoading(true)
  try {
    const imgId = imageByIndex.value.id
    const res = await imageUpdateApi({
      ...formModel.value,
      id: imgId
    })
    const resImgIndex = selectedImages.value.findIndex((i) => i.id === imgId)
    if (resImgIndex >= 0) {
      selectedImages.value[resImgIndex] = res.data.data
    }
    sakiMessage({
      type: 'success',
      message: '修改成功'
    })
    await imageStore.reGetImages()
  } finally {
    settingStore.setLoading(false)
    isSending.value = false
  }
}

const isMultiple = computed(() => {
  if (selectedImages.value.length > 1) {
    return true
  } else {
    return false
  }
})
const isCanPrevious = computed(() => {
  if (imgIndex.value > 0) {
    return true
  } else {
    return false
  }
})
const isCanNext = computed(() => {
  if (imgIndex.value < selectedImages.value.length - 1) {
    return true
  } else {
    return false
  }
})
</script>
<template>
  <div class="image-edit-card">
    <div v-if="selectedImages.length > 0">
      <div class="image-box">
        <ImageGroup
          :data="selectedImages"
          v-model:index="imgIndex"
          :notPreview="notPreview"
        ></ImageGroup>
      </div>
      <div class="row" v-if="isMultiple">
        <div class="image-select-box">
          <el-button
            round
            type="primary"
            size="small"
            @click="imgIndex -= 1"
            :disabled="!isCanPrevious"
          >
            上一个
          </el-button>
          <div class="lable">第 {{ imgIndex + 1 }} 个图片</div>
          <el-button
            round
            type="primary"
            size="small"
            @click="imgIndex += 1"
            :disabled="!isCanNext"
          >
            下一个
          </el-button>
        </div>
      </div>
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
  margin: 0 10px;
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
</style>
