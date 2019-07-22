<template>
  <div>
    <van-nav-bar
      title="搜索结果"
      left-text="返回"
      left-arrow
      @click-left="$router.push('/search')"/>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad">
      <van-cell
      v-for="item in result"
      :title="item.title"
      :key="item.art_id"/>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult, getHistories, delHistories } from '@/api/search'
export default {
  name: 'search-result',
  data () {
    return {
      loading: false,
      finished: false,
      page: 1,
      result: []
    }
  },
  // 第一次进入会将其缓存
  // activated () {
    // this.loading = true
    // this.onLoad()
  // },
  // 当停用时触发
  deactivated () {
    // this.page = 1
    // this.result = []
    // 销毁组件
    this.$destroy()
  },
  computed: {
    q () {
      return this.$route.params.q
    }
  },
  methods: {
    async onLoad () {
      await this.$sleep(300)
      // 异步请求需要加载
      const res = await this.loadResult()
      if (!res.results.length) {
        this.loading = false
        this.finished = true
        return
      }
      this.result.push(...res.results)
      this.page += 1
      this.loading = false
    },
    loadResult () {
      return getSearchResult(this.page, 10, this.q)
    }
  }
}
</script>

<style scoped>
</style>
