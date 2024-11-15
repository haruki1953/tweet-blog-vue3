<script setup lang="ts">
import NameBio from './components/NameBio.vue'
import AvatarUpdate from './components/AvatarUpdate.vue'
import SocialMedias from './components/SocialMedias.vue'
import ContactLinks from './components/ContactLinks.vue'
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
    <div class="control-box">
      <SocialMedias></SocialMedias>
    </div>
    <div class="control-box">
      <ContactLinks></ContactLinks>
    </div>
    <PageFooter></PageFooter>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/control.scss';
</style>
