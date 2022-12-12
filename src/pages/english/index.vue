<template>
    <div class="english-content">
        <div class="english-tt">
            <div class="english-head-im">
                <div class="im-fr">
                    <img mode="widthFix" src="https://pic1.zhimg.com/v2-98d09578a572ec96b07b6f31e6f8c2c0_b.jpg" alt="">
                </div>
            </div>
            <div class="english-search-btn">
                <div class="search-btn">
                    <!-- <img mode="widthFix" src="https://thumb.silhouette-ac.com/t/cc/cc841ee35f075ad94fa110f2a1e19128_t.jpeg" alt=""></img> -->
                </div>             
                搜索
            </div>
        </div>
        <div class="english-cards">
            <div class="card-fr">

            </div>
        </div>
        <div class="english-models">
            <div class="model-desc">这里是一句描述</div>
            <div class="start-btn">开始记单词</div>
            <div class=""></div>
        </div>
    </div>
</template>
<script>

</script>

<style lang="scss" scoped>
    .english-content{
        padding: 20rpx 30rpx;
    }
    .english-tt{
        display: flex;
        width:100%;
        .english-head-im{
            flex:1;
            .im-fr{
                width:56rpx;
                height:56rpx;
                overflow: hidden;
                border-radius: 50%;
                img{
                    width:100%;
                    height:100%;
                    display: block;
                }
            }
            
        }
        .english-search-btn{
            width:118rpx;
            height:48rpx;
            background: #6A92FE;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26rpx;
            line-height: 48rpx;
            color:#fafafa;
            border-radius: 25rpx;
            .search-btn{
                display: none;
                width:40rpx;
                height:40rpx;
                overflow: hidden;
                img{
                    width:100%;
                    height:100%;
                    display: block;
                }
            }
        }
    }
    .english-cards{
        margin-top:20rpx;
        display: flex;
        justify-content: center;
        .card-fr{
            width:520rpx;
            height:500rpx;
            background: #efefef;
            border-radius: 40rpx;
        }
    }
    .english-models{
        margin-top:20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .model-desc{
            font-size: 24rpx;
            color:#afafaf
        }
        .start-btn{
            margin-top:20rpx;
            width:520rpx;
            height:92rpx;
            border-radius: 10rpx;
            background: #6A92FE;
            color: #efefef;
            justify-content: center;
            align-items: center;
            display: flex;
        }
    }
</style>