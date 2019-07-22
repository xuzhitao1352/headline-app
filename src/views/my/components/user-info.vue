<template>
  <div class="my-user-info">
    <van-cell
    :border="false"
    center
    class="user-info"
    title="消息通知"
    is-link
    @click="$router.push('/user-settings')">
      <div slot="title">
        <img :src="user.photo" class="user-photo" width="40" height="40">
        <span>{{ user.name }}</span>
      </div>
    </van-cell>
    <van-grid :border="false">
      <van-grid-item text="头条">
        <div slot="icon">{{ user.art_count }}</div>
      </van-grid-item>
      <van-grid-item text="关注">
        <div slot="icon">{{ user.follow_count }}</div>
      </van-grid-item>
      <van-grid-item text="粉丝">
        <div slot="icon">{{ user.fans_count }}</div>
      </van-grid-item>
      <van-grid-item text="获赞">
        <div slot="icon">{{ user.like_count }}</div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { getMyUserInfo } from '@/api/user'
export default {
  name: 'AppUserInfo',
  created () {
    this.handleUserInfo()
  },
  data () {
    return {
      user: {}
    }
  },
  methods: {
    async handleUserInfo () {
       const res = await getMyUserInfo()
       this.user = res
    }
  }
}
</script>

<style lang="less" scoped>
.user-photo {
  border-radius: 50%;
  vertical-align: middle;
}
span {
  padding-left: 20px;
}
</style>