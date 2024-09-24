<script setup lang="ts">
import type { ImageStoreData } from '@/types'
import { onMounted, ref, watch } from 'vue'
import AlbumInfo from './components/AlbumInfo.vue'
import { useElementSize } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import type ImageSelector from '@/components/ImageSelector.vue'

const imagesData = ref<ImageStoreData[]>([])

const boxRef = ref<HTMLElement | null>(null)
const boxSize = useElementSize(boxRef)

const route = useRoute()
const router = useRouter()
const refImageSelecter = ref<InstanceType<typeof ImageSelector> | null>(null)

// set query, when imagesData(selectedImage) change
watch(
  () => imagesData.value.map((i) => i.id).toString(),
  () => {
    if (imagesData.value.length > 0) {
      router.replace({
        name: route.name,
        query: { img: imagesData.value[0].id }
      })
    } else {
      router.replace({ name: route.name })
    }
  }
)

// onMounted, select image by query
onMounted(() => {
  const routeImgId = Number(route.query.img)
  if (!isNaN(routeImgId)) {
    const findImg = refImageSelecter.value?.selectImgById(routeImgId)
    if (!findImg) {
      router.replace({ name: route.name })
    }
  } else {
    router.replace({ name: route.name })
  }
})
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
          :style="{ height: `${boxSize.height.value}px` }"
        >
          <Transition name="fade-down" mode="out-in">
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
        <ImageSelector
          v-model="imagesData"
          infiniteScroll
          ref="refImageSelecter"
        ></ImageSelector>
      </template>
    </Col2Layout>
  </div>
</template>

<style lang="scss" scoped>
.image-edit-card-container {
  margin-top: 5px;
  position: relative;
  // overflow: hidden;
  // transition: height 0.3s;
  .image-edit-card-box {
    position: absolute;
    width: 100%;
  }
}
</style>
