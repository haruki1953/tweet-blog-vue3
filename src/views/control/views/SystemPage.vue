<script setup lang="ts">
import { authRules } from '@/config'
import type { ElForm } from 'element-plus'
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { adminUpdateAuthApi } from '@/api'
import { sakiMessage } from '@/utils'

const formModel = ref({
  username: '',
  password: ''
})

const refElForm = ref<InstanceType<typeof ElForm> | null>(null)

const rules = authRules

const resetAuth = () => {
  refElForm.value?.resetFields()
}

const isSubmitingAuth = ref(false)
const submitAuth = async () => {
  // 预校验
  await refElForm.value?.validate()

  isSubmitingAuth.value = true
  try {
    // 调用修改密码的接口
    await adminUpdateAuthApi(formModel.value)
    sakiMessage({
      type: 'success',
      message: '修改成功'
    })
  } finally {
    isSubmitingAuth.value = false
    resetAuth()
  }
}
</script>
<template>
  <div class="system-page">
    <div class="control-box">
      <div class="control-row">
        <div class="control-lable">修改账号密码</div>
        <div class="form-box">
          <el-form
            :model="formModel"
            :rules="rules"
            ref="refElForm"
            size="large"
            autocomplete="off"
          >
            <el-form-item prop="username">
              <!-- <div class="input-lable">用户名</div> -->
              <el-input
                v-model="formModel.username"
                :prefix-icon="User"
                placeholder="请输入用户名"
                name="username"
                size="large"
                class="input"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <!-- <div class="input-lable">密码</div> -->
              <el-input
                v-model="formModel.password"
                :prefix-icon="Lock"
                placeholder="请输入密码"
                name="password"
                size="large"
                class="input"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="button-box auth-button-box">
          <el-button
            @click="submitAuth"
            :loading="isSubmitingAuth"
            type="success"
            round
          >
            保存
          </el-button>
          <el-button @click="resetAuth" type="info" round> 取消 </el-button>
        </div>
      </div>
      <div class="control-divider"></div>
      <div class="control-row t2"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button-box {
  display: flex;
  justify-content: right;
  align-items: center;
}

.control-box {
  background-color: var(--color-background-soft);
  transition: background-color 0.5s;
  border-radius: 20px;
}
.control-row {
  padding: 15px 20px;
}
.control-lable {
  font-size: 14px;
  font-weight: bold;
  color: var(--color-text-soft);
  margin: 0 0 15px 10px;
}
.control-divider {
  height: 2px;
  background-color: var(--color-background);
  transition: background-color 0.5s;
}

.input-lable {
  font-size: 12px;
  line-height: 12px;
  color: var(--color-text-soft);
  margin: 0 0 2px 25px;
}

.input {
  display: flex;
  :deep() {
    .el-input__wrapper {
      padding: 1px 20px;
      border-radius: 20px;
      // border: 2px solid var(--color-background);
      background-color: var(--color-background);
      transition: all 0.5s;
      // box-shadow: none;
      &:hover {
        // box-shadow: none;
      }
      .el-input__inner {
        // color: var(--color-text);
        margin-left: 5px;
      }
    }
  }
}

.el-button {
}
</style>
