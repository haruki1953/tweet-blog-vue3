<script setup lang="ts">
import { useForwardStore, useTaskStore } from '@/stores'
import { computed } from 'vue'
import ForwardAutoItem from './ForwardAutoItem.vue'
import ForwardAutoTaskList from './ForwardAutoTaskList.vue'

const taskStore = useTaskStore()

const forwardStore = useForwardStore()
// 加载转发统计数据
forwardStore.forwardSettingPostCountLoadHandleLoading()

// 转发配置
const forwardSettingList = computed(() => forwardStore.forwardSettingList)

// 任务信息
const taskForwardList = computed(() => taskStore.taskForwardList)
// 不在转发配置中的任务信息
const taskForwardNotSettingList = computed(() => {
  return taskForwardList.value.filter((taskItem) => {
    const findSetting = forwardSettingList.value.find(
      (settingItem) => settingItem.uuid === taskItem.forwardConfigId
    )
    if (findSetting == null) {
      return true
    }
    return false
  })
})
</script>
<template>
  <div class="forward-auto-page">
    <div class="forward-list">
      <div class="forward-item">
        <ForwardAutoTaskList
          :list="taskForwardNotSettingList"
        ></ForwardAutoTaskList>
      </div>
      <el-divider
        v-if="taskForwardNotSettingList.length > 0"
        border-style="dotted"
      />
      <template v-for="(item, index) in forwardSettingList" :key="item.uuid">
        <div class="forward-item">
          <ForwardAutoItem :item="item"></ForwardAutoItem>
        </div>
        <el-divider
          v-if="index < forwardSettingList.length - 1"
          border-style="dotted"
        />
      </template>
      <TweetEmpty
        description="暂无转发配置"
        v-if="forwardSettingList.length === 0"
      ></TweetEmpty>
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
