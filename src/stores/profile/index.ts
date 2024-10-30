import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useLoadModule } from './modules/load'
import type { BackendProfileStore } from '@/types'

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

    return {
      ...loadModule,
      profile,
      postNumber,
      imageNumber,
      avatar,
      avatarArray,
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
