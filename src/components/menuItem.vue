<template>
  <view class="menu-item" @tap="linkTo">
    <image mode="widthFix" :src="icon" />
    <view class="desc">{{ title }}</view>
  </view>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      default: () => '',
    },
    title: {
      type: String,
      default: () => '',
    },
    link: {
      type: String,
      default: () => '',
    },
  },

  methods: {
    linkTo() {
      if (this.link) {
        uni.navigateTo({ url: this.link });
      } else {
        uni.showToast({
          title: '建设中，敬请期待',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-item {
  padding: 30rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 187.5rpx;
  image {
    width: 70%;
    display: block;
  }
  .desc {
    margin-top: 15rpx;
    font-size: 26rpx;
    color: #666;
  }
}
</style>
