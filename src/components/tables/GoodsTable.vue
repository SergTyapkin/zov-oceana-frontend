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
      { name: 'Название', from: 'title' },
      { name: 'Происхождение', from: 'fromLocation' },
      { name: 'Цена', from: 'cost', changer: costFormatter },
      { name: 'На складе', from: 'amountLeft' },
      { name: 'В продаже', from: 'isOnSale' },
    ] : undefined"
    :table-fields="[
      { name: '#', from: 'id' },
      { name: 'Название', from: 'title' },
      { name: 'Происхождение', from: 'fromLocation' },
      { name: 'Цена', from: 'cost', changer: costFormatter },
      { name: 'На складе', from: 'amountLeft' },
      { name: 'В продаже', from: 'isOnSale', type: 'switch', disabled: true, preventClicks: true,  onEdit: onToggleProductOnSale},
    ]"
    :filters="[
      [
        {
          showName: false,
          type: 'search',
          key: 'search',
          compareFoo: (item: Goods, filter: string) => new RegExp(filter, 'i')?.test(item.title),
        },
      ],
      [
        {
          name: 'Происхождение',
          type: 'select',
          key: 'fromLocation',
          options: (Array.from(new Set(data.map(i => i.fromLocation)))).map(i => ({name: i, value: i})),
          canBeNull: true,
          compareFoo: (item: Goods, filter: string) => filter === null || item.fromLocation === filter,
        },
        {
          name: 'В продаже',
          type: 'select',
          key: 'isOnSale',
          options: [
            { name: 'Да', value: true },
            { name: 'Нет', value: false },
          ],
          canBeNull: true,
          compareFoo: (item: Goods, filter: boolean) => filter === null || item.isOnSale === filter,
        },
        {
          name: 'Деликатес',
          type: 'select',
          key: 'isDelicates',
          options: [
            { name: 'Да', value: true },
            { name: 'Нет', value: false },
          ],
          canBeNull: true,
          compareFoo: (item: Goods, filter: boolean) => item.isDelicates === filter,
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
import { Goods } from '~/utils/models';
import { costFormatter } from '~/utils/utils';

export default {
  components: { TableWithFilters },

  emits: ['change', 'update:modelValue', 'select'],

  props: {
    withInfoBlock: Boolean,
    tableTitle: {
      type: String,
      default: 'Товары',
    },
    tableOnRowClickedCallback: {
      type: Function as PropType<(row: { [key: string]: any }) => void> | null,
      default: null,
    },
    data: {
      type: Array as PropType<Goods[]>,
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

    onToggleProductOnSale: {
      type: Function as PropType<(value: boolean, row: { [key: string]: any }) => void> | null,
      default: null,
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
