import { profileConfig } from '@/config'
import type { AvatarProcessSetting } from '@/types'
import { ref } from 'vue'

export const useSettingModule = () => {
  const avatarProcessSettingDefault = (): AvatarProcessSetting => {
    return { ...profileConfig.avatarProcessSettingDefault }
  }

  const avatarProcessSetting = ref(avatarProcessSettingDefault())

  const avatarProcessSettingSave = (setting: AvatarProcessSetting) => {
    // avatarProcessSetting.value = setting
    avatarProcessSetting.value = { ...setting }
  }

  const avatarProcessSettingReset = () => {
    avatarProcessSetting.value = avatarProcessSettingDefault()
  }

  return {
    avatarProcessSettingDefault,
    avatarProcessSetting,
    avatarProcessSettingSave,
    avatarProcessSettingReset
  }
}
