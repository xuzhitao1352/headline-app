import request from '@/utils/request'

export const getArticles = (channelId, timestamp, withTop) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: withTop
    }
  })
}

// 不喜欢文章
export const dislikesArticle = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

// 举报文章
export const reportArticle = (obj) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: obj
  })
}

// 获取文章详情
export const getArticleDetails = article_id => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${article_id}`
  })
}

// 对文章点赞
export const addEndorse = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target
    }
  })
}

// 取消点赞
export const cancelEndorse = target => {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/article/likings/' + target
  })
}

// 对文章不喜欢
export const addDislikesArticle = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target
    }
  })
}

// 取消对文章不喜欢
export const cencelDislikes = target => {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/article/dislikes/' + target
  })
}
