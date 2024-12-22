<script setup lang="ts">
import { appInfo } from '@/config'
import {
  ChatSquare,
  Link,
  PictureRounded,
  Remove
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import ImportProcess from './components/ImportProcess.vue'
import ImportSubmit from './components/ImportSubmit.vue'
import ImportTask from './components/ImportTask.vue'

import type { PostControlImportJsonTypeOnDataProcess } from '@/types'
import SettingExcessImportDelete from './components/SettingExcessImportDelete.vue'
import SettingAllPostImportDelete from './components/SettingAllPostImportDelete.vue'
import SettingAllImageImportDelete from './components/SettingAllImageImportDelete.vue'

const importPosts = ref<PostControlImportJsonTypeOnDataProcess['importPosts']>(
  []
)

const options = [
  {
    label: '推文导入',
    value: 'import'
  },
  {
    label: '导入设置',
    value: 'setting'
  }
] as const
const segmentedOptions = [...options] // el-segmented直接传options会有类型错误
const segmentedValue = ref<(typeof options)[number]['value']>(options[0].value)
</script>
<template>
  <div class="tweet-import">
    <div class="segmented-box">
      <el-segmented
        v-model="segmentedValue"
        :options="segmentedOptions"
        block
      />
    </div>
    <Transition name="fade" mode="out-in">
      <div class="import-page" v-if="segmentedValue === 'import'">
        <ImportProcess v-model="importPosts"></ImportProcess>
        <ImportTask></ImportTask>
        <Transition name="fade">
          <ImportSubmit
            v-model="importPosts"
            v-if="importPosts.length !== 0"
          ></ImportSubmit>
        </Transition>
      </div>
      <div class="setting-page" v-else>
        <div class="control-box">
          <div class="control-row">
            <SettingExcessImportDelete></SettingExcessImportDelete>
          </div>
          <div class="control-divider"></div>
          <div class="control-row">
            <SettingAllPostImportDelete></SettingAllPostImportDelete>
          </div>
          <div class="control-divider"></div>
          <div class="control-row">
            <SettingAllImageImportDelete></SettingAllImageImportDelete>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
// @use '../../styles/control.scss';

.segmented-box {
  max-width: 550px;
  margin: 0 auto;
  margin-bottom: 20px;
  padding: 0 10px;
  --el-border-radius-base: 20px;
  :deep() {
    .el-segmented {
      color: var(--color-text);
      background-color: var(--color-background-soft);
      transition: background-color 0.5s;
    }
    .el-segmented__item {
      transition: background-color 0.2s;
    }
    .el-segmented__item-label {
      font-weight: bold;
    }
  }
}
</style>
