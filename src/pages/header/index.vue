<template>
  <div class="img-content">
    <div class="photo-list">
      <block v-for="(item, index) in pics" :key="item">
        <div class="photo-item lf" @tap="preview(index, 0)">
          <img :src="item['img_arr1'].imgurl" mode="widthFix" />
        </div>
        <div class="photo-item ri" @tap="preview(index, 1)">
          <img :src="item['img_arr2'].imgurl" mode="widthFix" />
        </div>
      </block>
    </div>
  </div>
</template>
<script>
import { request } from '../../common/util/request';
export default {
  data() {
    return {
      pics: [],
      pno: 1,
      psize: 20,
    };
  },
  onLoad() {
    this.loadMorePics(true);
  },
  onReachBottom() {
    if (this.loading) return;
    console.log('触底了');
    this.loadMorePics();
  },
  onShareAppMessage() {
    return {
      title: '总有一款情侣头像适合你',
      path: '/pages/header/index?_from=share',
    };
  },
  computed: {
    allPicLink() {
      const ret = [];

      this.pics.forEach((item) => {
        ret.push(item['img_arr1'].imgurl);
        ret.push(item['img_arr2'].imgurl);
      });

      return ret;
    },
  },
  methods: {
    async loadMorePics(isReset) {
      if (isReset) {
        this.pics = [];
        this.pno = 1;
      }
      uni.showLoading({
        title: '加载中',
      });
      this.loading = true;
      try {
        const ret = await request({
          url: 'https://ntx.qqtn.com/api/couple/index',
          method: 'POST',
          data: {
            page: this.pno,
            page_size: this.psize,
          },
        });
        console.log('情侣头像数据', ret);
        const { code, data } = ret;
        if (code === 1) {
          this.pics = this.pics.concat(data.couple_list || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        uni.hideLoading();
        this.loading = false;
      }
    },
    preview(itemIdx, index) {
      uni.previewImage({
        urls: this.allPicLink,
        current: 2 * itemIdx + index,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.photo-list {
  display: flex;
  flex-wrap: wrap;
  .photo-item {
    width: 330rpx;
    height: 330rpx;
    margin: 15rpx;
    overflow: hidden;
    display: flex;
    justify-content: center;
    flex-direction: column;
    border-radius: 30rpx;
    img {
      width: 100%;
      display: block;
    }
  }
  .lf {
    margin-left: 30rpx;
  }
  .ri {
    margin-right: 30rpx;
  }
}
</style>
