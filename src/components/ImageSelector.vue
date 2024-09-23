<script setup lang="ts">
import { useImageStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import { imgSamllUrl } from '@/utils'
import type { ImageStoreData } from '@/types'
import { CircleCheckFilled } from '@element-plus/icons-vue'
import { useElementSize } from '@vueuse/core'

const model = defineModel<ImageStoreData[]>({ required: true })

const props = withDefaults(
  defineProps<{
    max?: number
    span?: number
    infiniteScroll?: boolean
  }>(),
  {
    max: 1,
    infiniteScroll: false
  }
)

const imageStore = useImageStore()

const isSelected = (img: ImageStoreData) => {
  const findImg = model.value.find((i) => i.id === img.id)
  if (findImg) {
    return true
  } else {
    return false
  }
}

const selectImage = (img: ImageStoreData) => {
  if (isSelected(img)) {
    model.value = model.value.filter((selectedImg) => selectedImg.id !== img.id)
  } else {
    model.value.push(img)
    if (model.value.length > props.max) {
      model.value = model.value.slice(-props.max)
    }
  }
}

const boxRef = ref<HTMLElement | null>(null)
const boxSize = useElementSize(boxRef)
const imageSpan = computed(() => {
  if (props.span) {
    return props.span
  }
  if (boxRef.value == null) {
    return 8
  }
  if (boxSize.width.value > 500) {
    return 8
    // return 6
  } else {
    return 8
  }
})

const infiniteScrollFunc = () => {
  if (props.infiniteScroll) {
    imageStore.loadLimited()
  }
}

onMounted(() => {
  if (imageStore.isNeedReget) {
    imageStore.reGetImages()
  }
})

const selectImgById = (id: number) => {
  const findImg = imageStore.imageList.find((i) => i.id === id)
  if (findImg) {
    // model.value = [findImg]
    selectImage(findImg)
  }
  return findImg
}
defineExpose({
  selectImgById
})
</script>
<template>
  <div
    class="image-list"
    ref="boxRef"
    v-infinite-scroll="infiniteScrollFunc"
    :infinite-scroll-distance="200"
    :infinite-scroll-delay="0"
    :infinite-scroll-immediate="false"
  >
    <!-- 
    v-infinite-scroll="infiniteScrollFunc"
    :infinite-scroll-distance="200" 
    -->
    <el-row :gutter="6">
      <TransitionGroup name="fade-slide-list">
        <el-col :span="24" v-if="imageStore.limitedList.length === 0">
          <SakiEmpty description="暂无图片"></SakiEmpty>
        </el-col>
        <el-col
          :span="imageSpan"
          v-for="image in imageStore.limitedList"
          :key="image.id"
          class="img-box"
        >
          <el-image
            fit="cover"
            :src="imgSamllUrl(image)"
            @click="selectImage(image)"
          ></el-image>
          <div class="img-mask">
            <el-icon size="50" v-show="isSelected(image)">
              <CircleCheckFilled />
            </el-icon>
          </div>
        </el-col>
      </TransitionGroup>
    </el-row>
    <div class="load-button-box" v-if="imageStore.isHaveMoreLimited">
      <el-button
        type="primary"
        round
        size="small"
        :loading="imageStore.isLoadingLimited"
        @click="imageStore.loadLimited"
      >
        加载更多
      </el-button>
    </div>
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
.load-button-box {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  .el-button {
    width: 50%;
    min-width: 100px;
    max-width: 200px;
  }
}
</style>
