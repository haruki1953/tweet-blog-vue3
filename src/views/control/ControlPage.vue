<script setup lang="ts">
import type { IconMenuItem } from '@/types'
import {
  User,
  Postcard,
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
  <div class="control-page">
    <DataContainerMountedMask>
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
    </DataContainerMountedMask>
  </div>
</template>

<style lang="scss" scoped></style>
