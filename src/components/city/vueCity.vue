<template>
  <div name="slide">
    <div class="vue-city-container" ref="vueContainer">
      <scroll-view
        class="vue-city-scroll"
        scroll-y="true"
        :scroll-into-view="viewId"
      >
        <div class="vue-city-content" id="key-hot" ref="vueCityContent">
          <div class="hot-city-list-box">
            <span class="hot-title">热门城市</span>
            <div class="hot-city-list">
              <span
                v-for="(item, index) in hotCityList"
                :key="index"
                @click="clickCity(item)"
                >{{ item.cityName }}</span
              >
            </div>
          </div>
          <div class="city-sort-box">
            <div class="city-panel" v-for="(item, index) in chars" :key="index">
              <div class="sort_letter" :id="'key-' + item">
                {{ item.toUpperCase() }}
              </div>
              <div class="sort_item">
                <div
                  class="sort_name"
                  v-for="(item1, index1) in cityList[item]"
                  :key="index1"
                  @click="clickCity(index1, item)"
                >
                  {{ item1.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="slidebar">
          <ul>
            <li
              v-for="(item, index) in chars"
              :key="index"
              @tap="cityWordTap(item)"
            >
              {{ item.toUpperCase() }}
            </li>
          </ul>
        </div>
        <div class="toast" v-show="isSHowToast">
          {{ toast }}
        </div>
      </scroll-view>
    </div>
  </div>
</template>
<script>
import { request } from '../../common/util/request';
const cityList = require('./city.js').citys;
export default {
  name: 'vue-city',
  props: {
    hotCityList: {
      probeType: Array,
      default: [
        { cityName: '深圳市' },
        { cityName: '上海市' },
        { cityName: '北京市' },
        { cityName: '广州市' },
        { cityName: '杭州市' },
        { cityName: '武汉市' },
        { cityName: '天津市' },
        { cityName: '南京市' },
        { cityName: '成都市' },
      ],
    },
  },
  data: function () {
    return {
      isSHowToast: false,
      toast: '',
      cityList: [],
      chars: 'abcdefghijklmnopqrstuvwxyz'.split(''),
      viewId: 'key-hot',
    };
  },

  created() {},
  mounted() {
    this.$nextTick(() => {
      this.loadCityData();
    });
  },
  methods: {
    async loadCityData() {
      const ret = await request({
        url: `https://www.shebaotong.com/shebaotong/area/all?_=${Date.now()}`,
        method: 'GET',
        data: {},
      });
      if (ret.status === '200') {
        console.log(ret);
        this.cityList = ret.list;
      }
    },
    clickCity(index, char) {
      if (char) {
        this.$emit('changeCity', this.cityList[char][index]);
      } else {
        this.$emit('changeCity', index);
      }
    },
    cityWordTap(words) {
      console.log(words);
      this.viewId = `key-${words}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.vue-city-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f4f4f4;
  .vue-city-scroll {
    height: 100vh;
  }
  .vue-city-content {
    // height: 100%;

    .hot-city-list-box {
      background: #f8f8f8;
      border-top: 1px solid #e5e5e5;
      .hot-title {
        font-size: 13px;
        color: #999;
        padding: 9px 0 9px 15px;
        display: block;
      }
      .hot-city-list {
        -webkit-column-count: 3;
        column-count: 3;
        padding: 0 30px 0 15px;
        -webkit-column-gap: 2px;
        column-gap: 2px;
        span {
          width: 90%;
          height: 39px;
          font-size: 13px;
          line-height: 39px;
          color: #333;
          display: block;
          border: 1px solid #999;
          border-radius: 6px;
          text-align: center;
          margin-bottom: 10px;
          background: #fff;
        }
      }
    }
    .city-sort-box {
      width: 100%;
      border-top: 1px solid #e5e5e5;
      .sort_letter {
        height: 30px;
        line-height: 30px;
        padding-left: 15px;
        background: #f8f8f8;
        font-size: 13px;
        color: #999;
        border-bottom: 1px solid #e5e5e5;
      }
      .sort_item {
        padding-left: 15px;
        position: relative;
        .sort_name {
          height: 40px;
          line-height: 40px;
          color: #333;
          font-size: 15px;
          border-bottom: 1px solid #e5e5e5;
        }
      }
    }
  }
  .toast {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 100px;
    height: 100px;
    border-radius: 3px;
    background: #ccc;
    color: #333;
    font-size: 20px;
    text-align: center;
    line-height: 100px;
    box-shadow: 0 3px 3px #ccc;
  }
  .slidebar {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: 30px;
    text-align: center;
    font-size: 12px;
    z-index: 99;
    font-size: 13px;
    color: #1c94eb;
    ul {
      background: #fff;
      padding: 10px 0;
      border-radius: 10px;
      li {
        list-style: none;
        height: 3vh;
      }
    }
  }
}
</style>
