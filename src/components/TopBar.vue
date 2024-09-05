<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
defineProps<{
  title: string
}>()
</script>
<template>
  <div class="top-bar">
    <div class="mask">
      <div class="title">{{ title }}</div>
    </div>
    <div class="back" @click="$router.back()">
      <el-icon size="16"><ArrowLeft /></el-icon>
      <span>返 回</span>
    </div>
    <div class="button">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-bar {
  height: 48px;
  padding: 12px;
  background-color: var(--color-background-soft);
  border-radius: 20px;
  transition: all 0.5s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
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
  .button {
    min-width: 60px;
    display: flex;
    justify-content: end;
    align-items: center;
  }
  .mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    pointer-events: none; /* 允许点击穿透 */
    .title {
      color: var(--color-text);
      font-weight: bold;
      transition: all 0.2s;
    }
  }
}
</style>
