<template>
  <div>
    <van-button
    :class="{ 'is-praise': !isPraise }"
    round
    plain
    :type="attitude === 1 ? 'danger' : 'default'"
    @click="handleLike"
    :disabled="isLoading"
    :loading="likeBtnLoading"
    :loading-text="isPraise ? '取消' : '赞'">
      <i class="vant-icon icon-like"></i>  
      <span>{{ isPraise ? '取消' : '赞' }}</span>
    </van-button>
    <van-button
    round
    plain
    :type="attitude === 0 ? 'danger' : 'default'"
    @click="handleDisLike"
    :disabled="isLoading"
    :loading="disLikeBtnLoading"
    loading-text="不喜欢">
      不喜欢
    </van-button>
  </div>
</template>

<script>
import { addEndorse, cancelEndorse, dislikesArticle, cencelDislikes } from '@/api/article'
export default {
  name: 'MoreAction',
  inject: ['art_id'],
  props: {
    attitude: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      isPraise: false,
      isTrample: false,
      disLikeBtnLoading: false,
      likeBtnLoading: false,
      isLoading: false
    }
  },
  methods: {
    async handleLike () {
      this.likeBtnLoading = true
      this.isLoading = true
      if (!this.$isLogin()) {
        return
      }
      if (this.attitude === 0 || this.attitude === -1) {
        await addEndorse(this.art_id)
        this.$emit('update:attitude', 1)
      } else {
        await cancelEndorse(this.art_id)
        this.$emit('update:attitude', -1)
      }
      this.isLoading = false
      this.likeBtnLoading = false
    },
    async handleDisLike () {
      this.disLikeBtnLoading = true
      this.isLoading = true
      if (!this.$isLogin()) {
        return
      }
      if (this.attitude === 1 || this.attitude === -1) {
        await dislikesArticle(this.art_id)
        this.$emit('update:attitude', 0)
      } else {
        await cencelDislikes(this.art_id)
        this.$emit('update:attitude', -1)
      }
      this.isLoading = false
      this.disLikeBtnLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.is-praise {
  padding: 0 40px;
}
</style>
