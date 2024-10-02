<script setup lang="ts">
import { postConfig } from '@/config'
import { textToPostContentPartCalcCharNumber } from '@/utils'
import { computed } from 'vue'

const model = defineModel<string>({ required: true })
// const props = defineProps<{
//   text: string
// }>()

const charNum = computed(() => {
  console.log(textToPostContentPartCalcCharNumber(model.value))
  return textToPostContentPartCalcCharNumber(model.value)
})

const percentage = computed(() => {
  const rawPercentage =
    (charNum.value / postConfig.maxPostCharactersOnSend) * 100
  return Math.min(100, Math.max(0, Math.round(rawPercentage)))
})

const remainingChars = computed(() => {
  return postConfig.maxPostCharactersOnSend - charNum.value
})

const progressStatus = computed(() => {
  if (remainingChars.value <= 0) {
    return 'exception'
  } else if (remainingChars.value <= postConfig.remainingCharsToWarning) {
    return 'warning'
  } else {
    return ''
  }
})
</script>
<template>
  <div class="char-progress">
    <Transition name="fade-pop">
      <div class="progress-circle" v-show="remainingChars >= -99">
        <el-progress
          type="circle"
          :percentage="percentage"
          :status="progressStatus"
          :class="progressStatus"
          :width="30"
          :stroke-width="3"
          :show-text="false"
        />
      </div>
    </Transition>
    <Transition name="fade-pop">
      <div
        class="progress-lable"
        :class="progressStatus"
        v-show="remainingChars <= postConfig.remainingCharsToWarning"
      >
        {{ remainingChars }}
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
$progressWidth: 30px;
$progressHeight: 30px;
.char-progress {
  width: $progressWidth;
  height: $progressHeight;
  position: relative;
  user-select: none;
  .progress-circle {
    width: $progressWidth;
    height: $progressHeight;
    position: absolute;
    :deep() {
      .el-progress-circle__track {
        stroke: var(--el-color-primary-light-7);
        transition: all 0.5s;
      }
      .el-progress-circle__path {
        stroke: var(--el-color-primary);
      }
      .warning {
        .el-progress-circle__track {
          stroke: var(--el-color-warning-light-7);
        }
        .el-progress-circle__path {
          stroke: var(--el-color-warning);
        }
      }
      .exception {
        .el-progress-circle__track {
          stroke: var(--el-color-danger-light-7);
        }
        .el-progress-circle__path {
          stroke: var(--el-color-danger);
        }
      }
    }
  }
  .progress-lable {
    width: $progressWidth;
    height: $progressHeight;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 12px;
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-soft);
    transition: all 0.5s;
  }
  .warning {
    color: var(--el-color-warning);
  }
  .exception {
    color: var(--el-color-danger);
  }
}
</style>
