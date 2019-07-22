<template>
  <div>
    <userInfo v-if="islogin"></userInfo>
    <unLogin v-else></unLogin>
    <van-grid>
      <van-grid-item icon="star" text="我的收藏"/>
      <van-grid-item icon="more" text="我的评论"/>
      <van-grid-item icon="like" text="我的点赞"/>
      <van-grid-item icon="browsing-history" text="浏览历史"/>
    </van-grid>
    <van-cell-group>
      <van-cell title="消息通知" is-link/>
      <van-cell title="用户反馈" is-link/>
      <van-cell title="小智同学" is-link/>
      <van-cell title="系统设置" is-link/>
    </van-cell-group>
    <app-tabbar/>
  </div>
</template>

<script>
import unLogin from './components/un-login'
import userInfo from './components/user-info'

export default {
  name: 'AppMyInfo',
  components: {
    userInfo,
    unLogin
  },
  activated () {
    this.handleIsLogin()
  },
  deactivated () {
    this.$destroy()
  },
  data () {
    return {
      islogin: false
    }
  },
  methods: {
    handleIsLogin () {
      if (window.localStorage.getItem('user')) {
        this.islogin = true
      } else {
        this.islogin = false
      }
    }
  }
}
</script>

<style scoped>
</style>
