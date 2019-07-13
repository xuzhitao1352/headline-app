<template>
  <div>
    <van-popup
      :value="value"
      @input="$emit('input', $event)"
      position="bottom"
      :style="{ height: '95%' }">
      <div class="channel">
        <van-icon class="popup-close" name="cross" @click="handleClose"></van-icon>
        <div class="channel-my">
          <div class="channel-title">
            <h3>我的频道</h3>
            <span>点击进入频道</span>
            <van-button
              class="edit-btn"
              round
              plain
              type="danger"
              @click="isEdit = !isEdit">
            {{ isEdit ? '完成' : '编辑' }}
          </van-button>
          </div>
          <van-grid
          :gutter="10">
            <van-grid-item
              v-for="(item, index) in userChannels"
              :key="item.id"
              @click="handleMyChannel(item.id, index)">
              <van-icon v-show="isEdit" name="close"></van-icon>
              <span class="text" :class="{red: item.id === userChannels[activeChannel].id && !isEdit}">{{ item.name }}</span>
            </van-grid-item>
          </van-grid>
        </div>
        <div class="channel-all">
          <div class="channel-title">
            <h3>频道推荐</h3>
            <span>点击添加频道</span>
          </div>
          <van-grid
          :gutter="10"
          :border="false"
          clickable>
            <van-grid-item
              v-for="item in reAllChannel"
              :key="item.id"
              @click="handleAddChannel(item)">
                 <span class="text" :class="{ 'active-text': item.name.length >= 5 }"><i class="van-icon van-icon-add-o"></i> {{item.name}}</span>
            </van-grid-item>
          </van-grid>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getAllChannel } from '@/api/channel'

export default {
  name: 'HomeChannel',
  props: {
    // 控制频道列表展示，获取v-model的值
    value: {
      type: Boolean,
      default: false
    },
    userChannels: {
      type: Array,
      default: () => []
    },
    activeChannel: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.loadAllChannel()
  },
  computed: {
    // 计算属性
    reAllChannel () {
      let duplicates = this.userChannels.map(item => item.id)
      return this.allChannel.filter(item => !duplicates.includes(item.id))
    }
  },
  data () {
    return {
      allChannel: [],
      isEdit: false
    }
  },
  methods: {
    handleAddChannel (item) {
      const channelStr = window.localStorage.getItem('channels')
      const channels = JSON.parse(channelStr)
      channels.push(item)
      this.$emit('update:userChannels', channels)
      window.localStorage.setItem('channels', JSON.stringify(channels))
    },
    handleMyChannel (id, index) {
      if (!this.isEdit) {
        this.$emit('update:activeChannel', index)
        this.$emit('input', false)
        return
      }
      const channelStr = window.localStorage.getItem('channels')
      const channels = JSON.parse(channelStr)
      channels.splice(index, 1)
      this.$emit('update:userChannels', channels)
      window.localStorage.setItem('channels', JSON.stringify(channels))
    },
    handleClose () {
      this.$emit('input', false)
      this.isEdit = false
    },
    async loadAllChannel () {
      try {
        let { channels } = await getAllChannel()
        this.allChannel = channels
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  padding-top: 40px;
  .popup-close {
    font-size: 40px;
    position: absolute;
    top: 10px;
    left: 16px;
  }
  .channel-title {
    position: relative;
    padding-left: 20px;
    h3 {
      display: inline;
      font-size: 36px;
      font-weight: 400;
    }
    > span {
      color: #ccc;
      font-size: 24px;
    }
    .edit-btn {
      position: absolute;
      right: 20px;
      bottom: 10px;
      height: 46px;
      line-height: 1;
    }
  }

  /deep/ .van-grid-item__content {
    padding: 0;
    height: 70px;
    box-shadow: 0 0 5px 0 #ccc;
    .text {
      font-size: 26px;
      margin-top: 0;
      i {
        font-size: 30px;
        display: inline;
        vertical-align: middle;
      }
    }
    .red {
      color: red;
    }
    .active-text {
      font-size: 20px;
    }
  }
  .channel-my {
    /deep/ .van-grid-item__content {
      position: relative;
      background-color: #f2f2f2;
      box-shadow: 0 0 0 0;

      /deep/ .van-icon {
        position: absolute;
        top: -15px;
        right: -15px;
        font-size: 30px;
      }
    }
    /deep/ .van-grid-item__content:active {
      opacity: .8;
    }
  }
}
</style>
