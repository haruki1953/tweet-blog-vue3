<script setup lang="ts">
import { useTaskStore } from '@/stores'
import { formatTimeAgoChs } from '@/utils'
import { Check } from '@element-plus/icons-vue'
import { computed } from 'vue'

const taskStore = useTaskStore()

const importTaskList = computed(() => taskStore.importTaskList)
// const importTaskList = computed(() => [
//   {
//     uuid: 'aaa',
//     startAt: '2024-12-15',
//     completedCount: 10,
//     totalCount: 20
//   }
// ])

type ImageTaskItem = (typeof taskStore.importTaskList)[number]

const isComplete = (importTaskItem: ImageTaskItem) => {
  return importTaskItem.completedCount >= importTaskItem.totalCount
}

const couldDelete = (importTaskItem: ImageTaskItem) => {
  return isComplete(importTaskItem)
}

const tryDelete = (importTaskItem: ImageTaskItem) => {
  if (couldDelete(importTaskItem)) {
    taskStore.manageDeleteImportTask(importTaskItem.uuid)
  }
}
</script>
<template>
  <div class="import-task">
    <Transition name="fade">
      <div class="task-list" v-if="importTaskList.length > 0">
        <TransitionGroup name="fade-slide-list">
          <div
            class="task-item"
            v-for="importTaskItem in importTaskList"
            :key="importTaskItem.uuid"
          >
            <div class="info-box">
              <div class="info-row">
                <!-- <div class="info-id"></div> -->
                <div class="info-col progress">
                  <div class="progress-box">
                    <el-progress
                      :percentage="
                        (importTaskItem.completedCount /
                          (importTaskItem.totalCount || 1)) *
                        100
                      "
                      :show-text="false"
                      :stroke-width="8"
                      :status="
                        isComplete(importTaskItem) ? 'success' : undefined
                      "
                    />
                  </div>
                </div>
                <div class="info-col lable-date-button">
                  <div class="lable">
                    <div class="text">
                      <span class="count">
                        {{
                          `${importTaskItem.completedCount}/${importTaskItem.totalCount}`
                        }}
                      </span>
                      <span class="message">
                        {{
                          `${isComplete(importTaskItem) ? '导入完成' : '正在导入'}`
                        }}
                      </span>
                    </div>
                  </div>
                  <div class="date-button">
                    <div class="date">
                      <div class="text">
                        {{ formatTimeAgoChs(importTaskItem.startAt) }}
                      </div>
                    </div>
                    <div class="button">
                      <el-button
                        :type="
                          isComplete(importTaskItem) ? 'success' : 'primary'
                        "
                        :icon="Check"
                        circle
                        size="small"
                        :loading="!couldDelete(importTaskItem)"
                        @click="tryDelete(importTaskItem)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '../../../styles/control.scss';

.task-list {
  position: relative;
  margin-bottom: 20px;
}

.task-item {
  width: 100%;
  $media-max-width: 991px;

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
  }

  .info-divider {
    height: 2px;
    background-color: var(--color-background);
    transition: background-color 0.5s;
  }

  .info-row {
    margin: 0 20px;
    padding: 6px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: $media-max-width) {
      display: block;
    }
  }

  .info-col {
    // margin: 0 10px;
    padding: 4px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .progress {
    width: 60%;
    display: block;
    @media (max-width: $media-max-width) {
      width: auto;
      padding-top: 10px;
    }
  }

  .lable-date-button {
    width: calc(40% - 10px);

    @media (max-width: $media-max-width) {
      width: auto;
    }

    .lable {
      display: flex;
      align-items: center;
      .text {
        color: var(--color-text-soft);

        .count {
          font-weight: bold;
          font-family: 'Consolas', 'Courier New', monospace;
        }
        .message {
          margin-left: 10px;
          font-weight: bold;
        }
      }
    }

    .date-button {
      display: flex;
      align-items: center;
      .date {
        display: flex;
        align-items: center;
        color: var(--color-text-soft);
      }
      .button {
        display: flex;
        align-items: center;
        margin-left: 10px;

        .el-button {
          display: flex;
        }
      }
    }
  }
}

.el-progress {
  :deep() {
    .el-progress-bar__outer {
      transition: background-color 0.5s;
    }
  }
}
</style>
