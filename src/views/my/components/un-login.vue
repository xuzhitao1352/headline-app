<template>
  <div class="un-login" @click="$router.push({ name: 'login', query: { redirect: $router.currentRoute.fullPath } })">
    <div class="login-circle">登录</div>
  </div>
</template>

<script>
export default {
  name: 'AppUnLogin',
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.un-login {
  padding: 60px 0;
}
.login-circle {
  position: relative;
  left: 50%;
  margin-left: -90px;
  height: 180px;
  width: 180px;
  background-color: red;
  color: #fff;
  line-height: 180px;
  text-align: center;
  border-radius: 50%;
}
</style>