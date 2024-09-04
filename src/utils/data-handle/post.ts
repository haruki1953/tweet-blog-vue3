import type {
  Post,
  PostByIdData,
  PostData,
  PostGetByCursorData,
  PostGetByIdData
} from '@/types'
import { mergeArrays } from './base'

export const postGetByCursorDataHandle = (
  data: PostGetByCursorData
): PostData[][] => {
  // first handel data to `PostData[][]`

  // 将有关系的帖子合并在一起
  const idTempGrid: number[][] = data.map((post) => {
    const idList: number[] = []
    if (post.parentPost != null) {
      idList.push(post.parentPost.id)
    }
    idList.push(post.id)
    return idList
  })
  const idRelationGrid = mergeArrays(idTempGrid)
  const postRelationGrid: PostData[][] = idRelationGrid.map((idList) => {
    return idList
      .map((id) => {
        let idPost: PostData | undefined
        data.some((post) => {
          if (post.id === id) {
            idPost = post
            return true
          }
          if (post.parentPost?.id === id) {
            idPost = {
              ...post.parentPost,
              parentPost: null
            }
          }
        })
        return idPost
      })
      .filter((post) => post) as PostData[]
  })

  // 调整顺序，遍历postRelationGrid
  postRelationGrid.map((postList) => {
    const postGroup: PostData[] = []
    // 1 找到主帖 parentPost === null
    const mainPost = postList.find((post) => post.parentPost == null)
    if (!mainPost) {
      // 出现错误，原样返回
      return postList
    }
    postGroup.push(mainPost)

    // 2 找到所有parentPost.id为主帖的，再找到其他，可能要递归寻找
    // 查找
    const replies = postList.filter(
      (post) => post.parentPost?.id === mainPost.id
    )
    // 排序
    replies.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    // 递归 TODO
    replies.forEach((repost) => {
      // 查找
      const replies = postList.filter(
        (post) => post.parentPost?.id === repost.id
      )
      // 排序
    })
  })

  console.log(idRelationGrid)
  console.log(mergeArrays(idTempGrid))

  return []
}

// export const postGetByIdDataHandle = (data: PostGetByIdData): PostByIdData => {}
