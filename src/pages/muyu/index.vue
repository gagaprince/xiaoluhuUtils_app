<template>
    <div>
        <muyu></muyu>
    </div>
</template>

<script>

export default {
    onShareAppMessage(){
        return {
            title: '功德+1',
            path: '/pages/muyu/index',
            imageUrl:'https://syimg.3dmgame.com/uploadimg/xiaz/2022/1028/1666937479546.jpg',
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
  