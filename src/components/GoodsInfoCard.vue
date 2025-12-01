<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-goods-card
  display flex
  gap 20px
  justify-content space-between
  padding 20px
  background colorBlockBg
  .preview
    min-width 200px
    max-width 250px
    height 100%
    img
      img-size(100%)

      object-fit contain
      object-position top

      @media ({mobile})
        object-fit cover

    @media ({mobile})
      width 20%
      min-width 50px
  .text-container
    display flex
    flex 1
    flex-direction column
    justify-content space-between
    .title
      font-large()

      word-wrap anywhere
      .location
        font-small()
        font-upper()
        font-thin()
        svg-inside()

        margin-top 10px
        margin-bottom 10px
    .amount-selector-container
      display flex
      align-items center
      justify-content space-between
      width 100%
      max-width 300px
      font-large()
      font-bold-extra()
      button
        button-no-fill()

        padding-block 5px
        color colorText1
        font-large()

  .right-container
    display flex
    flex-direction column
    align-items end
    justify-content space-between
    .button-remove
      button-no-fill()

      width min-content
      padding 5px
      img
        img-size(20px)

        margin 0
    .cost-total
      font-large()
      font-bold-extra()

      margin-bottom 5px
    .cost
      font-small-extra()
      font-upper()

      color colorText3
</style>

<template>
  <section class="root-goods-card">
    <div class="preview">
      <ImageFallback
        :src="`${IMAGES_URL_BASE_PATH}${goods.images?.[0]}`"
        :fallback-src="DEFAULT_GOODS_IMAGE"
        alt="preview"
      />
    </div>

    <div class="text-container">
      <router-link :to="{ name: 'goods', params: { id: goods.id } }" class="title">
        {{ goods.title }}
        <div v-if="goods.fromLocation" class="location">
          <img src="/static/icons/location-dark.svg" alt="location" />
          {{ goods.fromLocation }}
        </div>
      </router-link>
      <div class="amount-selector-container">
        <button v-if="!noAmountSelectors" @click="$emit('decreaseAmount')" class="button-minus">-</button>
        <div>{{ goods.amount }} {{ goods.isWeighed ? 'кг' : 'шт' }}</div>
        <button v-if="!noAmountSelectors" @click="$emit('increaseAmount')" class="button-plus">+</button>
      </div>
    </div>

    <div class="right-container">
      <button v-if="!noDeleteButton" class="button-remove" @click="$emit('delete')">
        <img src="/static/icons/trashbox.svg" alt="remove" />
      </button>

      <div class="cost">
        <div class="cost-total">₽{{ Math.round(goods.cost * (goods.amount || 0)) }}</div>
        <div>₽{{ goods.cost }} за {{ goods.isWeighed ? 'кг' : 'шт' }}</div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Goods } from '~/utils/models';
import { PropType } from 'vue';
import DEFAULT_GOODS_IMAGE from '#/images/ocean-bg.jpg';
import ImageFallback from '~/components/ImageFallback.vue';
import { IMAGES_URL_BASE_PATH } from '~/constants';

export default {
  components: { ImageFallback },
  emits: ['increaseAmount', 'decreaseAmount', 'delete'],

  props: {
    goods: {
      type: Object as PropType<Goods>,
      required: true,
    },
    noAmountSelectors: Boolean,
    noDeleteButton: Boolean,
  },

  data() {
    return {
      IMAGES_URL_BASE_PATH,
      DEFAULT_GOODS_IMAGE,
    }
  },
};
</script>
