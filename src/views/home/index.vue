<template>
  <div>
    <van-nav-bar title="主页" fixed></van-nav-bar>
    <van-tabs class="pull-tabs" v-model="activechannelIndex">
      <div class="label-edit" slot="nav-right" @click="isChannelShow = true">
        <van-icon class="icon iconfont icon-menu"/>
      </div>
      <van-tab v-for="channelItem in channels" :title="channelItem.name" :key="channelItem.id">
        <van-pull-refresh
          v-model="pullRefresh"
          @refresh="onRefresh"
          :success-text="channelItem.pullSuccessText">
          <van-list
            v-model="upRefresh"
            :finished="upRefreshFinish"
            finished-text="没有更多了"
            @load="upLodingMore"
          >
            <van-cell
              v-for="item in activeChannel.articles"
              :key="item.art_id"
              :title="item.title"
            />
          </van-list>
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

    <!-- 频道组件 -->
    <home-channel
    v-model="isChannelShow"
    :user-channels.sync="channels"
    :active-channel.sync="activechannelIndex"/>
  </div>
</template>

<script>
import { getChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import HomeChannel from './components/channel'
export default {
  name: 'AppHome',
  components: {
    HomeChannel
  },
  data () {
    return {
      activechannelIndex: 0,
      pullRefresh: false,
      upRefresh: false,
      upRefreshFinish: false,
      channels: [],
      isChannelShow: false
    }
  },
  watch: {
    async 'isChannelShow' () {
      if (!this.isChannelShow && !this.channels[this.activechannelIndex].articles) {
        this.loadChannels()
      }
    }
  },
  created () {
    this.loadChannels()
  },
  computed: {
    activeChannel () {
      return this.channels[this.activechannelIndex]
    }
  },
  methods: {
    // 上拉加载更多
    async upLodingMore () {
      await this.$sleep(200)
      const articles = await this.loadArticles()
      if (articles.results) {
        // 重置时间戳
        this.activeChannel.pre_timestamp = articles.pre_timestamp
        // 追加文章
        this.activeChannel.articles.push(...articles.results)
      }
      this.upRefresh = false
    },
    async onRefresh () {
      let artChannel = this.activeChannel
      // 清空文章列表
      // 获取最新数据
      const data = await getArticles(artChannel.id, Date.now(), 1)
      await this.$sleep(500)
      if (data.results.length) {
        artChannel.articles = []
        artChannel.articles = data.results
        artChannel.pre_timestamp = data.pre_timestamp
        artChannel.pullSuccessText = '刷新列表成功'
        this.upLodingMore()
        this.pullRefresh = false
        return
      }
      artChannel.pullSuccessText = '暂无数据更新'
      this.pullRefresh = false
    },
    async loadChannels () {
      try {
        if (!window.localStorage.getItem('channels')) {
          const { channels } = await getChannels()
          window.localStorage.setItem('channels', JSON.stringify(channels))
        }
        const localChannels = JSON.parse(window.localStorage.getItem('channels'))
        localChannels.forEach(item => {
          item.articles = []
          item.pre_timestamp = Date.now()
          item.pullSuccessText = '' // 加载成功提示文字
        })
        this.channels = localChannels
      } catch (err) {
        console.log(err)
      }
    },
    async loadArticles () {
      try {
        const artChannel = this.activeChannel
        console.log(artChannel)
        const res = await getArticles(artChannel.id, artChannel.pre_timestamp, 1)
        if (res.results.length === 0 && artChannel.artives) {
          // 初始化数据
          return await getArticles(artChannel.id, res.pre_timestamp, 1)
        } else if (res.results.length === 0 && artChannel.artives) {
          // 没有数据进入
          return null
        }
        return res
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pull-tabs {
  /deep/ .van-tabs__wrap {
    position: fixed;
    margin-top: 92px;
  }
  /deep/ .van-tabs__content {
    margin: 84.5px 0 96px;
  }
  .label-edit {
    display: flex;
    align-items: center;
    position: sticky;
    right: -1px;
    background: #fff;
    padding-left: 10px;
    z-index: 999;

    .icon {
      font-size: 50px;
    }
  }
}
</style>
