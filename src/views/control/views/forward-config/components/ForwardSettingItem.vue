<script setup lang="ts">
import { platformKeyMap } from '@/config'
import { CircleCheckFilled, Plus } from '@element-plus/icons-vue'
import { useElementSize } from '@vueuse/core'
import { computed } from 'vue'
import { ref } from 'vue'
import type { UseForwardSettingListInFormControl } from './dependencies'
import type { ForwardSettingItem, ForwardSettingItemInForm } from '@/types'
import ForwardSettingForm from './ForwardSettingForm.vue'

// const model = defineModel<ForwardSettingItemInForm>({ required: true })

const props = defineProps<{
  // add: boolean
  itemInForm: ForwardSettingItemInForm
  itemInStore?: ForwardSettingItem
  useForwardSettingListInFormControl: UseForwardSettingListInFormControl
}>()

const isEditing = ref(false)

const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

// const dataPreview = computed(() => {
//   let dataStr
//   // for (const key in )
// })

const boxRef = ref<HTMLElement | null>(null)
const boxSize = useElementSize(boxRef)
const boxStyleHeight = computed(() => {
  return `${boxSize.height.value}px`
})
</script>
<template>
  <div class="forward-setting-item">
    <div
      class="info-box"
      :class="{
        // add,
        // adding: isEditing
      }"
    >
      <!-- <div class="info-row top-line add" @click="toggleEdit" v-if="add">
        <div class="mask">
          <el-icon class="icon"><Plus /></el-icon>
          <span class="text">添加转发配置</span>
        </div>
      </div> -->
      <div class="info-row top-line" @click="toggleEdit">
        <div class="info-col left">
          <div class="icon-text">
            <el-icon
              :class="platformKeyMap[itemInForm.platform].fontawesomeClass"
              size="25"
            ></el-icon>
            <div class="text">
              {{ itemInForm.name }}
            </div>
          </div>
          <div></div>
        </div>
        <div class="info-col right">
          <div></div>
          <div class="content-flag">
            <div class="content">****aabbcc ****ssddxx</div>
            <div class="flag">
              <el-icon :color="`var(--el-color-primary)`">
                <CircleCheckFilled />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
      <div
        class="style-box"
        :style="{
          height: boxStyleHeight
        }"
      >
        <div class="info-divider"></div>
        <Transition name="fade05">
          <div v-if="isEditing" ref="boxRef">
            <div class="info-row">
              <ForwardSettingForm
                :itemInForm="itemInForm"
                :itemInStore="itemInStore"
                :useForwardSettingListInFormControl="
                  useForwardSettingListInFormControl
                "
                :toggleEdit="toggleEdit"
              ></ForwardSettingForm>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.style-box {
  overflow: hidden;
  transition: height 0.8s ease-in-out;
  // transition: height 1s;
}

.info-box {
  margin-bottom: 10px;
  background-color: var(--color-background-soft);
  transition: background-color 0.5s;
  border-radius: 20px;
  transition:
    background-color 0.5s,
    box-shadow 0.5s;
  &:hover {
    box-shadow: var(--el-box-shadow-lighter);
    // background-color: var(--color-background-mute);
  }
  // &.add {
  //   background-color: var(--color-background);
  //   border: 2px dashed var(--el-border-color);
  //   transition:
  //     border var(--el-transition-duration),
  //     background-color 0.5s,
  //     box-shadow 0.5s;
  //   &:hover {
  //     background-color: var(--color-background-soft);
  //     border-color: var(--el-color-primary);
  //   }
  //   &.adding {
  //     background-color: var(--color-background-soft);
  //     border-color: var(--el-color-primary);
  //   }
  //   .top-line {
  //     position: relative;
  //     .mask {
  //       position: absolute;
  //       top: 0;
  //       right: 0;
  //       bottom: 0;
  //       left: 0;
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //       color: #8c939d;
  //       user-select: none;
  //       pointer-events: none; /* 允许点击穿透 */
  //       .icon {
  //         font-size: 25px;
  //       }
  //       .text {
  //         font-weight: bold;
  //         margin-left: 10px;
  //       }
  //     }
  //   }
  // }
}

.info-divider {
  height: 2px;
  background-color: var(--color-background);
  transition: background-color 0.5s;
}

.info-row {
  margin: 0 20px;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.top-line {
    height: 45px;
    cursor: pointer;
    user-select: none;
  }
}
.info-col {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.left {
  width: 50%;
}
.right {
  width: calc(50% - 20px);
}

.icon-text {
  width: 100%;
  display: flex;
  align-items: center;

  .el-icon {
    margin-right: 10px;
  }

  .text {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.content-flag {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .content {
    color: var(--color-text-soft);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: 'Consolas', 'Courier New', monospace;
  }

  .flag {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
}
</style>
