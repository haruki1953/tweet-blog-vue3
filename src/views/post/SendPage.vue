<script setup lang="ts">
import { ChatLineSquare, EditPen, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import type {
  Image,
  ImageStoreData,
  InfoBySendType,
  PostSendJsonType
} from '@/types'
import { useImageStore, usePostStore, useSettingStore } from '@/stores'
import { postConfig } from '@/config'
import { postSendApi, postUpdateApi } from '@/api'
import {
  formatTime,
  imageToImageStoreData,
  sakiGoBack,
  sakiMessage
} from '@/utils'
import { useRouter } from 'vue-router'
import InfoEditDialog from './components/InfoEditDialog.vue'
import type ImageEditDialog from '@/components/ImageEditDialog.vue'
import { useNow } from '@vueuse/core'
import { computed } from 'vue'
import { onMounted } from 'vue'

const formModel = ref<PostSendJsonType>({})

const imagesData = ref<ImageStoreData[]>([])

const imageStore = useImageStore()

const addImage = (image: Image) => {
  // push to imagesData, and limit length
  imagesData.value.push(imageToImageStoreData(image))
  if (imagesData.value.length > postConfig.postMaxImages) {
    imagesData.value = imagesData.value.slice(-postConfig.postMaxImages)
  }
}

const settingStore = useSettingStore()
const postStore = usePostStore()
const router = useRouter()

const refInfoEditDialog = ref<InstanceType<typeof InfoEditDialog> | null>(null)
const refImageEditDialog = ref<InstanceType<typeof ImageEditDialog> | null>(
  null
)

const nowRef = useNow({ interval: 1000 }) // 每秒更新一次
const showTime = computed(() => {
  if (formModel.value.createdAt !== undefined) {
    return formatTime(formModel.value.createdAt)
  } else {
    return formatTime(nowRef.value)
  }
})

const couldNotSend = computed(() => {
  if (!formModel.value.content && imagesData.value.length === 0) {
    return true
  } else {
    return false
  }
})

const isSending = ref(false)
const sendPost = async () => {
  isSending.value = true
  settingStore.setLoading(true)
  try {
    const images = imagesData.value.map((i) => i.id)
    await postSendApi({
      ...formModel.value,
      images
    })
    sakiMessage({
      type: 'success',
      message: '发送成功'
    })
    // 发送后，据情况设置是否需重新加载图片
    if (images.length > 0) {
      imageStore.setNeedReget()
    }
    // 重载帖子
    await postStore.reGetPosts()
    router.push({ name: 'home' })
  } finally {
    settingStore.setLoading(false)
    isSending.value = false
  }
}

const sendReply = async () => {
  if (!infoBySendType.value.data) {
    return
  }
  isSending.value = true
  settingStore.setLoading(true)
  try {
    const images = imagesData.value.map((i) => i.id)
    await postSendApi({
      ...formModel.value,
      images,
      parentPostId: infoBySendType.value.data.id
    })
    sakiMessage({
      type: 'success',
      message: '回复成功'
    })
    // 发送后，据情况设置是否需重新加载图片
    if (images.length > 0) {
      imageStore.setNeedReget()
    }
    await postStore.reGetPosts()
    postStore.resetPostRequested()
    sakiGoBack(router)
  } finally {
    settingStore.setLoading(false)
    isSending.value = false
  }
}

const sendUpdate = async () => {
  if (!infoBySendType.value.data) {
    return
  }
  isSending.value = true
  settingStore.setLoading(true)
  try {
    const images = imagesData.value.map((i) => i.id)
    const res = await postUpdateApi({
      ...formModel.value,
      id: infoBySendType.value.data.id,
      images
    })
    sakiMessage({
      type: 'success',
      message: '修改成功'
    })
    // 对于更新，多数情况都要重载图片
    imageStore.setNeedReget()
    // 重载帖子
    await postStore.reGetPosts()
    postStore.resetPostRequested()
    router.replace({
      name: 'post',
      params: { id: res.data.data.id }
    })
  } finally {
    settingStore.setLoading(false)
    isSending.value = false
  }
}

const infoBySendType = computed((): InfoBySendType => {
  // type === 'post'
  const info: InfoBySendType = {
    type: 'post',
    data: null,
    topBarTitle: '推文发送',
    topBarBtnText: '发 送',
    sendFunc: sendPost,
    repostLableText: null,
    textareaPlaceholder: '有什么新鲜事？！'
  }
  if (postStore.infoForSend.type === 'reply' && postStore.infoForSend.data) {
    info.type = 'reply'
    info.data = postStore.infoForSend.data
    info.topBarTitle = '推文回复'
    info.topBarBtnText = '回 复'
    info.sendFunc = sendReply
    info.repostLableText = postStore.infoForSend.data.content
    info.textareaPlaceholder = '发布你的回复'
  }
  if (postStore.infoForSend.type === 'update' && postStore.infoForSend.data) {
    info.type = 'update'
    info.data = postStore.infoForSend.data
    info.topBarTitle = '推文修改'
    info.topBarBtnText = '修 改'
    info.sendFunc = sendUpdate
    info.repostLableText =
      postStore.infoForSend.data.parentPost?.content == null
        ? null
        : postStore.infoForSend.data.parentPost.content
    info.textareaPlaceholder = '有什么新鲜事？！'
  }
  return info
})

const initFormModelForUpdate = () => {
  if (!(infoBySendType.value.type === 'update' && infoBySendType.value.data)) {
    return
  }
  const {
    content,
    createdAt,
    parentPostId,
    twitterId,
    twitterLink,
    isDeleted,
    images
  } = infoBySendType.value.data
  formModel.value = {
    content,
    createdAt: new Date(createdAt),
    parentPostId,
    twitterId,
    twitterLink,
    isDeleted
  }
  // deep copy, to prevent it change the post in home page
  imagesData.value = images.map((i) => imageToImageStoreData(i))
  // imagesData.value = [...images]
}
// formModel: {
//     content?: string | undefined;
//     images?: number[] | undefined;
//     createdAt?: Date | undefined;
//     parentPostId?: number | null | undefined;
//     twitterId?: string | null | undefined;
//     twitterLink?: string | null | undefined;
//     isDeleted?: boolean | undefined;
// }
const resetFuncForInfoEditDialog = computed(() => {
  if (!(infoBySendType.value.type === 'update' && infoBySendType.value.data)) {
    return undefined
  }
  return initFormModelForUpdate
})

onMounted(() => {
  initFormModelForUpdate()
})
</script>
<template>
  <div>
    <InfoEditDialog
      ref="refInfoEditDialog"
      v-model="formModel"
      :info="infoBySendType"
      :resetFunc="resetFuncForInfoEditDialog"
    ></InfoEditDialog>
    <ImageEditDialog
      ref="refImageEditDialog"
      v-model="imagesData"
      notPreview
      imageSelect
    ></ImageEditDialog>
    <Col2Layout>
      <template #colLeftSm>
        <TopBar :title="infoBySendType.topBarTitle">
          <el-button
            type="primary"
            round
            size="small"
            @click="infoBySendType.sendFunc"
            :disabled="imageStore.isImageUploading || couldNotSend"
            :loading="isSending"
          >
            {{ infoBySendType.topBarBtnText }}
          </el-button>
        </TopBar>
      </template>
      <template #colLeft>
        <TopBar :title="infoBySendType.topBarTitle">
          <el-button
            type="primary"
            round
            size="small"
            @click="infoBySendType.sendFunc"
            :disabled="imageStore.isImageUploading || couldNotSend"
            :loading="isSending"
          >
            {{ infoBySendType.topBarBtnText }}
          </el-button>
        </TopBar>
        <div
          class="post-group-box"
          v-if="['reply'].includes(infoBySendType.type) && infoBySendType.data"
        >
          <PostGroup :data="[infoBySendType.data]" mini></PostGroup>
        </div>
        <ImageUploader :onUploaded="addImage"></ImageUploader>
        <ImageSelector
          v-model="imagesData"
          :max="postConfig.postMaxImages"
        ></ImageSelector>
      </template>
      <template #colRight>
        <div class="info-bar">
          <div class="info">
            <div class="repost" v-if="infoBySendType.repostLableText != null">
              <el-icon :size="15">
                <ChatLineSquare />
              </el-icon>
              <div class="repost-text">
                {{ infoBySendType.repostLableText }}
              </div>
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
            :placeholder="infoBySendType.textareaPlaceholder"
            :rows="10"
            type="textarea"
            size="large"
            class="content-textarea"
            :maxlength="140"
            show-word-limit
          />
        </div>
        <Transition name="fade-slide">
          <div class="image-box" v-if="imagesData.length > 0">
            <div class="image-group-transition-container">
              <Transition name="fade-slide" mode="out-in">
                <ImageGroup
                  :data="imagesData"
                  backgroundColor="soft"
                  aspectRatio169
                  :key="imagesData.map((i) => i.id).toString()"
                ></ImageGroup>
              </Transition>
            </div>
            <div class="image-edit-button">
              <el-button
                type="primary"
                :icon="Edit"
                round
                size="small"
                @click="refImageEditDialog?.open()"
              >
                修改图片
              </el-button>
            </div>
          </div>
        </Transition>
        <ImageUploader
          :onUploaded="addImage"
          class="hidden-md-and-up"
        ></ImageUploader>
        <ImageSelector
          v-model="imagesData"
          :max="postConfig.postMaxImages"
          class="hidden-md-and-up"
        ></ImageSelector>
      </template>
    </Col2Layout>
  </div>
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
  .image-edit-button {
    margin: 5px 10px 0 0;
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
.image-group-transition-container {
  position: relative;
  aspect-ratio: 16 / 9;
  .image-group {
    position: absolute;
    width: 100%;
  }
}

.image-uploader {
  margin-bottom: 15px;
}
</style>
