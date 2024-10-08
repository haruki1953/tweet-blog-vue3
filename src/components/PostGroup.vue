<script setup lang="ts">
import type { PostData, PostsGetMode } from '@/types'

withDefaults(
  defineProps<{
    data: PostData[]
    mini?: boolean
    notPreview?: boolean
    notAlt?: boolean
    postMode?: PostsGetMode
  }>(),
  {
    mini: false,
    notPreview: false,
    notAlt: false,
    postMode: 'normal'
  }
)
</script>
<template>
  <div class="post-group post-group-skeleton" v-if="data.length === 0">
    <el-skeleton :rows="5" animated />
  </div>
  <div class="post-group" :class="{ 'card-mini': mini }" v-else>
    <template v-for="(post, index) in data" :key="post.id">
      <PostCard
        :data="post"
        :mini="mini"
        :notPreview="notPreview"
        :notAlt="notAlt"
        :postMode="postMode"
      ></PostCard>
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
  &.card-mini {
    padding-bottom: 18px;
    .el-divider {
      margin-top: 18px;
    }
  }
}
.post-group-skeleton {
  .el-skeleton {
    :deep() {
      .el-skeleton__item {
        background: linear-gradient(
          90deg,
          var(--color-background) 25%,
          var(--color-background-mute) 37%,
          var(--color-background) 63%
        );
        background-size: 400% 100%;
        transition: all 0.5s;
      }
      .is-first {
        width: 40%;
        margin-left: 60%;
      }
      .is-last {
        width: 60%;
        margin: 0 20%;
        margin-top: 16px;
      }
    }
  }
}
.el-divider {
  width: 90%;
  margin: 14px auto;
  transition: all 0.5s;
  --el-border-color: var(--color-border);
}
</style>
