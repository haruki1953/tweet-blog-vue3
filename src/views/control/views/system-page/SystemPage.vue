<script setup lang="ts">
import AdminInfo from './components/AdminInfo.vue'
import AuthUpdate from './components/AuthUpdate.vue'
</script>
<template>
  <div class="system-page">
    <div class="control-box">
      <div class="control-row">
        <AuthUpdate></AuthUpdate>
      </div>
      <div class="control-divider"></div>
      <div class="control-row">
        <AdminInfo></AdminInfo>
      </div>
    </div>
    <PageFooter></PageFooter>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/control.scss';
</style>
