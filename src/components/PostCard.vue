<script setup lang="ts">
import {
  ChatSquare,
  ChatLineSquare,
  Connection,
  Delete,
  EditPen,
  Star,
  RefreshLeft,
  Remove
} from '@element-plus/icons-vue'
import type { PostData } from '@/types'
import { formatTime, sakiMessage } from '@/utils'
import { usePostStore } from '@/stores'
import { computed, ref } from 'vue'
import { postUpdateApi } from '@/api'
import type PostDeleteDialog from './PostDeleteDialog.vue'

const props = withDefaults(
  defineProps<{
    data: PostData
    mini?: boolean
    notPreview?: boolean
    notAlt?: boolean
  }>(),
  {
    mini: false,
    notPreview: false,
    notAlt: false
  }
)

const postStore = usePostStore()
const editPost = () => {
  postStore.toUpdateSendPage(props.data)
}

const isDeleting = ref(false)
const deletePost = async () => {
  isDeleting.value = true
  try {
    await postUpdateApi({ id: props.data.id, isDeleted: true })
    sakiMessage({
      type: 'success',
      message: '已移至回收站'
    })
    postStore.updatePostListIsDeleted(props.data.id, true)
    postStore.resetPostRequested()
  } finally {
    isDeleting.value = false
  }
}

const isRestoring = ref(false)
const restorePost = async () => {
  isRestoring.value = true
  try {
    await postUpdateApi({ id: props.data.id, isDeleted: false })
    sakiMessage({
      type: 'success',
      message: '已将推文还原'
    })
    postStore.updatePostListIsDeleted(props.data.id, false)
    postStore.resetPostRequested()
  } finally {
    isRestoring.value = false
  }
}

const refPostDeleteDialog = ref<InstanceType<typeof PostDeleteDialog> | null>(
  null
)
const isDeleteEverlasting = ref(false)
const deletePostEverlast = async () => {
  refPostDeleteDialog.value?.open()
}

const isRead = computed(() => {
  if (props.mini) {
    return true
  }
  if (props.data.isDeleted) {
    return true
  }
  return postStore.readIsPostRead(props.data)
})
const setRead = () => {
  if (props.mini) {
    return
  }
  if (props.data.isDeleted) {
    return
  }
  postStore.readSetPostRead(props.data)
}
</script>
<template>
  <div
    class="post-card"
    @mouseleave="setRead"
    @mouseup="setRead"
    @touchend="setRead"
  >
    <PostDeleteDialog
      v-if="!mini && data.isDeleted"
      ref="refPostDeleteDialog"
      :data="data"
      v-model:isDeleteEverlasting="isDeleteEverlasting"
    ></PostDeleteDialog>
    <div class="badge-box">
      <Transition name="fade-pop">
        <div class="new-badge" v-show="!isRead">
          <el-badge value="new" type="primary"></el-badge>
        </div>
      </Transition>
    </div>
    <div class="info-bar">
      <div class="info">
        <div class="repost" v-if="data.parentPostId != null">
          <el-icon :size="15">
            <ChatLineSquare />
          </el-icon>
          <div class="repost-text">
            {{ data.parentPost?.content || '' }}
          </div>
        </div>
      </div>
      <div class="time">{{ formatTime(data.createdAt) }}</div>
    </div>

    <div class="content-box">
      <div class="content">
        <TextWithLink :data="data.content"></TextWithLink>
      </div>
    </div>
    <div class="image-box" v-if="data.images.length > 0">
      <ImageGroup
        :data="data.images"
        :mini="mini"
        :notPreview="notPreview"
        :notAlt="notAlt"
      ></ImageGroup>
    </div>
    <template v-if="mini"></template>
    <template v-else>
      <div class="trans-button-container">
        <Transition name="fade-down">
          <div class="trans-button-box" v-if="data.isDeleted">
            <div class="button-box">
              <div class="button-center">
                <el-button
                  type="success"
                  :icon="RefreshLeft"
                  round
                  size="small"
                  :loading="isRestoring"
                  @click="restorePost"
                >
                  还原推文
                </el-button>
                <el-button
                  type="danger"
                  :icon="Remove"
                  round
                  size="small"
                  :loading="isDeleteEverlasting"
                  @click="deletePostEverlast"
                >
                  永久删除
                </el-button>
              </div>
            </div>
          </div>
          <div class="trans-button-box" v-else>
            <div class="button-box">
              <div class="replies-lable">
                <div class="count" v-if="data._count.replies > 0">
                  {{ data._count.replies }}
                </div>
              </div>
              <div class="button-layout">
                <el-button
                  type="primary"
                  :icon="ChatSquare"
                  circle
                  size="small"
                  @click="
                    $router.push({ name: 'post', params: { id: data.id } })
                  "
                />
                <el-button
                  type="info"
                  :icon="EditPen"
                  circle
                  size="small"
                  @click="editPost"
                />
                <el-button type="warning" :icon="Star" circle size="small" />
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  size="small"
                  :loading="isDeleting"
                  @click="deletePost"
                />
                <el-button
                  type="success"
                  :icon="Connection"
                  circle
                  size="small"
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.post-card {
  .badge-box {
    position: relative;
    .new-badge {
      position: absolute;
      top: -24px;
      right: 0;
      .el-badge {
        :deep() {
          .el-badge__content {
            display: flex;
            padding-bottom: 2px;
            font-weight: bold;
            color: var(--color-background);
            border: none;
            transition: color 0.2s;
            user-select: none;
          }
        }
      }
    }
  }
  .info-bar {
    height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .info {
      width: 50%;
      .repost {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: var(--color-text-soft);
        .el-icon {
          margin-right: 5px;
        }
        .repost-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .time {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: var(--color-text-soft);
    }
  }
  .content-box {
    display: flex;
    justify-content: center;
    padding: 4px 0 8px 0;
    .content {
      max-width: 100%;
      color: var(--color-text);
      white-space: pre-wrap;
      // 解决在全英文无空格时，文字无法换行的问题
      word-wrap: break-word;
      transition: all 0.2s;
    }
  }
  .image-box {
    margin: 0;
  }
  .trans-button-container {
    margin-top: 12px;
    position: relative;
    height: 24px;
  }
  .trans-button-box {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .button-box {
    max-width: 300px;
    margin: 0 auto;
    position: relative;
    .replies-lable {
      width: 30px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: end;
      padding-right: 4px;
      .count {
        font-size: 12px;
        color: var(--color-text-soft);
      }
    }
    .button-layout {
      margin: 0 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-button {
        margin: 0;
      }
    }
    .button-center {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
