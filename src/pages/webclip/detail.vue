<template>
  <div class="img-content">
    <image
      mode="widthFix"
      v-if="imgLink"
      :src="imgLink"
      alt=""
      @tap="preview"
    />
    <div class="save-btn" @tap="savePic">保存</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
    };
  },

  computed: {
    imgLink() {
      if (this.name) {
        const path1 = this.name.substring(0, 2);
        const path2 = this.name.substring(2, 4);
        return `https://api.xiaowenzhao.com/fs/${path1}/${path2}/${this.name}`;
      }
      return '';
    },
  },

  methods: {
    preview() {
      uni.previewImage({
        urls: [this.imgLink],
        current: 0,
      });
    },
    savePic() {
      uni.showLoading({ title: '下载中' });
      return new Promise((res, rej) => {
        uni.downloadFile({
          url: this.imgLink,
          success(result) {
            uni.hideLoading();
            console.log(result);
            uni.saveImageToPhotosAlbum({
              filePath: result.tempFilePath,
              success(ret) {
                console.log(ret);
                uni.showToast({ title: '保存成功' });
                res(ret);
              },
              fail(e) {
                uni.showToast({ title: '保存失败' });
                console.log(e);
                rej(e);
              },
            });
          },
          fail(e) {
            uni.hideLoading();
            uni.showToast({ title: '下载失败' });
            console.log(e);
            rej(e);
          },
          complete() {
            uni.hideLoading();
          },
        });
      });
    },
  },

  onLoad({ name }) {
    // this.test();
    this.name = name;
  },
  onShow() {},

  created() {
    // let app = getApp()
  },
};
</script>

<style lang="scss" scoped>
.img-content {
  position: relative;
  width: 100%;
  padding-bottom: 80rpx;
  image {
    display: block;
    width: 100%;
  }
  .save-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 80rpx;
    background: #9dda81;
    color: #ffffff;
    z-index: 1;
    text-align: center;
    line-height: 80rpx;
  }
}
</style>
