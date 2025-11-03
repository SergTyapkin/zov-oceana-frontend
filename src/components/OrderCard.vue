<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-order-card
  cursor pointer
  width 100%
  text-align left
  display flex
  gap 10px
  justify-content space-between
  color colorText1
  padding 15px 30px
  trans()

  &:hover
    background colorBlockBg

  .order-preview
    background colorBgDark
    padding 15px
    aspect-ratio 1/1
    img
      img-size(100%)

  .main-container
    flex 1
    .title
      font-medium()
      font-spaced()
    .date
    .goods-count
      font-small()
      font-thin()
      color colorText4

  .status-container
    text-align right
    display flex
    flex-direction column
    justify-content space-between
    .status
      font-small-extra()
      color colorTextInvert1
      padding 5px 10px
      background colorEmp1
      &.red
        background colorError
      &.green
        background colorSuccess
      &.yellow
        background colorEmp1
      &.blue
        background colorEmp2

  .more-info
    button-no-styles()
    font-small-extra()
    color colorText1
    padding 0 10px
    hover-effect()
</style>

<template>
  <div class="root-order-card">
    <div class="order-preview">
      <img src="/static/icons/box.svg" alt="order">
    </div>

    <div class="main-container">
      <div class="title">{{ order.id }}</div>
      <div class="date">{{ order.createdDate }}</div>
      <div class="goods-count">Товаров {{ order.goods.length }}</div>
    </div>

    <div class="status-container">
      <div class="cost">₽{{ order.cost }}</div>
      <div v-if="order.status === 'created'" class="status yellow">Не оплачен</div>
      <div v-else-if="order.status === 'paid'" class="status green">Оплачен</div>
      <div v-else-if="order.status === 'prepared'" class="status green">Собран</div>
      <div v-else-if="order.status === 'delivered'" class="status blue">Доставлен</div>
      <div v-else-if="order.status === 'cancelled'" class="status red">Отменен</div>
    </div>

    <button class="more-info">
      Подробнее
    </button>
  </div>
</template>

<script lang="ts">
import { Order } from '~/utils/models';
import { PropType } from 'vue';
import IMAGE_DEFAULT from '#/images/ocean-bg.jpg';

export default {
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true,
    },
  },

  data() {
    return {
      IMAGE_DEFAULT,
    };
  },
};
</script>
