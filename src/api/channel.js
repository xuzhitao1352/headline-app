import request from '@/utils/request'

// 获取频道默认列表
export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 获取所有频道列表
export const getAllChannel = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

// 删除用户频道
export const delUserChannel = id => {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/user/channels/' + id
  })
}

// 批量修改用户频道列表（部分覆盖，添加用户)
export const updateUserChannel = channels => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}
