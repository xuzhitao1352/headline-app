<template>
  <div class="app-search">
    <van-nav-bar
      right-text="搜索"
      left-arrow
      @click-left="$router.push('/')"
      @click-right="handleSearch(searchText)">
      <van-search
      slot="title"
      placeholder="请输入搜索关键词"
      @keyup.13="handleSearch(searchText)"
      v-model="searchText"
      @search="handleSearch(searchText)"
      v-focus="focus"/>
    </van-nav-bar>
    <van-cell-group v-if="!showHistories">
      <van-cell title="历史纪录">
        <div slot="default" class="del-search-his" @click="handleDelHis">
          <van-icon name="delete"></van-icon>
          <span>清空纪录</span>
        </div>
      </van-cell>
      <van-cell v-for="(item,index) in histories" :key="item">
        <div slot="title" @click="handleSearch(item)">
          {{ item }}
        </div>
        <div slot="right-icon">
          <van-icon name="close" @click="delActItem(index)"></van-icon>
        </div>
      </van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell
        v-for="item in relevanceWord"
        :key="item.art_id"
        icon="search"
        @click="handleSearch(item)">
        <div slot="title" v-html="hightlight(item, searchText)"></div>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getAssociate, getSearchResult, getHistories, delHistories } from '@/api/search'
import { debounce } from 'lodash'
import { Dialog } from 'vant'
export default {
  name: 'AppSearch',
  data () {
    return {
      focus: false,
      searchText: '',
      relevanceWord: [],
      histories: [],
      showHistories: false
    }
  },
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  computed: {
    getHistories () {
      return JSON.parse(window.localStorage.getItem('histories'))
    },
    disreHistories () {
      const his = this.histories
      const newHis = []
      for (let i = 0; i < his.length; i++) {
        if (newHis.indexOf(his[i]) === -1) {
          newHis.push(his[i])
        }
      }
      window.localStorage.setItem('histories', JSON.stringify(newHis))
      return window.localStorage.getItem('histories')
    }
  },
  created () {
    this.initHistories()
  },
  activated () {
    this.focus = true
    this.showHistories = false
    this.searchText = ''
    this.loadHistories()
  },
  watch: {
    searchText: debounce(async function (newVal) {
      const keyWord = newVal.trim()
      if (keyWord === '') {
        this.loadHistories()
        this.showHistories = false
        return
      }
      this.showHistories = true
      const res = await getAssociate(keyWord)
      this.relevanceWord = res.options
    }, 300)
  },
  methods: {
    delActItem (i) {
      this.histories.splice(i, 1)
      window.localStorage.setItem('histories', this.disreHistories)
    },
    handleDelHis () {
      Dialog.confirm({
        title: '确定吗？'
      }).then(() => {
        window.localStorage.setItem('histories', [])
        this.histories = []
      }).catch(() => {
      });
    },
    async loadHistories () {
      this.histories = JSON.parse(window.localStorage.getItem('histories'))
    },
    initHistories () {
      if (this.getHistories === null) {
        window.localStorage.setItem('histories', JSON.stringify([]))
      }
    },
    async handleSearch (q) {
      if (q === "") {
        return
      }
      this.histories.unshift(q)
      window.localStorage.setItem("histories", this.disreHistories)
      this.$router.push({ name: 'search-result', params: { q } })
    },
    hightlight (item, searchText) {
      return item.toLowerCase().split(searchText).join(`<span style="color: red;">${searchText}</span>`)
    }
  }
}
</script>

<style lang="less" scoped>
.del-search-his {
  width: 140px;
  float: right;
}
.red {
  color: red;
}
.app-search {
  /deep/ .van-icon {
    color: #000;
  }
  /deep/ .van-nav-bar__text {
    color: #000;
  }
  /deep/ .van-nav-bar__title {
    max-width: 75%;
    width: 100%;

    /deep/ .van-search {
      padding: 10px;
    }
  }
}
</style>
