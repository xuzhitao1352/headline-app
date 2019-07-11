<template>
  <div>
    <van-nav-bar title="主页"></van-nav-bar>
    <van-tabs class="pulltabs" v-model="channelIndex">
      <van-tab v-for="channelItem in channels" :title="channelItem.name" :key="channelItem.id">
        <van-pull-refresh v-model="isPullRefresh" @refresh="onRefresh">
          <ul>
            <li v-for="item in articles" v-text="item.title" :key="item.art_id"></li>
          </ul>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 底部导航栏 -->
    <van-tabbar>
      <van-tabbar-item icon="home-o" to="/">主页</van-tabbar-item>
      <van-tabbar-item icon="search" to="/wd">问答</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/my">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { getChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
export default {
  name: 'AppHome',
  data () {
    return {
      channelIndex: 0,
      isPullRefresh: false,
      channels: [],
      articles: []
    }
  },
  created () {
    this.loadChannels()
    this.loadArticles()
  },
  methods: {
    onRefresh () {
      console.log('刷新')
    },
    async loadChannels () {
      try {
        const { channels } = await getChannels()
        this.channels = channels
      } catch (err) {
        console.log(err)
      }
    },
    async loadArticles () {
      try {
        const res = await getArticles(0, Date.now(), 1)
        // 暂时没有最新文章，所以使用埋点
        if (res.results.length === 0) {
          this.articles = (await getArticles(0, res.pre_timestamp, 1)).results
          return
        }
        this.article = res.results
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pull-refresh {
  height: 100%;
}
</style>
