import { postConfig } from '@/config'
import type { PostContentPart } from '@/types'

export const textToPostContentPart = (text: string): PostContentPart[] => {
  const parts: PostContentPart[] = [] // 用于存储解析后的部分
  const regex = /(https?:\/\/[^\s]+)/g // 匹配链接的正则表达式
  let lastIndex = 0 // 记录上一个匹配结束的位置

  // 使用 matchAll 方法找到所有链接
  const matches = text.matchAll(regex)
  for (const match of matches) {
    const offset = match.index // 当前匹配的开始位置
    // 如果当前匹配前有普通文本部分，添加到 parts 数组
    if (offset > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, offset)
      })
    }
    // 添加链接部分到 parts 数组
    // 限制链接文本长度
    const linkContent = (() => {
      const cutHttp = match[0].replace(/https?:\/\//, '')
      const limitLength = (() => {
        const maxLength = postConfig.linkContentMaxLength
        if (cutHttp.length > maxLength) {
          return cutHttp.slice(0, maxLength) + '...'
        } else {
          return cutHttp
        }
      })()
      return limitLength
    })()
    parts.push({
      type: 'link',
      content: linkContent,
      href: match[0]
    })
    // 更新 lastIndex 为当前匹配结束的位置
    lastIndex = offset + match[0].length
  }

  // 如果最后一个匹配后还有剩余的普通文本部分，添加到 parts 数组
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex)
    })
  }

  return parts // 返回解析后的部分数组
}
