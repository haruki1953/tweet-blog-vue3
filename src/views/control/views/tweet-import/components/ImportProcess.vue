<script setup lang="ts">
import { appInfo, platformKeyMap, type PlatformKeyEnumValues } from '@/config'
import type { PostControlImportJsonTypeOnDataProcess } from '@/types'
import {
  ChatSquare,
  Link,
  PictureRounded,
  Remove
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { processJsonToImportPostsByPlatform } from '../services'
import { sakiMessage } from '@/utils'
import { cloneDeep } from 'lodash'

const model = defineModel<
  PostControlImportJsonTypeOnDataProcess['importPosts']
>({
  required: true
})

const platform = ref<PlatformKeyEnumValues>(platformKeyMap.X.key)

const jsonData = ref('')

const jsonCancel = () => {
  jsonData.value = ''
}

const isJsonProcessing = ref(false)
const jsonProcess = async () => {
  isJsonProcessing.value = true
  try {
    const importPosts = processJsonToImportPostsByPlatform({
      jsonData: jsonData.value,
      platform: platform.value
    })
    if (importPosts == null) {
      sakiMessage({
        type: 'error',
        message: '解析失败'
      })
      return
    } else if (importPosts.length === 0) {
      sakiMessage({
        type: 'warning',
        message: '未解析到推文'
      })
    }
    importPostsAdd(importPosts)
    // console.log(importPosts)
    // console.log(model.value)
    sakiMessage({
      type: 'success',
      message: '解析成功'
    })
    jsonCancel()
  } catch (error) {
    sakiMessage({
      type: 'error',
      message: '解析失败'
    })
  } finally {
    isJsonProcessing.value = false
  }
}

// 添加帖子数据至 model，并且不与其重复
const importPostsAdd = (
  importPosts: PostControlImportJsonTypeOnDataProcess['importPosts']
) => {
  const uniquePosts = []
  for (const newPost of importPosts) {
    const find = model.value.find(
      (existingPost) =>
        existingPost.platform === newPost.platform &&
        existingPost.platformId === newPost.platformId
    )
    if (find) {
      continue
    }
    uniquePosts.push(newPost)
  }

  model.value.unshift(...uniquePosts)
}
</script>
<template>
  <div class="import-process">
    <div class="control-box">
      <div class="control-row">
        <div class="control-lable-with-link">
          <div class="lable">推文导入</div>
          <a
            class="link"
            :href="appInfo.importDocs.link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ appInfo.importDocs.text }}
          </a>
        </div>
        <div class="form-box">
          <div class="form-row">
            <div class="control-radio">
              <el-radio-group v-model="platform">
                <el-radio :value="platformKeyMap.X.key">
                  {{ platformKeyMap.X.name }}
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="form-row">
            <div class="input-lable">json数据</div>
            <el-input
              v-model="jsonData"
              placeholder=""
              type="textarea"
              :rows="10"
              resize="none"
              class="control-textarea"
            ></el-input>
          </div>
        </div>
        <div class="button-box">
          <el-button
            @click="jsonProcess"
            :loading="isJsonProcessing"
            type="primary"
            round
          >
            解析
          </el-button>
          <el-button @click="jsonCancel" type="info" round> 清空 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// @use '../../../styles/control.scss';

.form-box {
  max-width: 700px;
}
</style>
