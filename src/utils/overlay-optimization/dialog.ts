import { nextTick, watch, type Ref } from 'vue'

export const useDialogOptimization = (dependencies: {
  dialogVisible: Ref<boolean>
  overlayClass: string
  shouldHandleScroll?: boolean
}) => {
  const { dialogVisible, overlayClass } = dependencies
  // 控制滚动这款写的不好，还是别用了
  const shouldHandleScroll = (() => {
    if (dependencies.shouldHandleScroll !== undefined) {
      return dependencies.shouldHandleScroll
    } else {
      return false
    }
  })()

  // 对话框遮罩，显示时阻止背景滚动
  let overlayBox: HTMLElement | null = null
  let dialogBox: HTMLElement | null = null

  watch(dialogVisible, () => {
    if (dialogVisible.value) {
      enableOnDialogShow()
    } else {
      disableOnDialogClose()
    }
  })

  // 对话框打开时
  const enableOnDialogShow = async () => {
    await nextTick()
    // 获取对话框遮罩
    // overlayBox = document.querySelector(
    //   `.${overlayClass} .el-overlay-dialog .el-dialog`
    // ) as HTMLElement | null
    overlayBox = document.querySelector(
      `body`
      // `.${overlayClass}`
    ) as HTMLElement | null
    dialogBox = document.querySelector(
      `.${overlayClass} .el-overlay-dialog`
    ) as HTMLElement | null

    // 这行代码会在历史记录中插入一个状态，以防止返回到上一页面。
    window.history.pushState({ isDialogShow: true }, '', window.location.href)
    // 监听返回事件
    window.addEventListener('popstate', handleBackNavigation)

    // 在模态框显示时处理网页滚动
    if (shouldHandleScroll) {
      overlayBox?.addEventListener('wheel', handleWheelScroll, {
        passive: false
      })
      overlayBox?.addEventListener('touchstart', handleTouchStart, {
        passive: false
      })
      overlayBox?.addEventListener('touchmove', handleTouchMove, {
        passive: false
      })
    }
  }
  // 对话框关闭时，清理监听器与之前添加的历史状态
  const disableOnDialogClose = () => {
    window.removeEventListener('popstate', handleBackNavigation)
    if (shouldHandleScroll) {
      overlayBox?.removeEventListener('wheel', handleWheelScroll)
      overlayBox?.removeEventListener('touchstart', handleTouchStart)
      overlayBox?.removeEventListener('touchmove', handleTouchStart)
    }
    // 检查历史状态
    const currentState = window.history.state
    if (currentState && currentState.isDialogShow) {
      // 删除状态
      window.history.back() // 或者使用其他逻辑恢复到之前的状态
    }
  }

  // 返回事件操作
  const handleBackNavigation = () => {
    dialogVisible.value = false
  }
  // 处理滚动事件
  // 滚轮
  const handleWheelScroll = async (event: WheelEvent) => {
    // 禁用网页的滚动
    event.preventDefault()
    if (!dialogBox) {
      return
    }
    // 平滑滚动会有连续触发时的卡顿问题，只能硬滚动了
    dialogBox.scrollTop += event.deltaY * 0.3
  }

  // 触屏
  let startY = 0
  const handleTouchStart = (event: TouchEvent) => {
    startY = event.touches[0].clientY
  }
  const handleTouchMove = (event: TouchEvent) => {
    // 禁用网页的滚动
    event.preventDefault()
    if (!dialogBox) {
      return
    }
    const touch = event.touches[0]
    const deltaY = startY - touch.clientY
    dialogBox.scrollTop += deltaY
    startY = touch.clientY
  }
}
