<script setup lang="ts">
import { postControlImportApi } from '@/api'
import { appInfo } from '@/config'
import type { PostControlImportJsonTypeOnDataProcess } from '@/types'
import { formatTimeAgoChs, sakiMessage } from '@/utils'
import {
  ChatSquare,
  Link,
  PictureRounded,
  Remove
} from '@element-plus/icons-vue'
import axios from 'axios'
import { ref } from 'vue'

const model = defineModel<
  PostControlImportJsonTypeOnDataProcess['importPosts']
>({
  required: true
})

const importCancel = () => {
  model.value = []
}

const isSubmiting = ref(false)
const submit = async () => {
  isSubmiting.value = true
  try {
    await postControlImportApi({
      importPosts: model.value
    })
    sakiMessage({
      type: 'success',
      message: '正在导入'
    })
    model.value = []
  } finally {
    isSubmiting.value = false
  }
}

const removeByIndex = (index: number) => {
  model.value.splice(index, 1)
}
</script>
<template>
  <div class="import-submit">
    <div class="control-box">
      <div class="control-row">
        <div class="control-lable">已解析 {{ model.length }} 条推文</div>
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
      <TransitionGroup name="fade-slide-list">
        <div
          class="tweet-item"
          v-for="(importPostsItem, index) in model"
          :key="`${importPostsItem.platform} ${importPostsItem.platformId}`"
        >
          <div class="info-box">
            <div class="info-row">
              <!-- <div class="info-id"></div> -->
              <div
                class="info-col content-imagenum"
                :class="{
                  'imagenum-none': importPostsItem.importImages.length === 0,
                  'content-none':
                    importPostsItem.importImages.length !== 0 &&
                    importPostsItem.content === ''
                }"
              >
                <div class="content icon-text">
                  <el-icon>
                    <ChatSquare />
                  </el-icon>
                  <div class="text">
                    {{ importPostsItem.content }}
                  </div>
                </div>
                <div class="imagenum icon-text">
                  <el-icon>
                    <PictureRounded />
                  </el-icon>
                  <div class="text">
                    {{ importPostsItem.importImages.length }}
                  </div>
                </div>
              </div>
              <div class="info-col date-button">
                <div class="date">
                  <div class="text">
                    {{ formatTimeAgoChs(importPostsItem.createdAt) }}
                  </div>
                </div>
                <div class="button">
                  <el-button
                    type="primary"
                    :icon="Link"
                    circle
                    size="small"
                    tag="a"
                    :href="importPostsItem.platformLink"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                  <el-button
                    type="danger"
                    :icon="Remove"
                    circle
                    size="small"
                    @click="removeByIndex(index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../../styles/control.scss';

.tweet-list {
  position: relative;
}

.tweet-item {
  width: 100%;
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
    margin: 0 20px;
    padding: 6px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: $media-max-width) {
      display: block;
    }
  }

  .info-col {
    // margin: 0 10px;
    padding: 4px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .content-imagenum {
    width: 60%;
    justify-content: space-between;

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
      width: calc(100% - 60px);

      .text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
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
        width: 100%;
        margin-right: 0;
      }
    }
  }

  .date-button {
    width: calc(40% - 40px);

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
