<style lang="stylus" scoped>
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-table-with-filters
  page-root-disable()

  .filters
    page-root()

    padding-block 20px
    color colorTextInvert1
    background colorBgDark

  .main
    page-root()

    min-width 0
    background colorBlockBgLow

  .button-submit-1
    button-emp1()
  .button-submit-2
    button-emp2()
</style>

<template>
  <div class="root-table-with-filters">
    <section class="filters">
      <Filters :title="filtersTitle" :fields="filters" :data="data" v-model="filteredData" @input="(values: any) => $emit('filterInput', values)">
        <slot name="filters" />
      </Filters>
    </section>

    <main class="main">
      <TableComponent
        :title="tableTitle"
        class="table"
        :info-block-fields="tableInfoBlockFields"
        :fields="tableFields"
        :content="serverPagination ? data : filteredData"
        :server-pagination="serverPagination"
        :total-rows="totalRows"
        :page="page"
        @page-change="(page: number) => $emit('pageChange', page)"
        :row-click-redirect-name="rowClickRedirectName"
        :redirect-query-params="redirectQueryParams"
        :on-row-clicked-callback="tableOnRowClickedCallback"
        :clickable="tableRowsClickable"
        :addable="addable"
        :removable="removable"
        :on-add-callback="onAddCallback"
        with-paginator
        :sorted-by-column-idx="sortedByColumnIdx"
        :sorted-desc="sortedDesc"
        :model-value="modelValue"
        :rows-per-page="rowsPerPage"
        @change="setValue(modelValue)"
        @select="(d: any) => $emit('select', d)"
        @add="(d: any) => $emit('add', d)"
        @remove="(d: any) => $emit('remove', d)"
      >
        <slot name="table" />
      </TableComponent>
    </main>
  </div>
</template>

<script lang="ts">
import TableComponent from '~/components/tables/TableComponent.vue';
import Filters, { type Filter } from '~/components/tables/Filters.vue';
import { PropType } from 'vue';

type ExtFilter = Filter | {compareFoo: (tableRow: object, filterValue: any, allFilters: any[]) => boolean};

export default {
  emits: ['change', 'update:modelValue', 'select', 'add', 'remove', 'filter-input', 'page-change'],

  components: { Filters, TableComponent },

  props: {
    serverPagination: Boolean,
    totalRows: { type: Number, default: 0 },
    page: { type: Number, default: 1 },
    filters: {
      type: Array as PropType<ExtFilter[][]>,
      required: true,
    },
    tableInfoBlockFields: {
      type: Array as PropType<{[key: string]: any}[] | null>,
      default: null,
    },
    tableFields: {
      type: Array,
      required: true,
    },
    tableTitle: {
      type: String,
      required: true,
    },
    tableOnRowClickedCallback: {
      type: Function as PropType<(row: {[key: string]: any}) => void> | null,
      default: null,
    },
    data: {
      type: Array,
      required: true,
    },
    filtersTitle: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    rowClickRedirectName: {
      type: String as PropType<string | null>,
      default: null,
    },
    redirectQueryParams: {
      type: Object as PropType<{ [key: string]: any }>,
      default: () => ({}),
    },
    tableRowsClickable: Boolean,
    modelValue: {
      type: Array as PropType<{[key: string]: any}[] | undefined>,
      default: undefined,
    },
    addable: Boolean,
    removable: Boolean,
    onAddCallback: {
      type: Function as PropType<(row: {[key: string]: any}) => boolean> | null,
      default: null,
    },
    sortedByColumnIdx: {
      type: Number,
      default: undefined,
    },
    sortedDesc: Boolean,
    rowsPerPage: {
      type: Number,
      default: 10,
    },
  },


  data() {
    return {
      filteredData: [] as any[],
    };
  },

  methods: {
    setValue(val: {[key: string]: any}[]) {
      this.$emit('update:modelValue', val);
      this.$emit('change');
    }
  }
};
</script>
