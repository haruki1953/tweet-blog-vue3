import type { PostData, PostGetByCursorData } from '@/types'

export const postGetByCursorDataHandle = (
  postData: PostGetByCursorData
): PostData[][] => {
  // first handel data to `PostData[][]`
  const tempList = postData.map((post) => {
    const postGroup: PostData[] = []
    if (post.parentPost != null) {
      postGroup.push({
        ...post.parentPost,
        parentPost: null
      })
    }
    postGroup.push(post)
    return postGroup
  })
  return tempList
}
