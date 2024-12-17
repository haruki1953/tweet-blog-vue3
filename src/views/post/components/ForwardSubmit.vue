<script setup lang="ts">
import { platformKeyMap } from '@/config'
</script>
<template>
  <div class="forward-submit">
    <div class="forward-list">
      <div class="forward-item">
        <div class="info-box">
          <div class="info-row">
            <div class="info-col left">
              <div class="icon-text">
                <el-icon :class="'fa-brands fa-x-twitter'" size="25"></el-icon>
                <div class="text">
                  {{ platformKeyMap['X'].name }}
                </div>
              </div>
            </div>
            <div class="info-col right">
              <div class="date-button">
                <div class="date">
                  <div class="text"></div>
                </div>
                <div class="button">
                  <el-button
                    class="forward-button"
                    type="primary"
                    round
                    :loading="false"
                    @click="() => {}"
                  >
                    转发
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.forward-list {
  position: relative;
  margin-bottom: 20px;
}

.forward-item {
  width: 100%;
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
}

.info-row {
  margin: 0 10px 0 20px;
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.info-col {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.left {
  max-width: calc(100% - 140px);
}
.right {
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

.date-button {
  .date {
    display: flex;
    align-items: center;
    color: var(--color-text-soft);
  }

  .button {
    display: flex;
    align-items: center;
    .el-button {
      display: flex;
    }
    .forward-button {
      :deep() {
        span,
        .el-icon {
          color: var(--color-background-soft);
          font-weight: bold;
          transition: all 0.2s;
        }
      }
    }
  }
}
</style>
