<template>
  <div class="salary-content">
    <div class="result-container">
      <div class="salary-result">
        <div class="salary-title">税后年终奖</div>
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
        <div class="condition-lb">
          税前年终奖<span class="need-tian">*</span>
        </div>
        <input
          type="text"
          class="condition-input"
          v-model="salaryValue"
          placeholder="请输入税前年终奖"
        />
      </div>
      <div class="condition-input">
        <div class="condition-lb">是否按照累积计税</div>
        <switch :checked="isReversoChecked" @change="setChecked"></switch>
      </div>

      <div class="condition-input" v-if="isReversoChecked">
        <div class="condition-lb">年度累积收入</div>
        <input
          type="text"
          class="condition-input"
          v-model="totalValue"
          placeholder="除年终奖年外全年累积应税收入"
        />
      </div>
    </div>
    <div class="cal-btn" @tap="beginCal">计算</div>
    <div class="result-detail-container"></div>
  </div>
</template>
<script>
export default {
  mounted() {},
  data() {
    return {
      salaryValue: 0,
      realSalary: 0,
      rateVal: 0,
      bxVal: 0,
      gjjVal: 0,
      isReversoChecked: false,
      totalValue: '',
    };
  },
  onShow() {},
  methods: {
    setChecked(e) {
      this.isReversoChecked = e.detail.value;
    },
    reset() {
      this.salaryValue = 0;
      this.realSalary = 0;
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
    yearEndRate(val) {
      const monthVal = val / 12;
      if (monthVal <= 3000) {
        return val * 0.03;
      }
      if (monthVal <= 12000) {
        return val * 0.1 - 210;
      }
      if (monthVal <= 25000) {
        return val * 0.2 - 1410;
      }
      if (monthVal <= 35000) {
        return val * 0.25 - 2660;
      }
      if (monthVal <= 55000) {
        return val * 0.3 - 4410;
      }
      if (monthVal <= 80000) {
        return val * 0.35 - 7160;
      }
      if (monthVal > 80000) {
        return val * 0.45 - 15160;
      }

      return 0;
    },
    beginCal() {
      if (this.isReversoChecked) {
        //累积扣税
        if (this.totalValue) {
          const totalValue = +this.totalValue;
          console.log('年终奖', this.salaryValue);
          console.log('除年终奖收入', totalValue);
          const totalRate = this.reversoContextRate(
            +this.salaryValue + totalValue,
            12
          );
          const hasRate = this.reversoContextRate(totalValue, 12);
          console.log('总税收', totalRate);
          console.log('除年终奖税收', hasRate);
          const yearRate = totalRate - hasRate;
          this.realSalary = (+this.salaryValue - yearRate).toFixed(2);
          this.rateVal = yearRate.toFixed(2);
          console.log('税后收入', this.realSalary);
        } else {
          uni.showToast({
            title: '请输入年收入',
          });
        }
      } else {
        //独立扣税
        const yearRate = this.yearEndRate(+this.salaryValue);
        this.realSalary = (+this.salaryValue - yearRate).toFixed(2);
        this.rateVal = yearRate.toFixed(2);
      }
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
        width: 300rpx;
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
