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
  display flex
  gap 10px
  justify-content space-between
  width 100%
  padding 15px 30px
  color colorText1
  text-align left

  &:hover
    background colorBlockBg

  .order-preview
    aspect-ratio 1/1
    padding 15px
    background colorBgDark
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
    display flex
    gap 20px
    justify-content space-between
    .status-column
      display flex
      flex-direction column
      gap 10px
      justify-content space-between
      text-align right
      .status
        font-small-extra()

        padding 5px 10px
        color colorTextInvert1
        text-align center
        background colorEmp1
        &.red
          background colorError
        &.green
          background colorSuccess
        &.yellow
          background colorEmp1
        &.blue
          background colorEmp2
        &.gray
          background colorTextInvert2

    .more-info
      button-no-styles()
      font-small-extra()
      font-normal()

      padding 0 10px
      color colorText1
      hover-effect()

    @media ({mobile})
      flex-direction column
      gap 15px

  @media ({mobile})
    padding-inline 15px
  trans()
</style>

<template>
  <router-link :to="{name: 'order', params: {id: order.id}}" class="root-order-card">
    <div class="order-preview">
      <img v-if="!order.goods.length" src="/static/icons/box.svg" alt="order">
      <img v-else :src="IMAGES_URL_BASE_PATH + order.goods[0].images?.[0]" alt="goods">
    </div>

    <div class="main-container">
      <div class="title">№{{ order.number }}</div>
      <div class="date">{{ dateFormatter(order.createdDate) }}</div>
      <div class="goods-count">Товаров {{ order.goods.length }}</div>
    </div>

    <div class="status-container">
      <div class="status-column">
        <div class="cost">{{ costFormatter(totalCost) }}</div>
        <div class="status" :class="[OrderStatuses[order.status]?.color]">
          {{ OrderStatuses[order.status]?.title }}
        </div>
        <div class="status" :class="[PaymentStatuses[order.paymentStatus]?.color]">
          {{ PaymentStatuses[order.paymentStatus]?.title }}
        </div>
      </div>

      <button class="more-info">
        Подробнее
      </button>
    </div>
  </router-link>
</template>

<script lang="ts">
import { Order } from '~/utils/models';
import { PropType } from 'vue';
import { costFormatter, dateFormatter } from '~/utils/utils';
import { IMAGES_URL_BASE_PATH, OrderStatuses, PaymentStatuses } from '~/constants';

export default {
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true,
    },
  },

  data() {
    return {
      IMAGES_URL_BASE_PATH,

      OrderStatuses,
      PaymentStatuses,
    };
  },

  computed: {
    totalCost() {
      return this.order.goods.reduce((acc, g) => acc + g.cost * (g.amount ?? 0), 0);
    }
  },

  methods: {
    costFormatter,
    dateFormatter,
  }
};
</script>
