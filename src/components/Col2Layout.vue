<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

withDefaults(
  defineProps<{
    reverse?: boolean
  }>(),
  {
    reverse: false
  }
)

const windowSize = useWindowSize()
const profileHeight = computed(() => {
  return windowSize.height.value - 61
})
</script>
<template>
  <div class="col2-page">
    <el-row :gutter="10">
      <el-col :md="10" :sm="24" class="hidden-sm-and-down" v-if="!reverse">
        <div class="col2-left">
          <el-scrollbar :height="profileHeight">
            <slot name="colLeft"></slot>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :md="14" :sm="24">
        <div class="col2-left-sm hidden-md-and-up">
          <slot name="colLeftSm"></slot>
        </div>
        <div class="col2-right">
          <slot name="colRight"></slot>
        </div>
      </el-col>
      <el-col :md="10" :sm="24" class="hidden-sm-and-down" v-if="reverse">
        <div class="col2-left reverse">
          <el-scrollbar :height="profileHeight">
            <slot name="colLeft"></slot>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.col2-page {
  max-width: 950px;
  margin: 0 auto;
}
@media (max-width: 991px) {
  .col2-page {
    max-width: 550px;
  }
}

.col2-left-sm {
  margin-top: 20px;
}

.col2-left {
  position: sticky;
  top: 60px;
  .el-scrollbar {
    :deep() {
      .el-scrollbar__view {
        // overflow-x: visible;
        // margin: 20px 10px 20px 0;
        margin: 20px 10px;
      }
    }
  }
  // &.reverse {
  //   .el-scrollbar {
  //     :deep() {
  //       .el-scrollbar__view {
  //         margin: 20px 0 20px 10px;
  //       }
  //     }
  //   }
  // }
}

.col2-right {
  margin: 20px 0;
}
</style>
