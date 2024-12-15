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

const importPosts = ref<PostControlImportJsonTypeOnDataProcess['importPosts']>(
  []
)
</script>
<template>
  <div class="tweet-import">
    <ImportProcess v-model="importPosts"></ImportProcess>
    <ImportTask></ImportTask>
    <Transition name="fade">
      <ImportSubmit
        v-model="importPosts"
        v-if="importPosts.length !== 0"
      ></ImportSubmit>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/control.scss';
</style>
