<template>
    <div>
        <div class="word-spell">
            {{ word.word }}
        </div>
        <div class="word-yinpiao">
            /{{ word.yinbiao }}/
        </div>
        <div class="word-read" @tap="readWord">
            读音
        </div>
        <div class="word-zn">
            {{ word.word_zn }}
        </div>
        <div class="word-pic">
            <img :src="word.pic" alt="">
        </div>
    </div>
</template>
<script>
    import {initVoice} from '@/common/util/voice';
    export default {
        props:{
            word:{
                type: Object,
                default: () => {},
            }
        },
        watch:{
            word(newV,oldV){
                console.log(newV,oldV)
            }
        },
        mounted(){
            console.log(this.word);
            this.initWord();
        },
        methods:{
            initWord(){
                this.initVoice();
            },
            initVoice(){
                this.voiceHanlder = initVoice(this.word.voice);
            },
            readWord(){
                if(this.voiceHanlder){
                    this.voiceHanlder.seek(0);
                    this.voiceHanlder.play();
                }
            }
        }
    };
</script>