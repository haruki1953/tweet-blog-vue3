<script setup lang="ts">
import type { PostData } from '@/types'

defineProps<{
  data: PostData[]
}>()
</script>
<template>
  <div class="post-group">
    <template v-for="(post, index) in data" :key="post.id">
      <PostCard :data="post"></PostCard>
      <el-divider v-if="index < data.length - 1" border-style="dotted" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.post-group {
  margin-bottom: 15px;
  padding: 12px 18px 14px 18px;
  background-color: var(--color-background-soft);
  border-radius: 20px;
  transition: all 0.5s;
}
.el-divider {
  width: 90%;
  margin: 14px auto;
  transition: all 0.5s;
  --el-border-color: var(--color-border);
}
</style>
