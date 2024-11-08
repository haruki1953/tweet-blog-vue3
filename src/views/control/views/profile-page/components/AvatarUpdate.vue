<script setup lang="ts">
import userAvatar from '@/assets/haruki.jpg'
import { sakiMessage } from '@/utils'
import { ref } from 'vue'

const initData = () => {
  // name.value = profileStore.name
  // bio.value = profileStore.bio
}

const isSubmiting = ref(false)
const submit = async () => {
  isSubmiting.value = true
  try {
    // const res = await profileUpdateNameBioApi({
    //   name: name.value,
    //   bio: bio.value
    // })
    // // 更新store
    // profileStore.loadProfileByRes(res.data.data)
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
        <el-avatar :size="100" :src="userAvatar" />
      </div>
      <div class="button-box">
        <el-button @click="submit" :loading="isSubmiting" type="success" round>
          保存
        </el-button>
        <el-button @click="initData" type="info" round> 取消 </el-button>
      </div>
    </div>
    <div class="control-divider"></div>
    <div class="avatar-select-box">
      <AvatarSelector></AvatarSelector>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
.avatar-select-box {
  padding: 10px;
}
</style>
