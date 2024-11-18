<script setup lang="ts">
import { onMounted } from 'vue'
import { getScrollbarWidth } from './utils'

// 等待加载数据（暂不需要），之后取消在 index.html 中的加载遮罩
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  indexMaskClose()
})

// 关闭加载遮罩，恢复滚动条，同时防止抖动
const indexMaskClose = async () => {
  const scrollbarWidth = getScrollbarWidth()
  const maskElement = document.getElementById('index-mask')
  document.documentElement.style.overflowY = ''
  if (maskElement) {
    maskElement.style.right = `-${scrollbarWidth}px`
    maskElement.style.opacity = '0'
    await new Promise((resolve) => setTimeout(resolve, 300))
    maskElement.style.display = 'none'
  }
}

// 取消 index.html 中的遮罩 #index-mask
// 延迟 有助于确保页面稳定显示
// 对于遮罩和加载条，可以设置不同的延时
// onMounted(async () => {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   const loadingElement = document.getElementById('index-loading')
//   if (loadingElement) {
//     loadingElement.style.opacity = '0'
//     await new Promise((resolve) => setTimeout(resolve, 500))
//     loadingElement.style.display = 'none'
//   }
// })
// onMounted(async () => {
//   await new Promise((resolve) => setTimeout(resolve, 1000))
//   const maskElement = document.getElementById('index-mask')
//   if (maskElement) {
//     maskElement.style.opacity = '0'
//     await new Promise((resolve) => setTimeout(resolve, 500))
//     maskElement.style.display = 'none'
//   }
// })
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
