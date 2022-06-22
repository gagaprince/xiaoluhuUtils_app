<template>
  <vueCity @changeCity="changeCity"></vueCity>
</template>
<script>
import vueCity from '../../../components/city/vueCity.vue';

export default {
  components: {
    vueCity,
  },
  methods: {
    changeCity(res) {
      uni.setStorageSync('currentCity', res);
      uni.navigateBack();
    },
  },
};
</script>
<style lang="scss" scoped></style>
