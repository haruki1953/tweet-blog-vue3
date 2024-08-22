<script setup lang="ts">
import ProfileCard from './components/ProfileCard.vue'
import PostCard from './components/PostCard.vue'

const profileHeight = window.innerHeight - 61
</script>
<template>
  <div class="home-page">
    <div class="profile-m hidden-md-and-up">
      <ProfileCard>
        <div class="profile-solt">
          <el-button class="profile-button" type="primary" round>
            发 帖
          </el-button>
        </div>
      </ProfileCard>
    </div>
    <el-row :gutter="20">
      <el-col :md="10" :sm="24" class="hidden-sm-and-down">
        <div class="profile">
          <el-scrollbar :height="profileHeight">
            <ProfileCard>
              <div class="profile-solt">
                <el-button class="profile-button" type="primary" round>
                  发 帖
                </el-button>
              </div>
            </ProfileCard>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :md="14" :sm="24">
        <div class="posts">
          <PostCard></PostCard>
          <PostCard></PostCard>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  max-width: 920px;
  margin: 0 auto;
}
.profile {
  position: sticky;
  top: 60px;
  .el-scrollbar {
    :deep() {
      .el-scrollbar__view {
        padding-top: 20px;
      }
    }
  }
}
.profile-m {
  padding-top: 20px;
}

.profile-solt {
  // margin: 10px 0;
  width: 50%;
  .profile-button {
    display: flex;
    margin: 20px 0 0 0;
    width: 100%;
    :deep() {
      span {
        color: var(--color-background);
        font-weight: bold;
        transition: all 0.5s;
        // letter-spacing: 6px;
      }
    }
  }
}

.posts {
  padding-top: 20px;
}

@media (max-width: 991px) {
  .home-page {
    max-width: 540px;
    margin: 0 auto;
  }
}
</style>
