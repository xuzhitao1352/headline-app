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

Vue.use(Vant)

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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
