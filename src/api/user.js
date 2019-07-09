import request from '@/utils/request'

export const login = ({ mobile, code }) => request({
  method: 'post',
  url: '/app/v1_0/authorizations',
  data: {
    mobile,
    code
  }
})
