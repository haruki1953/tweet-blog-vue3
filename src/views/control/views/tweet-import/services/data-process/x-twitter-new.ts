// 原来zod是可以在前端用的啊，那一定是应该用zod

import type { PostControlImportJsonTypeOnDataProcess } from '@/types'
import { z } from 'zod'

const xtwitterItemContentSchema = z.object({})

const xtwitterResSchema = z.object({
  data: z.object({
    user: z.object({
      result: z.object({
        timeline_v2: z.object({
          timeline: z.object({
            instructions: z.array(
              z.object({
                entries: z
                  .array(
                    z.object({
                      content: z.object({
                        itemContent: z.any().optional(),
                        items: z
                          .array(
                            z.object({
                              item: z.object({
                                itemContent: z.any()
                              })
                            })
                          )
                          .optional()
                      })
                    })
                  )
                  .optional()
              })
            )
          })
        })
      })
    })
  })
})

// export const dataProcessXtwitterService = (
//   jsonData: string
// ): PostControlImportJsonTypeOnDataProcess['importPosts'] | null => {
//   const dataAny = JSON.parse(jsonData)
//   const result = xtwitterResSchema.safeParse(dataAny)
//   if (!result.success) {
//     return null
//   }
//   result.data.data.user.result.timeline_v2.timeline.instructions
// }
