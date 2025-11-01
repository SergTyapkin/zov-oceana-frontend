<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-goods-card
  cursor pointer
  width 100%
  height 100%
  max-width 400px
  max-height 300px
  min-width 300px
  min-height 300px
  position relative
  text-align left

  .background
    img-size(100%)
    position absolute
    inset 0
    object-fit cover

  .overlay
    position absolute
    left 0
    right 0
    bottom 0
    background linear-gradient(to top, black, transparent)
    padding 25px 20px
    display flex
    flex-direction column
    gap 5px
    justify-content space-between

    .location
    .description
      svg-inside()
      font-small-extra()
      font-thin()
    .location
      font-upper()
    .title
      font-large()
    .bottom-block
      display flex
      gap 10px
      align-items center
      justify-content space-between
      .cost
        .info
          svg-inside()
          font-small-extra()
          font-thin()
          font-upper()
          color colorTextInvert4
        .value
          font-large()
      .button-to-cart
        button-emp2()
        button-small()
        //svg-inside()
</style>

<template>
  <div class="root-goods-card" :class="{ small }">
    <img class="background" :src="goods.previewUrl || IMAGE_DEFAULT" alt="" />

    <section class="overlay">
      <div class="location" v-if="goods.fromLocation">
        <img src="/static/icons/location.svg" alt="location">
        <span>{{ goods.fromLocation }}</span>
      </div>
      <div class="title">{{ goods.title }}</div>
      <div v-if="goods.description" class="description">{{ goods.description }}</div>
      <div class="bottom-block">
        <div class="cost">
          <div class="info">цена за кг</div>
          <div class="value">₽{{ goods.cost }}</div>
        </div>
        <button class="button-to-cart">
          <img src="/static/icons/cart.svg" alt="cart">
          В корзину
        </button>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Goods } from '~/utils/models';
import { PropType } from 'vue';
import IMAGE_DEFAULT from '#/images/ocean-bg.jpg';

export default {
  props: {
    goods: {
      type: Object as PropType<Goods>,
      required: true,
    },

    small: Boolean,
  },

  data() {
    return {
      IMAGE_DEFAULT,
    }
  },
};
</script>
