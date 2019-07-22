<template>
  <div class="add-comment">
    <div class="input-box">
      <input v-model="commentText" type="text">
    </div>
    <button
      @click="handleAddComment"
      :disabled="!commentText.trim().length">发布
    </button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'WriteComment',
  inject: ['art_id'],
  props: {
    showCommentList: {
      type: Boolean,  
      default: false
    },
    comId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      commentText: ''
    }
  },
  methods: {
    async handleAddComment () {
      const data = {
        content: this.commentText.trim()
      }
      if (this.showCommentList) {
        Object.assign(data, {
          art_id: this.art_id,
          target: this.comId
        })
      } else {
        Object.assign(data, {
          target: this.art_id
        })
      }
      let res = await addComment(data)
      this.$emit('onWriteComment', {
        content: this.commentText,
        type: this.showCommentList ? 'c' : 'a'
      })
      this.commentText = ''
    }
  }
}
</script>

<style lang="less" scoped>
.add-comment {
  z-index: 999;
  display: flex;
  width: 100%;
  position: fixed;
  bottom: 10px;

  input {
    border: 0;
    width: 100%;
  }
  button {
    display: block;
    box-sizing: border-box;
    margin-right: 30px;
    padding: 20px 40px;
    width: 20%;
    height: 100%;
    border: 0;
    background-color: #fff;
    border: 1px solid #000;
  }
  .input-box {
    width: 65%;
    border-radius: 40px;
    background-color: #fff;
    padding: 20px 40px;
    border: 1px solid #ccc;
  }
}
</style>
