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
      <ImageEditDialog
        v-model="imagesData"
        autoOpen
        cancelOnClose
      ></ImageEditDialog>
    </template>
    <template #colLeft>
      <AlbumInfo></AlbumInfo>
      <ImageEditCard v-model="imagesData"></ImageEditCard>
    </template>
    <template #colRight>
      <ImageSelector
        v-model="imagesData"
        infiniteScroll
        :max="1"
      ></ImageSelector>
    </template>
  </Col2Layout>
</template>

<style lang="scss" scoped></style>
