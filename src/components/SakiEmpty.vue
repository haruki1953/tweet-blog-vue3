<script setup lang="ts">
import { sakiPlaceholder, sakiError } from '@/config'

withDefaults(
  defineProps<{
    description?: string
    type?: 'default' | 'error' | 'none'
  }>(),
  {
    type: 'default'
  }
)
</script>
<template>
  <el-empty :description="description">
    <template #image>
      <div v-if="type === 'none'"></div>
      <el-image
        class="saki-img"
        :src="sakiError"
        v-else-if="type === 'error'"
      ></el-image>
      <el-image class="saki-img" :src="sakiPlaceholder" v-else></el-image>
    </template>
    <slot></slot>
  </el-empty>
</template>

<style lang="scss" scoped>
.el-empty {
  :deep() {
    .el-empty__description {
      margin-top: 10px;
    }
  }
}
.saki-img {
  border-radius: 10px;
  display: block;
  :deep() {
    .el-image__inner.is-loading {
      display: none;
    }
    .el-image__wrapper,
    .el-image__error {
      position: static;
      width: 100%;
      aspect-ratio: 1 / 1.35;
      transition: background-color 0.5s;
    }
  }
}
</style>
