<script setup lang="ts">
import ProfileCard from './components/ProfileCard.vue'
import { usePostStore, useSettingStore } from '@/stores'
import { computed, onMounted, ref, watch } from 'vue'

const postStore = usePostStore()
const settingStore = useSettingStore()

const shouldShowSkeletonOnMounted = ref(false)
let isChecking = false
const checkShouldShowSkeletonOnMounted = async () => {
  if (isChecking) {
    return
  }
  isChecking = true
  if (postStore.isFirstRequest) {
    shouldShowSkeletonOnMounted.value = true
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  shouldShowSkeletonOnMounted.value = false
  isChecking = false
}

watch(
  () => postStore.isFirstRequest,
  () => {
    checkShouldShowSkeletonOnMounted()
  },
  { immediate: true }
)

// onMounted(async () => {
//   // postStore.resetLimited()
//   checkShouldShowSkeletonOnMounted()
// })

const isShowSkeleton = computed(() => {
  if (shouldShowSkeletonOnMounted.value) {
    // 骨架屏至少显示一段时间
    return true
  }
  if (settingStore.isLoadingPost && postStore.isFirstRequest) {
    return true
  }
  if (postStore.limitedList.length === 0) {
    return true
  }
  return false
})
</script>
<template>
  <div>
    <Col2Layout>
      <template #colLeftSm>
        <ProfileCard> </ProfileCard>
      </template>
      <template #colLeft>
        <ProfileCard> </ProfileCard>
      </template>
      <template #colRight>
        <div
          v-infinite-scroll="postStore.loadLimited"
          :infinite-scroll-distance="200"
          :infinite-scroll-delay="0"
          :infinite-scroll-immediate="false"
        >
          <TransitionGroup name="fade-slide-list">
            <PostGroup
              key="skeleton"
              :data="[]"
              v-if="isShowSkeleton"
            ></PostGroup>
            <PostGroup
              v-for="postGroup in postStore.limitedList"
              :key="postGroup.map((p) => p.id).toString()"
              :data="postGroup"
            >
            </PostGroup>
          </TransitionGroup>
          <div class="load-button-box" v-if="postStore.isHaveMoreLimited">
            <el-button
              type="primary"
              round
              size="small"
              :loading="postStore.isLoadingLimited"
              @click="postStore.loadLimited"
            >
              加载更多
            </el-button>
          </div>
        </div>
      </template>
    </Col2Layout>
  </div>
</template>

<style lang="scss" scoped>
.load-button-box {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  .el-button {
    width: 50%;
    max-width: 200px;
  }
}
</style>
