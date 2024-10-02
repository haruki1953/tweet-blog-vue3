export const axiosConfig = {
  baseUrl: 'http://192.168.2.110:3000/',
  // baseUrl: 'http://localhost:3000/',
  timeout: 20000
}

const imageBaseUrl = 'http://192.168.2.110:5500/image/'
// const imageBaseUrl = 'http://localhost:5500/image/'
export const imageConfig = {
  baseUrl: imageBaseUrl,
  smallBaseUrl: `${imageBaseUrl}small/`,
  largeBaseUrl: `${imageBaseUrl}large/`,
  originalBaseUrl: `${imageBaseUrl}original/`,
  imageNumInOnceRequest: 20,
  limitShow: {
    startAmounts: 15,
    limitAmounts: 15
  }
}

export const postConfig = {
  postMaxImages: 4,
  postNumInOnceRequest: 20,
  limitShow: {
    startAmounts: 4,
    limitAmounts: 4
  },
  linkContentMaxLength: 30
}

export const webName = '小祥の博客'

// logo图标
import logoImage from '@/assets/logo.png'
export { logoImage }

// 海报 占位 失败
import sakiPlaceholder from '@/assets/saki-placeholder.jpg'
import sakiError from '@/assets/saki-error.jpg'
export { sakiPlaceholder, sakiError }

interface LinkInfo {
  [key: string]: {
    name: string
    fontawesomeClass: string
    // logoUrl?: string
    description: string
    link: string
  }
}
// 联系方式
export const contactInfo: LinkInfo = {
  twitter: {
    name: 'X / Twitter', // 平台名称
    fontawesomeClass: 'fa-brands fa-x-twitter', // fontawesome图标的class
    // logoUrl: '', // 图标地址(有fontawesomeClass则不显示)
    description: '@harukiO_0', // 描述,简介
    link: 'https://x.com/harukiO_0' // 链接
  },
  discord: {
    name: 'Discord',
    fontawesomeClass: 'fa-brands fa-discord',
    description: '小祥の小窝',
    link: 'https://discord.gg/nZWpvz2WNW'
  },
  github: {
    name: 'Github',
    fontawesomeClass: 'fa-brands fa-github',
    description: 'tweet-blog-vue3',
    link: 'https://github.com/haruki1953/tweet-blog-vue3'
  }
}
