import { createRouter, createWebHashHistory } from 'vue-router'
import { webName } from '@/config'
import { nextTick, ref } from 'vue'
// 下边这些可能是因为vue的vscode插件导致报错，先不管了
import LayoutContainer from '@/views/layout/LayoutContainer.vue'
import TestPage from '@/views/test/TestPage.vue'
import HomePage from '@/views/home/HomePage.vue'
import LoginPage from '@/views/login/LoginPage.vue'
import SendPage from '@/views/post/SendPage.vue'
import PostPage from '@/views/post/PostPage.vue'
import AlbumPage from '@/views/image/AlbumPage.vue'
import ControlPage from '@/views/control/ControlPage.vue'

import SystemPage from '@/views/control/views/system-page/SystemPage.vue'
import ProfilePage from '@/views/control/views/profile-page/ProfilePage.vue'

import ImageConfig from '@/views/control/views/ImageConfig.vue'
import ForwardConfig from '@/views/control/views/ForwardConfig.vue'
import TweetImport from '@/views/control/views/TweetImport.vue'
import LogPage from '@/views/control/views/LogPage.vue'

import { useImageStore, usePostStore } from '@/stores'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'login',
      path: '/login',
      component: LoginPage,
      meta: { title: `登录` }
    },
    {
      path: '/',
      component: LayoutContainer,
      children: [
        {
          name: 'home',
          path: '',
          component: HomePage,
          meta: { title: `` }
        },
        {
          name: 'test',
          path: '/test',
          component: TestPage,
          meta: { title: `` }
        },
        {
          name: 'post',
          path: '/post/:id',
          component: PostPage,
          meta: { title: `` }
        },
        {
          name: 'send',
          path: '/send',
          component: SendPage,
          meta: { title: `` }
        },
        {
          name: 'album',
          path: '/album',
          component: AlbumPage,
          meta: { title: `相册` }
        },
        {
          path: '/control',
          component: ControlPage,
          children: [
            {
              name: 'system',
              path: '',
              component: SystemPage,
              meta: { title: `系统设置` }
            },
            {
              name: 'profile',
              path: '/profile',
              component: ProfilePage,
              meta: { title: `个人信息` }
            },
            {
              name: 'image-config',
              path: '/image-config',
              component: ImageConfig,
              meta: { title: `图片设置` }
            },
            {
              name: 'forward-config',
              path: '/forward-config',
              component: ForwardConfig,
              meta: { title: `转发设置` }
            },
            {
              name: 'tweet-import',
              path: '/tweet-import',
              component: TweetImport,
              meta: { title: `推文导入` }
            },
            {
              name: 'log',
              path: '/log',
              component: LogPage,
              meta: { title: `日志` }
            }
          ]
        }
      ]
    }
  ],
  // 路由滚动行为定制
  scrollBehavior: async (to, from, savedPosition) => {
    // console.log(to, from)
    // console.log(to.path, from.path)

    // 刷新时会有savedPosition，但自己想默认
    if (to.path === from.path) {
      return
    }
    // 保留有位置信息时滚动到原先位置
    if (savedPosition) {
      // 延迟一点会使滚动更准确
      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 10))
      return savedPosition
    }
    // 跳转至首页或其他包含无限滚动的页面时，重置显示限制
    if (to.path === '/') {
      const postStore = usePostStore()
      postStore.resetLimited()
      return { top: 0 }
    }
    if (['/album', '/send'].includes(to.path)) {
      const imageStore = useImageStore()
      imageStore.resetLimited()
      return { top: 0 }
    }
    // 默认回到顶部
    return { top: 0 }
  }
})

// 路由加载标识（本项目不是异步导入，应该用处不大）
export const isLoading = ref(false)

// 路由访问拦截
router.beforeEach((to) => {
  // 路由加载标识
  isLoading.value = true

  // 根据路由设置页面标题
  if (to.meta.title) {
    document.title = (to.meta.title as string) + ' | ' + webName
  } else {
    document.title = webName
  }

  // 路由不存在，拦截到首页
  if (router.resolve(to.path).matched.length === 0) {
    return '/'
  }
})

router.afterEach(() => {
  isLoading.value = false
})

export default router
