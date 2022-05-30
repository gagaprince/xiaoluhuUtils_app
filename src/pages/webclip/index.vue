<template>
  <div class="link-fr">
    <textarea
      :value="linkContent"
      maxlength="-1"
      @input="onInput"
      @blur="onBlur"
      class="link-text"
      placeholder="请输入网页链接"
    ></textarea>
    <div class="link-btn" @tap="beginClip">开始截图</div>
    <div class="past-btn" @tap="pastContent">粘贴</div>
  </div>
</template>

<script>
import { request } from '../../common/util/request';
export default {
  data() {
    return {
      linkContent: '',
    };
  },

  methods: {
    onBlur(e) {
      this.linkContent = e.mp.detail.value;
    },
    onInput(e) {
      this.linkContent = e.mp.detail.value;
    },
    beginClip() {
      setTimeout(() => {
        this.clipWeb(this.linkContent);
      }, 300);
    },
    toDetailPage(name) {
      uni.navigateTo({ url: `/pages/webclip/detail?name=${name}` });
    },

    async clipWeb(link) {
      uni.showLoading({ title: '截图中' });
      let ret;
      try {
        ret = await request({
          url: 'https://api.xiaowenzhao.com/api/v1/web2img',
          method: 'POST',
          timeout: 60000,
          data: {
            type: 'jpeg',
            url: link,
            mode: 'mobile',
            formId: '',
          },
        });
        console.log(ret);
        uni.hideLoading();
        const { name, title } = ret;
        this.toDetailPage(name);
      } catch (e) {
        console.log(e);
        uni.hideLoading();
      }
    },

    pastContent() {
      const _this = this;
      wx.getClipboardData({
        success(res) {
          if (res.data) {
            _this.linkContent = res.data;
          }
        },
      });
    },
  },

  onLoad() {
    // this.test();
    uni.showShareMenu();
  },
  onShow() {},

  created() {
    // let app = getApp()
  },
};
</script>

<style scoped>
.link-fr {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
textarea {
  margin-top: 30rpx;
}
.link-text {
  background: #f6f6f6;
  width: 650rpx;
  padding: 20rpx;
}
.link-btn,
.past-btn {
  display: block;
  width: 690rpx;
  height: 80rpx;
  margin-top: 30rpx;
  border-radius: 10rpx;
  background: #000000;
  color: #f6f6f6;
  font-size: 36rpx;
  text-align: center;
  line-height: 80rpx;
}
.past-btn {
  width: 120rpx;
  height: 60rpx;
  line-height: 60rpx;
  position: absolute;
  right: 10rpx;
  bottom: 150rpx;
  font-size: 30rpx;
}
</style>
