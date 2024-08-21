<script setup lang="ts">
import ProfileCard from './components/ProfileCard.vue'
</script>
<template>
  <div class="home-page">
    <el-row :gutter="20">
      <el-col :md="10" :sm="24">
        <div class="profile">
          <ProfileCard></ProfileCard>
        </div>
      </el-col>
      <el-col :md="14" :sm="24">
        <div class="posts">
          <div class="post">这俩人以后结婚肯定天天玩4i</div>
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
@media (max-width: 992px) {
  .home-page {
    max-width: 540px;
    margin: 0 auto;
  }
}
</style>
