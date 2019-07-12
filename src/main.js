import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
// 进入rem配置文件
import 'amfe-flexible'
import Vant from 'vant'
// 引入vant样式
import 'vant/lib/index.css'
// 引入icon
import '@/assets/icon/iconfont.css'
// 引入全局样式
import '@/styles/index.css'
// vue表单验证
import zhCN from 'vee-validate/dist/locale/zh_CN'
import VeeValidate, { Validator } from 'vee-validate'

Vue.use(Vant)
Vue.use(VeeValidate)
Validator.localize('zh_CN', zhCN)

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
