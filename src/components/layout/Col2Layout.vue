<script setup lang="ts">
import { useLayoutStore, useStatesStore } from '@/stores'
import { computed, ref } from 'vue'
import type { ElScrollbar } from 'element-plus'
import { useScroll } from '@vueuse/core'

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

const layoutStore = useLayoutStore()
const leftHeight = computed(() => {
  return layoutStore.col2LeftHeight
})

const show2Col = computed(() => layoutStore.col2IsShow2Col)
const largeColSpan = computed(() => (show2Col.value ? props.span : 24))
const smallColSpan = computed(() => (show2Col.value ? 24 - props.span : 24))

const statesStore = useStatesStore()

const refScroll = ref<InstanceType<typeof ElScrollbar> | null>(null)
const refWrap = computed(() => refScroll.value?.wrapRef)
const warpScroll = useScroll(refWrap)

// 在在滚动条置顶时不显示渐变遮罩
// 在明暗切换时不显示渐变遮罩
const showGradientMask = computed(
  () => !statesStore.isDarkTransitioning && !warpScroll.arrivedState.top
)
</script>
<template>
  <div class="col2-page">
    <el-row :gutter="10">
      <el-col :span="smallColSpan" v-if="!reverse && show2Col">
        <el-affix :offset="61" :z-index="1">
          <div class="col2-left">
            <el-scrollbar :height="leftHeight" ref="refScroll">
              <slot name="colLeft"></slot>
            </el-scrollbar>
            <div class="gradient-mask" v-show="showGradientMask"></div>
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
        <el-affix :offset="61" :z-index="1">
          <div class="col2-left reverse">
            <el-scrollbar :height="leftHeight" ref="refScroll">
              <slot name="colLeft"></slot>
            </el-scrollbar>
            <div class="gradient-mask" v-show="showGradientMask"></div>
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
  position: relative;
  .gradient-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 10px;
    background: linear-gradient(
      to bottom,
      var(--color-background),
      transparent
    );
    pointer-events: none; /* 允许点击穿透 */
  }
  .el-scrollbar {
    overflow: visible;
    :deep() {
      .el-scrollbar__view {
        margin: 20px 10px;
      }
      .el-scrollbar__bar.is-vertical {
        transform: translateX(4px);
        // width: 6px;
        // top: 20px;
        // height: calc(100% - 50px);
        .el-scrollbar__thumb {
          // height: 100px !important;
        }
      }
    }
  }
}

.col2-right {
  margin: 20px 0;
}

.el-col {
  background-color: transparent;
}
</style>
