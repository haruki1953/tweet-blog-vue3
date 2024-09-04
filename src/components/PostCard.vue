<script setup lang="ts">
import {
  ChatSquare,
  ChatLineSquare,
  Connection,
  Delete,
  EditPen,
  Star
} from '@element-plus/icons-vue'
import type { PostData } from '@/types'
import { formatTime } from '@/utils'

defineProps<{
  data: PostData
}>()
</script>
<template>
  <div class="post-card">
    <div class="info-bar">
      <div class="info">
        <div class="repost" v-if="data.parentPost != null">
          <el-icon :size="15">
            <ChatLineSquare />
          </el-icon>
          <div class="repost-text">
            {{ data.parentPost.content }}
          </div>
        </div>
      </div>
      <div class="time">{{ formatTime(data.createdAt) }}</div>
    </div>
    <div class="content-box">
      <div class="content">{{ data.content }}</div>
    </div>
    <div class="image-box" v-if="data.images.length > 0">
      <ImageGroup :data="data.images"></ImageGroup>
    </div>
    <div class="button-box">
      <div class="replies-lable">
        <div class="count" v-if="data._count.replies > 0">
          {{ data._count.replies }}
        </div>
      </div>
      <div class="button-layout">
        <el-button type="primary" :icon="ChatSquare" circle size="small" />
        <el-button type="info" :icon="EditPen" circle size="small" />
        <el-button type="warning" :icon="Star" circle size="small" />
        <el-button type="danger" :icon="Delete" circle size="small" />
        <el-button type="success" :icon="Connection" circle size="small" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post-card {
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
      color: var(--color-text);
      white-space: pre-line;
      transition: all 0.2s;
    }
  }
  .image-box {
    margin: 0;
  }
  .button-box {
    max-width: 300px;
    margin: 0 auto;
    margin-top: 12px;
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
  }
}
</style>
