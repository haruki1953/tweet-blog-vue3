<script setup lang="ts">
import { ChatLineSquare, EditPen } from '@element-plus/icons-vue'
import { ref } from 'vue'
import type { Image, PostSendJsonType } from '@/types'
import { useImageStore, usePostStore, useSettingStore } from '@/stores'
import { postConfig } from '@/config'
import { postSendApi } from '@/api'
import { formatTime, sakiMessage } from '@/utils'
import { useRouter } from 'vue-router'
import InfoEditDialog from './components/InfoEditDialog.vue'
import ImageSelector from './components/ImageSelector.vue'
import { useNow } from '@vueuse/core'
import { computed } from 'vue'

const formModel = ref<PostSendJsonType>({})

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
  console.log(formModel.value)
  console.log(formModel.value.content)
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
    await postStore.reGetPosts()
    router.push('/')
  } finally {
    settingStore.setLoading(false)
    isSending.value = false
  }
}

const refInfoEditDialog = ref<InstanceType<typeof InfoEditDialog> | null>(null)

const nowRef = useNow({ interval: 1000 }) // 每秒更新一次
const showTime = computed(() => {
  if (formModel.value.createdAt !== undefined) {
    return formatTime(formModel.value.createdAt)
  } else {
    return formatTime(nowRef.value)
  }
})
</script>
<template>
  <InfoEditDialog v-model="formModel" ref="refInfoEditDialog"></InfoEditDialog>
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
      <TopBar title="帖子发送" class="left">
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
      <ImageSelector v-model="imagesData"></ImageSelector>
    </template>
    <template #colRight>
      <div class="info-bar">
        <div class="info">
          <div class="repost" v-if="false">
            <el-icon :size="15">
              <ChatLineSquare />
            </el-icon>
            <div class="repost-text">帖子</div>
          </div>
        </div>
        <div class="time">
          <span>{{ showTime }}</span>
          <el-button
            type="info"
            :icon="EditPen"
            circle
            size="small"
            @click="refInfoEditDialog?.open()"
          />
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
      <ImageSelector
        v-model="imagesData"
        class="hidden-md-and-up"
      ></ImageSelector>
    </template>
  </Col2Layout>
</template>

<style lang="scss" scoped>
.top-bar {
  margin-bottom: 20px;
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
