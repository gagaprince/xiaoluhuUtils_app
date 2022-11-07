
const today = new Date();
const GONGDE_KEY = `GONGDE_KEY_${today.getFullYear()}_${today.getMonth()+1}_${today.getDate()}`;
Component({
  properties: {
    text: {
      type: String,
      default: "功德+1",
    }
  },
  data: {
    gongde: {
      num:0,
    },
    muyuAnimationData:null,
    gongdeAnimationData1:null,
    gongdeAnimationData2:null,
    gongdeAnimationData3:null,
    gongdeAnimationData4:null,
  },
  attached() {
    const gongde = wx.getStorageSync(GONGDE_KEY) || 0;
    console.log('gongde:', gongde);
    this.setData({
      gongde
    });
    this.initVoice();
    this.initAnimation();
  },
  detached() {
  },
  methods: {
    initVoice(){
      const innerAudioContext = wx.createInnerAudioContext({
        useWebAudioImplement: true // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
      })
      innerAudioContext.src = 'https://muyu.wx.h5work.com/app/remote/muyu.mp3';

      const innerAudioContextForFo = wx.createInnerAudioContext({
        useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
      })
      innerAudioContextForFo.src = 'http://image.msoutman.com/fo.mp3';

      this.voice = innerAudioContext;
      this.voiceForFo = innerAudioContextForFo;
    },
    initAnimation(){
      const muyuAnimation = wx.createAnimation({
        delay:0,
        duration: 20,
        timingFunction: "ease"
      });
      const gongdeAnimations = [];
      let tmp = null;
      for(let i=0; i<4; i++){
        const gongdeAnimation = wx.createAnimation({
          delay:0,
          duration: 200,
          timingFunction: "ease"
        });
        console.log(tmp === gongdeAnimation);
        tmp = gongdeAnimation;

        gongdeAnimations.push({
          index: i,
          isRuning:false,
          gongdeAnimation
        })
      }
      
      this.muyuAnimation = muyuAnimation;
      this.gongdeAnimations = gongdeAnimations;
    },
    playGongde(){
      const gongdeAnimationObj = this.gongdeAnimations.find(item => !item.isRuning);
      console.log(gongdeAnimationObj);
      if(!gongdeAnimationObj)return;
      console.log('继续....')
      const { gongdeAnimation, index } = gongdeAnimationObj;
      gongdeAnimationObj.isRuning = true;
      gongdeAnimation.opacity(1).step({duration:10});
      gongdeAnimation.translateY(-60).scale(1.5,1.5).opacity(0).step({
        duration: 500
      });
      gongdeAnimation.translateY(0).scale(1,1).step({
        duration: 40
      });
      this.setData({
        [`gongdeAnimationData${index+1}`]: gongdeAnimation.export(),
        // muyuAnimationData: this.muyuAnimation.export()
      });
      setTimeout(()=>{
        gongdeAnimationObj.isRuning = false;
      },500);
    },
    playMuyu(){
      this.muyuAnimation.rotate(-2).step({
        duration: 10
      });
      this.muyuAnimation.rotate(0).step({
        duration: 10
      });
      this.setData({
        muyuAnimationData: this.muyuAnimation.export()
      });
    },
    playVoice(){
      this.voice.seek(0);
      this.voice.play();
    },
    playFo(){
      this.voiceForFo.seek(0);
      this.voiceForFo.play();
    },
    save(){
      wx.setStorageSync(GONGDE_KEY, this.data.gongde);
    },
    qiao(){
      this.setData({
        gongde: this.data.gongde + 1
      },()=>{
        this.save();
      });
      this.playVoice();
      // this.playMuyu();
      this.playGongde();
      if(this.data.gongde%99 == 0){
        this.playFo();
      }
    }
  },
});
