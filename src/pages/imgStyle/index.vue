<template>
    <div class="container">
        <div class="preload-img" v-if="preloadImg">
            <img mode="widthFix" :src="preloadImg" alt="">
        </div>
        <div class="upload-img-btn" @click="uploadImg">上传图片</div>
        <div class="upload-img-btn" @click="genarater">生成漫画脸</div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                preloadImg:'',
                imgWidth:0,
                imgHeight:0,
                imageChannel:3,
            }
        },
        methods:{
            uploadImg() {
                uni.showActionSheet({
                    itemList: [ "从相册中选择", "拍照" ],
                    itemColor: "#f7982a",
                    success:(e) => {
                        e.cancel || (0 == e.tapIndex ? this.chooseWxImageShop("album") : 1 == e.tapIndex && this.chooseWxImageShop("camera"));
                    }
                });
            },
            chooseWxImageShop(style) {
                uni.chooseImage({
                    sizeType: [ "original", "compressed" ],
                    sourceType: [ style ],//类型
                    count:1,
                    success: (res) => {
                        const filePath = res.tempFilePaths[0]
                        console.log(filePath)
                        this.preloadImg = filePath
                        uni.getImageInfo({
                            src: filePath,
                            success:(res)=>{
                                this.imgWidth = res.width;
                                this.imgHeight = res.height;
                            }
                        })
                    }
                });
            },
            genarater(){
                console.log(`开始生成 imgPath:${this.preloadImg}, width:${this.imgWidth},height:${this.imgHeight}`);
                const canvas = wx.createOffscreenCanvas({type: '2d', width: this.imgWidth, height: this.imgWidth})

                const ctx = canvas.getContext('2d')
                const image = canvas.createImage()

                // wait for image upload
                new Promise(resolve => {
                    image.onload = resolve
                    image.src = this.preloadImg
                }).then(() => {
                // init the inferenceSession
                    this.InitSession().then(() => {
                        console.log('session 准备完毕')
                        // create input
                        ctx.clearRect(0, 0, this.imgWidth, this.imgHeight)
                        ctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight)

                        // get the imgdata
                        const imgData = ctx.getImageData(0, 0, this.imgWidth, this.imgHeight)

                        // use the image data
                        this.detect(imgData)
                    })
                })
            },
            InitSession(){
                return new Promise((resolve, reject) => {
                    const modelPath = `${wx.env.USER_DATA_PATH}/1.onnx`;

                    // 判断之前是否已经下载过onnx模型
                    wx.getFileSystemManager().access({
                        path: modelPath,
                        success: (res) =>{
                            console.log("file already exist at: " + modelPath)
                            this.createInferenceSession(modelPath).then(() =>{
                                resolve();
                            })
                        },
                        fail: (res) => {
                            console.error(res)
                            console.log("begin download model");

                            const modelUrl = 'http://192.168.1.12:8080/1.onnx'

                            this.downloadFile(modelUrl, function(r) {
                                console.log(`下载进度：${r.progress}%，已下载${r.totalBytesWritten}B，共${r.totalBytesExpectedToWrite}B`)
                            }).then(result => {
                                wx.getFileSystemManager().saveFile({
                                    tempFilePath:result.tempFilePath,
                                    filePath: modelPath,
                                    success: (res) => { // 注册回调函数
                                        console.log(res)
                        
                                        const modelPath = res.savedFilePath;
                                        console.log("save onnx model at path: " + modelPath)

                                        this.createInferenceSession(modelPath).then(() => {
                                            resolve();
                                        })
                                    },
                                    fail(res) {
                                        console.error(res)
                                        return
                                    }
                                })
                            });
                        }
                    })
                })
            },

            createInferenceSession(modelPath) {
                return new Promise((resolve, reject) => {
                    this.session = wx.createInferenceSession({
                        model: modelPath,
                        /* 0: Lowest  precision e.g., LS16 + A16 + Winograd A16 + approx. math
                        1: Lower   precision e.g., LS16 + A16 + Winograd off + approx. math
                        2: Modest  precision e.g., LS16 + A32 + Winograd A32 + approx. math
                        3: Higher  precision e.g., LS32 + A32 + Winograd A32 + approx. math
                        4: Highest precision e.g., LS32 + A32 + Winograd A32 + precise math
                        Higher precision always require longer time to run session
                        */
                        precisionLevel : 4,
                        // typicalShape:{input_name:[1, this.imageChannel, this.imgWidth, this.imgHeight]},
                        allowNPU : false,     // wheather use NPU for inference, only useful for IOS
                        allowQuantize: false, // wheather generate quantize model
                    });

                    // 监听error事件
                    this.session.onError((error) => {
                        console.error(error);
                        reject(error);
                    });
                    this.session.onLoad(() => {
                        resolve();
                    });
                })
            },

            downloadFile(url, onCall = () => {}) {
                return new Promise((resolve, reject) => {
                const task = wx.downloadFile({
                    url,
                    success: res => resolve(res),
                    fail: e => {
                        const info = e.toString()
                        if (info.indexOf('abort') != -1) {
                            reject(new Error('【文件下载失败】中断下载'))
                        } else {
                            reject(new Error('【文件下载失败】网络或其他错误'))
                        }
                    }
                })
                task.onProgressUpdate((res) => {
                    if (onCall(res) == false) {
                        task.abort()
                    }
                })
                })
            },

            detect(imgData){
                return new Promise((resolve, reject) => {
                    const uint8Data = new Uint8Array(imgData.data)

                    var floatData = new Float32Array(this.imageChannel * this.imgWidth * this.imgHeight);

                    // nhwc uint8 data to nchw float32 data, and ignore the alpha channel
                    const modelChannel = this.imageChannel
                
                    const imageWH = this.imgWidth * this.imgHeight;

                    var idx = 0;
                    for (var c = 0; c < modelChannel; ++c){
                        for (var wh = 0; wh < imageWH; ++wh){
                            var inputIdx = wh * 4 + c;
                            floatData[idx] = uint8Data[inputIdx];
                            idx++;
                        }
                    } 

                    const xinput = {
                        shape: [1, 3, this.imgWidth, this.imgHeight],  // Input data shape in NCHW
                        data: floatData.buffer,
                        type: 'float32',  // Input data type
                    };

                    console.log('xinput', xinput)

                    this.session.run({
                        // Here string "input1" Should be the same with the input name in onnx file
                        "input" : xinput,
                    }).then((res) => {
                        console.log('session run res', res);
                        // Here use res.outputname.data, outputname 
                        // Should be the same with the output name in onnx file
                        let output = new Float32Array(res.output.data)

                        const hwSize = imgData.height * imgData.width;

                        var finalout = new Uint8ClampedArray(4 * hwSize);

                        // fill the alpha channel
                        finalout.fill(255);

                        // convert from nchw to nhwc
                        idx = 0;
                        for (var c = 0; c < modelChannel; ++c){
                            for (var hw = 0; hw < hwSize; ++hw){
                                var dstIdx = hw * 4 + c;
                                finalout[dstIdx] = Math.max(0, Math.min(Math.round(output[idx]), 255));
                                idx++;
                            }
                        }

                        this.canvasCtx = wx.createCanvasContext('trans')

                        wx.canvasPutImageData({
                            canvasId: 'trans',
                            data: finalout,
                            height: this.imgHeight,
                            width: this.imgWidth,
                            x: 0,
                            y: 0,
                        }).then((res) =>{
                            console.log(res)
                        })
                    }).catch((e)=>{
                        console.error(e);
                    })

                    resolve();
                })
            },
        }
    }
</script>

<style lang="scss" scoped>

.container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .preload-img{
        width:350rpx;
        image{
            width:100%;
            display: block;
        }
    }
    .upload-img-btn {
        display: block;
        width: 690rpx;
        height: 80rpx;
        margin-top: 30rpx;
        border-radius: 10rpx;
        background: #000000;
        color: #f6f6f6;
        font-size: 36rpx;
        text-align: center;
        line-height: 80rpx;
    }
}

</style>