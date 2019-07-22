import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
// 公共组件
import AppTabbar from '@/components/app-tabbar'
// 自定义指令
import directives from '@/directives'
// 进入rem配置文件
import 'amfe-flexible'
import Vant, { Dialog } from 'vant'
// 引入vant样式
import 'vant/lib/index.css'
// 引入icon
import '@/assets/icon/iconfont.css'
// 引入全局样式
import '@/styles/index.css'
// 时间过滤器
import relativeTime from '@/filters/relative-time'
// vue表单验证
import zhCN from 'vee-validate/dist/locale/zh_CN'
import VeeValidate, { Validator } from 'vee-validate'

Vue.filter('relativeTime', relativeTime)

Vue.component('app-tabbar', AppTabbar)

Vue.use(Vant).use(Dialog)
Vue.use(VeeValidate)
Validator.localize('zh_CN', zhCN)
// 判断是否登录
import isLogin from '@/utils/check-user'
Vue.prototype.$isLogin = isLogin

// import {
//   Button,
//   Field,
//   Cell,
//   CellGroup,
//   NavBar
// } from 'vant'

// Vue
//   .use(Button)
//   .use(Field)
//   .use(Cell)
//   .use(CellGroup)
//   .use(NavBar)

Vue.config.productionTip = false

Vue.prototype.$sleep = sec => {
  return new Promise((resolve, reject) => {
    window.setTimeout(resolve, sec)
  })
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
