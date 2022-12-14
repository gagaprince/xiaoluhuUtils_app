<template>
    <div class="calendar-content" v-if="hasInit">
        <div class="calendar-head">
            <div class="ca-arrow ca-lf" @tap="lastMonth">
                <img mode="widthFix" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi8-j2SBjzaFiYaB2EDAKV2RslNRwPWTT2-AMot3GznvIo9tMPFWEfSA0GIh1r-xIGBxQ&usqp=CAU" alt=""/>
            </div>
            <div class="ca-month">{{year}}-{{month}}</div>
            <div class="ca-arrow ca-rt" @tap="nextMonth">
                <img mode="widthFix" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi8-j2SBjzaFiYaB2EDAKV2RslNRwPWTT2-AMot3GznvIo9tMPFWEfSA0GIh1r-xIGBxQ&usqp=CAU" alt=""/>
            </div>
        </div>
        <div class="calendar-body">
            <div class="calendar-it">一</div>
            <div class="calendar-it">二</div>
            <div class="calendar-it">三</div>
            <div class="calendar-it">四</div>
            <div class="calendar-it">五</div>
            <div class="calendar-it">六</div>
            <div class="calendar-it">日</div>
            <template v-for="(item, index) in calendarDays.days">
                <div :class="['calendar-it', ( index < calendarDays.firstDay-1 || index > calendarDays.firstDay + calendarDays.lastDay-2 ) ? 'gray' : '']" >
                    <div :class="['calendar-normal', {'calendar-select': markIndexs.indexOf(index)!==-1}]">{{item.num}}</div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    const toDateStr = (date)=>{
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }
    export default {
        props: {
            markDays: {
                type: Array,
                default: () => [],
            }
        },
        data(){
            return {
                year: 2022,
                month: 0,
                hasInit: false,
            }
        },
        mounted(){
            this.init();
        },
        computed:{
            calendarDays(){
                let firstDay = new Date(this.year, this.month - 1, 1).getDay(); //本月第一天是星期几
                if(firstDay===0){
                    firstDay = 7;
                }
                const lastDay = new Date(this.year, this.month, 0).getDate(); // 本月有多少天
                const lastMonthLastDay = new Date(this.year, this.month-1, 0).getDate(); //上月有多少天
                // console.log('firstDay', firstDay)
                // console.log('lastDay', lastDay)
                // console.log('lastMonthLastDay', lastMonthLastDay)
                var arr = [];
                for(let i = 0; i < (firstDay-1); i++){
                    const num = lastMonthLastDay - i;
                    arr.unshift({
                        num,
                        date: new Date(this.year, this.month-2, num)
                    });
                }
                for(let i = 1; i <= lastDay; i++){
                    const num = i;
                    arr.push({
                        num,
                        date: new Date(this.year, this.month-1, num)
                    });
                }
                let n = 1;
                while(arr.length<35){
                    const num = n++;
                    arr.push({
                        num,
                        date: new Date(this.year, this.month, num)
                    });
                }
                return {
                    firstDay,
                    lastDay,
                    days:arr,
                };
            },
            markIndexs(){// 被标记打卡的下标
                const markDays = this.markDays;
                const markDates = markDays.map(item=>toDateStr(new Date(item)));
                const calendarDays = this.calendarDays.days.map((day,index)=>{
                    return {index,...day}
                });
                const indexArr = calendarDays.filter(day=>markDates.indexOf(toDateStr(day.date))!==-1).map(day=>day.index);
                return indexArr;
            }
        },
        methods:{
            init(){
                const now = new Date();
                this.year = now.getFullYear();
                this.month = new Date().getMonth()+1;
                this.hasInit = true;
            },
            lastMonth(){
                this._swipMonth(-1)
            },
            nextMonth(){
                this._swipMonth(1)
            },
            _swipMonth(num){
                let nowMonth = this.month;
                nowMonth = nowMonth+num;
                if(nowMonth>12){
                    nowMonth = nowMonth-12
                    this.year += 1;
                }else if(nowMonth<1){
                    nowMonth = nowMonth + 12;
                    this.year -= 1;
                }
                this.month = nowMonth;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .calendar-content{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .calendar-head{
        width:100%;
        height:80rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .ca-arrow{
            width:30rpx;
            height:30rpx;
            img{
                display: block;
                width:100%;
                height:100%;
            }
        }
        .ca-lf{
            margin-left: 30rpx;
            img{
                transform:rotate(180deg);
            }
        }
        .ca-rt{
            margin-right: 30rpx;
        }
        .ca-month{
            flex:1;
            text-align: center;
            color: #666;
        }
    }
    .calendar-body{
        display: flex;
        width:95%;
        flex-flow: wrap;
        .calendar-it{
            width:14.285%;
            height:60rpx;
            color: #666;
            display: flex;
            justify-content: center;
            align-items: center;
            .calendar-normal{
                width:50rpx;
                height:50rpx;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                vertical-align: middle;
            }
            .calendar-select{
                background: #bfbfbf;
            }
        }
        .gray{
            color:#afafaf;
        }
        
    }
</style>