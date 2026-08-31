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
    background colorBgDark
    color colorTextInvert1

  .main
    page-root()
    min-width 0
    background colorBlockBg

  .button-submit-1
    button-emp1()
  .button-submit-2
    button-emp2()
</style>

<template>
  <div class="root-table-with-filters">
    <section class="filters">
      <Filters :title="filtersTitle" :fields="filters" :data="data" v-model="filteredData">
        <slot name="filters" />
      </Filters>
    </section>

    <main class="main">
      <TableComponent
        :title="tableTitle"
        class="table"
        :info-block-fields="tableInfoBlockFields"
        :fields="tableFields"
        :content="filteredData"
        :row-click-redirect-name="rowClickRedirectName"
        :on-row-clicked-callback="tableOnRowClickedCallback"
        :clickable="tableRowsClickable"
        :addable="addable"
        :removable="removable"
        :on-add-callback="onAddCallback"
        with-paginator
        :model-value="modelValue"
        @change="setValue(modelValue)"
        @select="(d: any) => $emit('select', d)"
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
  emits: ['change', 'update:modelValue', 'select'],

  components: { Filters, TableComponent },

  props: {
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
    tableRowsClickable: Boolean,
    modelValue: {
      type: Array as PropType<{[key: string]: any}[] | undefined>,
      default: undefined,
    },
    clickable: Boolean,
    addable: Boolean,
    removable: Boolean,
    onAddCallback: {
      type: Function as PropType<(row: {[key: string]: any}) => boolean> | null,
      default: null,
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
