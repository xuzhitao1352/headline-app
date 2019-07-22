<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-for="(item, index) in comments" class="comment-list" :key="index">
        <div class="comment-photo">
          <img :src="item.aut_photo" width="40" height="40">
        </div>
        <div class="comment-content">
          <div class="com-user-info">
            <a href="javascript:;" class="title">{{ item.aut_name }}</a>
            <span
            class="praise"
            @click="clickPraise(index ,item)"
            :class="{ red: item.is_liking }"><i class="vant-icon icon-like"></i>{{ item.like_count }}</span>
          </div>
          <div class="com-text">
            {{ item.content }}
          </div>
          <div class="com-operation">
            <span class="time">{{ item.pubdate | relativeTime }}</span>

            <span
            v-if="art_type === 'a'"
            class="reply"
            @click="handleReply(item)">
              · 回复{{ item.reply_count }}
            </span>
            <a href="javascript:;"><i class="vant-icon icon-close-rectangle-o"></i></a>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { getComment, commentPraise, cancelCommentPraise } from '@/api/comment'
import { getMyUserInfo } from '@/api/user'
export default {
  name: 'CommentList',
  inject: ['art_id'],
  props: {
    art_type: {
      type: String,
      default: 'a'
    },
    comId: {
      type: String,
      default: null
    },
    commentId: {
      type: String,
      default: ''
    },
    isClearCom: {
      type: Boolean,
      default: false
    },
    comText: {
      type: String,
      default: ''
    },
    comType: {
      type: String,
      default: ''
    }
  },
  watch: {
    async 'isClearCom' () {
      if (this.isClearCom) {
        this.onLoad()
      } else {
        this.comments = []
        this.offset = null
      }
    },
    async 'comType' () {
      if (this.comText !== '' && this.comType === this.art_type) {
        const res = await getMyUserInfo()
        this.comments.unshift({
          aut_name: res.name,
          aut_photo: res.photo,
          content: this.comText,
          is_liking: false,
          pubdate: new Date().toString(),
          reply_count: 0,
          like_count: 0,
          is_top: 0,
        })
        this.$emit('update:com-type', '')
      }
    }
  },
  data () {
    return {
      comments: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10
    }
  },
  methods: {
    handleReply (item) {
      this.$emit('input', true)
      this.$emit('update:comment-id', item.com_id.toString())
    },
    async onLoad () {
      let res = await this.getArtComment()
      this.offset = res.last_id
      if (res.results.length === 0) {
        this.finished = true
      }
      this.comments.push(...res.results)
      this.loading = false
    },
    getArtComment () {
      const params = {
        type: this.art_type,
        source: this.comId || this.art_id,
        offset: this.offset,
        limit: this.limit
      }
      return getComment(params)
    },
    async clickPraise (i, item) {
      if (!this.$isLogin()) {
        return
      }
      const target = item.com_id.toString()
      if (item.is_liking) {
        await cancelCommentPraise(target)
        this.comments[i].like_count--
        this.comments[i].is_liking = false
        return
      }
      await commentPraise(target)
      this.comments[i].like_count++
      this.comments[i].is_liking = true
    }
  }
}
</script>

<style lang="less" scoped>
.comment-list {
  display: flex;
  padding: 20px 0;
}
.comment-content {
  flex: 1;
  display: flex;
  flex-direction: column;

  .com-user-info {
    font-size: 28px;
    width: 100%;

    padding-bottom: 16px;

    .praise {
      float: right;
      font-size: 28px;

      i {
        font-size: 28px;
      }
    }
  }
  .com-text {
    word-break: break-all;
  }
  .com-operation {
    font-size: 28px;
    padding-top: 16px;

    a {
      float: right;
      color: #333333;
    }
  }
}
.comment-photo {
  padding: 0 20px;
  width: 80px;
  border-radius: 50%;

  img {
    border-radius: 50%;
  }
}
</style>
