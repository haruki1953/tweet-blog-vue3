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
import type { PostControlImportJsonType } from '@/types'

const importPosts = ref<PostControlImportJsonType['importPosts']>([])
</script>
<template>
  <div class="tweet-import">
    <Transition mode="out-in" name="fade">
      <ImportProcess
        v-model="importPosts"
        v-if="importPosts.length === 0"
      ></ImportProcess>
      <ImportSubmit v-model="importPosts" v-else></ImportSubmit>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/control.scss';
</style>
