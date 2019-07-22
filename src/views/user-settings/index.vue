<template>
  <div class="user-settings">
    <van-nav-bar
      title="标题"
      left-text="返回"
      right-text="保存"
      left-arrow
      @click-left="$router.push('/my')"
      @click-right="handleSave"
    />
    <van-cell-group>
      <van-cell center title="头像" @click="$refs['file'].click()">
        <div slot="right-icon">
          <img class="user-photo" :src="user.photo" width="30" height="30">
          <van-icon class="first-icon" name="arrow"></van-icon>
        </div>
        <input ref="file" style="display: none;" type="file">
      </van-cell>
      <van-cell center title="昵称">
        <div slot="right-icon">
          <span>{{ user.name }}</span>
          <van-icon name="arrow"></van-icon>
        </div>
      </van-cell>
      <van-cell center title="性别">
        <div slot="right-icon">
          <span>{{ user.gender === 0 ? '男' : '女' }}</span>
          <van-icon name="arrow"></van-icon>
        </div>
      </van-cell>
      <van-cell center title="生日">
        <div slot="right-icon">
          <span>{{ user.birthday }}</span>
          <van-icon name="arrow"></van-icon>
        </div>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import {
  getUserProfile,
  updateUserProfile,
  updateUserProfilePhoto
} from '@/api/user'

export default {
  name: 'AppUserSettings',
  data () {
    return {
      user: ''
    }
  },
  computed: {
    file () {
      return this.$refs['file']
    }
  },
  created () {
    this.handleUserProfile()
  },
  mounted () {
    this.file.addEventListener('change', this.handleFileChange)
  },
  deactivated () {
    this.$destroy()
  },
  methods: {
    async handleUserProfile () {
      const res = await getUserProfile()
      this.user = res
    },
    /**
     * 转换
     * @return {[type]} [description]
     */
    handleFileChange () {
      const file = this.file.files[0]
      const reader = new FileReader()
      // 转换成base64
      reader.readAsDataURL(file)
      // 图片加载事件
      reader.addEventListener('load', () => {
        this.user.photo = reader.result
      })
    },
    async handleSave () {
      try {
        let r1 = Promise.resolve()
        // 一、如果用户选择了文件，则请求上传图片
        if (this.file.files[0]) {
          r1 = this.uploadPhoto()
        }
        // 二、请求更新用户信息
        const r2 = updateUserProfile({
          name: this.user.name,
          gender: this.user.gender,
          birthday: this.user.birthday
        })
        await Promise.all([r1, r2])
        this.$toast('更新成功')
      } catch (err) {
        this.$toast.fail('更新用户信息失败')
      }
    },
    uploadPhoto () {
      /**
       * 《接口要求 Content-Type 为 multipart/form-data 的处理》
       */
      const formData = new FormData()
      formData.append('photo', this.file.files[0])
      return updateUserProfilePhoto(formData)
    }
  }
}
</script>

<style lang="less" scoped>
.user-photo {
  vertical-align: middle;
  border-radius: 50%;
}
.user-settings {
  /deep/ .van-icon-arrow {
    vertical-align: middle;
    margin-left: 10px;
  }
}
</style>
