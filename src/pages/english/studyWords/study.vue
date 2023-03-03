<template>
    <div>
        开始记单词
        <allInfoCard :word="currentWord"></allInfoCard>
    </div>
</template>
<script>
    import allInfoCard from '../components/studyCards/allInfoCard'
    export default{
        components:{
            allInfoCard
        },
        data(){
            return {
                wordList:[],
                currentWord:{
                    "id":1,
                    "word":"afternoon",
                    "word_zn":"下午",
                    "yinbiao":"ˌæftərˈnuːn",
                    "voice":"https://alioss.aitutuor.top/google_api/jigoump3/ket14/afternoon.mp3",
                    "pic":"http://assets.baicizhan.com/r/20140723_07_46_02_807.png",
                    "sentence":"They watch cartoons in the afternoon.",
                    "video":"https://aitutuor.top/files/mntfiles/afternoon/afternoon.mp4",
                    "captions":"{\"data\":[{\"sttime\":0,\"entime\":3.634,\"engsub\":\"Good afternoon. Welcome to Giuseppe's grooming salon.\",\"chinsub\":\"下午好 欢迎光临朱塞佩美发沙龙\"},{\"sttime\":3.85,\"entime\":8.676,\"engsub\":\"What can I do for you today, sir? A shave? A light pomade? Or is it just a brush?\",\"chinsub\":\"先生 今天我能为你做什么 刮胡子 轻点上头油 或者只是刷一刷\"},{\"sttime\":10.27,\"entime\":11.402,\"engsub\":\"Quick trim, barber.\",\"chinsub\":\"快速修剪下 理发师\"},{\"sttime\":11.56,\"entime\":13.736,\"engsub\":\"Oh, I'm not the barber. I just tidy up.\",\"chinsub\":\"噢 我不是理发师 我是打扫卫生的[有收拾整理的意思]\"},{\"sttime\":13.736,\"entime\":14.879,\"engsub\":\"Yeah, well, that's all I want.\",\"chinsub\":\"是的 好吧 这就是我想要的\"}]}",
                    "multi_mean":"[{\"cixing\":\"n.\",\"translation\":\"下午;\"}]",
                    "cixing":"n.",
                    "ctime":1662651379987,
                    "utime":1662651379987,
                    "more_sentence":"[\"Good afternoon!下午好！\"]",
                    "synonym_word":"{\"jin\":\"p.m. 下午（=post mer... decline; 下降; wane; 衰落;\",\"fan\":\"morning;早晨;\"}",
                    "cixing_change":"",
                    "fast_remember":""
                },
            }
        }
    }
</script>

<style lang="scss" scoped></style>