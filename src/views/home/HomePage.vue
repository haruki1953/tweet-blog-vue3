<script setup lang="ts">
import ProfileCard from './components/ProfileCard.vue'
import { usePostStore } from '@/stores'
// import { onMounted } from 'vue'
import { computed, onMounted } from 'vue'

const postStore = usePostStore()

const sendPost = () => {
  postStore.toPostSendPage()
}

onMounted(() => {
  // postStore.resetLimited()
})
</script>
<template>
  <div>
    <Col2Layout>
      <template #colLeftSm>
        <ProfileCard>
          <div class="profile-solt">
            <el-button
              class="profile-button"
              type="primary"
              round
              @click="sendPost"
            >
              发 帖
            </el-button>
          </div>
        </ProfileCard>
      </template>
      <template #colLeft>
        <ProfileCard>
          <div class="profile-solt">
            <el-button
              class="profile-button"
              type="primary"
              round
              @click="sendPost"
            >
              发 帖
            </el-button>
          </div>
        </ProfileCard>
      </template>
      <template #colRight>
        <div
          v-infinite-scroll="postStore.loadLimited"
          :infinite-scroll-distance="200"
          :infinite-scroll-delay="0"
          :infinite-scroll-immediate="false"
        >
          <PostGroup
            v-for="postGroup in postStore.limitedList"
            :key="postGroup.map((p) => p.id).toString()"
            :data="postGroup"
          >
          </PostGroup>
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
.profile-solt {
  // margin: 10px 0;
  width: 50%;
  .profile-button {
    display: flex;
    margin: 20px 0 0 0;
    width: 100%;
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
