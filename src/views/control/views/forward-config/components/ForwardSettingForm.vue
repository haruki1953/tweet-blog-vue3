<script setup lang="ts">
import type CompleteMessageContainer from '@/components/layout/CompleteMessageContainer.vue'
import {
  platformKeyEnum,
  platformKeyMap,
  type PlatformKeyEnumValues
} from '@/config'
import type { ForwardSettingItem, ForwardSettingItemInForm } from '@/types'
import {
  Aim,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Key,
  User
} from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash'
import { computed } from 'vue'
import { ref } from 'vue'
import type { UseForwardSettingListInFormControl } from './dependencies'

// const model = defineModel<ForwardSettingItemInForm>({ required: true })
const props = defineProps<{
  itemInForm: ForwardSettingItemInForm
  itemInStore?: ForwardSettingItem
  useForwardSettingListInFormControl: UseForwardSettingListInFormControl
  toggleEdit: () => void
}>()

// 表单中的数据
const item = ref(cloneDeep(props.itemInForm))

// 将可选的值赋值到data
const assigningValuesToData = (
  data: typeof dataDefault,
  value?: Partial<typeof dataDefault> | '' | null | undefined
) => {
  for (const key in data) {
    if (value && (value as any)[key]) {
      ;(data as any)[key] = (value as any)[key]
    } else {
      ;(data as any)[key] = ''
    }
  }
}
// 默认数据，为空字符串
const dataDefault = {
  ...props.itemInForm.data
}
assigningValuesToData(dataDefault)

// 令牌数据的 placeholder，默认显示itemInStore中的数据
const dataPlaceholder = computed(() => {
  const dataValueTemp = {
    ...dataDefault
  }
  // 一旦有值被输入，则都显示为空
  for (const key in item.value.data) {
    if ((item.value.data as any)[key] !== '') {
      return dataValueTemp
    }
  }
  // 未输入时，显示store中的数据
  assigningValuesToData(dataValueTemp, props.itemInStore?.data)
  return dataValueTemp
})

const initData = () => {
  item.value = cloneDeep(props.itemInForm)
}
initData()

const closeSetting = () => {
  props.toggleEdit()
}

const forwardSettingListInFormControl =
  props.useForwardSettingListInFormControl()

const updateSetting = () => {
  // model.value = item.value
  forwardSettingListInFormControl.updateSetting(item.value)
  refCompleteMessageContainer.value?.success()
  // await new Promise((resolve) => setTimeout(resolve, 300))
}

const deleteSetting = () => {
  item.value.isDeleted = true
  updateSetting()
}

const restoreSetting = () => {
  item.value.isDeleted = false
  updateSetting()
}

const couldUp = computed(() => {
  const couldIndex = forwardSettingListInFormControl.couldMoveSetting(
    item.value.uuid,
    'up'
  )
  return couldIndex.couldMove
})
const couldDown = computed(() => {
  const couldIndex = forwardSettingListInFormControl.couldMoveSetting(
    item.value.uuid,
    'down'
  )
  return couldIndex.couldMove
})
const moveUp = () => {
  forwardSettingListInFormControl.moveSetting(item.value.uuid, 'up')
}
const moveDown = () => {
  forwardSettingListInFormControl.moveSetting(item.value.uuid, 'down')
}

const refCompleteMessageContainer = ref<InstanceType<
  typeof CompleteMessageContainer
> | null>(null)
</script>
<template>
  <div class="forward-setting-form">
    <CompleteMessageContainer
      ref="refCompleteMessageContainer"
      backgroundColor="var(--color-background-soft)"
    >
      <div class="form-box">
        <div class="form-row">
          <div class="form-fa-brand">
            <div class="left">
              <Transition name="fade">
                <el-icon :size="30" @click="moveUp" v-show="couldUp">
                  <ArrowUp />
                </el-icon>
              </Transition>
            </div>
            <Transition name="fade-pop" mode="out-in">
              <el-icon
                :class="platformKeyMap[item.platform].fontawesomeClass"
                :key="platformKeyMap[item.platform].fontawesomeClass"
                size="40"
              ></el-icon>
            </Transition>
            <div class="right">
              <Transition name="fade">
                <el-icon :size="30" @click="moveDown" v-show="couldDown">
                  <ArrowDown />
                </el-icon>
              </Transition>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="control-radio">
            <el-radio-group v-model="item.platform">
              <el-radio v-for="key in platformKeyEnum" :value="key" :key="key">
                {{ platformKeyMap[key].name }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="form-row">
          <div class="input-lable">
            uuid
            <a href="javascript:;">生成</a>
          </div>
          <el-input
            v-model="item.uuid"
            :prefix-icon="Aim"
            placeholder="uuid"
            size="large"
            class="control-input"
          ></el-input>
        </div>
        <div class="form-row">
          <div class="input-lable">名称</div>
          <el-input
            v-model="item.name"
            :prefix-icon="User"
            placeholder="名称"
            size="large"
            class="control-input"
          ></el-input>
        </div>
        <template v-for="key in Object.keys(item.data)" :key="key">
          <div class="form-row">
            <div class="input-lable">{{ key }}</div>
            <el-input
              v-model="(item.data as any)[key]"
              :placeholder="(dataPlaceholder as any)[key]"
              :prefix-icon="Key"
              size="large"
              class="control-input"
            ></el-input>
          </div>
        </template>
        <Transition mode="out-in" name="fade">
          <div class="button-box edit" v-if="item.isDeleted">
            <el-button
              @click="restoreSetting"
              type="primary"
              round
              size="small"
            >
              恢复
            </el-button>
            <el-button @click="closeSetting" type="info" round size="small">
              关闭
            </el-button>
          </div>
          <div class="button-box edit" v-else>
            <el-button @click="updateSetting" type="warning" round size="small">
              修改
            </el-button>
            <el-button @click="deleteSetting" type="danger" round size="small">
              移除
            </el-button>
            <el-button @click="closeSetting" type="info" round size="small">
              关闭
            </el-button>
          </div>
        </Transition>
      </div>
    </CompleteMessageContainer>
  </div>
</template>

<style lang="scss" scoped>
.form-fa-brand {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  .left,
  .right {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      color 0.2s,
      transform 0.5s;
    .el-icon {
      cursor: pointer;
    }
  }
  .left {
    &:hover {
      transform: scale(1.2, 1.2);
    }
  }
  .right {
    &:hover {
      transform: scale(1.2, 1.2);
    }
  }
}

.button-box {
  margin-bottom: -8px;
  &.add,
  &.edit {
    margin-top: 18px;
  }
}
</style>
