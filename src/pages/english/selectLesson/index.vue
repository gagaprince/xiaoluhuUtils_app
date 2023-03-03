<template>
    <div>
        <div class="big-cate">
            <div class="cate-item-fr" v-for="(item,index) in bigCateNames" :key="index" @tap="changeCate(index)">
                {{ item }}
            </div>
        </div>
        <div class="small-cate">
            <div v-for="(item,index) in currentBooks" :key="index">
                <div class="small-cate-item-fr" @tap="selectBook(item)">
                    {{ item.book_name }}
                </div>
                <div v-if="item.showLevel">
                    <div class="sub-small-cate-fr" v-for="(levelInfo,idx) in item.levelInfos" :key="levelInfo.levelName" @tap="selectLevel(item.book_name, levelInfo.levelName)">
                        {{ levelInfo.levelName }}
                    </div>
                </div>
                
            </div>
            
        </div>
    </div>
</template>
<script>
    import { getSelf } from '@/common/util/request';
    export default {
        data(){
            return {
                bigCateNames:[],
                currentBooks:[],
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                // 请求大分类数据 渲染
                this.initData();
            },
            initData(){
                getSelf('/words/allLessons',{}).then((ret = {})=>{
                    const {code, data} = ret;
                    if(code === 0){
                        this.bookInfo = data;
                        this.bigCateNames = Object.keys(data);
                        this.currentBooks = this.bookInfo[this.bigCateNames[0]];
                    }else{
                        console.error('获取大分类出错');
                    }
                })
            },
            changeCate(index){                
                if(index >= 0 && index < this.bigCateNames.length){
                    this.currentBooks = this.bookInfo[this.bigCateNames[index]]
                }                
            },
            async selectBook(bookInfo){
                if(bookInfo.showLevel){
                   bookInfo.showLevel = false;
                   this.flash();
                   return; 
                }
                const bookName = bookInfo.book_name;
                // 选择一本书 加载内部信息
                if(!bookInfo.levelInfos){
                    const ret = await getSelf('/words/lessonDetail',{
                        books:bookName
                    });
                    const {data, code} = ret;
                    if(code === 0){
                        bookInfo.levelInfos = data[bookName].levelInfos;
                        bookInfo.showLevel = true;
                    }
                }else{
                    bookInfo.showLevel = true;
                }
                this.flash();
            },
            selectLevel(bookName,levelName){
                console.log(`选择了${bookName}-${levelName}`);
                uni.setStorageSync('GAGAUTIL_BOOK_SELECT',{
                    bookName,levelName
                });
                uni.navigateBack({})
            },
            flash(){
                this.currentBooks = {...this.currentBooks}
            }
        }
    }
</script>
<style lang="scss" scoped>
.big-cate{
    width:100%;
    min-height:100rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1rpx solid #999;
    .cate-item-fr{
        padding: 0 20rpx;
        height: 60rpx;
        border-radius: 20rpx;
        background: red;
        font-size: 24rpx;
        line-height: 60rpx;
    }

}
.small-cate{
    .small-cate-item-fr{
        height: 200rpx;
        background: blue;
        border-bottom: 1px solid pink;
        display: flex;
        align-items: center;
    }
    .sub-small-cate-fr{
        height: 100rpx;
        background: pink;
        border-bottom: 1px solid #999;
        display: flex;
        align-items: center;
    }
}
</style>