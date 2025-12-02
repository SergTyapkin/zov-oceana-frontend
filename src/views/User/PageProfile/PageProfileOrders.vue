<style lang="stylus" scoped>
@import '../../../styles/constants.styl'
@import '../../../styles/components.styl'
@import '../../../styles/buttons.styl'
@import '../../../styles/fonts.styl'
@import '../../../styles/utils.styl'
@import '../../../styles/animations.styl'
@import '../../../styles/scrollbars.styl'

.root-profile-info
  box-shadow 0 0 10px colorShadow
  .header
    padding 30px
    color colorTextInvert1
    background colorBgDark
    .header-title
      font-large()
      font-upper()

      margin-bottom 5px
    .header-desc
      font-small()
      font-thin()

      color colorTextInvert3

  .main
    padding 30px 0
    .orders-list
      list-no-styles()

      display flex
      flex-direction column
      width 100%
      .desc
        font-small()
        color colorText5
        text-align center
</style>

<template>
  <div class="root-profile-info">
    <header class="header">
      <header class="header-title">История заказов</header>
      <div class="header-desc">Просмотр и отслеживание ваших заказов</div>
    </header>

    <main class="main">
      <ul class="orders-list">
        <li class="desc" v-if="!orders.length && !loading">Заказов пока нет</li>
        <OrderCard v-for="order in orders" :order="order" :key="order.id" />
      </ul>
    </main>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import OrderCard from '~/components/OrderCard.vue';
import { Order } from '~/utils/models';

export default {
  components: { OrderCard, CircleLinesLoading },

  data() {
    return {
      orders: [] as Order[],

      loading: false,
    };
  },

  mounted() {
    this.updateOrders();
  },

  methods: {
    async updateOrders() {
      this.orders = (
        (await this.$request(this, this.$api.getUserOrders, [this.$user.id], `Не удалось получить список заказов`)) as {orders: Order[]}
      ).orders;
    },
  },
};
</script>
