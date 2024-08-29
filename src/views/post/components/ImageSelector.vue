<script setup lang="ts">
import { useImageStore } from '@/stores'
import { computed } from 'vue'
import { imgSamllUrl } from '@/utils'
import type { Image } from '@/types'
import { postConfig } from '@/config'
import { CircleCheckFilled } from '@element-plus/icons-vue'

const model = defineModel<Image[]>({ required: true })

const imageStore = useImageStore()
const imageList = computed(() => {
  return imageStore.imageList
})

const isSelected = (img: Image) => {
  const findImg = model.value.find((i) => i.id === img.id)
  if (findImg) {
    return true
  } else {
    return false
  }
}

const selectImage = (img: Image) => {
  if (isSelected(img)) {
    model.value = model.value.filter((selectedImg) => selectedImg.id !== img.id)
  } else {
    model.value.push(img)
    if (model.value.length > postConfig.postMaxImages) {
      model.value = model.value.slice(-postConfig.postMaxImages)
    }
  }
}
</script>
<template>
  <div class="image-list">
    <el-row :gutter="6">
      <el-col
        :span="8"
        v-for="image in imageList"
        :key="image.id"
        class="img-box"
      >
        <el-image
          fit="cover"
          :src="imgSamllUrl(image)"
          @click="selectImage(image)"
        ></el-image>
        <div class="img-mask">
          <el-icon size="40" v-show="isSelected(image)"
            ><CircleCheckFilled
          /></el-icon>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.img-box {
  position: relative;
  margin-bottom: 6px;
  .img-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    pointer-events: none; /* 允许点击穿透 */
    .el-icon {
      color: var(--el-color-success);
    }
  }
  .el-image {
    display: block;
    width: 100%;
    --aspect-ratio-val: 1 / 1;
    --border-radius-val: 5px;
    aspect-ratio: var(--aspect-ratio-val);
    border-radius: var(--border-radius-val);
    user-select: none;
    cursor: pointer;
    :deep() {
      .el-image__inner.is-loading {
        width: 100%;
        aspect-ratio: var(--aspect-ratio-val);
      }
      .el-image__placeholder,
      .el-image__error {
        position: static;
        width: 100%;
        border-radius: var(--border-radius-val);
        aspect-ratio: var(--aspect-ratio-val);
        transition: background-color 0.5s;
        background-color: var(--color-background-soft);
      }
    }
  }
}
</style>
