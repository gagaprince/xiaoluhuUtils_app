<template>
  <div class="salary-content">
    <div class="result-container">
      <div class="salary-result">
        <div class="salary-title">税后所得</div>
        <div class="salary"><span>10000</span><span class="dan">元</span></div>
      </div>
      <div class="detail">
        <div class="detail-item">
          <div class="detail-item-lb">个税：</div>
          <div class="detail-item-val">0</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-lb">保险：</div>
          <div class="detail-item-val">0</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-lb">公积金：</div>
          <div class="detail-item-val">0</div>
        </div>
      </div>
    </div>
    <div class="condition-container">
      <div class="condition-input">
        <div class="condition-lb">城市</div>
        <div class="condition-lb1">北京</div>
      </div>
      <div class="condition-input">
        <div class="condition-lb">税前工资</div>
        <input
          type="text"
          class="condition-input"
          placeholder="请输入税前工资"
        />
      </div>
      <div class="condition-input">
        <div class="condition-lb">保险基数</div>
        <input
          type="text"
          class="condition-input"
          placeholder="请输入保险基数 默认全额"
        />
      </div>
    </div>
    <div class="result-detail-container"></div>
  </div>
</template>
<script>
export default {};
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
