<template>
  <div>
    <van-nav-bar class="header-title" title="登录"/>
    <van-cell-group>
      <van-field
        v-model="userInfo.mobile"
        clearable
        left-icon="iconfont icon-mobile"
        label="手机号"
        placeholder="请输入手机号"
        @click-right-icon="$toast('question')"
        v-validate="'required|digits:11'"
        name="手机号"
        :error-message="errors.first('手机号')"
      />
      <van-field
        v-model="userInfo.code"
        center
        left-icon="iconfont icon-lock"
        label="验证码"
        clearable
        type="password"
        placeholder="请输入验证码"
        v-validate="'required|digits:6'"
        name="验证码"
        :error-message="errors.first('验证码')"
      >

        <van-button size="small" class="yzm-auth-code" slot="button" type="default">获取验证码</van-button>
      </van-field>
      <div class="login-btn-box">
        <van-button :loading="isLoginLoding" type="info" size="large" @click="handleLogin" loading-text="登录中...">登录</van-button>
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
        code: '246810'
      },
      isLoginLoding: false
    }
  },
  methods: {
    // 登录
    async handleLogin () {
      try {
        const valid = await this.$validator.validate()
        if (!valid) {
          this.$notify({
            message: '格式有误',
            background: '#FFCC33',
            color: '#000'
          })
          return
        }
        this.isLoginLoding = true
        const data = await login(this.userInfo)
        this.$store.commit('setUser', data)
        // pc端
        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
        // 移动端
        // this.$router.back()
        this.$notify({
          message: '登录成功',
          background: '#33FF33'
        })
      } catch (err) {
        console.log(err)
        this.$notify({
          message: '账户名密码有误',
          background: '#1989fa'
        })
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
