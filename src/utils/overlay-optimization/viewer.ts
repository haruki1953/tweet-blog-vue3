import { computed, nextTick, onUnmounted, ref, type ComputedRef } from 'vue'
import {
  optimizationScrollOnOverlayClose,
  optimizationScrollOnOverlayShow
} from './base'
import type { Image } from '@/types'
import { imgLargeUrl, imgSamllUrl } from '../data-handle'
import axios from 'axios'
import { axiosConfig } from '@/config'

const imageLoadedInfos = ref<
  {
    imageId: number
    isLoaded: boolean
  }[]
>([])

export const useImageViewerOptimization = (dependencies: {
  images: ComputedRef<Image[]>
}) => {
  const { images } = dependencies

  // 片预览优化，先显示小图，大图加载完毕再显示
  const previewSrcList = computed(() => {
    return images.value.map((img) => {
      const findImageLoadedInfo = imageLoadedInfos.value.find(
        (info) => info.imageId === img.id
      )
      if (findImageLoadedInfo?.isLoaded) {
        return imgLargeUrl(img)
      } else {
        return imgSamllUrl(img)
      }
    })
  })
  // 在预览打开时加载大图
  const loadImageOnViewerShow = async () => {
    const promiseList = images.value.map(async (img) => {
      const findImageLoadedInfo = imageLoadedInfos.value.find(
        (info) => info.imageId === img.id
      )
      // 未加载（findImageLoadedInfo===undefined）
      // 加载中（isLoaded===false）
      // 已加载（isLoaded===true）
      // 已加载或加载中直接返回
      if (findImageLoadedInfo) {
        return
      }
      // 未加载，进行加载
      const newLength = imageLoadedInfos.value.push({
        imageId: img.id,
        isLoaded: false
      })
      const loadingImageIndex = newLength - 1
      await axios
        .get(imgLargeUrl(img), { timeout: axiosConfig.timeout })
        .catch(() => {})
      imageLoadedInfos.value[loadingImageIndex].isLoaded = true
    })
    await Promise.all(promiseList)
  }

  const isViewing = ref(false)

  // 解决图片预览不能通过手机返回键退出的问题
  // 关闭按钮
  let viewerCloseBtn: HTMLElement | null = null

  // 预览时阻止背景滚动
  // 预览遮罩，在其之上滑动控制缩放
  let viewerWrapperMask: HTMLElement | null = null
  // 预览图片，在其之上滑动控制位移
  let viewerImageList: HTMLElement[] = []

  // 预览打开时
  const enableOnViewerShow = async () => {
    isViewing.value = true
    // 禁用滚动，同时防止抖动
    optimizationScrollOnOverlayShow()

    // 加载大图
    loadImageOnViewerShow()

    // 控制返回，以及触屏控制
    await nextTick()
    // 获取返回按钮
    viewerCloseBtn = document.querySelector(
      '.el-image-viewer__btn.el-image-viewer__close'
    ) as HTMLElement | null
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

    // 遮罩添加触摸事件监听器
    viewerWrapperMask?.addEventListener('touchstart', touchMaskStartHandler)
    viewerWrapperMask?.addEventListener('touchmove', touchMaskMoveHandler, {
      passive: true
    })
    viewerWrapperMask?.addEventListener('touchend', touchMaskEndHandler)

    // 为所有图片绑定触摸事件
    viewerImageList.forEach((image) => {
      image.addEventListener('touchstart', touchImageStartHandler)
      image.addEventListener('touchmove', touchImageMoveHandler, {
        passive: true
      })
      image.addEventListener('touchend', touchImageEndHandler)
    })
  }

  // 预览关闭时清理监听器与之前添加的历史状态
  const disableOnViewerClose = () => {
    isViewing.value = false
    // 恢复滚动，同时防止抖动
    optimizationScrollOnOverlayClose()

    window.removeEventListener('popstate', handleBackNavigation)
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
  onUnmounted(() => {
    // 防止在预览打开时跳转至其他页面，导致滚动锁死
    if (isViewing.value) {
      disableOnViewerClose()
    }
  })

  // 返回事件操作
  const handleBackNavigation = () => {
    viewerCloseBtn?.click()
  }

  // 触屏缩放移动实现（转为鼠标事件）
  // el-image的图片预览无法通过触屏来控制
  // el-image是遮罩负责滚轮缩放，其中的图片负责接收鼠标点击移动事件
  // 缩放灵敏度，增大迟钝，减小灵敏（当触摸距离变化超过此值时进行缩放）
  const sensitivity = 25
  // 最后触摸距离（双指距离）
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

  return {
    enableOnViewerShow,
    disableOnViewerClose,
    previewSrcList
  }
}
