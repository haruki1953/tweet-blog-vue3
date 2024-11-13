<script setup lang="ts">
import { contactInfo } from '@/config'
import { useProfileStore } from '@/stores'
import type { BackendProfileStore } from '@/types'
import { sakiMessage } from '@/utils'
import { Link, Plus } from '@element-plus/icons-vue'
import type { Ref } from 'vue'
import { computed } from 'vue'
import { ref, watch } from 'vue'

const profileStore = useProfileStore()

const socialMediasInfo = ref<BackendProfileStore['socialMedias']>([])

const mode = ref<'edit' | 'add' | 'none'>('edit')
const selected = ref<string>('')

const selectedFaClass = ref<string[]>([])
const faClass = computed(() => {
  if (selectedFaClass.value.length === 0) {
    return 'fa-brands fa-chrome'
  }
  return selectedFaClass.value[0]
})
const description = ref('')
const link = ref('')

const initData = () => {
  socialMediasInfo.value = profileStore.socialMedias
}
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
  isSubmiting.value = true
  try {
    // const res = await profileUpdateAvatarApi(currentAvatar.value.uuid)
    // 更新store
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
  <div class="social-medias">
    <div class="control-row social-medias-row">
      <div class="control-lable">修改社交媒体信息</div>
      <div class="social-medias-group">
        <TransitionGroup name="fade-slide-list">
          <div
            class="social-medias-item"
            v-for="(item, key) in contactInfo"
            :key="key"
          >
            <el-icon :class="item.fontawesomeClass" size="25"></el-icon>
          </div>
          <div class="social-medias-add" key="social-medias-add">
            <el-icon class="icon"><Plus /></el-icon>
          </div>
        </TransitionGroup>
      </div>
      <div class="button-box save">
        <el-button @click="submit" :loading="isSubmiting" type="success" round>
          保存
        </el-button>
        <el-button @click="initData" type="info" round> 取消 </el-button>
      </div>
    </div>
    <div class="control-divider"></div>
    <div class="control-row info-edit-row">
      <div class="form-box">
        <div class="form-row">
          <el-row :gutter="10">
            <el-col :span="6">
              <div class="form-fa-brand">
                <Transition name="fade-pop" mode="out-in">
                  <el-icon :class="faClass" size="40" :key="faClass"></el-icon>
                </Transition>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="input-lable">描述</div>
              <el-input
                v-model="description"
                placeholder="将会悬停提示"
                size="large"
                class="control-input"
              ></el-input>
            </el-col>
          </el-row>
        </div>
        <div class="form-row">
          <div class="input-lable">链接</div>
          <el-input
            v-model="link"
            :prefix-icon="Link"
            placeholder="链接"
            size="large"
            class="control-input"
          ></el-input>
        </div>
      </div>
      <div class="button-box edit" v-if="mode === 'edit'">
        <el-button
          @click="submit"
          :loading="isSubmiting"
          type="warning"
          round
          size="small"
        >
          修改
        </el-button>
        <el-button @click="initData" type="danger" round size="small">
          移除
        </el-button>
        <el-button @click="initData" type="info" round size="small">
          取消
        </el-button>
      </div>
      <div class="button-box add" v-else>
        <el-button
          @click="submit"
          :loading="isSubmiting"
          type="primary"
          round
          size="small"
        >
          添加
        </el-button>
        <el-button @click="initData" type="info" round size="small">
          取消
        </el-button>
      </div>
    </div>
    <div class="control-divider"></div>
    <div class="social-medias-select-box">
      <SocialMediasSelector v-model="selectedFaClass"></SocialMediasSelector>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '../../../styles/control.scss';

.form-fa-brand {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-box {
  margin-bottom: -8px;
  &.add,
  &.edit {
    margin-top: 18px;
  }
}

.info-edit-row {
  padding-top: 25px;
}

.social-medias-select-box {
  padding: 10px;
}

.social-medias-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 18px;
}
.social-medias-item {
  margin: 3px;
  padding: 8px;
  border-radius: 10px;
  transition:
    background-color 0.5s,
    color 0.2s,
    transform 0.2s;
  cursor: pointer;
  &:hover {
    background-color: var(--color-background-mute);
    transform: scale(1.1, 1.1);
  }
  &.selected {
    background-color: var(--el-color-primary-light-7);
  }
  .el-icon {
    display: flex;
  }
}
.social-medias-add {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 41px;
  height: 41px;
  margin: 3px;
  border: 2px dashed var(--el-border-color);
  border-radius: 10px;
  cursor: pointer;
  transition:
    border var(--el-transition-duration),
    background-color 0.5s,
    transform 0.2s;
  &:hover {
    background-color: var(--color-background-mute);
    transform: scale(1.05, 1.05);
  }
  &.selected {
    border-color: var(--el-color-primary);
  }
  .el-icon {
    color: #8c939d;
  }
}
</style>
