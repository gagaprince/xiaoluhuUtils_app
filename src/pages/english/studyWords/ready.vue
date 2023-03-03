<template>
    <div @tap="goStudy">
        准备开始记单词
    </div>
</template>
<script>
    import { login } from '@/common/util/login';
    import { post, getSelf } from '@/common/util/request';
    export default {
        onLoad(options){
            this.init(options);
        },
        methods:{
            init(){
                // 调用开始学习计划接口
                this.startPlan();
            }, 
            async startPlan(){
                const {openid} = await login();
                const lesson = '仁爱版初中英语';
                const level = '七年级上册';
                const unit = 'Unit 1Topic 1';
                console.log(openid)

                const {code, data} = await post('/words/createStudyPlan',{
                    lesson, level, unit, openid
                })
                if(code === 0){
                    // 记录下data
                    console.log(data);
                    const {new_words} = data;
                    // 调用获取课程单词接口 获取要学习的单词详情
                    this.getLessonWords(new_words);
                }
            },
            async getLessonWords(words){
                const lesson = '仁爱版初中英语';
                const level = '七年级上册';
                const unit = 'Unit 1Topic 1';

                const {code, data} = await post('/words/wordDetail',{
                    words: words.split(',')
                });
                console.log(code, data);

            },
            goStudy(){
                uni.navigateTo({
                    url:'/pages/english/studyWords/study'
                })
            }
        }
    }
</script>

<style lang="scss" scoped></style>