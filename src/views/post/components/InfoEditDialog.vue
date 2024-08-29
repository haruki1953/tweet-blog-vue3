<script setup lang="ts">
import { computed } from 'vue'
import { ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import type { PostSendJsonType } from '@/types'

const model = defineModel<PostSendJsonType>({ required: true })

const dialogVisible = ref(false)

const windowSize = useWindowSize()
const dialogWidth = computed(() => {
  const width = 400
  const windowWidth = windowSize.width.value
  return windowWidth * 0.9 < width ? '90%' : width
})

const open = () => {
  dialogVisible.value = true
}

defineExpose({
  open
})

const handleModelData = () => {
  if (!(model.value.createdAt instanceof Date)) {
    model.value.createdAt = undefined
  }
}

const resetModelData = () => {
  model.value.createdAt = undefined
}
</script>
<template>
  <div class="info-edit-dialog">
    <el-dialog
      v-model="dialogVisible"
      :width="dialogWidth"
      :lock-scroll="false"
      @close="handleModelData"
    >
      <div class="form-box">
        <div class="row">
          <el-date-picker
            v-model="model.createdAt"
            type="datetime"
            placeholder="选择帖子创建时间"
          />
        </div>
        <div class="button-box">
          <el-button
            round
            class="row"
            type="info"
            size="small"
            @click="resetModelData"
          >
            重 置
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.info-edit-dialog {
  :deep() {
    .el-dialog {
      border-radius: 20px;
    }
    .el-input {
      .el-input__wrapper {
        border-radius: 10px;
        background-color: var(--color-background-soft);
        transition: all 0.5s;
        box-shadow: none;
        &:hover {
          box-shadow: none;
        }
        .el-input__inner {
          // color: var(--color-text);
          font-weight: bold;
          // text-align: center;
        }
      }
    }
  }
}

.form-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  .row {
    margin-bottom: 10px;
  }
}
</style>
