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
import { getSelf } from '../../common/util/request';
const LOCAL_MENU_LIST_KEY = 'local_menu_list_key';

export default {
  components: {
    MenuItem,
  },
  data() {
    return {
      menuList: menu.menuList,
    };
  },
  mounted() {
    this.loadMenuFormLocal();
    this.loadMenu();
  },
  onLoad() {},
  methods: {
    loadMenuFormLocal() {
      const menuList = wx.getStorageSync(LOCAL_MENU_LIST_KEY);
      this.menuList = menuList;
    },
    async loadMenu() {
      const ret = await getSelf('/wx/mcc', {
        key: 'utils-menu-list',
      });
      if (ret.code === 0) {
        console.log(ret.data);
        if (ret.data) {
          const menuList = JSON.parse(ret.data);
          wx.setStorageSync(LOCAL_MENU_LIST_KEY, menuList);
          this.menuList = menuList;
        }
      }
    },
  },
  onShareAppMessage() {
    return {
      title: '万能口袋王，收集常用的互联网工具包，给你的在线生活提供助力',
      path: '/pages/index/index?_from=share',
    };
  },
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
