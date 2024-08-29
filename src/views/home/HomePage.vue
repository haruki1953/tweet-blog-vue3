<script setup lang="ts">
import ProfileCard from './components/ProfileCard.vue'
import { usePostStore } from '@/stores'
// import { onMounted } from 'vue'
import { computed } from 'vue'

const postStore = usePostStore()

const postList = computed(() => {
  return postStore.postList
})

const sendPost = () => {
  postStore.toPostSendPage()
}
</script>
<template>
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
      <PostGroup
        v-for="postGroup in postList"
        :key="postGroup[postGroup.length - 1].id"
        :data="postGroup"
      >
      </PostGroup>
    </template>
  </Col2Layout>
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
</style>
