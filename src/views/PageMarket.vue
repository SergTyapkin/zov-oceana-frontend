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
    page-root-disable()

    width 100vw

  section.title
    gap 50px
    color colorTextInvert1
    background linear-gradient(#00000077, #00000077), url("/static/images/ocean-bg.jpg")
    .header
      font-large-extra-extra()
      font-semibold()
      font-upper()
      animation-float(0.5s, -20px, 0, left)

      margin-bottom 20px
      word-wrap break-word

      @media ({mobile})
        font-large-extra()
    .title-desc
      font-small()
      font-thin()
      animation-float(0.5s, -20px, 0, left)

  section.filters
    padding-block 30px
    box-shadow 0 15px 15px #00000033
    animation-float()
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
    .bottom-row
      font-small-extra()

      width min-content
      margin-top 20px
      padding 5px 10px
      white-space nowrap
      background #f0f9ff

  section.goods
    display flex
    flex-wrap wrap
    gap 15px
    justify-content space-evenly
    width 100%
    margin-inline auto
    padding-block 50px
    .goods-card
      flex 1
      animation-float()
      &.loaded
        animation none
        opacity 1
</style>

<style scoped lang="stylus">
.list-enter-active
.list-leave-active
  transition all 0.3s ease

.list-enter-from
.list-leave-to
  transform scale(0.8)
  opacity 0 !important

</style>

<template>
  <div class="root-page">
    <section class="title">
      <header class="header" style="--animation-index: 0">
        Магазин<br>
        Морепродуктов
      </header>
      <div class="title-desc" style="--animation-index: 1">
        Просмотрите наш полный ассортимент премиальных морепродуктов
      </div>
    </section>

    <section class="filters" style="--animation-index: 0">
      <div class="top-row">
        <div class="input-group">
          <InputSearch class="search" placeholder="Найти продукты..." v-model="filters.searchText" />
          <SelectList
            class="category-selector"
            placeholder="Все категории"
            can-be-null
            :list="
              $categories.map(category => ({
                id: category.id,
                name: category.title,
                value: category.id,
              }))
            "
            :selected-id="filters.categoryId"
            v-model="filters.categoryId"
            @input="saveFilters"
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
          v-for="(goodsOne, i) in goodsFiltered"
          :key="goodsOne.id"
          class="goods-card"
          :class="{loaded: goodsAnimationLoaded}"
          :goods="goodsOne"
          :style="`--animation-index: ${i}`"
        />
      </transition-group>
    </section>

    <CircleLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import GoodsCard from '~/components/GoodsCard.vue';
import { Goods } from '~/utils/models';
import InputSearch from '~/components/InputSearch.vue';
import SelectList from '~/components/SelectList.vue';
import CircleLoading from '~/components/loaders/CircleLoading.vue';

export default {
  components: { CircleLoading, SelectList, InputSearch, GoodsCard },

  data() {
    return {
      goods: [] as Goods[],

      filters: {
        sorting: null as 'name' | 'cost-cheap' | 'cost-expensive' | null,
        searchText: '',
        categoryId: this.$route.query.categoryId as string | undefined,
      },

      loading: false,

      goodsAnimationLoaded: false,
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
    console.log(this.filters.categoryId);
    this.updateGoods();

    setTimeout(() => {this.goodsAnimationLoaded = true}, 3000);
  },

  methods: {
    async updateGoods() {
      this.goods = (
        (await this.$request(this, this.$api.getGoodsList, [], `Не удалось получить список товаров`)) as {
          goods: Goods[];
        }
      ).goods;
    },

    saveFilters() {
      this.$router.replace({name: 'market', query: {categoryId: this.filters.categoryId}});
    },
  },
};
</script>
