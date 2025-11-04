<style scoped lang="stylus">
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-page
  page-root()
  padding-block 0

  section.title
  section.filters
    page-root()
    margin-inline 'min(calc((100vw - %s) / -2), -%s)' % (pageMaxWidth pageMinHorizontalPadding)
    width 100vw

  section.title
    background linear-gradient(#00000077, #00000077), url("/static/images/ocean-bg.jpg")
    color colorTextInvert1
    gap 50px
    .header
      font-large-extra-extra()
      font-semibold()
      font-upper()
      margin-bottom 20px
    .title-desc
      font-small()
      font-thin()

  section.filters
    padding-block 30px
    box-shadow 0 15px 15px #00000033
    .top-row
      display flex
      gap 10px
      justify-content space-between
      .input-group
        flex 1
        display flex
        .search
          flex 1
    .bottom-row
      font-small-extra()
      background #F0F9FF
      padding 5px 10px
      width min-content
      white-space nowrap
      margin-top 20px

  section.goods
    margin-inline auto
    padding-block 50px
    display flex
    gap 15px
    flex-wrap wrap
    justify-content space-evenly
    width 100%
    .goods-card
      flex 1
      animation-float()
</style>

<style scoped lang="stylus">
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>

<template>
  <div class="root-page">
    <section class="title">
      <header class="header">
        Магазин<br>
        Морепродуктов
      </header>
      <div class="title-desc">Просмотрите наш полный ассортимент премиальных морепродуктов</div>
    </section>

    <section class="filters">
      <div class="top-row">
        <div class="input-group">
          <InputSearch class="search" placeholder="Найти продукты..." v-model="filters.searchText" />
          <SelectList
            placeholder="Все категории"
            can-be-null
            :list="
              categories.map(category => ({
                name: category.title,
                value: category.id,
              }))
            "
            v-model="filters.categoryId"
          />
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
          ]"
        />
      </div>
      <div v-if="filters.searchText || filters.categoryId" class="bottom-row">
        Найдено {{ goodsFiltered.length }} товаров
      </div>
    </section>

    <section class="goods">
      <transition-group name="list">
        <GoodsCard
          v-for="(goods, i) in goodsFiltered"
          :key="goods.id"
          class="goods-card"
          :goods="goods"
          :style="`--animation-index: ${i}`"
        />
      </transition-group>
    </section>

    <CircleLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import GoodsCard from '~/components/GoodsCard.vue';
import { Category, Goods } from '~/utils/models';
import InputSearch from '~/components/InputSearch.vue';
import SelectList from '~/components/SelectList.vue';
import CircleLoading from '~/components/loaders/CircleLoading.vue';

export default {
  components: { CircleLoading, SelectList, InputSearch, GoodsCard },

  data() {
    return {
      goods: [] as Goods[],
      categories: [] as Category[],

      filters: {
        sorting: null as 'name' | 'cost-cheap' | 'cost-expensive' | null,
        searchText: '',
        categoryId: null as string | null,
      },

      loading: false,
    };
  },

  computed: {
    goodsFiltered() {
      console.log(this.filters.categoryId, this.goods);
      return this.goods
        .filter(goods => {
          return (
            (!this.filters.searchText || new RegExp(this.filters.searchText, 'i').test(goods.title)) &&
            (!this.filters.categoryId || goods.categoryId === this.filters.categoryId)
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
    this.updateCategories();
    this.updateGoods();
  },

  methods: {
    async updateCategories() {
      this.categories = (
        (await this.$request(this, this.$api.getCategories, [], `Не удалось получить список категори`)) as {
          categories: Category[];
        }
      ).categories;
    },

    async updateGoods() {
      this.goods = (
        (await this.$request(this, this.$api.getGoods, [], `Не удалось получить список товаров`)) as {
          goods: Goods[];
        }
      ).goods;
    },
  },
};
</script>
