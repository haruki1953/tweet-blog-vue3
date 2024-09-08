<script setup lang="ts">
import userAvatar from '@/assets/haruki.jpg'
import { computed, onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { usePostStore, useSettingStore } from '@/stores'

// withDefaults(
//   defineProps<{
//     showLinkGroup?: boolean
//   }>(),
//   {
//     showLinkGroup: false
//   }
// )

const postStore = usePostStore()
const settingStore = useSettingStore()

const sendPost = () => {
  postStore.toPostSendPage()
}

const searchVal = ref('')

const isLoading = computed(() => {
  return settingStore.isLoadingPost
})

// 处理搜索
const handleSearch = async () => {
  if (isLoading.value) {
    return
  }
  await postStore.searchGetPosts(searchVal.value)
}

// showAll 显示全部
const showAll = async () => {
  if (isLoading.value) {
    return
  }
  await postStore.reGetPosts()
}

onMounted(() => {
  // 当切换至首页时，必须为正常模式
  if (!postStore.isNormalGetPostsMode) {
    postStore.reGetPosts()
  }
})
</script>
<template>
  <div class="profile-card">
    <div class="user">
      <div class="avatar">
        <el-avatar :size="72" :src="userAvatar" />
      </div>
      <div class="name">haruki🐻</div>
    </div>
    <div class="bio-box">
      <div class="bio">可怜的孩子 不再胆怯</div>
    </div>
    <div class="blog-info">
      <div class="info-box">
        <div class="info-val">100</div>
        <div class="info-text">推文</div>
      </div>
      <el-divider direction="vertical" />
      <div class="info-box">
        <div class="info-val">30</div>
        <div class="info-text">图片</div>
      </div>
    </div>
    <div class="search-input-box">
      <el-input
        v-model="searchVal"
        placeholder="推文搜索"
        clearable
        :prefix-icon="Search"
        size="large"
        @change="handleSearch"
        @clear="showAll"
      />
      <el-button
        type="info"
        :icon="Search"
        circle
        @click="handleSearch"
        :loading="isLoading"
      />
    </div>
    <div class="send-button-box">
      <el-button class="profile-button" type="primary" round @click="sendPost">
        发 推
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-card {
  .user {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    .avatar {
      margin-right: 12px;
    }
    .name {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .bio-box {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    .bio {
      white-space: pre-line;
    }
  }
  .blog-info {
    height: 80px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background-color: var(--color-background-soft);
    border-radius: 20px 20px 0 0;
    transition: all 0.5s;
    .info-box {
      min-width: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .info-val {
        font-size: 20px;
        font-weight: bold;
        color: var(--color-text);
        transition: all 0.2s;
      }
      .info-text {
        font-size: 12px;
        color: var(--color-text-soft);
      }
    }
    .el-divider {
      height: 40px;
      transition: all 0.5s;
      --el-border-color: var(--color-border);
    }
  }
  .solt-box {
    display: flex;
    justify-content: center;
  }
}

.search-input-box {
  margin: 2px 0 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0 0 20px 20px;
  background-color: var(--color-background-soft);
  transition: all 0.5s;
  .el-input {
    :deep() {
      .el-input__wrapper {
        border-radius: 20px;
        background-color: var(--color-background-soft);
        transition: all 0.5s;
        box-shadow: none;
        &:hover {
          box-shadow: none;
        }
        .el-input__inner {
          color: var(--color-text);
          transition: all 0.2s;
          font-weight: bold;
          // text-align: center;
        }
      }
    }
  }
  .el-button {
    margin-right: 4px;
  }
}

.send-button-box {
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
