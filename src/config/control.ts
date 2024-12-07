// 关于导入与导出，平台所代表字段
export const platformLabelMap = {
  x: 'X'
} as const
export const platformLabelEnum = ['X'] as const

// 类型检查以确保 platformLabelEnum 与 platformLabelMap 的值是同步的
type PlatformLabelMapValues =
  (typeof platformLabelMap)[keyof typeof platformLabelMap]
type PlatformLabelEnumValues = (typeof platformLabelEnum)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const platformLabelMapTest: PlatformLabelMapValues[] = [...platformLabelEnum]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const platformLabelEnumTest: PlatformLabelEnumValues[] =
  Object.values(platformLabelMap)
