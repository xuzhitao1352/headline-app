<template>
  <div class="article-wrap">
    <van-nav-bar
        title="标题"
        left-text="返回"
        left-arrow
        @click-left="$router.back()"/>
    <template v-if="artInfo.art_id">
      <h4>{{ artInfo.title }}</h4>
      <AuthInfo
        :author-photo="artInfo.aut_photo"
        :author-name="artInfo.aut_name"
        :pubdate="artInfo.pubdate"
        :aut-id="artInfo.aut_id"
        :is-followed.sync="artInfo.is_followed"
      />
      <!-- <div class="ariticle-content" v-html="artInfo.content"></div> -->
      <MoreAction
        :attitude.sync="artInfo.attitude"/>
      <RecommendArticle></RecommendArticle>
      <RecommendSearch></RecommendSearch>
      <!-- 加载文章评论 -->
      <CommentList
      v-model="comment.comList"
      :comment-id.sync="comment.com_id"
      :com-text.sync="writeCom.content"
      :com-type.sync="writeCom.type"/>
      <!-- 加载评论的评论 -->
      <van-popup
        class="com-comment"
        v-model="comment.comList"
        position="bottom"
        :style="{ height: '80%' }"
      >
        <CommentList
          art_type="c"
          :com-id="comment.com_id"
          :isClearCom.sync="comment.comList"
          :com-text.sync="writeCom.content"
          :com-type.sync="writeCom.type"/>
      </van-popup>
      <WriteComment
        v-model="writeContent"
        :show-comment-list="comment.comList"
        :com-id="comment.com_id"
        @onWriteComment="handelWriteCom"/>  
    </template>
    <template v-else>
      <van-loading class="article-loading" type="spinner" />
    </template>
  </div>
</template>

<script>
import AuthInfo from './components/auth-info.vue'
import CommentList from './components/comment-list.vue'
import MoreAction from './components/more-action.vue'
import RecommendArticle from './components/recommend-article.vue'
import RecommendSearch from './components/recommend-search.vue'
import WriteComment from './components/write-comment.vue'
import { getArticleDetails } from '@/api/article'
export default {
  name: 'AppArticle',
  components: {
    AuthInfo,
    CommentList,
    MoreAction,
    RecommendArticle,
    RecommendSearch,
    WriteComment
  },
  created () {
    this.loadDetailsInfo()
  },
  deactivated () {
    this.$destroy()
  },
  provide: function () {
    return {
      art_id: this.$route.params.articleId
    }
  },
  data () {
    return {
      artInfo: {},
      comment: {
        comList: false,
        com_id: ''
      },
      writeContent: '',
      writeCom: {
        content: '',
        type: ''
      }
    }
  },
  methods: {
    async loadDetailsInfo () {
      const res = await getArticleDetails(this.$route.params.articleId)
      this.artInfo = res
    },
    handelWriteCom (data) {
      Object.assign(this.writeCom, data)
    }
  }
}
</script>

<style lang="less" scoped>
.com-comment {
  z-index: 998 !important;
  /deep/ div[role] {
    padding: 10px;
  }
}
.article-loading {
  width: 0.8rem;
  height: 0.8rem;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
}

.article-content {
  margin: 50px 0;
  font-family: 'Microsoft YaHei';
  font-size: medium;
}
.article-wrap {
  position: relative;
  height: 100%;
  padding: 0 20px;
}
h4 {
  font-weight: 400;
  padding: 50px 0; 
}
</style>
