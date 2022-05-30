<template>
  <view class="content">
    <view class="header"></view>
    <view class="body">
      <MenuItem
        v-for="menu in menuList"
        :key="menu.icon"
        :icon="menu.icon"
        :title="menu.title"
        :link="menu.link"
      />
    </view>
    <view class="foot"> </view>
  </view>
</template>

<script>
import MenuItem from '../../components/menuItem.vue';
import menu from './menu';

export default {
  components: {
    MenuItem,
  },
  data() {
    return {
      menuList: menu.menuList,
    };
  },
  onLoad() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.body {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
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
