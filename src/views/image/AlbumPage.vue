<script setup lang="ts">
import type { Image } from '@/types'
import { ref } from 'vue'
import AlbumInfo from './components/AlbumInfo.vue'

const imagesData = ref<Image[]>([])
</script>
<template>
  <Col2Layout reverse>
    <template #colLeftSm>
      <AlbumInfo></AlbumInfo>
    </template>
    <template #colLeft>
      <AlbumInfo></AlbumInfo>
    </template>
    <template #colRight>
      <ImageSelector v-model="imagesData" infiniteScroll></ImageSelector>
    </template>
  </Col2Layout>
</template>

<style lang="scss" scoped></style>
