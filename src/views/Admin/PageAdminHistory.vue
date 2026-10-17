<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-admin-history
  page-root()

  padding-top 0
</style>

<template>
  <div class="root-page-admin-history">
    <HistoryTable 
      :data="history"
      :total-rows="total"
      :page="page"
      @filter-input="updateFilters" 
      @page-change="loadPage"
    />
    <CircleLinesLoading v-if="loading" centered />
    <p v-if="error" role="alert">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import HistoryTable from '~/components/tables/HistoryTable.vue';
import { HistoryRecord, HistoryFilters } from '~/utils/models';

export default {
  components: { CircleLinesLoading, HistoryTable },
  data() {
    return {
      history: [] as HistoryRecord[], 
      total: 0, 
      page: 1,
      limit: 50,
      loading: false,
      error: '', 
      filters: {} as HistoryFilters,
      requestId: 0,
      filterTimer: undefined as ReturnType<typeof setTimeout> | undefined,
    };
  },
  mounted() {
    if (this.$user.canEditUsers) this.loadPage(1);
  },
  beforeUnmount() {
    clearTimeout(this.filterTimer);
    this.requestId++;
  },
  methods: {
    updateFilters(values: Record<string, string | undefined>) {
      clearTimeout(this.filterTimer);
      this.requestId++;
      const filters: HistoryFilters = {};
      for (const key of ['search', 'type', 'userId'] as const) {
        if (values[key]?.trim()) filters[key] = values[key]!.trim();
      }
      if (values.dateStart && values.dateEnd && values.dateStart > values.dateEnd) {
        this.error = 'Начальная дата должна быть не позже конечной';
        this.loading = false;
        return;
      }
      if (values.dateStart) filters.dateStart = new Date(`${values.dateStart}T00:00:00`).toISOString();
      if (values.dateEnd) {
        const end = new Date(`${values.dateEnd}T00:00:00`);
        end.setDate(end.getDate() + 1);
        filters.dateEnd = end.toISOString();
      }
      this.filters = filters;
      this.filterTimer = setTimeout(() => this.loadPage(1), 300);
    },
    async loadPage(page: number) {
      if (!this.$user.canEditUsers) return;
      const requestId = ++this.requestId;
      this.loading = true;
      this.error = '';
      try {
        const result = await this.$api.getHistory({ ...this.filters, limit: this.limit, offset: (page - 1) * this.limit });
        if (requestId !== this.requestId) return;
        if (!result.ok) throw new Error('Не удалось загрузить историю');
        this.history = result.data.history;
        this.total = result.data.total;
        this.page = page;
      } catch {
        if (requestId === this.requestId) this.error = 'Не удалось загрузить историю. Повторите запрос.';
      } finally {
        if (requestId === this.requestId) this.loading = false;
      }
    },
  },
};
</script>
