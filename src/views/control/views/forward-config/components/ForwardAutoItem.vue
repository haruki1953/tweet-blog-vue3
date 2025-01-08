<script setup lang="ts">
import { platformKeyMap } from '@/config'
import type { ForwardSettingItem } from '@/types'
import { Notification } from '@element-plus/icons-vue'
import { useElementSize } from '@vueuse/core'
import { computed } from 'vue'
import { ref } from 'vue'

const props = defineProps<{
  item: ForwardSettingItem
}>()

const isEditing = ref(false)

const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

const boxRef = ref<HTMLElement | null>(null)
const boxSize = useElementSize(boxRef)
const boxStyleHeight = computed(() => {
  return `${boxSize.height.value}px`
})
</script>
<template>
  <div class="forward-auto-item">
    <div class="info-box">
      <div @click="toggleEdit" class="top-line">
        <div class="info-row">
          <div class="info-col left">
            <div class="icon-text">
              <el-icon
                :class="platformKeyMap[item.platform].fontawesomeClass"
                size="25"
              ></el-icon>
              <Transition name="fade" mode="out-in">
                <div class="text" :key="item.name">
                  {{ item.name }}
                </div>
              </Transition>
            </div>
            <div></div>
          </div>
          <div class="info-col right">
            <div></div>
            <div class="content-flag">
              <Transition name="fade" mode="out-in">
                <div class="content" v-if="true">{{ '55/100' }}</div>
              </Transition>
              <Transition name="fade-pop" mode="out-in">
                <div class="flag" :key="''">
                  <el-icon :color="'var(--el-color-primary)'" size="20">
                    <component :is="Notification"></component>
                  </el-icon>
                </div>
              </Transition>
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
            <div class="info-row form">
              <!-- <ForwardSettingForm
                :itemInForm="itemInForm"
                :itemInStore="itemInStore"
                :itemState="itemState"
                :useForwardSettingListInFormControl="
                  useForwardSettingListInFormControl
                "
                :toggleEdit="toggleEdit"
              ></ForwardSettingForm> -->
            </div>
          </div>
        </Transition>
      </div>
    </div>
    <div class="task-box"></div>
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
  border-radius: 20px;
  transition:
    background-color 0.5s,
    box-shadow 0.5s;
  &:hover {
    box-shadow: var(--el-box-shadow-lighter);
  }
}

.info-divider {
  // height: 2px;
  // background-color: var(--color-background);
  // transition: background-color 0.5s;
  border-top: 2.4px solid var(--color-background); // divider
  transition: border 0.5s;
}

.top-line {
  height: 45px;
  cursor: pointer;
  user-select: none;
}
.info-row {
  margin: 0 16px 0 20px;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.form {
    display: block;
    margin: 0 20px;
    padding: 20px 0;
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
