<script setup lang="ts">
import type { Image } from '@/types'
import { ref } from 'vue'
import AlbumInfo from './components/AlbumInfo.vue'
import { useElementSize } from '@vueuse/core'

const imagesData = ref<Image[]>([])

const boxRef = ref<HTMLElement | null>(null)
const boxSize = useElementSize(boxRef)
</script>
<template>
  <div>
    <Col2Layout reverse>
      <template #colLeftSm>
        <AlbumInfo></AlbumInfo>
        <ImageEditDialog
          v-model="imagesData"
          autoOpen
          cancelOnClose
        ></ImageEditDialog>
      </template>
      <template #colLeft>
        <AlbumInfo></AlbumInfo>
        <div
          class="image-edit-card-container"
          :style="{ height: `${boxSize.height.value + 20}px` }"
        >
          <Transition name="fade-down">
            <div
              class="image-edit-card-box"
              ref="boxRef"
              :key="imagesData.map((i) => i.id).toString()"
            >
              <ImageEditCard v-model="imagesData"></ImageEditCard>
            </div>
          </Transition>
        </div>
      </template>
      <template #colRight>
        <ImageSelector v-model="imagesData" infiniteScroll></ImageSelector>
      </template>
    </Col2Layout>
  </div>
</template>

<style lang="scss" scoped>
.image-edit-card-container {
  position: relative;
  overflow: hidden;
  .image-edit-card-box {
    position: absolute;
    width: 100%;
  }
}
</style>
