<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-admin-orders
  page-root()
  padding-top 0

  > .status
    font-bold()

    color mix(colorEmp1, transparent, 90%)
    &.red
      color mix(colorError, transparent, 90%)
    &.green
      color mix(colorSuccess, transparent, 90%)
    &.yellow
      color mix(colorEmp1, transparent, 90%)
    &.blue
      color mix(colorEmp2, transparent, 90%)
    &.gray
      color mix(colorTextInvert4, transparent, 90%)


  .button-plus
    centered-margin()
    button-emp2()

    width fit-content
    margin-top 30px
</style>

<template>
  <div class="root-page-admin-orders">
    <OrdersTable
      :data="orders"
      row-click-redirect-name="adminOrderEdit"
    />

    <router-link :to="{ name: 'adminOrderCreate' }" class="button-plus"><img src="/static/icons/plus-thin.svg" alt="plus">Добавить</router-link>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import OrdersTable from '~/components/tables/OrdersTable.vue';
import { Order } from '~/utils/models';

export default {
  components: { CircleLinesLoading, OrdersTable },

  data() {
    return {
      orders: [] as Order[],

      loading: false,
    };
  },

  computed: {
  },

  mounted() {
    this.updateOrders();
  },

  methods: {
    async updateOrders() {
      this.orders = (
        (await this.$request(this, this.$api.getAllAdminOrdersList, [], `Не удалось получить список заказов`)) as {
          orders: Order[];
        }
      ).orders;
    },
  },

  watch: {},
};
</script>
