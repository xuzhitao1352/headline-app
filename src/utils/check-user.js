import router from '@/router'
import { Dialog } from 'vant'

export default () => {
  const user = window.localStorage.getItem('user')
  if (user) {
    return true
  } else {
    Dialog.confirm({
      title: '您还未登录是否登录？'
    }).then(() => {
      router.push({
        name: 'login',
        query: { // 传递查询字符串
          // router.currentRoute 用于在非组件模块中获取当前路由对象
          redirect: router.currentRoute.fullPath
        }
      })
    }).catch(() => {
    })
  }
}
