<script setup lang="ts">
import userAvatar from '@/assets/haruki.jpg'
import { computed, onMounted, ref } from 'vue'
import {
  Search,
  Delete,
  Finished,
  ChatLineSquare,
  Star
} from '@element-plus/icons-vue'
import { useLayoutStore, usePostStore, useSettingStore } from '@/stores'
import type { IconMenuItem, PostsGetMode } from '@/types'
import PostDeleteAllDialog from './PostDeleteAllDialog.vue'
import { sakiMessage } from '@/utils'

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
const layoutStore = useLayoutStore()

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
  if (searchVal.value === '') {
    if (postStore.postsGetMode !== 'normal') {
      showAll()
    }
    return
  }
  scrollToTop()
  await postStore.searchGetPosts(searchVal.value)
  scrollToTop()
}

// showAll 显示全部
const showAll = async () => {
  if (isLoading.value) {
    return
  }
  scrollToTop()
  await postStore.reGetPosts()
  scrollToTop()
}

const showDelete = async () => {
  if (isLoading.value) {
    return
  }
  scrollToTop()
  await postStore.deleteGetPosts()
  scrollToTop()
}

const showFavorite = () => {
  if (isLoading.value) {
    return
  }
  scrollToTop()
  postStore.favoriteGetPosts()
}

// 清空回收站
const refPostDeleteAllDialog = ref<InstanceType<
  typeof PostDeleteAllDialog
> | null>(null)
const isDeleteAlling = ref(false)
const deleteAll = async () => {
  refPostDeleteAllDialog.value?.open()
}
const onDeleteAlled = () => {
  postsGetModeMark.value = 'normal'
  showAll()
}

// 清空收藏夹
const clearFavorite = () => {
  postStore.favoriteDelAllPost()
  sakiMessage({
    type: 'success',
    message: '收藏夹已清空'
  })
}

onMounted(() => {
  // 当切换至首页时，保留模式
  searchVal.value = postStore.nowSearchKey ?? ''
  postsGetModeMark.value = postStore.postsGetMode
})

const shouldDisableSearchButton = computed(() => {
  if (postStore.postsGetMode === 'normal' && searchVal.value === '') {
    return true
  }
  return false
})

const postsGetModeMark = ref<PostsGetMode>('normal')

const scrollToTop = () => {
  if (layoutStore.col2IsShow2Col) {
    window.scrollTo({
      top: 0
    })
  }
}

const setModeToNormal = () => {
  if (isLoading.value) {
    return
  }
  postsGetModeMark.value = 'normal'
  showAll()
}
const setModeToSearch = () => {
  postsGetModeMark.value = 'search'
  if (
    postStore.postsGetMode !== 'normal' &&
    postStore.postsGetMode !== 'search'
  ) {
    showAll()
  }
}
const setModeToDelete = () => {
  if (isLoading.value) {
    return
  }
  postsGetModeMark.value = 'delete'
  showDelete()
}
const setModeToFavorite = () => {
  if (isLoading.value) {
    return
  }
  postsGetModeMark.value = 'favorite'
  showFavorite()
}

type ButtonMenuItem = Omit<IconMenuItem, 'index'> & { index: PostsGetMode }

const buttonMenu: ButtonMenuItem[] = [
  {
    index: 'normal',
    title: '全部推文',
    icon: ChatLineSquare,
    actionColor: 'success',
    onClick: setModeToNormal
  },
  {
    index: 'search',
    title: '搜索推文',
    icon: Search,
    actionColor: 'info',
    onClick: setModeToSearch
  },
  {
    index: 'favorite',
    title: '收藏夹',
    icon: Star,
    actionColor: 'warning',
    onClick: setModeToFavorite
  },
  {
    index: 'delete',
    title: '回收站',
    icon: Delete,
    actionColor: 'danger',
    onClick: setModeToDelete
  }
]

const newPostText = computed(() => {
  if (postStore.readNewPostCount > 10) {
    return `【新推文 10+】`
  } else if (postStore.readNewPostCount > 0) {
    return `【新推文 ${postStore.readNewPostCount}】`
  } else {
    return ''
  }
})
</script>
<template>
  <div class="profile-card">
    <PostDeleteAllDialog
      ref="refPostDeleteAllDialog"
      v-model:isDeleteAlling="isDeleteAlling"
      @deleted="onDeleteAlled"
    ></PostDeleteAllDialog>
    <div class="user">
      <div class="avatar">
        <el-avatar :size="72" :src="userAvatar" />
      </div>
      <div class="name">haruki🐻</div>
    </div>
    <div class="bio-box">
      <div class="bio">可怜的孩子 不再胆怯</div>
    </div>

    <div class="blog-info" :class="{ normal: postsGetModeMark === 'normal' }">
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

    <div class="button-menu-box">
      <IconMenuBox
        v-model:model-value="postsGetModeMark"
        :menu="buttonMenu"
        :boxSize="65"
        notBackgroundColor
        dontSetIndex
      ></IconMenuBox>
    </div>

    <div class="block-part-container">
      <Transition name="fade-slide">
        <div
          class="block-part-box search-input-box"
          v-if="postsGetModeMark === 'search'"
          key="search-input-box"
        >
          <el-input
            v-model="searchVal"
            placeholder="搜索推文"
            clearable
            :prefix-icon="Search"
            size="large"
            @change="handleSearch"
          />
          <el-button
            type="info"
            :icon="Search"
            circle
            @click="handleSearch"
            :loading="isLoading"
            :disabled="shouldDisableSearchButton"
          />
        </div>
        <div
          class="block-part-box delete-mode-box"
          v-else-if="postsGetModeMark === 'delete'"
          key="delete-mode-box"
        >
          <div class="info-lable">回收站</div>
          <div class="button-row">
            <el-button
              round
              type="danger"
              :icon="Delete"
              size="small"
              :loading="isDeleteAlling"
              @click="deleteAll"
            >
              清空回收站
            </el-button>
          </div>
        </div>
        <div
          class="block-part-box favorite-mode-box"
          v-else-if="postsGetModeMark === 'favorite'"
          key="favorite-mode-box"
        >
          <div class="info-lable">收藏夹</div>
          <div class="button-row">
            <el-button
              round
              type="warning"
              :icon="Delete"
              size="small"
              @click="clearFavorite"
            >
              清空收藏夹
            </el-button>
          </div>
        </div>
        <div v-else class="block-part-box normal-mode-box">
          <div class="info-lable">
            全部推文
            <span v-if="newPostText" class="blinking-2s">
              {{ newPostText }}
            </span>
          </div>
          <el-button
            round
            type="success"
            :icon="Finished"
            size="small"
            @click="postStore.readSetAllRead()"
          >
            全部已读
          </el-button>
        </div>
      </Transition>
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
    transition: all 0.5s;
    border-radius: 20px 20px 0 0;
    // &.normal {
    //   border-radius: 20px;
    // }
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
  .button-menu-box {
    margin-top: 2px;
    padding-bottom: 5px;
    background-color: var(--color-background-soft);
    transition: background-color 0.5s;
  }
  .block-part-container {
    position: relative;
    height: 40px;
    margin-top: 2px;
  }
  .block-part-box {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 0 0 20px 20px;
    background-color: var(--color-background-soft);
    transition: all 0.5s;
  }
  .normal-mode-box,
  .favorite-mode-box,
  .delete-mode-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 0 15px;
    .info-lable {
      font-size: 12px;
      color: var(--color-text-soft);
    }
    .button-row {
      .el-button {
        margin-left: 10px;
      }
    }
  }
  .search-input-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
  .small-button-bar {
    display: flex;
    align-items: center;
    // justify-content: center;
    margin: 5px 0 20px 0;
    .el-button {
      margin-left: 10px;
    }
  }

  .solt-box {
    display: flex;
    justify-content: center;
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
