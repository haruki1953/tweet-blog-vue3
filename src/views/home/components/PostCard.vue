<script setup lang="ts">
import {
  ChatSquare,
  Connection,
  Delete,
  EditPen,
  Star
} from '@element-plus/icons-vue'
</script>
<template>
  <div class="post-card">
    <div class="info-bar">
      <div class="repost"></div>
      <div class="time">2024-07-09 13:15</div>
    </div>
    <div class="content-box">
      <div class="content">这俩人以后结婚肯定天天玩4i</div>
    </div>
    <div class="image-box">
      <div class="image">
        <el-image
          class="post-img"
          fit="cover"
          src="https://wx2.sinaimg.cn/mw2000/008zXk04ly1hsrz9i0iu8j31hc0u0jtx.jpg"
        ></el-image>
      </div>
    </div>
    <div class="button-box">
      <el-button type="primary" :icon="ChatSquare" circle size="small" />
      <el-button type="info" :icon="EditPen" circle size="small" />
      <el-button type="warning" :icon="Star" circle size="small" />
      <el-button type="danger" :icon="Delete" circle size="small" />
      <el-button type="success" :icon="Connection" circle size="small" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post-card {
  margin-bottom: 15px;
  padding: 12px 20px 12px 20px;
  background-color: var(--color-background-soft);
  border-radius: 20px;
  transition: all 0.5s;
  .info-bar {
    display: flex;
    justify-content: space-between;
    .time {
      line-height: 12px;
      font-size: 12px;
      color: var(--color-text-soft);
    }
  }
  .content-box {
    margin-top: 5px;
    margin-bottom: 12px;
    display: flex;
    justify-content: center;
    .content {
      white-space: pre-line;
    }
  }
  .button-box {
    max-width: 300px;
    margin: 0 auto;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
}
.image-box {
  margin-bottom: 12px;
  border-radius: 20px;
  .post-img {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 20px;
    :deep() {
      .el-image__inner.is-loading {
        display: none;
      }
      .el-image__wrapper,
      .el-image__error {
        position: static;
        width: 100%;
        border-radius: 20px;
        aspect-ratio: 16 / 9;
        transition: background-color 0.5s;
        background-color: var(--color-background);
      }
    }
  }
}
</style>
