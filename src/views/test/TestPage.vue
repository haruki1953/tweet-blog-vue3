<script setup lang="ts">
import { HomeFilled, PictureFilled } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'

const menu = ref([
  {
    index: '/',
    title: '首页首页首页首页',
    icon: HomeFilled
  },
  {
    index: '/album',
    title: '相册',
    icon: PictureFilled
  }
])

// 模拟 sleep 函数，等待一定时间
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
let count = 0
const addMenuItemPeriodically = async () => {
  // eslint-disable-next-line no-constant-condition
  while (1) {
    await sleep(3000) // 等待3秒
    menu.value.push({
      index: String(count),
      title: String(count),
      icon: PictureFilled
    })
    count++
    console.log('Added new item to menu:', menu.value)
  }
}

onMounted(() => {
  // 开始无限循环，定时添加item
  addMenuItemPeriodically()
})
</script>
<template>
  <div>
    <IconMenuBox :menu="menu"></IconMenuBox>
  </div>
</template>

<style lang="scss" scoped></style>
