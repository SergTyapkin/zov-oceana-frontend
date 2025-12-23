<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-admin-goods
  page-root()

  section.filters
    page-root-disable()
    animation-float()

    margin-inline 0
    @media({mobile})
      margin-inline 0

    .top-row
      display flex
      flex-wrap wrap
      gap 10px
      justify-content space-between
      .input-group
        display flex
        flex 1
        .search
          flex 1
          min-width 150px
        .category-selector
          min-width 150px

  section.goods
    width 100%
    display grid
    grid-template-columns repeat(6, auto)
    grid-row-gap 10px
    align-items center
    box-shadow 0 15px 15px #00000033
    padding 40px 10px
    .row
      display contents
      > *
        trans()
        padding-inline 10px
      &:not(.header):hover
        > *
          opacity 0.6
      &.header
        font-bold()
        > *
          margin-bottom 10px
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
  <div class="root-page-admin-goods">
    <section class="filters" style="--animation-index: 0">
      <div class="top-row">
        <div class="input-group">
          <InputSearch class="search" placeholder="Найти продукты..." v-model="filters.searchText" />
          <SelectList
            class="category-selector"
            placeholder="Все категории"
            can-be-null
            :list="
              $globals?.categories?.map?.(category => ({
                id: category.id,
                name: category.title,
                value: category.id,
              }))
            "
            :selected-id="filters.categoryId"
            v-model="filters.categoryId"
            @input="saveFilters" />
        </div>

        <SelectList
          v-model="filters.sorting"
          :selected-idx="0"
          :list="[
            {
              name: 'Название (А-Я)',
              value: 'name',
            },
            {
              name: 'Цена (сначала дешевые)',
              value: 'cost-cheap',
            },
            {
              name: 'Цена (сначала дорогие)',
              value: 'cost-expensive',
            },
          ]" />
      </div>
    </section>

    <section class="goods">
      <div class="row header">
        <div>#</div>
        <div>Название</div>
        <div>Цена</div>
        <div>Происхождение</div>
        <div>На складе</div>
        <div>В продаже?</div>
      </div>

      <router-link class="row" :to="{name: 'goods', params: {id: goodsOne.id}}" v-for="goodsOne in goodsFiltered" :key="goodsOne.id">
        <div>{{ goodsOne.id }}</div>
        <div>{{ goodsOne.title }}</div>
        <div>{{ costFormatter(goodsOne.cost) }}</div>
        <div>{{ goodsOne.fromLocation }}</div>
        <div>{{ goodsOne.amountLeft }}</div>
        <div><InputSwitch v-model="goodsOne.isOnSale" @click.prevent /></div>
      </router-link>

      <div/>
      <div/>
      <div/>
      <div v-if="!goodsFiltered.length" class="info">Товаров не найдено</div>
      <div/>
      <div/>
    </section>
    <button class="button-plus"><img src="/static/icons/plus-thin.svg" alt="plus" />Добавить</button>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import GoodsCard from '~/components/GoodsCard.vue';
import SelectList from '~/components/SelectList.vue';
import InputSearch from '~/components/InputSearch.vue';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import { Goods } from '~/utils/models';
import { costFormatter } from '~/utils/utils';
import InputSwitch from '~/components/InputSwitch.vue';

export default {
  components: { InputSwitch, CircleLinesLoading, SelectList, InputSearch, GoodsCard },

  data() {
    return {
      goods: [] as Goods[],

      filters: {
        sorting: null as 'name' | 'cost-cheap' | 'cost-expensive' | null,
        searchText: '',
        categoryId: this.$route.query.categoryId as string | undefined,
      },

      loading: false,
    };
  },

  computed: {
    goodsFiltered() {
      return this.goods
        .filter(goods => {
          return (
            (!this.filters.searchText || new RegExp(this.filters.searchText, 'i').test(goods.title)) &&
            (!this.filters.categoryId ||
              goods.categories.findIndex(c => String(c.id) === String(this.filters.categoryId)) !== -1)
          );
        })
        .sort((g1, g2) => {
          if (this.filters.sorting === 'name') {
            return g1.title.localeCompare(g2.title);
          } else if (this.filters.sorting === 'cost-cheap') {
            return Number(g1.cost) - Number(g2.cost);
          } else if (this.filters.sorting === 'cost-expensive') {
            return Number(g2.cost) - Number(g1.cost);
          } else {
            return 0;
          }
        });
    },
  },

  mounted() {
    this.updateGoods();
  },

  methods: {
    costFormatter,

    async updateGoods() {
      this.goods = (
        (await this.$request(this, this.$api.getGoodsList, [], `Не удалось получить список товаров`)) as {
          goods: Goods[];
        }
      ).goods;
    },

    saveFilters() {
      this.$router.replace({ name: 'admin', query: { categoryId: this.filters.categoryId } });
    },
  },

  watch: {
    '$route.query.categoryId'() {
      this.filters.categoryId = this.$route.query.categoryId;
    },
  },
};
</script>
