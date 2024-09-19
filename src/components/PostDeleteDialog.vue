<script setup lang="ts">
import { computed } from 'vue'
import { ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import type { PostData } from '@/types'
import { postDeleteApi } from '@/api'
import { useImageStore, usePostStore } from '@/stores'
import { sakiMessage } from '@/utils'

const modelIsDeleteEverlasting = defineModel<boolean>('isDeleteEverlasting', {
  required: true
})
const props = defineProps<{
  data: PostData
}>()

const dialogVisible = ref(false)

const windowSize = useWindowSize()
const dialogWidth = computed(() => {
  const width = 400
  const windowWidth = windowSize.width.value
  return windowWidth * 0.9 < width ? '90%' : width
})

const open = () => {
  dialogVisible.value = true
}
const close = () => {
  dialogVisible.value = false
}

defineExpose({
  open,
  close
})

const imageStore = useImageStore()
const postStore = usePostStore()

const isDeleteRelatedImage = ref(false)

const deletePost = async () => {
  close()
  modelIsDeleteEverlasting.value = true
  try {
    // TODO 帖子永久删除对话框，可选是否删除图片
    const res = await postDeleteApi(props.data.id, {
      delateImage: isDeleteRelatedImage.value ? 'true' : 'false'
    })
    sakiMessage({
      type: 'success',
      message: '推文已永久删除'
    })
    postStore.updatePostListToRemove(props.data.id)
    if (res.data.data.deletedImages.find((i) => i != null)) {
      imageStore.setNeedReget()
    }
  } finally {
    modelIsDeleteEverlasting.value = false
  }
}
</script>
<template>
  <div class="post-delete-dialog">
    <el-dialog
      v-model="dialogVisible"
      :width="dialogWidth"
      :lock-scroll="false"
    >
      <div class="row center-box">
        <div class="lable">确认要永久删除此推文吗？</div>
        <div class="input-box">
          <el-checkbox
            v-model="isDeleteRelatedImage"
            label="删除推文图片"
            size="small"
          />
        </div>
      </div>
      <PostCard :data="data" mini></PostCard>
      <div class="button-box">
        <el-button round type="danger" size="small" @click="deletePost">
          删 除
        </el-button>
        <el-button round type="info" size="small" @click="close">
          取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.row {
  margin-bottom: 10px;
  .lable {
    margin-bottom: 4px;
    font-size: 12px;
    color: var(--color-text-soft);
  }
}

.center-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.button-box {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
