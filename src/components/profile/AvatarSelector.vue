<script setup lang="ts">
import { Upload, CircleCheckFilled } from '@element-plus/icons-vue'
import userAvatar from '@/assets/haruki.jpg'
import { computed, ref } from 'vue'
import { useElementSize } from '@vueuse/core'

const boxRef = ref<HTMLElement | null>(null)
const boxSize = useElementSize(boxRef)
const imageSize = computed(() => {
  if (boxRef.value == null) {
    return 50
  }
  if (boxSize.width.value > 500) {
    return 80
    // return 6
  }
  return 50
})
</script>
<template>
  <div class="avatar-selector" ref="boxRef">
    <div class="selector-image-row">
      <el-scrollbar>
        <div class="scroll-image-box">
          <div class="item-image-box" v-for="item in 20" :key="item">
            <div class="img-box">
              <el-avatar shape="square" :size="imageSize" :src="userAvatar" />
              <div class="img-mask">
                <Transition name="fade-pop">
                  <el-icon size="20" v-show="0">
                    <CircleCheckFilled />
                  </el-icon>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="gradient-mask-left"></div>
      <div class="gradient-mask-right"></div>
    </div>
    <div class="selector-botton-row">
      <el-button type="primary" round size="small" :icon="Upload">
        上传图片
      </el-button>
      <el-button type="info" round size="small"> 操作 </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.selector-botton-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.selector-image-row {
  position: relative;
  .gradient-mask-left {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(
      to right,
      var(--color-background-soft),
      transparent
    );
    pointer-events: none; /* 允许点击穿透 */
  }
  .gradient-mask-right {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(
      to left,
      var(--color-background-soft),
      transparent
    );
    pointer-events: none; /* 允许点击穿透 */
  }
}
.scroll-image-box {
  display: flex;
  // padding: 10px 20px;
  padding: 10px 0;
  .item-image-box {
    padding: 0 5px;
    &:first-child {
      padding-left: 20px;
    }
    &:last-child {
      padding-right: 20px;
    }
  }
}
.img-box {
  position: relative;
  &:hover {
    .el-avatar,
    .img-mask {
      transform: scale(0.95, 0.95);
    }
  }
  .img-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: pointer;
    transition: transform 0.2s;
    .el-icon {
      color: var(--el-color-success);
    }
  }
  // 有了上面的遮罩，图片就不会被拖动
  .el-avatar {
    display: flex;
    border: 1px solid var(--color-background-mute);
    background-color: var(--color-background-mute);
    user-select: none;
    transition:
      background-color 0.5s,
      transform 0.2s,
      border 0.5s;
  }
}
</style>
