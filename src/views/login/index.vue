<template>
  <div>
    <van-nav-bar class="header-title" title="登录"/>
    <van-cell-group>
      <van-field
        v-model="userInfo.mobile"
        clearable
        left-icon="iconfont icon-mobile"
        label="手机号"
        placeholder="请输入用户名"
        @click-right-icon="$toast('question')"
        :error-message="errors.mobile"
      />

      <van-field
        v-model="userInfo.code"
        center
        left-icon="iconfont icon-lock"
        label="验证码"
        clearable
        type="password"
        placeholder="请输入验证码"
        :error-message="errors.code"
      >
        <van-button size="small" class="yzm-auth-code" slot="button" type="default">获取验证码</van-button>
      </van-field>
      <div class="login-btn-box">
        <van-button type="info" size="large" @click="handleLogin" loading-text="登录中..." :loding="isLoginLoding">登录</van-button>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'AppLogin',
  data () {
    return {
      userInfo: {
        mobile: '13520809374',
        code: '123456'
      },
      errors: {
        mobile: '',
        code: ''
      },
      isLoginLoding: false
    }
  },
  methods: {
    async handleLogin () {
      try {
        let user = this.userInfo
        let errors = this.errors
        if (user.mobile === '') {
          errors.mobile = '请输入手机号'
          return
        }
        if (user.code === '') {
          errors.code = '请输入验证码'
          return
        }
        // 清空错误提醒
        errors.mobile = ''
        errors.code = ''
        this.isLoginLoding = true
        const data = await login(user)
        this.$store.commit('setUser', data)
        this.$router.push('/')
      } catch (err) {
        console.log(err)
      }
      this.isLoginLoding = false
    }
  }
}
</script>

<style lang="less" scoped>
.header-title {
  background-color: #1989fa;
  .van-nav-bar__title {
    color: #fff;
  }
}
.login-btn-box {
  padding: 60px 30px;

  button {
    height: 90px;
    line-height: 90px;
    border-radius: 10px !important;
  }
}
.yzm-auth-code {
  border-radius: 100px;
  background-color: #F0F0F0;
  height: 48px;
  line-height: 48px;
  color: #555555;
}

</style>
