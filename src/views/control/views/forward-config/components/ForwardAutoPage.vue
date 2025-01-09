<script setup lang="ts">
import { useForwardStore } from '@/stores'
import { computed } from 'vue'
import ForwardAutoItem from './ForwardAutoItem.vue'

const forwardStore = useForwardStore()
forwardStore.forwardSettingPostCountLoadHandleLoading()

// Store中的数据，也就是请求的数据
const forwardSettingList = computed(() => forwardStore.forwardSettingList)
</script>
<template>
  <div class="forward-auto-page">
    <div class="forward-list">
      <template v-for="(item, index) in forwardSettingList" :key="item.uuid">
        <div class="forward-item">
          <ForwardAutoItem :item="item"></ForwardAutoItem>
        </div>
        <el-divider
          v-if="index < forwardSettingList.length - 1"
          border-style="dotted"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.forward-item {
  margin: 15px 0;
}
.el-divider {
  width: 90%;
  margin: 0 auto;
  transition: all 0.5s;
  --el-border-color: var(--color-border);
}
</style>
