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

  section.filters
    display flex
    flex-wrap wrap
    gap 10px
    justify-content space-between
    margin-inline 0

    .search
      flex 1
      min-width 150px
    .category-selector
      min-width 150px

    @media ({mobile})
      margin-inline 0
    page-root-disable()
    animation-float()

  section.orders
    overflow auto
    display grid
    grid-template-columns repeat(9, auto)
    width 100%
    box-shadow 0 15px 15px #00000033
    scrollable()
    .row
      display contents
      white-space pre-wrap
      > *
        display flex
        align-items center
        width 100%
        height 100%
        padding 15px 10px
        text-align left
        trans()
        &:first-child
          padding-left 25px
        &:last-child
          padding-right 25px
      &:nth-child(2n)
        > *
          background mix(colorBlockBg, transparent, 30%)
      &:not(.header):hover
        > *
          opacity 0.6
      &.header
        font-bold()
        > *
          margin-bottom 10px

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
    .info
      font-small()

      color colorText5

  .button-plus
    centered-margin()
    button-emp2()

    width fit-content
    margin-top 30px
</style>

<template>
  <div class="root-page-admin-orders">
    <section class="filters" style="--animation-index: 0">
      <InputSearch class="search" placeholder="Номер заказа..." v-model="filters.searchText" />
      <SelectList
        class="category-selector"
        placeholder="Любой статус"
        can-be-null
        :list="
          Object.entries(OrderStatuses)?.map?.(([key, status]) => ({
            id: key,
            name: status.title,
            value: key,
          }))
        "
        v-model="filters.status"
      />
    </section>

    <section class="orders">
      <div class="row header">
        <div>#</div>
        <div>Номер</div>
        <div>Товары</div>
        <div>Статус</div>
        <div>Оплата</div>
        <div>Пользователь</div>
        <div>Общая сумма</div>
        <div>Создан</div>
        <div>Обновлен</div>
      </div>

      <router-link
        class="row"
        :to="{ name: 'adminOrderEdit', params: { id: order.id } }"
        v-for="order in ordersFiltered"
        :key="order.id"
      >
        <div>{{ order.id }}</div>
        <div>{{ order.number }}</div>
        <div>
          {{ order.goods.map((g) => `${g.title} ${g.amount}${g.isWeighed ? 'кг' : 'шт'}`).join('\n\n') }}
        </div>
        <div class="status" :class="OrderStatuses[order.status]?.color">{{ OrderStatuses[order.status]?.title }}</div>
        <div class="status" :class="PaymentStatuses[order.paymentStatus]?.color">{{ PaymentStatuses[order.paymentStatus]?.title }}</div>
        <div>{{ order.userGivenName }} {{ order.userFamilyName }}</div>
        <div>{{ costFormatter(order.goods.reduce((acc, g) => acc + g.cost * g.amount!, 0)) }}</div>
        <div>{{ dateTimeFormatter(order.createdDate) }}</div>
        <div>{{ dateTimeFormatter(order.updatedDate) }}</div>
      </router-link>

      <div />
      <div />
      <div />
      <div />
      <div v-if="!ordersFiltered.length && !loading" class="info">Заказов не найдено</div>
    </section>
    <router-link
      :to="{ name: 'adminOrderCreate' }"
      class="button-plus"
    >
      <img src="/static/icons/plus-thin.svg" alt="plus">Добавить
    </router-link>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import SelectList from '~/components/SelectList.vue';
import InputSearch from '~/components/InputSearch.vue';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import { Order, OrderStatus } from '~/utils/models';
import { costFormatter, dateTimeFormatter } from '~/utils/utils';
import { OrderStatuses, PaymentStatuses } from '~/constants';

export default {
  components: { CircleLinesLoading, SelectList, InputSearch },

  data() {
    return {
      orders: [] as Order[],

      filters: {
        searchText: '',
        status: null as OrderStatus | null,
      },

      loading: false,

      OrderStatuses,
      PaymentStatuses,
    };
  },

  computed: {
    ordersFiltered() {
      return this.orders.filter(order => {
        return (
          (!this.filters.searchText || new RegExp(this.filters.searchText, 'i').test(String(order.number))) &&
          (!this.filters.status || order.status === this.filters.status)
        );
      });
    },
  },

  mounted() {
    this.updateOrders();
  },

  methods: {
    dateTimeFormatter,
    costFormatter,

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
