<script setup lang="ts">
import { platformKeyMap } from '@/config'
import CharProgress from './CharProgress.vue'

const model = defineModel<string>()
</script>
<template>
  <div class="char-progress-group">
    <div class="progress-box">
      <Transition name="fade-pop">
        <CharProgress
          v-if="model"
          v-model="model"
          :platform="platformKeyMap.Discord.key"
        ></CharProgress>
      </Transition>
    </div>
    <div class="progress-box">
      <Transition name="fade-pop">
        <CharProgress
          v-if="model"
          v-model="model"
          :platform="platformKeyMap.Telegram.key"
        ></CharProgress>
      </Transition>
    </div>
    <div class="progress-box">
      <Transition name="fade-pop">
        <CharProgress
          v-if="model"
          v-model="model"
          :platform="platformKeyMap.X.key"
        ></CharProgress>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.char-progress-group {
  display: flex;
  align-items: center;
}
.progress-box {
  // width: 30px;
  // height: 30px;
  // margin: 1px;
  margin-left: 10px;
}
</style>
