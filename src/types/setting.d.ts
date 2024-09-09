import { PostData } from './data'

export interface InfoForSendType {
  type: 'post' | 'reply' | 'update'
  data: PostData | null
}

export interface InfoBySendType extends InfoForSendType {
  topBarTitle: string
  topBarBtnText: string
  sendFunc: () => void
  repostLableText: string | null
  textareaPlaceholder: string
}

export type PostsGetMode = 'normal' | 'search' | 'delete'
