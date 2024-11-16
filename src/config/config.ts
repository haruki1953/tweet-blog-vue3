export const appInfo = {
  copyright: {
    text: 'tweet-blog',
    link: '/'
  },
  version: {
    text: 'v0.0.1',
    link: '/'
  }
}

export const axiosConfig = {
  // baseUrl: 'http://192.168.2.110:3000/',
  baseUrl: 'http://localhost:3000/',
  timeout: 20000
}

export const webName = 'tweet-blog'

// logo图标
import logoImage from '@/assets/logo.png'
export { logoImage }

export const profileConfig = {
  avatarDefault: logoImage,
  // avatarUrl: 'http://192.168.2.110:5500/avatar/',
  avatarUrl: 'http://localhost:5500/avatar/',
  avatarProcessSettingDefault: {
    imageProcess: true,
    imageType: 'image/jpeg' as const,
    imageQuality: 0.9,
    imageWidth: 400
  },
  iconDefault: logoImage,
  // iconUrl: 'http://192.168.2.110:5500/icon/',
  iconUrl: 'http://localhost:5500/icon/',
  iconProcessSettingDefault: {
    imageProcess: true,
    imageType: 'image/jpeg' as const,
    imageQuality: 0.9,
    imageWidth: 200
  }
}

// const imageBaseUrl = 'http://192.168.2.110:5500/image/'
const imageBaseUrl = 'http://localhost:5500/image/'
export const imageConfig = {
  // 图片基础路径
  baseUrl: imageBaseUrl,
  // 各版本图片路径
  smallBaseUrl: `${imageBaseUrl}small/`,
  largeBaseUrl: `${imageBaseUrl}large/`,
  originalBaseUrl: `${imageBaseUrl}original/`,
  // 一次请求中图片的一般数量
  imageNumInOnceRequest: 20,
  // 无限滚动中的数量限制
  limitShow: {
    // 最初的数量
    startAmounts: 15,
    // 每次增加的数量
    limitAmounts: 15
  },
  // 修改alt时的最大字数
  maxAltCharactersOnSend: 1000
}

export const postConfig = {
  // 帖子最多可包含的图片数
  postMaxImages: 4,
  // 一次请求中帖子的一般数量
  postNumInOnceRequest: 20,
  // 无限滚动中的数量限制
  limitShow: {
    startAmounts: 4,
    limitAmounts: 4
  },
  // 链接在显示时的长度限制
  linkContentMaxLength: 30,
  // 在推特发送推文输入链接是，好像不管链接长度，所代表的字数都会是23
  linkCharacterCountRepresentationInPost: 23,
  // 发推时的最大字数（只是提示，不会约束）
  maxPostCharactersOnSend: 280,
  // 开始警告的剩余字数
  remainingCharsToWarning: 20
}

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
