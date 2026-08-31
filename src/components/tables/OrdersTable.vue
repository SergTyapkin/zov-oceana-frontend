<template>
  <TableWithFilters
    :data="data"
    :table-title="tableTitle"
    :table-on-row-clicked-callback="tableOnRowClickedCallback"
    :table-rows-clickable="tableRowsClickable"
    :row-click-redirect-name="rowClickRedirectName"
    :model-value="modelValue"
    @change="updateModelValue"
    @select="(d: any) => $emit('select', d)"
    :table-info-block-fields="withInfoBlock ? [
      { name: '#', from: 'id' },
      { name: 'Номер', from: 'number' },
      { name: 'Товары', from: 'goods', changer: (goods: Goods[]) => goods.map((g) => `${g.title} ${g.amount}${g.isWeighed ? 'кг' : 'шт'}`).join('\n\n') },
      { name: 'Статус', from: 'status', changer: (status: OrderStatus) => OrderStatuses[status]?.title, colorMatches: statusColorMatches },
      { name: 'Пользователь', from: '', changer: (_: unknown, order: Order) => `#${order.userId} ${order.userGivenName} ${order.userFamilyName}` },
      { name: 'Сумма', from: 'goods', changer: (goods: Goods[]) => costFormatter(goods.reduce((acc, g) => acc + g.cost * g.amount!, 0)) },
      { name: 'Оплата', from: 'paymentStatus', changer: (paymentStatus: PaymentStatus) => PaymentStatuses[paymentStatus]?.title, colorMatches: paymentStatusColorMatches },
    ] : undefined"
    :table-fields="[
      { name: '#', from: 'id' },
      { name: 'Номер', from: 'number' },
      { name: 'Товары', from: 'goods', changer: (goods: Goods[]) => goods.map((g) => `${g.title} ${g.amount}${g.isWeighed ? 'кг' : 'шт'}`).join('\n\n') },
      { name: 'Статус', from: 'status', changer: (status: OrderStatus) => OrderStatuses[status]?.title, colorMatches: statusColorMatches },
      { name: 'Пользователь', from: '', changer: (_: unknown, order: Order) => `#${order.userId} ${order.userGivenName} ${order.userFamilyName}` },
      { name: 'Сумма', from: 'goods', changer: (goods: Goods[]) => costFormatter(goods.reduce((acc, g) => acc + g.cost * g.amount!, 0)) },
      { name: 'Оплата', from: 'paymentStatus', changer: (paymentStatus: PaymentStatus) => PaymentStatuses[paymentStatus]?.title, colorMatches: paymentStatusColorMatches },
    ]"
    :filters="[
      [
        {
          showName: false,
          type: 'search',
          key: 'search',
          compareFoo: (item: Order, filter: string) => 
            new RegExp(filter, 'i')?.test(String(item.number)) || 
            new RegExp(filter, 'i')?.test(`${item.userGivenName} ${item.userFamilyName}`),
        },
      ],
      [
        {
          name: 'Статус',
          type: 'select',
          key: 'status',
          options: Object.entries(OrderStatuses)?.map?.(([key, status]) => ({ name: status.title, value: key })),
          canBeNull: true,
          compareFoo: (item: Order, filter: OrderStatus | null) => filter === null || item.status === filter,
        },
        {
          name: 'Оплата',
          type: 'select',
          key: 'paymentStatus',
          options: Object.entries(PaymentStatuses)?.map?.(([key, status]) => ({ name: status.title, value: key })),
          canBeNull: true,
          compareFoo: (item: Order, filter: PaymentStatus | null) => filter === null || item.paymentStatus === filter,
        },
      ],
    ]"
  >
    <template #filters>
      <slot name="filters" />
    </template>
    <template #table>
      <slot name="table" />
    </template>
  </TableWithFilters>
</template>

<script lang="ts">
import TableWithFilters from '~/components/tables/TableWithFilters.vue';
import { PropType } from 'vue';
import { Order } from '~/utils/models';
import { costFormatter } from '~/utils/utils';
import { OrderStatuses, PaymentStatuses } from '~/constants';

export default {
  components: { TableWithFilters },

  emits: ['change', 'update:modelValue', 'select'],

  props: {
    withInfoBlock: Boolean,
    tableTitle: {
      type: String,
      default: 'Заказы',
    },
    tableOnRowClickedCallback: {
      type: Function as PropType<(row: { [key: string]: any }) => void> | null,
      default: null,
    },
    data: {
      type: Array as PropType<Order[]>,
      required: true,
    },
    rowClickRedirectName: {
      type: String as PropType<string | null>,
      default: null,
    },
    tableRowsClickable: Boolean,
    modelValue: {
      type: Array as PropType<{ [key: string]: any }[] | undefined>,
      default: undefined,
    },
  },

  data() {
    return {
      costFormatter,

      OrderStatuses,
      PaymentStatuses,

      statusColorMatches: {
        [OrderStatuses.created.title]: '#555555',
        [OrderStatuses.accepted.title]: '#ffaa00',
        [OrderStatuses.cancelled.title]: '#d61919',
        [OrderStatuses.delivered.title]: '#1176e1',
        [OrderStatuses.prepared.title]: '#21c61e',
      },
      paymentStatusColorMatches: {
        [PaymentStatuses.new.title]: '#ffaa00',
        [PaymentStatuses.authorized.title]: '#21c61e',
        [PaymentStatuses.confirmed.title]: '#21c61e',
        [PaymentStatuses.cancelled.title]: '#555555',
        [PaymentStatuses.expired.title]: '#d61919',
        [PaymentStatuses.rejected.title]: '#d61919',
        [PaymentStatuses.refunded.title]: '#1176e1',
      },
    };
  },

  computed: {
  },

  methods: {
    updateModelValue() {
      this.$emit('change');
      this.$emit('update:modelValue', this.modelValue);
    },
  },
};
</script>
