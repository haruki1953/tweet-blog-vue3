<script setup lang="ts">
import { ChatLineSquare, EditPen } from '@element-plus/icons-vue'
import { ref } from 'vue'
import type { Image } from '@/types'
import { useImageStore, usePostStore, useSettingStore } from '@/stores'
import { postConfig } from '@/config'
import { postSendApi } from '@/api'
import { sakiMessage } from '@/utils'
import { useRouter } from 'vue-router'

const formModel = ref({
  content: ''
})

const imagesData = ref<Image[]>([])

const imageStore = useImageStore()

const addImage = (image: Image) => {
  // push to imagesData, and limit length
  imagesData.value.push(image)
  if (imagesData.value.length > postConfig.postMaxImages) {
    imagesData.value = imagesData.value.slice(-postConfig.postMaxImages)
  }
}

const settingStore = useSettingStore()
const postStore = usePostStore()
const router = useRouter()

const isSending = ref(false)
const sendPost = async () => {
  isSending.value = true
  settingStore.setLoading(true)
  try {
    await postSendApi({
      ...formModel.value,
      images: imagesData.value.map((i) => i.id)
    })
    sakiMessage({
      type: 'success',
      message: '发送成功'
    })
    await postStore.reGetPost()
    router.push('/')
  } finally {
    settingStore.setLoading(false)
    isSending.value = false
  }
}
</script>
<template>
  <Col2Layout>
    <template #colLeftSm>
      <TopBar title="帖子发送">
        <el-button
          type="primary"
          round
          size="small"
          @click="sendPost"
          :disabled="imageStore.isImageUploading"
          :loading="isSending"
        >
          发 送
        </el-button>
      </TopBar>
    </template>
    <template #colLeft>
      <TopBar title="帖子发送">
        <el-button
          type="primary"
          round
          size="small"
          @click="sendPost"
          :disabled="imageStore.isImageUploading"
          :loading="isSending"
        >
          发 送
        </el-button>
      </TopBar>
      <ImageUploader :onUploaded="addImage"></ImageUploader>
    </template>
    <template #colRight>
      <div class="info-bar">
        <div class="info">
          <div class="repost">
            <el-icon :size="15">
              <ChatLineSquare />
            </el-icon>
            <div class="repost-text">帖子</div>
          </div>
        </div>
        <div class="time">
          <span>2024-08-18 07:20</span>
          <el-button type="info" :icon="EditPen" circle size="small" />
        </div>
      </div>
      <div class="content-box">
        <el-input
          v-model="formModel.content"
          placeholder="有什么新鲜事？！"
          :rows="10"
          type="textarea"
          size="large"
          class="content-textarea"
          :maxlength="140"
          show-word-limit
        />
      </div>
      <div class="image-box" v-if="imagesData.length > 0">
        <ImageGroup :data="imagesData" backgroundColor="soft"></ImageGroup>
      </div>
      <ImageUploader
        :onUploaded="addImage"
        class="hidden-md-and-up"
      ></ImageUploader>
    </template>
  </Col2Layout>
</template>

<style lang="scss" scoped>
.top-bar {
  margin: 20px 0;
}

.info-bar {
  height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
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
    .el-button {
      margin-left: 5px;
    }
  }
}

.content-box {
  margin-bottom: 15px;
  .content-textarea {
    padding: 10px;
    border-radius: 20px;
    background-color: var(--color-background-soft);
    transition: all 0.5s;
    :deep() {
      .el-textarea__inner {
        // color: var(--color-text);
        // font-weight: bold;
        border: none;
        box-shadow: none;
        background-color: var(--color-background-soft);
        transition:
          background-color 0.5s,
          color 0.2s;
      }
      .el-input__count {
        background-color: var(--color-background-soft);
        color: var(--color-text-soft);
        transition: all 0.5s;
        right: 20px;
        bottom: 15px;
        user-select: none;
      }
    }
  }
}

.image-box {
  margin-bottom: 15px;
}

.image-uploader {
  margin-bottom: 15px;
}
</style>
