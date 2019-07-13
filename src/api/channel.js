import request from '@/utils/request'

export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

export const getAllChannel = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
