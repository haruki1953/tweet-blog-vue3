<script setup lang="ts">
import { appInfo, platformKeyMap, type PlatformKeyEnumValues } from '@/config'
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

const platform = ref<PlatformKeyEnumValues>(platformKeyMap.x.key)

const jsonData = ref('')

const jsonCancel = () => {
  jsonData.value = ''
}

const isJsonProcessing = ref(false)
const jsonProcess = async () => {
  isJsonProcessing.value = true
  try {
    // test
    model.value = [
      {
        importImages: []
      }
    ]
  } finally {
    isJsonProcessing.value = false
  }
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
            type="primary"
            :href="appInfo.tweetImportHelpDocs.link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ appInfo.tweetImportHelpDocs.text }}
          </a>
        </div>
        <div class="form-box">
          <div class="form-row">
            <div class="control-radio">
              <el-radio-group v-model="platform">
                <el-radio :value="platformKeyMap.x.key">
                  {{ platformKeyMap.x.name }}
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
              :autosize="{ minRows: 10, maxRows: 20 }"
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
@use '../../../styles/control.scss';

.form-box {
  max-width: 700px;
}
</style>
