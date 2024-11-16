<script setup lang="ts">
import { profileUpdateAvatarApi } from '@/api'
import type AvatarSelector from '@/components/profile/AvatarSelector.vue'
import { profileConfig } from '@/config'
import { useProfileStore } from '@/stores'
import type { BackendProfileStore } from '@/types'
import { profileAvatarUrl, sakiMessage } from '@/utils'
import { onMounted, watch } from 'vue'
import { computed } from 'vue'
import { ref } from 'vue'

const profileStore = useProfileStore()

const selectedAvatar = ref<BackendProfileStore['avatarArray']>([])
const currentAvatar = computed(() => {
  if (selectedAvatar.value.length > 0) {
    return selectedAvatar.value[0]
  }
  return profileStore.avatarItem
})
const showAvatar = computed(() => {
  if (currentAvatar.value) {
    return profileAvatarUrl(currentAvatar.value)
  }
  return profileConfig.avatarDefault
})

const refAvatarSelector = ref<InstanceType<typeof AvatarSelector> | null>(null)

const initData = () => {
  if (profileStore.avatar === null) {
    return
  }
  refAvatarSelector.value?.selectImgById(profileStore.avatar)
}
onMounted(initData)
// profileStore 加载后，应初始化数据
watch(
  () => profileStore.isLoading,
  () => {
    if (profileStore.isLoading) {
      return
    }
    initData()
  }
)

const isSubmiting = ref(false)
const submit = async () => {
  if (currentAvatar.value === null) {
    return
  }
  isSubmiting.value = true
  try {
    const res = await profileUpdateAvatarApi(currentAvatar.value.uuid)
    // 更新store
    profileStore.loadProfileByRes(res.data.data)
    sakiMessage({
      type: 'success',
      message: '修改成功'
    })
  } finally {
    isSubmiting.value = false
  }
}
</script>
<template>
  <div class="avatar-update">
    <div class="control-row">
      <div class="control-lable">修改头像</div>
      <div class="avatar-box">
        <Transition name="fade-pop" mode="out-in">
          <el-avatar
            :size="100"
            :src="showAvatar"
            :key="showAvatar || 'null'"
          />
        </Transition>
      </div>
      <div class="button-box">
        <el-button
          @click="submit"
          :loading="isSubmiting"
          :disabled="currentAvatar === null"
          type="success"
          round
        >
          保存
        </el-button>
        <el-button @click="initData" type="info" round> 取消 </el-button>
      </div>
    </div>
    <div class="control-divider"></div>
    <div class="avatar-select-box">
      <AvatarSelector
        ref="refAvatarSelector"
        v-model="selectedAvatar"
      ></AvatarSelector>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../../styles/control.scss';

.avatar-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 18px;
  .el-avatar {
    background-color: transparent;
    user-select: none;
  }
}
.avatar-select-box {
  padding: 10px;
}

.button-box {
  margin-bottom: -8px;
}
</style>
