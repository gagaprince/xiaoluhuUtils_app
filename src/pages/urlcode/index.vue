<template>
  <div class="link-fr">
    <div class="encode-content">
      <textarea
        :value="linkContent"
        maxlength="-1"
        @input="onInput"
        @blur="onBlur"
        class="link-text"
        placeholder="待转码的链接 或 解码后的链接"
      ></textarea>
      <div class="past-btn" @tap="pastContent(false)">粘贴</div>
      <div class="cp-btn" @tap="cpContent(false)">复制</div>
    </div>
    <div class="link-btn" @tap="scanQrCode(false)">扫码录入待转码链接</div>

    <div class="link-btn" @tap="beginEncode">urlEncode转码</div>

    <div class="encode-content">
      <textarea
        :value="encodeLinkContent"
        maxlength="-1"
        class="link-text"
        @input="onDecodeInput"
        @blur="onDecodeBlur"
        placeholder="转码后链接 或 待解码的链接"
      ></textarea>
      <div class="past-btn" @tap="pastContent(true)">粘贴</div>
      <div class="cp-btn" @tap="cpContent(true)">复制</div>
    </div>
    <div class="link-btn" @tap="scanQrCode(true)">扫码录入待解码链接</div>

    <div class="link-btn" @tap="beginDecode">urlEncode解码</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      linkContent: '',
      encodeLinkContent: '',
    };
  },

  methods: {
    onBlur(e) {
      this.linkContent = e.mp.detail.value;
    },
    onInput(e) {
      this.linkContent = e.mp.detail.value;
    },
    onDecodeInput(e) {
      this.encodeLinkContent = e.mp.detail.value;
    },
    onDecodeBlur(e) {
      this.encodeLinkContent = e.mp.detail.value;
    },
    scanQrCode(isDecode) {
      console.log('开始扫码');
      const _this = this;
      uni.scanCode({
        success(res) {
          console.log(res);
          if (isDecode) {
            _this.encodeLinkContent = res.result;
          } else {
            _this.linkContent = res.result;
          }
        },
      });
    },

    beginEncode() {
      this.encodeLinkContent = encodeURIComponent(this.linkContent);
    },
    beginDecode() {
      this.linkContent = decodeURIComponent(this.encodeLinkContent);
    },

    pastContent(isDecode) {
      const _this = this;
      wx.getClipboardData({
        success(res) {
          if (res.data) {
            if (isDecode) {
              _this.encodeLinkContent = res.data;
            } else {
              _this.linkContent = res.data;
            }
          }
        },
      });
    },
    cpContent(isDecode) {
      if (isDecode) {
        uni.setClipboardData({
          data: this.encodeLinkContent,
          success(res1) {
            console.log(res1);
          },
        });
      } else {
        uni.setClipboardData({
          data: this.linkContent,
          success(res1) {
            console.log(res1);
          },
        });
      }
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

<style lang="scss" scoped>
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
  height: 160rpx;
  padding: 20rpx;
}
.link-btn,
.past-btn,
.save-btn,
.cp-btn {
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
.past-btn,
.cp-btn {
  width: 120rpx;
  height: 60rpx;
  line-height: 60rpx;
  position: absolute;
  right: 10rpx;
  top: 120rpx;
  font-size: 30rpx;
}
.past-btn {
  top: 30rpx;
}
.encode-content {
  margin-top: 30rpx;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .cp-btn {
  }
}
</style>
