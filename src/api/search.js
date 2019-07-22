import request from '@/utils/request'
// 联想建议
export const getAssociate = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

// 获取搜索结果
export const getSearchResult = (page, per_page, q) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params: {
      page,
      per_page,
      q
    }
  })
}

// 获取用户搜索历史
export const getHistories = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search/histories'
  })
}

// 删除搜索历史
export const delHistories = () => {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/search/histories'
  })
}
