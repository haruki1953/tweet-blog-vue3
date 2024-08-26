<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
defineProps<{
  title: string
}>()
</script>
<template>
  <div class="top-bar">
    <div class="back" @click="$router.back()">
      <el-icon size="16"><ArrowLeft /></el-icon>
      <span>返 回</span>
    </div>
    <div class="title">{{ title }}</div>
    <div class="button">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-bar {
  padding: 12px;
  background-color: var(--color-background-soft);
  border-radius: 20px;
  transition: all 0.5s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .back {
    min-width: 60px;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    .el-icon,
    span {
      color: var(--color-text);
      font-weight: bold;
      transition: all 0.2s;
    }
    span {
      margin-left: 5px;
    }
  }
  .title {
    color: var(--color-text);
    font-weight: bold;
    transition: all 0.2s;
  }
  .button {
    min-width: 60px;
    display: flex;
    justify-content: end;
    align-items: center;
  }
}
</style>
