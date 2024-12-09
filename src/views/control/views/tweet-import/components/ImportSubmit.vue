<script setup lang="ts">
import { appInfo } from '@/config'
import type { PostControlImportJsonType } from '@/types'
import {
  ChatSquare,
  Link,
  PictureRounded,
  Remove
} from '@element-plus/icons-vue'
import { ref } from 'vue'

const model = defineModel<PostControlImportJsonType['importPosts']>({
  required: true
})

const importCancel = () => {
  model.value = []
}

const isSubmiting = ref(false)
const submit = async () => {
  isSubmiting.value = true
  try {
    // const res = await profileUpdateAboutMdApi({
    //   aboutMarkdown: aboutMarkdown.value
    // })
    // sakiMessage({
    //   type: 'success',
    //   message: '修改成功'
    // })
  } finally {
    isSubmiting.value = false
  }
}
</script>
<template>
  <div class="import-submit">
    <div class="control-box">
      <div class="control-row">
        <div class="control-lable-with-link">
          <div class="lable">解析到 20 条推文</div>
          <a
            class="link"
            type="primary"
            :href="appInfo.tweetImportHelpDocs.link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ appInfo.tweetImportHelpDocs.text }}
          </a>
        </div>
        <div class="button-box">
          <el-button
            @click="submit"
            :loading="isSubmiting"
            type="success"
            round
          >
            导入
          </el-button>
          <el-button @click="importCancel" type="info" round> 取消 </el-button>
        </div>
      </div>
    </div>
    <div class="tweet-list">
      <div class="tweet-item">
        <div class="info-box">
          <div class="info-row">
            <!-- <div class="info-id"></div> -->
            <div
              class="info-col content-imagenum"
              :class="{
                'imagenum-none': false,
                'content-none': false
              }"
            >
              <div class="content icon-text">
                <el-icon>
                  <ChatSquare />
                </el-icon>
                <div class="text">
                  推文内容推文内容推文内容推文推文内容推文内容推文内容推文
                </div>
              </div>
              <div class="imagenum icon-text">
                <el-icon>
                  <PictureRounded />
                </el-icon>
                <div class="text">1</div>
              </div>
            </div>
            <div class="info-col date-button">
              <div class="date">
                <div class="text">2024-12-08</div>
              </div>
              <div class="button">
                <el-button
                  type="primary"
                  :icon="Link"
                  circle
                  size="small"
                  @click="() => {}"
                />
                <el-button
                  type="danger"
                  :icon="Remove"
                  circle
                  size="small"
                  @click="() => {}"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../../styles/control.scss';

.tweet-item {
  $media-max-width: 600px;
  .info-box {
    margin-bottom: 10px;
    background-color: var(--color-background-soft);
    transition: background-color 0.5s;
    border-radius: 20px;
    transition:
      background-color 0.5s,
      box-shadow 0.5s;
    &:hover {
      box-shadow: var(--el-box-shadow-lighter);
      // background-color: var(--color-background-mute);
    }
  }
  .info-divider {
    height: 2px;
    background-color: var(--color-background);
    transition: background-color 0.5s;
  }
  .info-row {
    margin: 0 10px;
    padding: 6px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (max-width: $media-max-width) {
      display: block;
    }
  }
  .info-col {
    margin: 0 10px;
    padding: 4px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content-imagenum {
    width: 60%;
    justify-content: start;
    @media (max-width: $media-max-width) {
      width: auto;
      justify-content: space-between;
    }
    .icon-text {
      display: flex;
      align-items: center;
      .el-icon {
        margin-right: 10px;
      }
      .text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .content {
      max-width: calc(100% - 60px);
      margin-right: 20px;
    }
    .imagenum {
      //
    }
    &.content-none {
      .content {
        display: none;
      }
    }
    &.imagenum-none {
      .imagenum {
        display: none;
      }
      .content {
        max-width: 100%;
        margin-right: 0;
      }
    }
  }
  .date-button {
    width: 40%;
    @media (max-width: $media-max-width) {
      width: auto;
    }
    .date {
      display: flex;
      align-items: center;
      color: var(--color-text-soft);
    }
    .button {
      display: flex;
      align-items: center;
      .el-button {
        display: flex;
      }
    }
  }
}
</style>
