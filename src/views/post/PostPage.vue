<script setup lang="ts">
import { usePostStore } from '@/stores'
import type { PostData } from '@/types'
import { watch } from 'vue'
import { onMounted } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { House } from '@element-plus/icons-vue'

const route = useRoute()
const postStore = usePostStore()

const routePostId = computed(() => {
  const userId = Number(route.params.id)
  if (isNaN(userId)) {
    return undefined
  } else {
    return userId
  }
})
const postPoolItem = computed(() => {
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

onMounted(loadPostPoolItemData)
watch(routePostId, loadPostPoolItemData)
</script>
<template>
  <div>
    <Col1Layout v-if="!shouldShow2Col">
      <TopBar title="查看帖子">
        <el-button
          type="primary"
          round
          size="small"
          :icon="House"
          @click="$router.push('/')"
        >
          首页
        </el-button>
      </TopBar>
      <!-- id参数无效 -->
      <div v-if="routePostId == null">
        <SakiEmpty description="帖子 id 无效" type="error">
          <el-button type="primary" round @click="$router.replace('/')">
            返回首页
          </el-button>
        </SakiEmpty>
      </div>
      <!-- 暂无此贴，显示骨架屏 -->
      <div v-else-if="mainPostGroup == null">骨架屏TODO</div>
      <!-- 显示帖子 -->
      <div v-else>
        <div class="main-post-group-box">
          <PostGroup :data="mainPostGroup"></PostGroup>
        </div>
        <div class="replie-button-box">
          <el-button type="primary" round> 回 复 </el-button>
        </div>
      </div>
      <!-- 没有回帖 -->
    </Col1Layout>
    <Col2Layout v-else>
      <template #colLeftSm>
        <TopBar title="查看帖子">
          <el-button
            type="primary"
            round
            size="small"
            :icon="House"
            @click="$router.push('/')"
          >
            首页
          </el-button>
        </TopBar>
        <div class="main-post-group-box" v-if="mainPostGroup">
          <PostGroup :data="mainPostGroup"></PostGroup>
        </div>
        <div class="replie-button-box">
          <el-button type="primary" round> 回 复 </el-button>
        </div>
      </template>
      <template #colLeft>
        <TopBar title="查看帖子">
          <el-button
            type="primary"
            round
            size="small"
            :icon="House"
            @click="$router.push('/')"
          >
            首页
          </el-button>
        </TopBar>
        <div class="main-post-group-box" v-if="mainPostGroup">
          <PostGroup :data="mainPostGroup"></PostGroup>
        </div>
        <div class="replie-button-box">
          <el-button type="primary" round> 回 复 </el-button>
        </div>
      </template>
      <template #colRight>
        <div class="replies-post-group-box" v-if="postPoolItem">
          <PostGroup
            v-for="postGroup in postPoolItem.replies"
            :key="postGroup.map((p) => p.id).toString()"
            :data="postGroup"
          >
          </PostGroup>
        </div>
      </template>
    </Col2Layout>
  </div>
</template>

<style lang="scss" scoped>
.top-bar {
  margin-bottom: 20px;
}
.main-post-group-box {
}
.replie-button-box {
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
