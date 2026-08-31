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
      { name: 'Имя', from: '', changer: (_: unknown, user: User) => `${user.familyName} ${user.givenName} ${user.middleName}` },
      { name: 'Телефон', from: 'tel' },
      { name: 'Заказов', from: 'ordersCount' },
      { name: 'Сумма выкупа', from: 'totalOrdersCost', changer: costFormatter },
      { name: 'Статус партнерства', from: 'partnerStatus', changer: (isPartner: boolean | null) => isPartner === false ? '-' : (isPartner ? 'Партнёр' : 'Подал заявку') },
    ] : undefined"
    :table-fields="[
      { name: '#', from: 'id' },
      { name: 'Имя', from: '', changer: (_: unknown, user: User) => `${user.familyName} ${user.givenName} ${user.middleName}` },
      { name: 'Телефон', from: 'tel' },
      { name: 'Заказов', from: 'ordersCount' },
      { name: 'Сумма выкупа', from: 'totalOrdersCost', changer: costFormatter },
      { name: 'Статус партнерства', from: 'partnerStatus', changer: (isPartner: boolean | null) => isPartner === false ? '-' : (isPartner ? 'Партнёр' : 'Подал заявку') },
    ]"
    :filters="[
      [
        {
          showName: false,
          type: 'search',
          key: 'search',
          compareFoo: (item: User, filter: string) => new RegExp(filter, 'i')?.test(`${item.familyName} ${item.givenName} ${item.middleName}`),
        },
      ],
      [
        {
          name: 'Статус партнерства',
          type: 'select',
          key: 'status',
          options: [
            { name: 'Да', value: true },
            { name: 'Нет', value: false },
            { name: 'Подал заявку', value: undefined },
          ],
          canBeNull: true,
          compareFoo: (item: User, filter: boolean | null | undefined) => filter === null || item.partnerStatus === filter,
        }
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
import { User } from '~/utils/models';
import { costFormatter } from '~/utils/utils';

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
      type: Array as PropType<User[]>,
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
