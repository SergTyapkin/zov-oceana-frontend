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

      margin-bottom 20px
    .title-desc
      font-small()
      font-thin()
      animation-float(0.5s, -20px, 0, left)

  section.cart
    display flex
    flex-wrap wrap
    gap 30px
    width 100%
    padding-top 50px
    padding-bottom 100px
    @media({mobile})
      flex-direction column
    .goods-list
      display flex
      flex 3
      flex-direction column
      gap 20px
      list-no-styles()
      animation-float(0.5s, -20px, 0, left)

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

    .section-take-order
      margin-top 20px
      .info-link
        button-emp2()
        text-align center
</style>

<template>
  <div class="root-page">
    <section class="title">
      <router-link :to="{ name: 'market' }" class="title-button-back" style="--animation-index: 0">
        <img src="/static/icons/arrow-left.svg" alt="arrow left" />
        Назад к каталогу
      </router-link>
      <header class="header" style="--animation-index: 1">Корзина</header>
      <div class="title-desc" style="--animation-index: 2">{{ $cart.length }} товаров в вашей корзине</div>
    </section>

    <section class="cart">
      <ul class="goods-list" style="--animation-index: 1">
        <li class="goods" v-if="!$cart.length">В корзине пока что ничего нет</li>
        <GoodsInfoCard
          ref="goodsCards"
          v-for="goods in $cart"
          :key="goods.id"
          class="goods"
          :goods="goods"
          @increase-amount="addGoodsAmount(goods, goods.amountStep)"
          @decrease-amount="addGoodsAmount(goods, -goods.amountStep)"
          @delete="removeFromCart(goods)"
        />
      </ul>

      <section class="order-controls" style="--animation-index: 1">
        <article class="total-info-container">
          <header class="header">Итого</header>

          <ul class="costs-list">
            <li class="cost-container">
              <p class="title">Стоимость товаров</p>
              <div class="cost">₽{{ Math.round($cart.reduce((total, g) => total + g.cost * (g.amount || 0), 0)) }}</div>
            </li>
            <li class="cost-container">
              <p class="title">Стоимость Доставки</p>
              <div class="cost">₽{{ `???` }}</div>
            </li>
          </ul>

          <div class="cost-total-container">
            <p class="title">Всего</p>
            <div class="cost">₽{{ Math.round($cart.reduce((total, g) => total + g.cost * (g.amount || 0), 0)) }}</div>
          </div>
        </article>

        <section class="section-take-order">
          <button class="info-link" v-if="!$user.isSignedIn" @click="$app.showSignInModal()">
            Войти или создать профиль, чтобы оформить заказ
          </button>
          <router-link :to="{name: 'profileAddresses'}" v-else-if="!addresses.length" class="info-link">
            Добавить адрес доставки в профиле
          </router-link>
          <SelectList
            v-else
            title="Выберите адрес доставки"
            :list="addresses.map(a => ({ name: addressFormatter(a), value: a.id }))"
            v-model="selectedAddressId"
            error-text="Не выбрано"
            :error="errors.address" />
        </section>

        <button
          v-if="!isTakeOrderBlockShown"
          :disabled="!selectedAddressId || loading"
          class="button-confirm-order"
          @click="takeOrder">
          Оформить заказ
        </button>
      </section>
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';

import DEFAULT_GOODS_IMAGE from '#/images/ocean-bg.jpg';
import { Address, Goods } from '~/utils/models';
import { addressFormatter, toDebounced } from '~/utils/utils';
import SelectList from '~/components/SelectList.vue';
import GoodsInfoCard from '~/components/GoodsInfoCard.vue';

export default {
  components: { GoodsInfoCard, SelectList, CircleLinesLoading },

  data() {
    return {
      isTakeOrderBlockShown: false,

      selectedAddressId: null as string | null,
      addresses: [] as Address[],
      errors: {
        address: false,
      },

      loading: false,

      DEFAULT_GOODS_IMAGE,
    };
  },

  computed: {},

  mounted() {
    this.updateAddresses();
    this.saveGoodsAmount = toDebounced(this.saveGoodsAmount, 800);
  },

  methods: {
    addressFormatter,

    async updateAddresses() {
      if (!this.$user.isSignedIn) {
        this.addresses = [];
        return;
      }
      this.addresses = (
        (await this.$request(
          this,
          this.$api.getUserAddresses,
          [this.$user.id],
          `Не удалось получить список адресов`,
        )) as {
          addresses: Address[];
        }
      ).addresses;
    },

    async removeFromCart(goods: Goods) {
      if (!(await this.$modals.confirm('Вы уверены?', `Удалить из корзины "${goods.title}"?`))) {
        return;
      }
      this.$store.dispatch('REMOVE_FROM_CART', goods);
      this.$forceUpdate();
    },

    addGoodsAmount(goods: Goods, addValue: number) {
      const newAmount =
        Math.round(Math.max(Math.min((goods.amount || 0) + addValue, goods.amountLeft || 0), 0.1) * 10) / 10;

      if (goods.amount === newAmount) {
        return;
      }

      this.$store.dispatch('SET_CART_GOODS_AMOUNT', {
        goodsId: goods.id,
        amount: newAmount,
      });
      this.$refs.goodsCards.forEach(g => g.$forceUpdate());
      this.saveGoodsAmount(goods.id);
    },
    async saveGoodsAmount(goodsId: string) {
      const goods = this.$cart.find(goods => String(goods.id) === String(goodsId));
      if (!goods) {
        return;
      }
      await this.$request(
        this,
        this.$api.updateGoodsInCartAmount,
        [this.$user.id, goods.id, goods.amount],
        `Не удалось обновить количество товаров`,
      );
    },

    async takeOrder() {
      this.errors.address = !this.selectedAddressId;

      if (Object.values(this.errors).findIndex(err => err) !== -1) {
        return;
      }

      if (!(await this.$modals.confirm('Подтверждение', 'Вы подтверждаете оформление заказа?'))) {
        return;
      }

      this.isTakeOrderBlockShown = true;
      await this.$request(
        this,
        this.$api.createOrder,
        [this.$user.id, this.selectedAddressId, this.$cart],
        `Не удалось оформить заказ`,
        () => {
          this.$request(
            this,
            this.$api.setGoodsInCart,
            [this.$user.id, []],
            `Не удалось сбросить товары в корзине`,
          );
          this.$store.dispatch('CLEAR_CART');
          this.$router.push({ name: 'profileOrders' });
        },
      );
    },
  },
};
</script>
