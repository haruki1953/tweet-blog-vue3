<script setup lang="ts">
import { imageConfig } from '@/config'
import type { Image } from '@/types'
import { nextTick } from 'vue'
import { ref, type ComponentPublicInstance } from 'vue'

defineProps<{
  data: Image[]
}>()

const img1 = ref<ComponentPublicInstance | null>(null)

const img1Load = async () => {
  await nextTick()
  if (!img1.value) return
  const imgEl = img1.value.$el as HTMLElement

  // width / height
  const maxRatio = 4 / 5
  const minRatio = 4 / 1

  const width = imgEl.offsetWidth
  const height = imgEl.offsetHeight

  const maxHeight = width / maxRatio
  const minHeight = width / minRatio

  console.log(width, height, maxHeight, minHeight)

  if (height > maxHeight) {
    imgEl.style.setProperty('aspect-ratio', '4 / 5')
  } else if (height < minHeight) {
    imgEl.style.setProperty('aspect-ratio', '4 / 1')
  }
}

const imgSamllUrl = (path: string) => {
  return `${imageConfig.smallBaseUrl}${path}`
}
</script>
<template>
  <div class="image-group">
    <el-row v-if="data.length === 1">
      <el-col :span="24">
        <el-image
          class="post-img img1-1"
          fit="cover"
          :src="imgSamllUrl(data[0].path)"
          ref="img1"
          @load="img1Load"
        ></el-image>
      </el-col>
    </el-row>

    <el-row v-else-if="data.length === 2">
      <el-col :span="12">
        <el-image
          class="post-img img2-1"
          fit="cover"
          :src="imgSamllUrl(data[0].path)"
        ></el-image>
      </el-col>
      <el-col :span="12">
        <el-image
          class="post-img img2-2"
          fit="cover"
          :src="imgSamllUrl(data[1].path)"
        ></el-image>
      </el-col>
    </el-row>

    <el-row v-else-if="data.length === 3">
      <el-col :span="12">
        <el-image
          class="post-img img3-1"
          fit="cover"
          :src="imgSamllUrl(data[0].path)"
        ></el-image>
      </el-col>
      <el-col :span="12">
        <el-image
          class="post-img img3-2"
          fit="cover"
          :src="imgSamllUrl(data[1].path)"
        ></el-image>
        <el-image
          class="post-img img3-3"
          fit="cover"
          :src="imgSamllUrl(data[2].path)"
        ></el-image>
      </el-col>
    </el-row>

    <el-row v-else>
      <el-col :span="12">
        <el-image
          class="post-img img4-1"
          fit="cover"
          :src="imgSamllUrl(data[0].path)"
        ></el-image>
        <el-image
          class="post-img img4-3"
          fit="cover"
          :src="imgSamllUrl(data[1].path)"
        ></el-image>
      </el-col>
      <el-col :span="12">
        <el-image
          class="post-img img4-2"
          fit="cover"
          :src="imgSamllUrl(data[2].path)"
        ></el-image>
        <el-image
          class="post-img img4-4"
          fit="cover"
          :src="imgSamllUrl(data[3].path)"
        ></el-image>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.post-img {
  display: block;
  width: 100%;
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 20px;
  aspect-ratio: var(--aspect-ratio-val);
  border-radius: var(--border-radius-val);
  border: 1px solid transparent;
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
      background-color: var(--color-background);
    }
  }
}
.img1-1 {
  aspect-ratio: unset;
}
.img2-1 {
  --aspect-ratio-val: 8 / 9;
  --border-radius-val: 20px 0 0 20px;
}
.img2-2 {
  --aspect-ratio-val: 8 / 9;
  --border-radius-val: 0 20px 20px 0;
}
.img3-1 {
  --aspect-ratio-val: 8 / 9;
  --border-radius-val: 20px 0 0 20px;
}
.img3-2 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 20px 0 0;
}
.img3-3 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 0 20px 0;
}
.img4-1 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 20px 0 0 0;
}
.img4-2 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 20px 0 0;
}
.img4-3 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 0 0 20px;
}
.img4-4 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 0 20px 0;
}
</style>
