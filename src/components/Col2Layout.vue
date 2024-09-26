<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    reverse?: boolean
    span?: number
  }>(),
  {
    reverse: false,
    span: 14
  }
)

const windowSize = useWindowSize()
const profileHeight = computed(() => {
  return windowSize.height.value - 61
})

const show2Col = computed(() => windowSize.width.value >= 992)
const largeColSpan = computed(() => (show2Col.value ? props.span : 24))
const smallColSpan = computed(() => (show2Col.value ? 24 - props.span : 24))
</script>
<template>
  <div class="col2-page">
    <el-row :gutter="10">
      <el-col :span="smallColSpan" v-if="!reverse && show2Col">
        <el-affix :offset="61">
          <div class="col2-left">
            <el-scrollbar :height="profileHeight">
              <slot name="colLeft"></slot>
            </el-scrollbar>
          </div>
        </el-affix>
      </el-col>
      <el-col :span="largeColSpan">
        <div class="col2-left-sm" v-if="!show2Col">
          <slot name="colLeftSm"></slot>
        </div>
        <div class="col2-right">
          <slot name="colRight"></slot>
        </div>
      </el-col>
      <el-col :span="smallColSpan" v-if="reverse && show2Col">
        <el-affix :offset="61">
          <div class="col2-left reverse">
            <el-scrollbar :height="profileHeight">
              <slot name="colLeft"></slot>
            </el-scrollbar>
          </div>
        </el-affix>
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
  .el-scrollbar {
    :deep() {
      .el-scrollbar__view {
        margin: 20px 10px;
      }
    }
  }
}

.col2-right {
  margin: 20px 0;
}
</style>
