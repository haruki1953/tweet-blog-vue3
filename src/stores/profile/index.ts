import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useLoadModule } from './modules/load'
import type { BackendProfileStore } from '@/types'
import { useSettingModule } from './modules/setting'

export type ProfileStoreModuleDependencies = {
  postNumber: Ref<number>
  imageNumber: Ref<number>
  profile: Ref<BackendProfileStore | null>
}

// 个人信息模块
export const useProfileStore = defineStore(
  'tweet-profile',
  () => {
    const postNumber = ref(0)
    const imageNumber = ref(0)

    const profile = ref<BackendProfileStore | null>(null)

    const avatar = computed(() => profile.value?.avatar || null)
    const avatarArray = computed(() => profile.value?.avatarArray || [])
    const avatarItem = computed(() => {
      if (avatar.value === null) {
        return null
      }
      const find = avatarArray.value.find((a) => a.uuid === avatar.value)
      if (find === undefined) {
        return null
      }
      return find
    })
    const name = computed(() => profile.value?.name || '')
    const bio = computed(() => profile.value?.bio || '')
    const socialMedias = computed(() => profile.value?.socialMedias || [])
    const aboutMarkdown = computed(() => profile.value?.aboutMarkdown || '')
    const externalLinks = computed(() => profile.value?.externalLinks || [])
    const externalIcons = computed(() => profile.value?.externalIcons || [])

    const dependencies = {
      postNumber,
      imageNumber,
      profile
    }

    const loadModule = useLoadModule(dependencies)
    const settingModule = useSettingModule()

    return {
      ...loadModule,
      ...settingModule,
      profile,
      postNumber,
      imageNumber,
      avatar,
      avatarArray,
      avatarItem,
      name,
      bio,
      socialMedias,
      aboutMarkdown,
      externalLinks,
      externalIcons
    }
  },
  {
    persist: true // 持久化
  }
)
