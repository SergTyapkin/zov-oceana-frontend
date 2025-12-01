<style scoped lang="stylus">
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-page
  page-root()

  padding-block 0

  section.title
    page-root()
    page-root-disable()

    width 100vw
    padding-block 70px
    color colorTextInvert1
    background linear-gradient(#00000077, #00000077), url("/static/images/ocean-bg.jpg")
    .title-button-back
      svg-inside(1lh)
      font-small()
      animation-float(0.5s, -20px, 0, left)

      cursor pointer
      margin-bottom 20px
      img
        trans()
      &:hover
        img
          margin-right 15px
          margin-left 5px
    .header
      font-large-extra-extra()
      font-semibold()
      font-upper()
      animation-float(0.5s, -20px, 0, left)
    .order-status
      animation-float(0.5s, -20px, 0, left)
      .status
        font-small-extra()

        width min-content
        white-space nowrap
        padding 5px 10px
        color colorText1
        text-align center
        background mix(colorEmp1, transparent, 90%)
        &.red
          background mix(colorError, transparent, 90%)
        &.green
          background mix(colorSuccess, transparent, 90%)
        &.yellow
          background mix(colorEmp1, transparent, 90%)
        &.blue
          background mix(colorEmp2, transparent, 90%)
    .address-info
      animation-float(0.5s, -20px, 0, left)
      font-small()
      margin-bottom 30px
      color colorTextInvert2

  section.cart
    display flex
    flex-wrap wrap
    gap 30px
    width 100%
    padding-top 50px
    padding-bottom 100px
    .goods-list
      display flex
      flex 3
      flex-direction column
      gap 20px
      list-no-styles()
      animation-float(0.5s, -20px, 0, left)
      .goods
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
          .amount-selector-container
            display flex
            align-items center
            justify-content space-between
            width 100%
            max-width 300px
            margin-top 10px
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

    .order-controls
      animation-float(0.5s, 20px, 0, right)

      flex 1
      min-width 300px
      .total-info-container
        padding 20px
        color colorTextInvert1
        background colorBgDark
        .header
          font-large()
          font-upper()
          font-semibold()
        .costs-list
          display flex
          flex-direction column
          gap 15px
          padding-block 25px
          border-bottom 1px solid colorTextInvert5
          .cost-container
            display flex
            gap 10px
            align-items center
            justify-content space-between
            .title
              font-small-extra()

              color colorTextInvert3
            .cost
              font-medium()
              font-bold-extra()

        .cost-total-container
          display flex
          gap 10px
          align-items center
          justify-content space-between
          margin-top 20px
          .title
            font-large()
          .cost
            font-large()
            font-bold-extra()

      .button-confirm-order
        button-emp2()

        width 100%
        margin-top 20px
</style>

<template>
  <div class="root-page">
    <section class="title">
      <router-link :to="{ name: 'profileOrders' }" class="title-button-back" style="--animation-index: 0">
        <img src="/static/icons/arrow-left.svg" alt="arrow left" />
        Назад к заказам
      </router-link>
      <header class="header" style="--animation-index: 1">Заказ №{{ order.number }}</header>
      <div class="address-info">
        <div>Доставляется по адресу: {{ order.addressTextCopy }}</div>
        <div v-if="order.commentTextCopy">Комментарий: {{ order.commentTextCopy }}</div>
      </div>
      <div class="order-status">
        <div v-if="order.status === 'created'" class="status yellow">Не оплачен</div>
        <div v-else-if="order.status === 'paid'" class="status green">Оплачен</div>
        <div v-else-if="order.status === 'prepared'" class="status green">Собран</div>
        <div v-else-if="order.status === 'delivered'" class="status blue">Доставлен</div>
        <div v-else-if="order.status === 'cancelled'" class="status red">Отменен</div>
      </div>
    </section>

    <section class="cart">
      <ul class="goods-list" style="--animation-index: 1">
        <li class="goods" v-if="!order.goods?.length">В заказе нет товаров</li>
        <GoodsInfoCard
          v-for="goods in order.goods"
          :key="goods.id"
          class="goods"
          :goods="goods"
          no-amount-selectors
          no-delete-button
        />
      </ul>

      <section class="order-controls" style="--animation-index: 1">
        <article class="total-info-container">
          <header class="header">Итого</header>

          <ul class="costs-list">
            <li class="cost-container">
              <p class="title">Стоимость товаров</p>
              <div class="cost">₽{{ order.goods?.reduce?.((total, g) => total + g.cost * (g.amount || 0), 0) }}</div>
            </li>
            <li class="cost-container">
              <p class="title">Стоимость Доставки</p>
              <div class="cost">₽{{ `???` }}</div>
            </li>
          </ul>

          <div class="cost-total-container">
            <p class="title">Всего</p>
            <div class="cost">₽{{ order.goods?.reduce?.((total, g) => total + g.cost * (g.amount || 0), 0) }}</div>
          </div>
        </article>
      </section>
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import DEFAULT_GOODS_IMAGE from '#/images/ocean-bg.jpg';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';

import { Order } from '~/utils/models';
import GoodsInfoCard from '~/components/GoodsInfoCard.vue';

export default {
  components: { GoodsInfoCard, CircleLinesLoading },

  data() {
    return {
      orderId: this.$route.params.id,

      order: {} as Order,

      loading: false,

      DEFAULT_GOODS_IMAGE,
    };
  },

  computed: {},

  mounted() {
    if (!this.orderId) {
      this.$popups.error('id заказа не задан', 'В url нет id заказа');
      this.$router.push({ name: 'profile' });
      return;
    }
    this.updateOrder();
  },

  methods: {
    async updateOrder() {
      this.order = (await this.$request(
        this,
        this.$api.getOrder,
        [this.orderId],
        `Не удалось получить данные заказа`,
      )) as Order;
    },
  },
};
</script>
