import type { MessageHandler } from 'element-plus'
import type { AppContext } from 'vue'

export const sakiMessage = ((
  options?: any,
  appContext?: null | AppContext
): MessageHandler => {
  return ElMessage(
    {
      ...options,
      offset: 66
    },
    appContext
  )
}) as typeof ElMessage
