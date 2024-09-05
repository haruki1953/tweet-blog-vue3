import { createRouter, createWebHashHistory } from 'vue-router'
import { webName } from '@/config'
import { ref } from 'vue'
// 下边这些可能是因为vue的vscode插件导致报错，先不管了
import LayoutContainer from '@/views/layout/LayoutContainer.vue'
import HomePage from '@/views/home/HomePage.vue'
import LoginPage from '@/views/login/LoginPage.vue'
import PostSend from '@/views/post/PostSend.vue'
import PostPage from '@/views/post/PostPage.vue'
import AlbumPage from '@/views/image/AlbumPage.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: LoginPage,
      meta: { title: `登录` }
    },
    {
      path: '/',
      component: LayoutContainer,
      children: [
        {
          path: '',
          component: HomePage,
          meta: { title: `` }
        },
        {
          path: '/post/:id',
          component: PostPage,
          meta: { title: `帖子` }
        },
        {
          path: '/send',
          component: PostSend,
          meta: { title: `发送帖子` }
        },
        {
          path: '/album',
          component: AlbumPage,
          meta: { title: `相册` }
        }
      ]
    }
  ],
  // 路由滚动行为定制
  scrollBehavior: (to, from, savedPosition) => {
    return { top: 0 }
    //   if (savedPosition) {
    //     return new Promise((resolve, reject) => {
    //       setTimeout(() => {
    //         resolve({
    //           ...savedPosition,
    //           behavior: 'smooth'
    //         })
    //       }, 100)
    //     })
    //   } else {
    //     return { top: 0 }
    //   }
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
