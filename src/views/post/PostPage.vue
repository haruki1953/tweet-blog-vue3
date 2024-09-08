<script setup lang="ts">
import { usePostStore, useSettingStore } from '@/stores'
import type { PosPoolItem, PostData } from '@/types'
import { ref, watch } from 'vue'
import { onMounted } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { House } from '@element-plus/icons-vue'

const route = useRoute()
const postStore = usePostStore()
const settingStore = useSettingStore()

const routePostId = computed(() => {
  const userId = Number(route.params.id)
  if (isNaN(userId)) {
    return undefined
  } else {
    return userId
  }
})
const postPoolItem = computed((): PosPoolItem | undefined => {
  if (routePostId.value == null) {
    return undefined
  }
  return postStore.getPostPoolItem(routePostId.value)
})

const mainPostGroup = computed(() => {
  if (!postPoolItem.value) {
    return undefined
  }
  const postGroup: PostData[] = []
  if (postPoolItem.value.parentPost) {
    postGroup.push(postPoolItem.value.parentPost)
  }
  postGroup.push(postPoolItem.value.mainPost)
  return postGroup
})

const shouldShow2Col = computed(() => {
  if (!postPoolItem.value) {
    return false
  }
  if (postPoolItem.value.replies.length === 0) {
    return false
  }
  return true
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

const shouldShowSkeletonOnMounted = ref(false)
const checkShouldShowSkeletonOnMounted = async () => {
  if (!postPoolItem.value) {
    return
  }
  if (!postStore.isPostRequested(postPoolItem.value.id)) {
    // 最少显示Skeleton 2秒
    shouldShowSkeletonOnMounted.value = true
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
  shouldShowSkeletonOnMounted.value = false
}
const isShowSkeleton = computed(() => {
  if (!postPoolItem.value) {
    return false
  }
  if (shouldShowSkeletonOnMounted.value) {
    return true
  }
  if (!postStore.isPostRequested(postPoolItem.value.id)) {
    return true
  }
  return false
})

watch(
  routePostId,
  () => {
    loadPostPoolItemData()
    checkShouldShowSkeletonOnMounted()
  },
  { immediate: true }
)

const replyPost = () => {
  if (!postPoolItem.value) {
    return
  }
  postStore.toReplySendPage(postPoolItem.value.mainPost)
}
</script>
<template>
  <div>
    <!-- <Transition name="fade-slide"> -->
    <Col1Layout v-if="!shouldShow2Col">
      <TopBar title="查看推文"></TopBar>
      <!-- id参数无效 -->
      <div v-if="routePostId == null">
        <SakiEmpty description="推文 id 无效" type="error"></SakiEmpty>
      </div>
      <!-- 暂无此贴，显示骨架屏 -->
      <div v-else-if="mainPostGroup == null">
        <PostGroup :data="[]"></PostGroup>
      </div>
      <!-- 显示帖子 -->
      <div v-else>
        <div class="main-post-group-box">
          <PostGroup :data="mainPostGroup"></PostGroup>
        </div>
        <div class="replie-button-box col1">
          <el-button type="primary" round @click="replyPost"> 回 复 </el-button>
        </div>
        <Transition name="fade-slide">
          <div v-if="isShowSkeleton">
            <PostGroup :data="[]"></PostGroup>
          </div>
        </Transition>
      </div>
      <!-- 没有回帖 -->
    </Col1Layout>
    <Col2Layout v-else>
      <template #colLeftSm>
        <TopBar title="查看推文"></TopBar>
        <div class="main-post-group-box" v-if="mainPostGroup">
          <PostGroup :data="mainPostGroup"></PostGroup>
        </div>
        <div class="replie-button-box">
          <el-button type="primary" round @click="replyPost"> 回 复 </el-button>
        </div>
      </template>
      <template #colLeft>
        <TopBar title="查看推文"></TopBar>
        <div class="main-post-group-box" v-if="mainPostGroup">
          <PostGroup :data="mainPostGroup"></PostGroup>
        </div>
        <div class="replie-button-box">
          <el-button type="primary" round @click="replyPost"> 回 复 </el-button>
        </div>
      </template>
      <template #colRight>
        <div class="replies-post-group-box" v-if="postPoolItem">
          <!-- <TransitionGroup name="fade-slide"> -->
          <PostGroup
            v-for="postGroup in postPoolItem.replies"
            :key="postGroup.map((p) => p.id).toString()"
            :data="postGroup"
          >
          </PostGroup>
          <!-- </TransitionGroup> -->
        </div>
        <Transition name="fade-slide">
          <div v-if="isShowSkeleton">
            <PostGroup :data="[]"></PostGroup>
          </div>
        </Transition>
      </template>
    </Col2Layout>
    <!-- </Transition> -->
  </div>
</template>

<style lang="scss" scoped>
.top-bar {
  margin-bottom: 20px;
}
.main-post-group-box {
}
.replie-button-box {
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
