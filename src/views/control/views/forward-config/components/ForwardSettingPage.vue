<script setup lang="ts">
import { appInfo, platformKeyMap } from '@/config'
import { useForwardStore } from '@/stores/forward'
import type { ForwardSettingItemInForm } from '@/types'
import { cloneDeep } from 'lodash'
import { watch } from 'vue'
import { computed } from 'vue'
import { ref } from 'vue'

const forwardStore = useForwardStore()

// Store中的数据，也就是请求的数据
const forwardSettingListInStore = computed(
  () => forwardStore.forwardSettingList
)
// 表单中的数据，需要进行处理
const forwardSettingListInForm = ref<ForwardSettingItemInForm[]>([])

const initData = () => {
  const tempList = cloneDeep(forwardSettingListInStore.value)
  forwardSettingListInForm.value = tempList.map((item) => {
    // 将data中的数据设为空字符串
    for (const key in item.data) {
      ;(item.data as Record<string, string>)[key] = ''
    }
    // 添加 isDeleted: false
    return {
      ...item,
      isDeleted: false
    }
  })
}
initData()

// forwardStore 加载后，应初始化数据
watch(
  () => forwardStore.isLoading,
  () => {
    if (forwardStore.isLoading) {
      return
    }
    initData()
  }
)

const isSubmiting = ref(false)
const submit = async () => {
  isSubmiting.value = true
  try {
    // const res = await postControlImportApi({
    //   importPosts: model.value
    // })
    // taskStore.pollLoadByData(res.data.data)
    // sakiMessage({
    //   type: 'success',
    //   message: '正在导入'
    // })
  } finally {
    isSubmiting.value = false
  }
}
</script>
<template>
  <div class="forward-setting-page">
    <div class="title-save">
      <div class="control-box">
        <div class="control-row">
          <div class="control-lable-with-link">
            <div class="lable">转发配置</div>
            <a
              class="link"
              :href="appInfo.forwardSettingDocs.link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ appInfo.forwardSettingDocs.text }}
            </a>
          </div>
          <div class="button-box">
            <el-button
              @click="submit"
              :loading="isSubmiting"
              type="primary"
              round
            >
              保存
            </el-button>
            <el-button @click="initData" type="info" round> 取消 </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="forward-list"></div>
  </div>
</template>

<style lang="scss" scoped></style>
