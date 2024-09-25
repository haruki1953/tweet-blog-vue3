<script setup lang="ts">
import type { Image } from '@/types'
import { imgLargeUrl, imgSamllUrl } from '@/utils'
import { computed } from 'vue'
import { nextTick } from 'vue'
import { ref, type ComponentPublicInstance } from 'vue'

const imgIndex = defineModel<number>('index')

const props = withDefaults(
  defineProps<{
    data: Image[]
    backgroundColor?: '' | 'soft'
    notPreview?: boolean
    mini?: boolean
    aspectRatio169?: boolean
  }>(),
  {
    backgroundColor: '',
    notPreview: false,
    mini: false,
    aspectRatio169: false
  }
)

const img1 = ref<ComponentPublicInstance | null>(null)

const img1Load = async () => {
  await nextTick()
  if (!img1.value) return
  const imgEl = img1.value.$el as HTMLElement

  // width / height
  const maxRatio = 4 / 5
  const minRatio = 4 / 1
  const normalRatio = 16 / 9

  const width = imgEl.offsetWidth
  const height = imgEl.offsetHeight

  const maxHeight = width / maxRatio
  const minHeight = width / minRatio
  const normalHeight = width / normalRatio

  if (props.aspectRatio169) {
    imgEl.style.setProperty('aspect-ratio', '16 / 9')
  } else if (props.mini) {
    if (height > normalHeight) {
      imgEl.style.setProperty('aspect-ratio', '16 / 9')
    } else if (height < minHeight) {
      imgEl.style.setProperty('aspect-ratio', '4 / 1')
    }
  } else {
    if (height > maxHeight) {
      imgEl.style.setProperty('aspect-ratio', '4 / 5')
    } else if (height < minHeight) {
      imgEl.style.setProperty('aspect-ratio', '4 / 1')
    }
  }
}

const imgSmallList = computed(() => {
  return props.data.map((i) => {
    return imgSamllUrl(i)
  })
})

const imgLargeList = computed(() => {
  return props.data.map((i) => {
    return imgLargeUrl(i)
  })
})

const isIndex = (num: number) => {
  if (num === imgIndex.value) {
    return true
  } else {
    return false
  }
}

const previewSrcList = computed(() => {
  if (props.notPreview) {
    return undefined
  } else {
    return imgLargeList.value
  }
})

const onImgClick = (num: number) => {
  if (imgIndex.value === undefined) {
    return
  }
  imgIndex.value = num
}

// 解决图片预览不能通过手机返回键退出的问题
// 关闭按钮
let viewerCloseBtn: HTMLElement | null = null
// 预览时阻止背景滚动
// 预览遮罩，在其之上滑动控制缩放
let viewerWrapperMask: HTMLElement | null = null
// 预览图片，在其之上滑动控制位移
let viewerImageList: HTMLElement[] = []

// 预览打开时
const onViewerShow = async () => {
  await nextTick()
  // 获取返回按钮
  viewerCloseBtn = document.querySelector(
    '.el-image-viewer__btn.el-image-viewer__close'
  ) as HTMLElement | null
  console.log('获取返回按钮', viewerCloseBtn)
  // 获取遮罩
  viewerWrapperMask = document.querySelector(
    '.el-image-viewer__wrapper'
  ) as HTMLElement | null
  // 获取图片
  viewerImageList = Array.from(
    document.querySelectorAll('.el-image-viewer__img')
  )

  // 这行代码会在历史记录中插入一个状态，以防止返回到上一页面。
  window.history.pushState({ isPreview: true }, '', window.location.href)
  // 监听返回事件
  window.addEventListener('popstate', handleBackNavigation)

  // 在模态框显示时禁用滚动
  viewerWrapperMask?.addEventListener('wheel', preventScroll)
  viewerWrapperMask?.addEventListener('touchmove', preventScroll)

  // 遮罩添加触摸事件监听器
  viewerWrapperMask?.addEventListener('touchstart', touchMaskStartHandler)
  viewerWrapperMask?.addEventListener('touchmove', touchMaskMoveHandler)
  viewerWrapperMask?.addEventListener('touchend', touchMaskEndHandler)

  // 为所有图片绑定触摸事件
  viewerImageList.forEach((image) => {
    image.addEventListener('touchstart', touchImageStartHandler)
    image.addEventListener('touchmove', touchImageMoveHandler)
    image.addEventListener('touchend', touchImageEndHandler)
  })
}

// 预览关闭时清理监听器与之前添加的历史状态
const onViewerClose = () => {
  window.removeEventListener('popstate', handleBackNavigation)
  viewerWrapperMask?.removeEventListener('wheel', preventScroll)
  viewerWrapperMask?.removeEventListener('touchmove', preventScroll)
  viewerWrapperMask?.removeEventListener('touchstart', touchMaskStartHandler)
  viewerWrapperMask?.removeEventListener('touchmove', touchMaskMoveHandler)
  viewerWrapperMask?.removeEventListener('touchend', touchMaskEndHandler)
  viewerImageList.forEach((image) => {
    image.removeEventListener('touchstart', touchImageStartHandler)
    image.removeEventListener('touchmove', touchImageMoveHandler)
    image.removeEventListener('touchend', touchImageEndHandler)
  })
  // 检查历史状态
  const currentState = window.history.state
  if (currentState && currentState.isPreview) {
    // 删除预览状态
    window.history.back() // 或者使用其他逻辑恢复到之前的状态
  }
}
// 返回事件操作
const handleBackNavigation = () => {
  console.log('返回事件操作', viewerCloseBtn)
  viewerCloseBtn?.click()
}
// 阻止滚动事件
const preventScroll = (event: Event) => {
  // 这个是禁用网页的滚动
  event.preventDefault()
  // 这个会禁用自己的滚动缩放，保留比较好
  // event.stopPropagation()
}

// 触屏缩放移动实现（转为鼠标事件）
// el-image的图片预览，是遮罩负责缩放，其中的图片负责接收鼠标点击移动事件
// 缩放灵敏度，增大迟钝，减小灵敏
const sensitivity = 25
// 最后触摸距离
let lastTouchDistance = 0
// 触摸距离变化
let changeTouchDistance = 0

// 查找当前可见的图片
const getVisibleImage = (): HTMLElement | undefined => {
  return viewerImageList.find((image) => image.style.display !== 'none')
}

// 处理遮罩的触摸事件
const touchMaskStartHandler = (event: TouchEvent) => {
  if (event.touches.length === 2) {
    const dx = event.touches[0].clientX - event.touches[1].clientX
    const dy = event.touches[0].clientY - event.touches[1].clientY
    lastTouchDistance = Math.sqrt(dx * dx + dy * dy)
  }
}
const touchMaskMoveHandler = (event: TouchEvent) => {
  if (event.touches.length === 2) {
    const dx = event.touches[0].clientX - event.touches[1].clientX
    const dy = event.touches[0].clientY - event.touches[1].clientY
    const currentTouchDistance = Math.sqrt(dx * dx + dy * dy)
    changeTouchDistance += lastTouchDistance - currentTouchDistance

    if (Math.abs(changeTouchDistance) > sensitivity) {
      const mouseWheelEvent = new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        deltaY: Math.sign(changeTouchDistance) * 120
      })
      viewerWrapperMask?.dispatchEvent(mouseWheelEvent)
      changeTouchDistance = 0
    }
    lastTouchDistance = currentTouchDistance
  }
}
const touchMaskEndHandler = () => {
  lastTouchDistance = 0
  changeTouchDistance = 0
}

// 处理图片的触摸事件
const touchImageStartHandler = (event: TouchEvent) => {
  if (event.touches.length === 1) {
    const visibleImage = getVisibleImage()
    if (visibleImage) {
      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY
      })
      visibleImage.dispatchEvent(mouseDownEvent)
    }
  }
}
const touchImageMoveHandler = (event: TouchEvent) => {
  if (event.touches.length === 1) {
    const visibleImage = getVisibleImage()
    if (visibleImage) {
      const mouseMoveEvent = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY
      })
      visibleImage.dispatchEvent(mouseMoveEvent)
    }
  }
}
const touchImageEndHandler = () => {
  const visibleImage = getVisibleImage()
  if (visibleImage) {
    const mouseUpEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true
    })
    visibleImage.dispatchEvent(mouseUpEvent)
  }
}
</script>
<template>
  <div
    class="image-group"
    :class="{ 'img-background-soft': backgroundColor === 'soft' }"
    v-if="data.length > 0"
  >
    <el-row v-if="data.length === 1">
      <el-col :span="24">
        <el-image
          class="post-img img1-1"
          fit="cover"
          ref="img1"
          @load="img1Load"
          :key="imgSmallList[0]"
          :src="imgSmallList[0]"
          :alt="data[0].alt"
          @click="onImgClick(0)"
          :initial-index="0"
          :preview-src-list="previewSrcList"
          hide-on-click-modal
          @close="onViewerClose"
          @show="onViewerShow"
          preview-teleported
        ></el-image>
      </el-col>
    </el-row>

    <el-row v-else-if="data.length === 2">
      <el-col :span="12">
        <el-image
          class="post-img img2-1"
          fit="cover"
          :src="imgSmallList[0]"
          :alt="data[0].alt"
          @click="onImgClick(0)"
          :class="{ 'is-index': isIndex(0) }"
          :initial-index="0"
          :preview-src-list="previewSrcList"
          hide-on-click-modal
          @close="onViewerClose"
          @show="onViewerShow"
          preview-teleported
        ></el-image>
      </el-col>
      <el-col :span="12">
        <el-image
          class="post-img img2-2"
          fit="cover"
          :src="imgSmallList[1]"
          :alt="data[1].alt"
          @click="onImgClick(1)"
          :class="{ 'is-index': isIndex(1) }"
          :initial-index="1"
          :preview-src-list="previewSrcList"
          hide-on-click-modal
          @close="onViewerClose"
          @show="onViewerShow"
          preview-teleported
        ></el-image>
      </el-col>
    </el-row>

    <el-row v-else-if="data.length === 3">
      <el-col :span="12">
        <el-image
          class="post-img img3-1"
          fit="cover"
          :src="imgSmallList[0]"
          :alt="data[0].alt"
          @click="onImgClick(0)"
          :class="{ 'is-index': isIndex(0) }"
          :initial-index="0"
          :preview-src-list="previewSrcList"
          hide-on-click-modal
          @close="onViewerClose"
          @show="onViewerShow"
          preview-teleported
        ></el-image>
      </el-col>
      <el-col :span="12">
        <el-image
          class="post-img img3-2"
          fit="cover"
          :src="imgSmallList[1]"
          :alt="data[1].alt"
          @click="onImgClick(1)"
          :class="{ 'is-index': isIndex(1) }"
          :initial-index="1"
          :preview-src-list="previewSrcList"
          hide-on-click-modal
          @close="onViewerClose"
          @show="onViewerShow"
          preview-teleported
        ></el-image>
        <el-image
          class="post-img img3-3"
          fit="cover"
          :src="imgSmallList[2]"
          :alt="data[2].alt"
          @click="onImgClick(2)"
          :class="{ 'is-index': isIndex(2) }"
          :initial-index="2"
          :preview-src-list="previewSrcList"
          hide-on-click-modal
          @close="onViewerClose"
          @show="onViewerShow"
          preview-teleported
        ></el-image>
      </el-col>
    </el-row>

    <el-row v-else>
      <el-col :span="12">
        <el-image
          class="post-img img4-1"
          fit="cover"
          :src="imgSmallList[0]"
          :alt="data[0].alt"
          @click="onImgClick(0)"
          :class="{ 'is-index': isIndex(0) }"
          :initial-index="0"
          :preview-src-list="previewSrcList"
          hide-on-click-modal
          @close="onViewerClose"
          @show="onViewerShow"
          preview-teleported
        ></el-image>
        <el-image
          class="post-img img4-3"
          fit="cover"
          :src="imgSmallList[2]"
          :alt="data[2].alt"
          @click="onImgClick(2)"
          :class="{ 'is-index': isIndex(2) }"
          :initial-index="2"
          :preview-src-list="previewSrcList"
          hide-on-click-modal
          @close="onViewerClose"
          @show="onViewerShow"
          preview-teleported
        ></el-image>
      </el-col>
      <el-col :span="12">
        <el-image
          class="post-img img4-2"
          fit="cover"
          :src="imgSmallList[1]"
          :alt="data[1].alt"
          @click="onImgClick(1)"
          :class="{ 'is-index': isIndex(1) }"
          :initial-index="1"
          :preview-src-list="previewSrcList"
          hide-on-click-modal
          @close="onViewerClose"
          @show="onViewerShow"
          preview-teleported
        ></el-image>
        <el-image
          class="post-img img4-4"
          fit="cover"
          :src="imgSmallList[3]"
          :alt="data[3].alt"
          @click="onImgClick(3)"
          :class="{ 'is-index': isIndex(3) }"
          :initial-index="3"
          :preview-src-list="previewSrcList"
          hide-on-click-modal
          @close="onViewerClose"
          @show="onViewerShow"
          preview-teleported
        ></el-image>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.post-img {
  display: block;
  width: 100%;
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 20px;
  aspect-ratio: var(--aspect-ratio-val);
  border-radius: var(--border-radius-val);
  border: 1px solid var(--color-background);
  transition: border 0.5s;
  user-select: none;
  :deep() {
    .el-image__inner.is-loading {
      width: 100%;
      aspect-ratio: var(--aspect-ratio-val);
    }
    .el-image__placeholder,
    .el-image__error {
      position: static;
      width: 100%;
      border-radius: var(--border-radius-val);
      aspect-ratio: var(--aspect-ratio-val);
      transition: background-color 0.5s;
      background-color: var(--color-background);
    }
  }
  &.is-index::before {
    content: '';
    border-radius: var(--border-radius-val);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow:
      0 0 3px 3px var(--el-color-primary),
      0 0 3px 3px var(--el-color-primary) inset;
    pointer-events: none; /* 让阴影不影响鼠标交互 */
    z-index: 1; /* 将阴影置于图片上方 */
  }
}
.img-background-soft .post-img {
  :deep() {
    .el-image__placeholder,
    .el-image__error {
      background-color: var(--color-background-soft);
    }
  }
}

.img1-1 {
  aspect-ratio: unset;
}
.img2-1 {
  --aspect-ratio-val: 8 / 9;
  --border-radius-val: 20px 0 0 20px;
}
.img2-2 {
  --aspect-ratio-val: 8 / 9;
  --border-radius-val: 0 20px 20px 0;
}
.img3-1 {
  --aspect-ratio-val: 8 / 9;
  --border-radius-val: 20px 0 0 20px;
}
.img3-2 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 20px 0 0;
}
.img3-3 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 0 20px 0;
}
.img4-1 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 20px 0 0 0;
}
.img4-2 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 20px 0 0;
}
.img4-3 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 0 0 20px;
}
.img4-4 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 0 20px 0;
}
</style>
