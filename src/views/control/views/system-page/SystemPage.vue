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
      <div class="control-divider"></div>
      <div class="control-row decoration"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
