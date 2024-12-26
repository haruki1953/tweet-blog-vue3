import type { platformKeyMap } from '@/config'

// BackendForwardStore ForwardSetting 转发配置
export type ForwardSettingBase = {
  uuid: string
  name: string
}

// 手动根据platformKeyMap设置了ForwardSettingItem的类型
// export type ForwardSettingX = {
//   platform: typeof platformKeyMap.X.key
//   data: typeof platformKeyMap.X.forwardSettingDataDefault
// } & ForwardSettingBase
// export type ForwardSettingT = {
//   platform: typeof platformKeyMap.T.key
//   data: typeof platformKeyMap.T.forwardSettingDataDefault
// } & ForwardSettingBase
// export type ForwardSettingItem = ForwardSettingX | ForwardSettingT

// 241226 类型体操自动生成ForwardSettingItem的类型
// 提取 platformKeyMap 的键
type PlatformKeys = keyof typeof platformKeyMap
// 动态生成 ForwardSetting 类型
type ForwardSetting<K extends PlatformKeys> = {
  platform: (typeof platformKeyMap)[K]['key']
  data: (typeof platformKeyMap)[K]['forwardSettingDataDefault']
} & ForwardSettingBase
// 生成所有可能的 ForwardSettingItem 类型
type ForwardSettingItem = {
  [K in PlatformKeys]: ForwardSetting<K>
}[PlatformKeys]

export type ForwardSettingList = ForwardSettingItem[]
// BackendForwardStore
export type BackendForwardStore = {
  forwardSettingList: ForwardSettingList
}

// 在转发配置设置页面的表单中，需要添加isDeleted
export type ForwardSettingItemInForm = ForwardSettingItem & {
  isDeleted: boolean
}
export type ForwardSettingListInForm = ForwardSettingItemInForm[]
