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
    margin-inline 'min(calc((100vw - %s) / -2), -%s)' % (pageMaxWidth pageMinHorizontalPadding)
    width 100vw
    background linear-gradient(#00000077, #00000077), url("/static/images/ocean-bg.jpg")
    color colorTextInvert1
    padding-block 70px
    .title-button-back
      svg-inside(1lh)
      font-small()
      margin-bottom 20px
      cursor pointer
      img
        trans()
      &:hover
        img
          margin-left 5px
          margin-right 15px
    .header
      font-large-extra-extra()
      font-semibold()
      font-upper()
      margin-bottom 20px
    .title-desc
      font-small()
      font-thin()

  section.cart
    padding-top 50px
    padding-bottom 100px
    width 100%
    display flex
    flex-wrap wrap
    gap 30px
    .goods-list
      flex 3
      list-no-styles()
      display flex
      flex-direction column
      gap 20px
      min-width 400px
      .goods
        background colorBlockBg
        padding 20px
        display flex
        gap 20px
        justify-content space-between
        .preview
          min-width 200px
          height 100%
          max-width 250px
          img
            img-size(100%)
            object-fit contain
            object-position top
        .text-container
          flex 1
          display flex
          flex-direction column
          justify-content space-between
          .title
            font-large()
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
            max-width 300px
            width 100%
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
          justify-content space-between
          align-items end
          .button-remove
            button-no-fill()
            padding 5px
            width min-content
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
      flex 1
      min-width 300px
      .total-info-container
        padding 20px
        background colorBgDark
        color colorTextInvert1
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
            justify-content space-between
            align-items center
            gap 10px
            .title
              font-small-extra()
              color colorTextInvert3
            .cost
              font-medium()
              font-bold-extra()

        .cost-total-container
          display flex
          justify-content space-between
          align-items center
          gap 10px
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
      <router-link :to="{ name: 'market' }" class="title-button-back">
        <img src="/static/icons/arrow-left.svg" alt="arrow left" />
        Назад к каталогу
      </router-link>
      <header class="header">Корзина</header>
      <div class="title-desc">{{ $cart.length }} товаров в вашей корзине</div>
    </section>

    <section class="cart">
      <ul class="goods-list">
        <li class="goods" v-if="!$cart.length">В корзине пока что ничего нет</li>
        <li class="goods" v-for="goods in $cart">
          <div class="preview">
            <img :src="goods.previewUrl || DEFAULT_IMAGE" alt="preview" />
          </div>

          <div class="text-container">
            <header class="title">
              {{ goods.title }}
              <div class="location">
                <img src="/static/icons/location-dark.svg" alt="location" />
                {{ goods.fromLocation }}
              </div>
            </header>
            <div class="amount-selector-container">
              <button @click="addGoodsAmount(goods, -0.1)" class="button-minus">-</button>
              <div>{{ goods.amount }}</div>
              <button @click="addGoodsAmount(goods, 0.1)" class="button-plus">+</button>
            </div>
          </div>

          <div class="right-container">
            <button class="button-remove" @click="removeFromCart(goods)">
              <img src="/static/icons/trashbox.svg" alt="remove" />
            </button>

            <div class="cost">
              <div class="cost-total">₽{{ goods.cost * (goods.amount || 0) }}</div>
              <div>₽{{ goods.cost }} за кг</div>
            </div>
          </div>
        </li>
      </ul>

      <section class="order-controls">
        <article class="total-info-container">
          <header class="header">Итого</header>

          <ul class="costs-list">
            <li class="cost-container">
              <p class="title">Стоимость товаров</p>
              <div class="cost">₽{{ $cart.reduce((total, g) => total + g.cost * (g.amount || 0), 0) }}</div>
            </li>
            <li class="cost-container">
              <p class="title">Стоимость Доставки</p>
              <div class="cost">₽{{ `???` }}</div>
            </li>
          </ul>

          <div class="cost-total-container">
            <p class="title">Всего</p>
            <div class="cost">₽{{ $cart.reduce((total, g) => total + g.cost * (g.amount || 0), 0) }}</div>
          </div>
        </article>

        <button class="button-confirm-order">Оформить заказ</button>
      </section>
    </section>

    <CircleLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLoading from '~/components/loaders/CircleLoading.vue';

import DEFAULT_IMAGE from '#/images/ocean-bg.jpg';
import { Goods } from '~/utils/models';

export default {
  components: { CircleLoading },

  data() {
    return {
      DEFAULT_IMAGE,

      loading: false,
    };
  },

  computed: {},

  mounted() {},

  methods: {
    async removeFromCart(goods: Goods) {
      if (!(await this.$modals.confirm('Вы уверены?', `Удалить из корзины "${goods.title}"?`))) {
        return;
      }
      this.$store.dispatch('REMOVE_FROM_CART', goods);
      this.$forceUpdate();
    },

    addGoodsAmount(goods: Goods, addValue: number) {
      this.$store.dispatch('SET_CART_GOODS_AMOUNT', {
        goodsId: goods.id,
        amount: Math.round(
          Math.max(
            Math.min(
              (goods.amount || 0) + addValue,
              goods.amountLeft || 0
            ),
            0.1,
          ) * 10,
        ) / 10,
      });
      this.$forceUpdate();
    }
  },
};
</script>
