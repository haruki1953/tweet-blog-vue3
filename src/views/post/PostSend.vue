<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
</script>
<template>
  <Col2Layout>
    <template #colLeft></template>
    <template #colLeftSm>
      <div class="top-bar">
        <div class="back">
          <el-icon size="16"><ArrowLeft /></el-icon>
          <span>返 回</span>
        </div>
        <div class="title">帖子发送</div>
      </div>
    </template>
    <template #colRight> </template>
  </Col2Layout>
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
    margin-right: 10px;
    color: var(--color-text);
    font-weight: bold;
    transition: all 0.2s;
  }
}
</style>
