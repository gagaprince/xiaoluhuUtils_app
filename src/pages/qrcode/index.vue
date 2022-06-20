<template>
  <div class="link-fr">
    <textarea
      :value="linkContent"
      maxlength="-1"
      @input="onInput"
      @blur="onBlur"
      class="link-text"
      placeholder="请输入要转为二维码的文字"
    ></textarea>
    <div class="link-btn" @tap="beginQrCode">生成二维码</div>
    <div class="link-btn" @tap="scanQrCode" v-if="!showQrcode">扫描二维码</div>
    <div class="past-btn" @tap="pastContent">粘贴</div>
    <div v-show="showQrcode">
      <div class="canvas-fr">
        <canvas class="my-canvas" canvas-id="myQrcode"></canvas>
        <div class="save-btn" @tap="saveImg">保存二维码</div>
      </div>
    </div>
  </div>
</template>

<script>
import drawQrcode from 'weapp-qrcode';
export default {
  data() {
    return {
      linkContent: '',
      showQrcode: false,
    };
  },

  methods: {
    onBlur(e) {
      this.linkContent = e.mp.detail.value;
    },
    onInput(e) {
      this.linkContent = e.mp.detail.value;
      this.showQrcode = false;
    },
    scanQrCode() {
      console.log('开始扫码');
      const _this = this;
      uni.scanCode({
        success(res) {
          console.log(res);
          _this.linkContent = res.result;
          wx.setClipboardData({
            data: res.result,
            success(res1) {
              console.log(res1);
            },
          });
        },
      });
    },
    beginQrCode() {
      setTimeout(() => {
        this.createQRCode(this.linkContent);
      }, 300);
    },
    toDetailPage(name) {
      uni.navigateTo({ url: `/pages/webclip/detail?name=${name}` });
    },

    createQRCode(link) {
      console.log('生成二维码：', link);
      console.log(400 * this.scale);
      drawQrcode({
        width: 500 * this.scale,
        height: 500 * this.scale,
        canvasId: 'myQrcode',
        text: link,
      });
      this.showQrcode = true;
    },

    pastContent() {
      const _this = this;
      wx.getClipboardData({
        success(res) {
          if (res.data) {
            _this.linkContent = res.data;
            _this.showQrcode = false;
          }
        },
      });
    },
    saveImg() {
      console.log('保存图片');
      uni.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 500 * this.scale,
        height: 500 * this.scale,
        canvasId: 'myQrcode',
        success: function (res) {
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(ret) {
              console.log(ret);
              uni.showToast({ title: '保存成功' });
            },
            fail(e) {
              uni.showToast({ title: '保存失败' });
              console.log(e);
            },
          });
        },
      });
    },

    calcuWidth() {
      const sysInfo = uni.getSystemInfoSync();
      const innerWidth = sysInfo.screenWidth;
      this.scale = innerWidth / 750;
    },
  },

  onLoad() {
    // this.test();
    uni.showShareMenu();
    this.calcuWidth();
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
.save-btn {
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
  top: 120rpx;
  font-size: 30rpx;
}
.canvas-fr {
  margin-top: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .my-canvas {
    width: 500rpx;
    height: 500rpx;
    background: #ff0000;
  }
  .save-btn {
    width: 500rpx;
    margin-top: 50rpx;
  }
}
</style>
