<script setup lang="ts">
import { logoImage } from '@/config'

defineProps<{
  description: string
  size?: '' | 'small'
}>()
</script>
<template>
  <div
    class="tweet-empty"
    :class="{
      small: size === 'small'
    }"
  >
    <el-image class="empty-img" :src="logoImage" fit="cover"></el-image>
    <div class="empty-description">{{ description }}</div>
  </div>
</template>

<style lang="scss" scoped>
.tweet-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  &.small {
    padding: 20px 0;
    .empty-img {
      max-width: 100px;
      margin-bottom: 10px;
    }
    .empty-description {
      font-size: 14px;
    }
  }
}

.empty-img {
  display: block;
  width: 100%;
  aspect-ratio: 1/1;
  max-width: 160px;
  border-radius: 10px;
  margin-bottom: 20px;
  :deep() {
    .el-image__inner.is-loading {
      display: none;
    }
    .el-image__wrapper,
    .el-image__error {
      position: static;
      width: 100%;
      aspect-ratio: 1/1;
      transition: background-color 0.5s;
    }
  }
}

.empty-description {
  color: var(--color-text-soft);
}
</style>
