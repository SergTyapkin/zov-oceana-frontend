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
  position relative
  overflow hidden
  display block
  width 100%
  min-width 300px
  max-width 800px
  height 100%
  min-height 300px
  max-height 300px
  color colorTextInvert1
  text-align left

  .background
    img-size(100%)

    position absolute
    inset 0
    object-fit cover
    pointer-events none
    trans()

  .overlay
    position absolute
    right 0
    bottom 0
    left 0
    display flex
    flex-direction column
    gap 5px
    justify-content space-between
    padding 25px 20px
    background linear-gradient(to top, black, transparent)

    .location
    .description
      svg-inside()
      font-small-extra()
      font-thin()
    .location
      font-upper()
    .title
      font-large()
      trans()
    .bottom-block
      display flex
      gap 10px
      align-items center
      justify-content space-between
      .cost
        trans()
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
        // svg-inside()

  &:hover
    .background
      transform scale(1.1)
    .overlay
      .title
        margin-bottom 10px
      .cost
        margin-bottom 5px
</style>

<template>
  <router-link
    :to="{name: 'goods', params: {id: goods.id}}"
    class="root-goods-card"
    :class="{ small }"
  >
    <img class="background" :src="goods.previewUrl || IMAGE_DEFAULT" alt="">

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
  </router-link>
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
