<script setup lang="ts">
import { platformKeyMap } from '@/config'
import { formatTimeAgoChs } from '@/utils'
import { Link } from '@element-plus/icons-vue'
</script>
<template>
  <div class="forward-info">
    <div class="forward-info-box">
      <div class="control-lable-with-button">
        <div class="lable">转发记录</div>
        <div class="button">
          <el-button
            class="forward-button"
            type="primary"
            size="small"
            round
            text
            @click="() => {}"
          >
            编辑
          </el-button>
        </div>
      </div>
      <div class="forward-list">
        <div class="forward-item">
          <div class="info-box">
            <div class="info-row">
              <div class="info-col left">
                <div class="icon-text">
                  <el-icon
                    :class="'fa-brands fa-x-twitter'"
                    size="20"
                  ></el-icon>
                  <div class="text">
                    {{ platformKeyMap['X'].name }}
                  </div>
                </div>
              </div>
              <div class="info-col right">
                <div class="date-button">
                  <div class="date">
                    <div class="text">{{ formatTimeAgoChs('2024-12-17') }}</div>
                  </div>
                  <div class="button">
                    <el-button
                      type="primary"
                      circle
                      size="small"
                      :icon="Link"
                      tag="a"
                      :href="''"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  </div>
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
.control-lable-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 10px 10px;

  .lable {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-text-soft);
  }

  .button {
    display: flex;
    align-items: center;
  }
}

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
  margin: 0 10px 0 15px;
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
  width: calc(100% - 120px);
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
</style>
