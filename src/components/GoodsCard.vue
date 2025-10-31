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
  position relative

  .background
    position absolute
    inset 0
    object-fit cover

  .overlay
    position absolute
    left 0
    right 0
    bottom 0
    background linear-gradient(to top, black, transparent 60%)
    padding 25px 20px
    display flex
    flex-direction column
    gap 15px
    justify-content space-between

    .location
    .description
      svg-inside()
      font-small()
      font-thin()
    .title
      font-medium()
    .bottom-block
      display flex
      gap 10px
      align-items center
      justify-content space-between
      .cost
        .info
          svg-inside()
          font-small()
          font-thin()
          color colorText2
        .value
          font-large()
      .button-to-cart
        button-emp()
        //svg-inside()
</style>

<template>
  <div class="root-goods-card" :class="{ small }">
    <img v-if="goods.previewUrl" class="background" :src="goods.previewUrl" alt="" />

    <section class="overlay">
      <div class="location" v-if="goods.fromLocation">
        <img src="" alt="location">
        <span>{{ goods.fromLocation }}</span>
      </div>
      <div class="title">{{ goods.title }}</div>
<!--      <div class="description">{{ goods.description }}</div>-->
      <div class="bottom-block">
        <div class="cost">
          <div class="info">цена за кг</div>
          <div class="value">₽{{ goods.cost }}</div>
          <span>{{ goods.fromLocation }}</span>
        </div>
        <button class="button-to-cart">
          <img src="" alt="cart">
          в корзину
        </button>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Goods } from '~/utils/models';
import { PropType } from 'vue';

export default {
  props: {
    goods: {
      type: Object as PropType<Goods>,
      required: true,
    },

    small: Boolean,
  },
};
</script>
