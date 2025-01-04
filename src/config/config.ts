// // 开发时使用的
// const apiBaseUrl = 'http://localhost:3000/api/'
// const staticBaseUrl = 'http://localhost:3000/'

// // 这是为了在手机上测试，需要的话要改为自己电脑的ip
// const apiBaseUrl = 'http://192.168.2.110:3000/api/'
// const staticBaseUrl = 'http://192.168.2.110:3000/'

// 部署时，将由后端来托管前端，设置为根路径
const apiBaseUrl = '/api/'
const staticBaseUrl = '/'

export const axiosConfig = {
  baseUrl: apiBaseUrl,
  // timeout: 20000
  // 推文转发操作需要的时间可能比较长，所以timeout尽量长一点
  timeout: 50000
}

export const webName = 'Tweblog'

// logo图标
// import logoImage from '@/assets/logo.png'
// import logoImage from '@/assets/icon2x.png'
import logoImage from '@/assets/tweet.svg'
export { logoImage }

export const profileConfig = {
  avatarDefault: logoImage,
  avatarUrl: staticBaseUrl + 'avatar/',
  avatarProcessSettingDefault: {
    imageProcess: true,
    imageType: 'image/jpeg' as const,
    imageQuality: 0.9,
    imageWidth: 400
  },
  iconDefault: logoImage,
  iconUrl: staticBaseUrl + 'icon/',
  iconProcessSettingDefault: {
    imageProcess: true,
    imageType: 'image/jpeg' as const,
    imageQuality: 0.9,
    imageWidth: 200
  }
}

const imageBaseUrl = staticBaseUrl + 'image/'
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
  remainingCharsToWarning: 20,
  // 持久化保存的帖子数据的最大数量
  postPoolSizeLimit: 100,
  // 超过限制时移除的数量
  postPoolSizeRemove: 50
}

// 占位图片
import sakiPlaceholder from '@/assets/saki-placeholder.jpg'
import sakiError from '@/assets/saki-error.jpg'
export { sakiPlaceholder, sakiError }
