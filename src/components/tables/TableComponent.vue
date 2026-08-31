<style lang="stylus" scoped>
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-table
  .table-big-container
    display flex
    gap 15px
    align-items flex-start

    .table-block
      width 100%
      flex 1

      .header-row
        display flex
        justify-content space-between
        margin-bottom 10px

        header
          font-large()
          font-bold()

          margin-right 15px


      .table-container
        overflow-x auto
        width 100%
        scrollable()

        table
          border-collapse collapse
          box-sizing border-box
          width 100%
          border-radius = borderRadiusM
          *
            white-space pre-wrap

          thead
            tr
              color colorText1
              th
                font-small()
                font-semibold()
                padding 16px
                padding-right calc(16px + 1.3em)
                text-align left
                background mix(colorBlockBg, colorBgDark, 90%)
                white-space nowrap
                transition color 0.2s ease
                &:has(img)
                  color colorEmp2
                  padding-right 16px
                img
                  height 1em
                  width 1em
                  padding-top 0.2lh

              th:first-child
                border-radius border-radius 0 0 border-radius

              th:last-child
                border-radius 0 border-radius border-radius 0

          tbody
            tr
              width 100%
              border-bottom 1px solid colorBorder
              hover-effect()
              background mix(colorBgLight, colorBgDark, 100%)
              color colorText1
              &:nth-child(2n)
                background mix(colorBlockBg, colorBgDark, 96%)

              &:hover
                opacity 1
                background mix(colorBlockBg, colorBgDark, 92%)

              &.selected
                background mix(colorEmp1, colorBgLight, 10%)

              td
                &.thin
                  width 0

                > *
                  display block
                  padding 16px
                  font-small-extra()

                .checkbox
                  pointer-events none

                .image-status
                  img-size(25px)

                  margin-left 10px
                  padding 0

                .button-add-row
                  button-no-styles()
                  svg-inside(15px, 0, 0)
                  padding 10px
                  border-radius radiusS
                  background mix(colorSuccess, transparent, 20%)
                  trans()
                  &:hover
                    background mix(colorSuccess, transparent, 30%)
                  &[disabled]
                    opacity 0
                    pointer-events none
                .button-remove-row
                  button-no-styles()
                  svg-inside(20px, 0, 0)
                  padding 7px
                  border-radius radiusS
                  background mix(colorError, transparent, 20%)
                  trans()
                  &:hover
                    background mix(colorError, transparent, 30%)
                  &[disabled]
                    opacity 0
                    pointer-events none

        .no-data-info
          width 100%
          padding 10px 0
          color colorText2
          text-align center

    .info-block
      block-bg-shadow()

      .row
        font-medium()

        display flex
        gap 10px
        align-items center
        justify-content space-between

        &:not(:last-child)
          margin-bottom 15px

        .name
          color colorText2

    @media ({mobile})
      flex-direction column-reverse
      align-items stretch

  .paginator
    margin-top 15px
</style>

<template>
  <section class="root-table">
    <section class="table-big-container">
      <div class="table-block">
        <div class="header-row">
          <header>{{ title }}</header>
          <slot />
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th v-if="statusImages !== null" />
                <th v-if="modelValue !== undefined" />
                <th 
                  v-for="(field, idx) in fields"
                  @click="() => {
                    if (idx !== currentSortingFieldIdx) {
                      currentSortingFieldIdx = idx;
                      currentSortingIsDesc = true;
                    } else {
                      currentSortingIsDesc = !currentSortingIsDesc;
                    }
                  }"
                >
                  {{ field.name }}
                  <transition name="opacity" mode="out-in" :duration="150">
                    <img v-if="currentSortingFieldIdx === idx && currentSortingIsDesc" src="/static/icons/chevron-down.svg" alt="sort desc">
                    <img v-else-if="currentSortingFieldIdx === idx && !currentSortingIsDesc" src="/static/icons/chevron-up.svg" alt="sort asc">
                  </transition>
                </th>
                <th v-if="addable" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, idx) in paginatedContent"
                :class="{
                  clickable: clickable | rowClickRedirectName,
                  selected: row === selectedRow || selectedRows.has(row),
                }"
                @click="onClickRow(row)"
              >
                <td v-if="statusImages !== null">
                  <img :src="statusImages[row.status]" alt="status" class="image-status">
                </td>
                <td v-if="modelValue !== undefined">
                  <Checkbox :model-value="selectedRows.has(row)" readonly class="checkbox" />
                </td>
                <td v-for="(field, idx) in fields" :style="{color: field.colorMatches?.[row.values[idx]]}">
                  <component 
                    :is="rowClickRedirectName && !field.preventClicks ? 'router-link' : 'span'"
                    :to="{ name: rowClickRedirectName, params: { id: row.id }, query: redirectQueryParams }"
                  >
                    <span v-if="!field.type || field.type === 'text'">{{ row.values[idx] }}</span>
                    <Checkbox
                      v-else-if="field.type === 'checkbox'"
                      :model-value="row.values[idx]"
                      :readonly="field.disabled"
                      @update:model-value="(value: any) => field.onEdit?.(value, row)"
                    />
                    <InputSwitch
                      v-else-if="field.type === 'switch'"
                      :model-value="row.values[idx]"
                      :readonly="field.disabled"
                      @update:model-value="(value: any) => field.onEdit?.(value, row)"
                    />
                  </component>
                </td>
                <td v-if="addable || removable" class="thin">
                  <button 
                    class="button-remove-row"
                    v-if="removable"
                    @click="onDeleteRow(row, idx)"
                    :disabled="isLoadingRemove === idx"
                  >
                    <img src="/static/icons/trashbox.svg" alt="delete">
                  </button>
                </td>
              </tr>
              <tr v-if="addable">
                <td v-if="statusImages !== null" />
                <td v-if="modelValue !== undefined" />
                <td v-for="field in fields">
                  <span v-if="field.from === undefined || field.addable === false" />
                  <SelectList v-else-if="field.availableValues" v-model="addedRowData[field.from]" :list="field.availableValues" />
                  <InputComponent v-else v-model="addedRowData[field.from]" :placeholder="field.name" />
                </td>
                <td class="thin">
                  <button class="button-add-row" @click="onAddRow" :disabled="isLoadingAdding"><img src="/static/icons/plus-bold.svg" alt="add" /></button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="!content?.length && !addable" class="no-data-info">Нет данных</div>
        </div>
      </div>

      <div class="info-block" v-if="infoBlockFields && selectedRow">
        <div v-for="field in infoBlockFields" class="row">
          <span class="name">{{ field.name }}</span>
          <span class="value">
            {{ field.changer ? field.changer(selectedRow[field.from], selectedRow) : selectedRow[field.from] }}
          </span>
        </div>
      </div>
    </section>

    <Paginator
      v-if="withPaginator"
      class="paginator"
      :max-pages-count="Math.ceil(content.length / rowsPerPage)"
      v-model="selectedPageNum"
      can-show-more
    />
  </section>
</template>

<script lang="ts">
import { PropType } from 'vue';
import Paginator from '~/components/tables/Paginator.vue';
import Checkbox from '~/components/Checkbox.vue';
import SelectList from '~/components/SelectList.vue';
import InputSwitch from '~/components/InputSwitch.vue';
import InputComponent from '../InputComponent.vue';
import { deepClone } from '~/utils/utils.js';

type Field = {
  name: string;
  from?: string | number;
  changer?: (value: any, row: { [key: string]: any }) => unknown;
  type?: 'text' | 'checkbox' | 'switch';
  disabled?: boolean;
  onEdit?: (value: any, row: { [key: string]: any }) => unknown;
  preventClicks?: boolean;
  availableValues?: { name: string, value: any }[];
  addable?: boolean;
  colorMatches?: { [key: string]: string };
};

type RowWithValues = {
  id?: string,
  status?: string,
  values: any[],
  [key: string]: any,
};

export default {
  emits: ['change', 'update:modelValue', 'select', 'add', 'remove'],

  components: { Checkbox, Paginator, InputSwitch, InputComponent, SelectList },

  props: {
    title: {
      type: String,
      default: '',
    },
    infoBlockFields: {
      type: Array as PropType<Field[] | null>,
      default: null,
    },
    fields: {
      type: Array as PropType<Field[]>,
      required: true,
    },
    rowsPerPage: {
      type: Number,
      default: 10,
    },
    content: {
      type: Array as PropType<{[key: string]: any}[]>,
      required: true,
    },
    rowClickRedirectName: {
      type: String as PropType<string | null>,
      default: null,
    },
    redirectQueryParams: {
      type: Object as PropType<{ [key: string]: any }>,
      default: () => ({}),
    },
    statusImages: {
      type: Object as PropType<{[key: string]: string} | null>,
      default: null,
    },
    onRowClickedCallback: {
      type: Function as PropType<(row: {[key: string]: any}) => void> | null,
      default: null,
    },
    clickable: Boolean,
    withPaginator: Boolean,
    addable: Boolean,
    removable: Boolean,
    onAddCallback: {
      type: Function as PropType<(row: {[key: string]: any}) => boolean | Promise<boolean>> | null,
      default: null,
    },
    onRemoveCallback: {
      type: Function as PropType<(row: {[key: string]: any}) => boolean | Promise<boolean>> | null,
      default: null,
    },
    modelValue: {
      type: Array as PropType<{[key: string]: any}[] | undefined>,
      default: undefined,
    }
  },

  data() {
    return {
      selectedRow: null as { [key: string]: any } | null,
      selectedRows: new Set() as Set<{ [key: string]: any }>,

      selectedPageNum: 1,

      currentSortingFieldIdx: null as number | null,
      currentSortingIsDesc: true,

      addedRowData: {},

      isLoadingAdding: false,
      isLoadingRemove: false as false | number,
    };
  },

  computed: {
    changedContent(): RowWithValues[] {
      return this.content.map(row => ({
        ...row,
        id: row.id,
        status: row.status,
        values: (this.fields.map(field => field.changer?.(row[field.from], row) ?? row[field.from])),
      }));
    },
    sortedContent(): RowWithValues[] {
      if (this.currentSortingFieldIdx === null) return this.changedContent;
      const sortingReverseCoeff = this.currentSortingIsDesc ? 1 : -1;

      return this.changedContent.toSorted((rowA, rowB) => {
        const valA = rowA.values[this.currentSortingFieldIdx!];
        const valB = rowB.values[this.currentSortingFieldIdx!];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * sortingReverseCoeff;
        } else {
          try { // strings
            return String(valA).localeCompare(String(valB)) * sortingReverseCoeff;
          } catch { // any others
            return (valA - valB) * sortingReverseCoeff;
          }
        }
      });
    },
    paginatedContent(): RowWithValues[] {
      const pageIdx = this.selectedPageNum - 1;
      return this.sortedContent.slice(this.rowsPerPage * pageIdx, this.rowsPerPage * (pageIdx + 1));
    },
  },

  mounted() {
  },

  methods: {
    async onDeleteRow(row: RowWithValues, idx: number) {
      const data = deepClone(row);
      this.$emit('remove', data);
      this.isLoadingRemove = idx;
      await this.onRemoveCallback?.(data);
      this.isLoadingRemove = false;
    },
    async onAddRow() {
      const data = deepClone(this.addedRowData);
      this.$emit('add', data);
      this.isLoadingAdding = true;
      const res = await this.onAddCallback?.(data);
      this.isLoadingAdding = false;
      if (res) this.addedRowData = {};
    },

    onClickRow(row: RowWithValues) {
      this.onRowClickedCallback?.(row);

      if (!this.modelValue) {
        this.selectedRow = row;
        this.$emit('select', row);
        return;
      }

      if (this.selectedRows.has(row)) {
        this.selectedRows.delete(row);
      } else {
        this.selectedRows.add(row);
      }
      this.updateModelValue(this.content.filter(row => this.selectedRows.has(row)));
    },

    updateModelValue(val: {[key: string]: any}[]) {
      this.$emit('update:modelValue', val);
      this.$emit('change');
    },
  },

  watch: {
    content() {
      this.selectedRow = null;
    },
  },
};
</script>
