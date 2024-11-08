<script setup lang="ts">
import NameBio from './components/NameBio.vue'
import AvatarUpdate from './components/AvatarUpdate.vue'
</script>
<template>
  <div class="profile-page">
    <div class="control-box">
      <div class="control-row">
        <NameBio></NameBio>
      </div>
      <!-- <div class="control-divider"></div>
      <div class="control-row decoration"></div> -->
    </div>
    <div class="control-box">
      <AvatarUpdate></AvatarUpdate>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
