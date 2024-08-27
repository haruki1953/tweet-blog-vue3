<script setup lang="ts">
import { ChatLineSquare, EditPen } from '@element-plus/icons-vue'
import { ref } from 'vue'

const formModel = ref({
  content: ''
})
</script>
<template>
  <Col2Layout>
    <template #colLeft>
      <TopBar title="帖子发送">
        <el-button type="primary" round size="small"> 发 送 </el-button>
      </TopBar>
    </template>
    <template #colLeftSm>
      <TopBar title="帖子发送">
        <el-button type="primary" round size="small"> 发 送 </el-button>
      </TopBar>
    </template>
    <template #colRight>
      <div class="info-bar">
        <div class="info">
          <div class="repost">
            <el-icon :size="15">
              <ChatLineSquare />
            </el-icon>
            <div class="repost-text">帖子</div>
          </div>
        </div>
        <div class="time">
          <span>2024-08-18 07:20</span>
          <el-button type="info" :icon="EditPen" circle size="small" />
        </div>
      </div>
      <div class="content-box">
        <el-input
          v-model="formModel.content"
          placeholder="有什么新鲜事？！"
          :rows="10"
          type="textarea"
          size="large"
          class="content-textarea"
          :maxlength="140"
          show-word-limit
        />
      </div>
    </template>
  </Col2Layout>
</template>

<style lang="scss" scoped>
.info-bar {
  height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .info {
    width: 50%;
    .repost {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: var(--color-text-soft);
      .el-icon {
        margin-right: 5px;
      }
      .repost-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .time {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: var(--color-text-soft);
    .el-button {
      margin-left: 5px;
    }
  }
}

.content-box {
  .content-textarea {
    padding: 10px;
    border-radius: 20px;
    background-color: var(--color-background-soft);
    transition: all 0.5s;
    :deep() {
      .el-textarea__inner {
        // color: var(--color-text);
        // font-weight: bold;
        border: none;
        box-shadow: none;
        background-color: var(--color-background-soft);
        transition:
          background-color 0.5s,
          color 0.2s;
      }
      .el-input__count {
        background-color: var(--color-background-soft);
        color: var(--color-text-soft);
        transition: all 0.5s;
        right: 20px;
        bottom: 15px;
      }
    }
  }
}
</style>
