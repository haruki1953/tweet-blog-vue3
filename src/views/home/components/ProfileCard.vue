<script setup lang="ts">
import userAvatar from '@/assets/haruki.jpg'

// withDefaults(
//   defineProps<{
//     showLinkGroup?: boolean
//   }>(),
//   {
//     showLinkGroup: false
//   }
// )
</script>
<template>
  <div class="profile-card">
    <div class="user">
      <div class="avatar">
        <el-avatar :size="72" :src="userAvatar" />
      </div>
      <div class="name">haruki🐻</div>
    </div>
    <div class="bio-box">
      <div class="bio">可怜的孩子 不再胆怯</div>
    </div>
    <div class="blog-info">
      <div class="info-box">
        <div class="info-val">100</div>
        <div class="info-text">帖子</div>
      </div>
      <el-divider direction="vertical" />
      <div class="info-box">
        <div class="info-val">30</div>
        <div class="info-text">图片</div>
      </div>
    </div>
    <div class="solt-box">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-card {
  .user {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    .avatar {
      margin-right: 12px;
    }
    .name {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .bio-box {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    .bio {
      white-space: pre-line;
    }
  }
  .blog-info {
    height: 80px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background-color: var(--color-background-soft);
    border-radius: 20px;
    transition: all 0.5s;
    .info-box {
      min-width: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .info-val {
        font-size: 20px;
        font-weight: bold;
      }
      .info-text {
        font-size: 12px;
        color: var(--color-text-soft);
      }
    }
    .el-divider {
      height: 40px;
      transition: all 0.5s;
      --el-border-color: var(--color-border);
    }
  }
  .solt-box {
    display: flex;
    justify-content: center;
  }
}
</style>
