<script setup lang="ts">
import type { IconMenuItem } from '@/types'
import {
  User,
  Postcard,
  Picture,
  Connection,
  Sell,
  Tickets
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const menu: IconMenuItem[] = [
  {
    index: '/control',
    title: `系统设置`,
    icon: User,
    actionColor: 'primary',
    onClick() {
      router.push('/control')
    }
  },
  {
    index: '/profile',
    title: `个人信息`,
    icon: Postcard,
    actionColor: 'primary',
    onClick() {
      router.push('/profile')
    }
  },
  {
    index: '/image-config',
    title: `图片设置`,
    icon: Picture,
    actionColor: 'primary',
    onClick() {
      router.push('/image-config')
    }
  },
  {
    index: '/forward-config',
    title: `转发设置`,
    icon: Connection,
    actionColor: 'primary',
    onClick() {
      router.push('/forward-config')
    }
  },
  {
    index: '/tweet-import',
    title: `推文导入`,
    icon: Sell,
    actionColor: 'primary',
    onClick() {
      router.push('/tweet-import')
    }
  },
  {
    index: '/log',
    title: `日志`,
    icon: Tickets,
    actionColor: 'primary',
    onClick() {
      router.push('/log')
    }
  }
]
</script>
<template>
  <div>
    <Col2Layout :span="20">
      <template #colLeftSm>
        <div class="horizontal-menu">
          <IconMenuBox :menu="menu" :modelValue="$route.path"></IconMenuBox>
        </div>
      </template>
      <template #colLeft>
        <div class="vertical-menu">
          <IconMenuBox :menu="menu" :modelValue="$route.path"></IconMenuBox>
        </div>
      </template>
      <template #colRight>
        <div class="contorl-page">
          <!-- <router-view></router-view> -->
          <router-view v-slot="{ Component }">
            <transition name="fade-slide" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </template>
    </Col2Layout>
  </div>
</template>

<style lang="scss" scoped>
.contorl-page {
  :deep() {
    .button-box {
      margin-right: 4px;
      display: flex;
      justify-content: right;
      align-items: center;
      flex-wrap: wrap;
      .el-button {
        margin-bottom: 4px;
      }
    }

    .control-box {
      background-color: var(--color-background-soft);
      transition: background-color 0.5s;
      border-radius: 20px;
    }
    .control-row {
      padding: 15px 20px;
      &.decoration {
        padding: 0;
        height: 25px;
      }
    }
    .control-lable {
      font-size: 14px;
      font-weight: bold;
      color: var(--color-text-soft);
      margin: 0 0 15px 10px;
    }
    .control-divider {
      height: 2px;
      background-color: var(--color-background);
      transition: background-color 0.5s;
    }

    .input-lable {
      font-size: 12px;
      line-height: 12px;
      color: var(--color-text-soft);
      margin: 0 0 2px 25px;
    }

    .control-input {
      display: flex;
      width: 100%;
      .el-input__wrapper {
        padding: 1px 20px;
        border-radius: 20px;
        background-color: var(--color-background);
        transition: all 0.5s;
        overflow: hidden;
        .el-input__inner {
          margin-left: 5px;
        }
      }
      .el-input-number__decrease,
      .el-input-number__increase {
        background-color: transparent;
        transition:
          border 0.5s,
          color 0.2s;
      }
    }

    .control-textarea {
      .el-textarea__inner {
        padding: 10px 20px;
        border-radius: 20px;
        background-color: var(--color-background);
        transition:
          background-color 0.5s,
          box-shadow 0.5s;
      }
    }

    .form-box {
      max-width: 500px;
      margin: 0 auto;
    }
    .form-row {
      margin-bottom: 10px;
    }
  }
}
</style>
