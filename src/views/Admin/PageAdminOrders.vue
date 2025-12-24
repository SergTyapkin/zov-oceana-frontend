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
    page-root-disable()
    animation-float()

    display flex
    flex-wrap wrap
    gap 10px
    justify-content space-between
    margin-inline 0
    @media({mobile})
      margin-inline 0

    .search
      flex 1
      min-width 150px
    .category-selector
      min-width 150px

  section.orders
    width 100%
    display grid
    grid-template-columns repeat(8, auto)
    box-shadow 0 15px 15px #00000033
    .row
      display contents
      > *
        width 100%
        height 100%
        padding 15px 10px
        display flex
        align-items center
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
      &.red > .status
        color mix(colorError, transparent, 90%)
      &.green > .status
        color mix(colorSuccess, transparent, 90%)
      &.yellow > .status
        color mix(colorEmp1, transparent, 90%)
      &.blue > .status
        color mix(colorEmp2, transparent, 90%)
    .info
      font-small()
      color colorText5

  .button-plus
    centered-margin()
    button-emp2()
    margin-top 30px
    width fit-content
</style>

<template>
  <div class="root-page-admin-orders">
    <section class="filters" style="--animation-index: 0">
      <InputSearch class="search" placeholder="Найти заказы..." v-model="filters.searchText" />
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
        v-model="filters.status" />
    </section>

    <section class="orders">
      <div class="row header">
        <div>#</div>
        <div>Номер</div>
        <div>Товары</div>
        <div>Статус</div>
        <div>Пользователь</div>
        <div>Общая сумма</div>
        <div>Создан</div>
        <div>Обновлен</div>
      </div>

      <router-link
        class="row"
        :class="[OrderStatuses[order.status].color]"
        :to="{ name: 'adminOrderEdit', params: { id: order.id } }"
        v-for="order in ordersFiltered"
        :key="order.id"
      >
        <div>{{ order.id }}</div>
        <div>{{ order.number }}</div>
        <div>
          {{ order.goods.reduce((acc, g) => acc + `\n${g.title} x${g.amount}${g.isWeighed ? 'кг' : 'шт'}`, '') }}
        </div>
        <div class="status">{{ OrderStatuses[order.status].title }}</div>
        <div>{{ order.userGivenName }} {{ order.userFamilyName }}</div>
        <div>{{ costFormatter(order.goods.reduce((acc, g) => acc + g.cost * g.amount!, 0)) }}</div>
        <div>{{ dateTimeFormatter(order.createdDate) }}</div>
        <div>{{ dateTimeFormatter(order.updatedDate) }}</div>
      </router-link>

      <div />
      <div />
      <div />
      <div v-if="!ordersFiltered.length && !loading" class="info">Заказов не найдено</div>
      <div />
      <div />
    </section>
    <router-link :to="{ name: 'adminOrderCreate' }" class="button-plus"
      ><img src="/static/icons/plus-thin.svg" alt="plus" />Добавить</router-link
    >

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import SelectList from '~/components/SelectList.vue';
import InputSearch from '~/components/InputSearch.vue';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import { Order, OrderStatus } from '~/utils/models';
import { costFormatter, dateTimeFormatter } from '~/utils/utils';
import { OrderStatuses } from '~/constants';

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
    };
  },

  computed: {
    OrderStatuses() {
      return OrderStatuses;
    },
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
