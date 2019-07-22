<template>
  <div>
    <van-nav-bar
      left-arrow
    >
      <div slot="left" class="auth-info">
        <div class="fl">
          <img class="auth-photo" :src="authorPhoto" width="46" height="46">
        </div>
        <div class="fl">
          <p v-text="authorName"></p>
          <p>{{ pubdate | relativeTime}}</p>
        </div>
      </div>
      <div slot="right">
        <van-button
        :type="isFollowed ? 'default' : 'danger'"
        @click="collectAuthor"
        :disabled="isLoading"
        :loading="isLoading"
        :loading-text="isFollowed ? '取消关注' : '关注'">
          {{ isFollowed ? '取消关注' : '关注' }}
        </van-button>
      </div>
    </van-nav-bar>
  </div>
</template>

<script>
import { attentionAuthor, cancelAttentionAuthor } from '@/api/user'
export default {
  name: 'AuthInfo',
  props: {
    authorPhoto: {
      type: String,
      default: '@/assets/img404.jpg'
    },
    authorName: {
      type: String,
      default: ''
    },
    pubdate: {
      type: String,
      default: ''
    },
    autId: {
      type: Number
    },
    isFollowed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    async collectAuthor () {
      this.isLoading = true
      if (this.isFollowed) {
        await cancelAttentionAuthor(this.autId)
        this.$emit('update:is-followed', false)
      } else {
        await attentionAuthor(this.autId)
        this.$emit('update:is-followed', true)
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.fl {
  float: left;
}
.fr {
  float: right;
}
.auth-info {
  line-height: initial;
  height: 100%;
}
.auth-photo {
  display: block;
  border-radius: 50%;
}
</style>
