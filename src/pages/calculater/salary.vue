<template>
  <div class="salary-content">
    <div class="result-container">
      <div class="salary-result">
        <div class="salary-title">税后所得</div>
        <div class="salary">
          <span>{{ realSalary }}</span
          ><span class="dan">元</span>
        </div>
      </div>
      <div class="detail">
        <div class="detail-item">
          <div class="detail-item-lb">个税：</div>
          <div class="detail-item-val">{{ rateVal }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-lb">保险：</div>
          <div class="detail-item-val">{{ bxVal }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-lb">公积金：</div>
          <div class="detail-item-val">{{ gjjVal }}</div>
        </div>
      </div>
    </div>
    <div class="condition-container">
      <div class="condition-input">
        <div class="condition-lb">城市</div>
        <div class="condition-lb1" @tap="gotoSelectCity">
          {{ cityInfo.name }}
        </div>
      </div>
      <div class="condition-input">
        <div class="condition-lb">税前工资<span class="need-tian">*</span></div>
        <input
          type="text"
          class="condition-input"
          v-model="salaryValue"
          placeholder="请输入税前工资"
          @focus="checkSalary"
        />
      </div>
      <div class="condition-input">
        <div class="condition-lb">保险基数</div>
        <input
          type="text"
          class="condition-input"
          v-model="bxBase"
          placeholder="请输入保险基数 默认全额"
        />
      </div>
      <div class="condition-input">
        <div class="condition-lb">公积金基数</div>
        <input
          type="text"
          class="condition-input"
          v-model="gjjBase"
          placeholder="请输入公积金基数 默认全额"
        />
      </div>
      <div class="condition-input">
        <div class="condition-lb">专项扣除</div>
        <input
          type="text"
          class="condition-input"
          v-model="rateMinus"
          placeholder="请输入个税扣减数 默认0"
        />
      </div>
      <!-- <div class="condition-input">
        <div class="condition-lb">年度累积收入</div>
        <input
          type="text"
          class="condition-input"
          placeholder="之前月份已有收入总和 可以不填"
        />
      </div> -->
      <div class="condition-input">
        <div class="condition-lb">计税周期</div>
        <input
          type="text"
          class="condition-input"
          v-model="rateTimes"
          placeholder="默认去年12月为基准计算"
        />
      </div>
    </div>
    <div class="cal-btn" @tap="beginCal">计算</div>
    <div class="result-detail-container"></div>
  </div>
</template>
<script>
import { request } from '../../common/util/request';
export default {
  mounted() {
    this.rateObj = {
      minBX: 0,
      maxBX: 1000000,
      minGJJ: 0,
      maxGJJ: 1000000,
    };
    this.getRateInfoByCity();
  },
  watch: {
    salaryValue(newVal, oldVal) {
      if (newVal) {
        let bxBase = 0;
        if (+newVal > this.rateObj.maxBX) {
          bxBase = this.rateObj.maxBX;
        } else {
          bxBase = newVal;
        }
        this.bxBase = bxBase;

        let gjjBase = 0;
        if (+newVal > this.rateObj.maxGJJ) {
          gjjBase = this.rateObj.maxGJJ;
        } else {
          gjjBase = newVal;
        }
        this.gjjBase = gjjBase;
      } else {
        this.bxBase = 0;
        this.gjjBase = 0;
      }
    },
  },
  data() {
    return {
      salaryValue: 0,
      bxBase: 0,
      gjjBase: 0,
      rateMinus: 0,
      rateTimes: '',
      realSalary: 0,
      rateVal: 0,
      bxVal: 0,
      gjjVal: 0,
      cityInfo: {
        name: '北京',
        value: 'beijing',
      },
    };
  },
  onShow() {
    const cityInfo = uni.getStorageSync('currentCity');
    if (cityInfo) {
      if (cityInfo.value !== this.cityInfo.value) {
        this.cityInfo = cityInfo;
        this.getRateInfoByCity();
        this.reset();
      }
    }
  },
  onShareAppMessage() {
    return {
      title: '工资计算器,来算算你能拿多少',
      path: '/pages/calculater/yearEnd?_from=share',
    };
  },
  methods: {
    checkSalary() {
      if (this.salaryValue == 0) {
        this.salaryValue = '';
      }
    },
    reset() {
      this.salaryValue = 0;
      this.realSalary = 0;
      this.rateVal = 0;
      this.bxVal = 0;
      this.gjjVal = 0;
      this.bxBase = 0;
      this.gjjBase = 0;
    },
    async getRateInfoByCity() {
      // https://www.shebaotong.com/shebaotong/area/getInsOrg?areaCode=shanghai
      const ret = await request({
        url: `https://www.shebaotong.com/shebaotong/area/getInsOrg?areaCode=${this.cityInfo.value}`,
        method: 'GET',
        data: {},
      });
      console.log('城市税收信息', ret);
      const { shebao } = ret;
      if (shebao) {
        const shebaoData = shebao[0] || {};
        const gjjData = (shebaoData.gongjijin || [])[0] || {};
        this.rateObj = {
          minBX: shebaoData.minBase || 0,
          maxBX: shebaoData.maxBase || 1000000,
          minGJJ: gjjData.minBase || 0,
          maxGJJ: gjjData.maxBase || 1000000,
        };
        console.log('current Rate info', this.rateObj);
      }
    },
    //累积缴税算法
    reversoContextRate(val, times) {
      const yingRateVal = val - 5000 * times; // 5000是免征额
      if (yingRateVal < 0) {
        return 0;
      }
      if (yingRateVal < 36000) {
        //低于36000 交3%税
        return yingRateVal * 0.03;
      }
      if (yingRateVal < 144000) {
        // 低于14.4w 交10% - 速算数
        return yingRateVal * 0.1 - 2520;
      }
      if (yingRateVal < 300000) {
        return yingRateVal * 0.2 - 16920;
      }
      if (yingRateVal < 420000) {
        return yingRateVal * 0.25 - 31920;
      }
      if (yingRateVal < 660000) {
        return yingRateVal * 0.3 - 52920;
      }
      if (yingRateVal < 960000) {
        return yingRateVal * 0.35 - 85920;
      }
      if (yingRateVal >= 960000) {
        return yingRateVal * 0.45 - 181920;
      }
      return 0;
    },
    beginCal() {
      console.log('beginCal');
      if (this.salaryValue) {
        const yanglaobx = this.bxBase * 0.08; //养老保险
        const yiliaobx = this.bxBase * 0.02 + 3; //医疗保险
        const shiyebx = this.bxBase * 0.005; //失业保险

        const bxTotal = yanglaobx + yiliaobx + shiyebx;

        const gjj = this.gjjBase * 0.12; //公积金

        const beforeRate =
          this.salaryValue -
          yanglaobx -
          yiliaobx -
          shiyebx -
          gjj -
          this.rateMinus; // 应税工资

        let rateTimes = new Date().getMonth() + 2;
        if (rateTimes > 12) {
          rateTimes = 1;
        }
        if (this.rateTimes) {
          rateTimes = +this.rateTimes;
        }

        const rate =
          this.reversoContextRate(beforeRate * rateTimes, rateTimes) -
          this.reversoContextRate(beforeRate * (rateTimes - 1), rateTimes - 1);

        const realVal = beforeRate - rate + +this.rateMinus;

        console.log('养老保险', yanglaobx);
        console.log('医疗保险', yiliaobx);
        console.log('失业保险', shiyebx);
        console.log('公积金', gjj);
        console.log('应税工资', beforeRate);
        console.log('计税周期', rateTimes);
        console.log('当前周期个税', rate);
        console.log('实际工资', realVal);

        this.realSalary = realVal.toFixed(2);
        this.bxVal = bxTotal.toFixed(2);
        this.gjjVal = gjj.toFixed(2);
        this.rateVal = rate.toFixed(2);
      } else {
        uni.showToast({
          title: '请先输入税前工资',
          icon: 'error',
        });
      }
    },
    gotoSelectCity() {
      uni.navigateTo({ url: '/pages/calculater/city/index' });
    },
  },
};
</script>

<style lang="scss" scoped>
.salary-content {
  background: #f8f8f8;
  min-height: 100vh;
  .result-container {
    background: #1ebc21;
    color: #f8f8f8;
    .salary-result {
      padding: 20rpx 20rpx 0 20rpx;
      height: 200rpx;
      .salary {
        margin-top: 20rpx;
        span {
          font-size: 80rpx;
          font-weight: bolder;
        }
        .dan {
          margin-left: 10rpx;
          font-size: 20rpx;
        }
      }
    }
    .detail {
      display: flex;

      .detail-item {
        display: flex;
        width: 33.33%;
        height: 80rpx;
        justify-content: start;
        align-items: center;
        background: #2e7c21;
        border-right: 1rpx solid #1ebc21;
        .detail-item-lb {
          margin-left: 20rpx;
          font-size: 24rpx;
          color: #cccccc;
        }
        .detail-item-val {
          font-size: 26rpx;
        }
      }
      .detail-item:last-child {
        border-right: 0;
      }
    }
  }
  .cal-btn {
    width: 600rpx;
    height: 80rpx;
    background: #1ebc21;
    color: #fff;
    margin: 30rpx auto;
    text-align: center;
    line-height: 80rpx;
    border-radius: 10rpx;
  }
  .condition-container {
    margin-top: 20rpx;
    border-top: 1rpx solid #e6e6e6;
    .condition-input {
      display: flex;
      height: 80rpx;
      align-items: center;
      border-bottom: 1rpx solid #e6e6e6;
      background: #fff;
      .condition-lb,
      .condition-lb1 {
        color: #999;
        width: 200rpx;
        font-size: 28rpx;
        .need-tian {
          color: red;
          margin-left: 10rpx;
        }
      }
      .condition-lb {
        margin-left: 20rpx;
      }
      .condition-input {
        flex: 1;
        display: block;
        border: none;
        padding-right: 20rpx;
      }
    }
  }
}
</style>
