<script setup lang="ts">
import type { IconMenuItem } from '@/types'
import {
  Lock,
  User,
  Picture,
  Connection,
  Tickets
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const menu: IconMenuItem[] = [
  {
    index: '/control',
    title: `系统设置`,
    icon: Lock,
    actionColor: 'primary',
    onClick() {
      router.push('/control')
    }
  },
  {
    index: '/profile',
    title: `个人信息`,
    icon: User,
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
        <div>
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

<style lang="scss" scoped></style>
