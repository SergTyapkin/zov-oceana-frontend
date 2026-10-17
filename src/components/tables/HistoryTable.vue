<template>
  <TableWithFilters
    table-title="История действий"
    :data="data"
    :filters="[
      [
        { name: 'Поиск по описанию', type: 'search', key: 'search' }
      ],
      [
        { name: 'Категория', type: 'select', key: 'type', options: data.map(i => i.type).filter((v, i, a) => a.indexOf(v) === i).map(i => ({ name: i, value: i })), canBeNull: true },
        { name: 'ID пользователя', type: 'text', placeholder: '00', inputType: 'number', key: 'userId' },
        { name: 'С даты', type: 'text', placeholder: 'дд.мм.гг', inputType: 'date', key: 'dateStart' },
        { name: 'По дату', type: 'text', placeholder: 'дд.мм.гг', inputType: 'date', key: 'dateEnd' },
      ],
    ]"
    server-pagination
    :total-rows="totalRows"
    :page="page"
    :sorted-by-column-idx="1"
    :sorted-desc="true"
    @page-change="(page: number) => $emit('pageChange', page)"
    @filter-input="(values: any) => $emit('filterInput', values)"
    :rows-per-page="50"
    table-row-redirect-name="adminUserEdit"
    :table-rows-clickable="true"
    :table-fields="[
      { name: '#', from: 'id' },
      { name: 'Дата', from: 'date', changer: dateTimeFormatter },
      { name: 'ID пользователя', from: 'userId', changer: (id: string) => id || '—' },
      { name: 'Тип', from: 'type' },
      { name: 'Описание', from: 'text' },
    ]"
  />
</template>

<script lang="ts">
import { PropType } from 'vue';
import TableWithFilters from './TableWithFilters.vue';
import { HistoryRecord } from '~/utils/models';
import { dateTimeFormatter } from '~/utils/utils.js';

export default {
  components: { TableWithFilters },
  emits: ['pageChange', 'filterInput'],
  props: {
    totalRows: { type: Number, required: true },
    page: { type: Number, required: true },
    data: { type: Array as PropType<HistoryRecord[]>, required: true },
  },
  methods: {
    dateTimeFormatter,
  },
};
</script>
