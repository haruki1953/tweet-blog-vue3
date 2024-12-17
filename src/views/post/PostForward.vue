<script setup lang="ts">
import { usePostStore } from '@/stores'
import type { PostPoolItem, PostData } from '@/types'
import { onMounted } from 'vue'
import { ref, watch } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomSkeleton from './components/BottomSkeleton.vue'

const route = useRoute()
const postStore = usePostStore()

const routePostId = computed(() => {
  const userId = route.params.id
  if (userId == null) {
    return null
  }
  if (typeof userId === 'string') {
    return userId
  } else {
    return userId[0]
  }
})
const postPoolItem = computed((): PostPoolItem | undefined => {
  if (routePostId.value == null) {
    return undefined
  }
  return postStore.getPostPoolItem(routePostId.value)
})

const loadPostPoolItemData = () => {
  if (routePostId.value == null) {
    return
  }
  if (postStore.isPostRequested(routePostId.value)) {
    return
  }
  postStore.getPostById(routePostId.value)
}

onMounted(() => {
  loadPostPoolItemData()
})

watch(routePostId, () => {
  loadPostPoolItemData()
})

// 优化从骨架屏到帖子的过渡
// 当在初始化（setup）时就有数据，禁用过渡（避免重复过渡）
const havePostOnSetUp = postPoolItem.value != null
</script>
<template>
  <div :key="String(route.params.id)">
    <DataContainerMountedMask>
      <Col2Layout :span="12">
        <template #colLeftAndSm>
          <TopBar title="推文转发"></TopBar>
          <!-- 暂无此贴，显示骨架屏 -->
          <div v-if="postPoolItem == null">
            <PostGroup :data="[]"></PostGroup>
          </div>
          <!-- 显示帖子 -->
          <div v-else>
            <DataContainerMountedMask :disabled="havePostOnSetUp">
              <div class="main-post-group-box">
                <PostGroup :data="[postPoolItem.mainPost]" forward></PostGroup>
              </div>
            </DataContainerMountedMask>
          </div>
        </template>
        <template #colRight> </template>
      </Col2Layout>
    </DataContainerMountedMask>
  </div>
</template>

<style lang="scss" scoped>
.top-bar {
  margin-bottom: 20px;
}
.bottom-button-box {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  .el-button {
    display: block;
    width: 50%;
    :deep() {
      span {
        color: var(--color-background);
        font-weight: bold;
        transition: all 0.2s;
        // letter-spacing: 6px;
      }
    }
  }
}
</style>
