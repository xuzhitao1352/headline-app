<template>
  <div>
    <van-search class="home-search" @focus="$router.push('/search')" placeholder="请输入搜索关键词" v-model="searchText" />
    <van-tabs class="pull-tabs" v-model="activechannelIndex">
      <div class="label-edit" slot="nav-right" @click="isChannelShow = true">
        <van-icon class="icon iconfont icon-menu"/>
      </div>
      <van-tab v-for="channelItem in channels" :title="channelItem.name" :key="channelItem.id">
        <van-pull-refresh
          v-model="pullRefresh"
          @refresh="onRefresh"
          >
          <van-list
            v-model="activeArticle.upRefresh"
            :finished="activeArticle.upRefreshFinish"
            finished-text="没有更多了"
            @load="upLodingMore"
          >
            <van-cell
              v-for="item in activeArticle.articles"
              :key="item.art_id.toString()"
              :title="item.title"
              @click="$router.push({ name: 'article', params: { articleId:item.art_id } })"
            >
              <div slot="label">
                <template v-if="item.cover">
                  <van-grid :border="false" :column-num="3">
                    <van-grid-item v-for="(imgs,index) in item.cover.images" :key="index">
                      <van-image :src="imgs" />
                    </van-grid-item>
                  </van-grid>
                </template>
                <p>
                  <span class="fl">{{ item.aut_name }}</span>
                  <span class="fl">{{ item.ch_id }}条评论</span>
                  <span class="fl">{{ item.pubdate | relativeTime }}</span>
                  <van-icon @click="handleReport(item)" class="fr iconfont icon-close-square"></van-icon>
                </p>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 底部导航栏 -->
    <app-tabbar/>

    <!-- 举报弹出层 -->
    <div class="home-report-dialog">
      <van-dialog
        v-model="showReportItem"
        closeOnClickOverlay
        :showConfirmButton="false"
      >
        <van-cell-group>
          <template v-if="!isReport">
            <van-cell @click="handleDislikesArticle" title="不感兴趣" icon="close" clickable />
            <van-cell @click="isReport = true" title="反馈垃圾内容" icon="warning-o" clickable />
            <van-cell @click="handleAddBlackList" title="拉黑作者" icon="manager" clickable />
          </template>
          <template v-else>
            <van-nav-bar
              title="标题"
              left-text="返回"
              left-arrow
              @click-left="isReport = false"
            />
            <van-cell @click="handleRest" title="其他问题" clickable />
            <van-cell @click="handleReportArticle(1)" title="标题夸张" clickable />
            <van-cell @click="handleReportArticle(2)" title="低俗色情" clickable />
            <van-cell @click="handleReportArticle(3)" title="错别字多" clickable />
            <van-cell @click="handleReportArticle(4)" title="旧闻重复" clickable />
            <van-cell @click="handleReportArticle(5)" title="广告软文" clickable />
            <van-cell @click="handleReportArticle(6)" title="内容不实" clickable />
            <van-cell @click="handleReportArticle(7)" title="涉嫌违法犯罪" clickable />
            <van-cell @click="handleReportArticle(8)" title="侵权" clickable />
          </template>
        </van-cell-group>
      </van-dialog>
      <!-- 其他举报信息 -->
      <van-dialog
        v-model="showRest"
        title="举报内容"
        show-cancel-button
        @confirm="handleReportArticle(0)"
      >
        <van-cell-group>
          <van-field
            v-model="restInfo"
            id="restInfoText"
            type="textarea"
            placeholder="请输入举报信息"
            rows="2"
            autosize
          />
        </van-cell-group>
      </van-dialog>
    </div>

    <!-- 频道组件 -->
    <home-channel
    v-model="isChannelShow"
    :user-channels.sync="channels"
    :active-channel.sync="activechannelIndex"
    :user-articles.sync="articles"/>
  </div>
</template>

<script>
import { getChannels } from '@/api/channel'
import { addBlacklist } from '@/api/user'
import { debounce } from 'lodash'
import { getArticles, dislikesArticle, reportArticle } from '@/api/article'
import HomeChannel from './components/channel'

export default {
  name: 'AppHome',
  components: {
    HomeChannel
  },
  data () {
    return {
      searchText: '',
      restInfo: '',
      showRest: false,
      currentActiveArticle: {},
      showReportItem: false,
      isReport: false,
      activechannelIndex: 0,
      pullRefresh: false,
      articles: [],
      channels: [],
      isChannelShow: false
    }
  },
  created () {
    this.loadChannels()
  },
  computed: {
    activeChannel () {
      return this.channels[this.activechannelIndex]
    },
    activeArticle () {
      return this.articles.filter(item => item.id === this.activeChannel.id)[0]
    }
  },
  watch: {
    async 'showReportItem' () {
      if (!this.showReportItem) {
        await this.$sleep(200)
        this.isReport = false
      }
    }
  },
  methods: {
    // 拉黑作者
    async handleAddBlackList () {
      const res = await addBlacklist(this.currentActiveArticle.aut_id)
      console.log(res)
      this.showReportItem = false
      this.$toast('操作成功')
    },
    // 不感兴趣
    async handleDislikesArticle () {
      try {
        const currentArtId = this.currentActiveArticle.art_id.toString()
        await dislikesArticle(currentArtId)
        this.showReportItem = false
        const articles = this.activeArticle.articles
        const delIndex = articles.findIndex(item => item.art_id.toString() === currentArtId)
        articles.splice(delIndex, 1)
        this.$toast('操作成功!')
      } catch (err) {
        console.log(err)
      }
    },
    // 举报文章
    async handleReportArticle (type) {
      try {
        const currentActArticle = this.currentActiveArticle
        const data = {
          target: currentActArticle.art_id.toString(),
          type
        }
        if (!type) {
          data.remark = this.restInfo
        }
        await reportArticle(data)
        this.$toast('举报成功')
        this.showReportItem = false
      } catch (err) {
        this.$toast('该文章已被举报')
        console.log(err)
      }
    },
    // 其他问题处理，进入获取焦点（待处理）
    async handleRest () {
      this.restInfo = ''
      this.showRest = true
    },
    // 举报
    handleReport (item) {
      const { user } = this.$store.state
      if (!user) {
        this.$toast.fail('请先登录')
        return
      }
      this.currentActiveArticle = item
      this.showReportItem = true
    },
    // 上拉加载更多
    async upLodingMore () {
      const articles = await this.loadArticles()
      const art = this.activeArticle
      // 重置时间戳
      art.pre_timestamp = articles.pre_timestamp
      // 追加文章
      art.articles.push(...articles.results)
      art.upRefresh = false
    },
    async onRefresh () {
      let art = this.activeArticle
      // 清空文章列表
      // 获取最新数据
      const data = await getArticles(art.id, Date.now(), 1)
      await this.$sleep(500)
      if (data.results.length) {
        art.articles = []
        art.articles = data.results
        art.pre_timestamp = data.pre_timestamp
        art.pullSuccessText = '刷新列表成功'
        this.upLodingMore()
        this.pullRefresh = false
        return
      }
      art.pullSuccessText = '暂无数据更新'
      this.pullRefresh = false
    },
    // 刷新频道列表
    async loadChannels () {
      const { user } = this.$store.state
      try {
        let { channels } = await getChannels()
        if (!user) {
          if (!window.localStorage.getItem('channels')) {
            window.localStorage.setItem('channels', JSON.stringify(channels))
          }
          channels = JSON.parse(window.localStorage.getItem('channels'))
        }
        this.channels.push(...channels)
        this.initArticle()
      } catch (err) {
        console.log(err)
      }
    },
    // 加载文章列表
    initArticle () {
      const chs = this.channels
      const art = this.articles
      for (let i = 0; i < chs.length; i++) {
        art.push({ id: chs[i].id, articles: [], pre_timestamp: Date.now(), pullSuccessText: '', upRefresh: false, upRefreshFinish: false })
        // 报错
        // art[i].id = chs[i].id
        // art[i].articles = []
        // art[i].pre_timestamp = Date.now()
      }
    },
    async loadArticles () {
      try {
        let art = this.activeArticle
        const res = await getArticles(art.id, art.pre_timestamp, 1)
        if (res.results.length === 0) {
          // 初始化数据
          return await getArticles(art.id, res.pre_timestamp, 1)
        } else if (res.results.length === 0 && art.artives.length > 0) {
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
.fr {
  float: right;
}
.fl {
  margin-right: 10px;
}
.home-search {
  position: sticky;
  top: 0;
  z-index: 999;
}
.pull-tabs {
  /deep/ .van-tabs__wrap {
    position: fixed;
    margin-top: 92px;
  }
  /deep/ .van-tabs__content {
    margin: 0px 0 96px;
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
