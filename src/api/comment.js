import request from '@/utils/request'

// 获取文章评论
export const getComment = params => {
  return request({
    method:  'GET',
    url: '/app/v1_0/comments',
    params
  })
}

// 对评论点赞
export const commentPraise = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })
}

// 取消对文章点赞
export const cancelCommentPraise = target => {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/comment/likings/' + target
  })
}

// 添加评论
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}

