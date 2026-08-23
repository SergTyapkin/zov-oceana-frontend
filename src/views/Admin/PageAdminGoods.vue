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

  .header-info
    font-upper()
    font-medium()

    margin-bottom 10px
    text-align center

  section.filters
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

    @media ({mobile})
      margin-inline 0
    page-root-disable()
    animation-float()

  section.goods
    overflow auto
    display grid
    grid-template-columns repeat(6, auto)
    width 100%
    box-shadow 0 15px 15px #00000033
    scrollable()
    .row
      display contents
      > *
        display flex
        align-items center
        width 100%
        height 100%
        padding 15px 10px
        text-align left
        trans()

        @media ({mobile})
          padding 15px 3px

        @media ({desktop})
          &:first-child
            padding-left 25px
          &:last-child
            padding-right 25px
      &:nth-child(2n)
        > *
          background mix(colorBlockBg, transparent, 30%)
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

    width fit-content
    margin-top 30px
    margin-bottom 100px
</style>

<template>
  <div class="root-page-admin-goods">
    <header class="header-info">Товары</header>
    <section class="filters" style="--animation-index: 0">
      <div class="top-row">
        <div class="input-group">
          <InputSearch class="search" placeholder="Найти товары..." v-model="filters.searchText" />
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
            @input="saveFilters"
          />
        </div>
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

      <router-link class="row" :to="{name: 'adminGoodsEdit', params: {id: goodsOne.id}}" v-for="goodsOne in goodsFiltered" :key="goodsOne.id">
        <div>{{ goodsOne.id }}</div>
        <div>{{ goodsOne.title }}</div>
        <div>{{ costFormatter(goodsOne.cost) }}</div>
        <div>{{ goodsOne.fromLocation }}</div>
        <div>{{ goodsOne.amountLeft }}</div>
        <div>
          <InputSwitch 
            v-model="goodsOne.isOnSale"
            on-state-title="ДА"
            off-state-title="НЕТ"
            @click="(e) => {e.preventDefault(); onToggleProductOnSale(goodsOne)}"
          />
        </div>
      </router-link>

      <div />
      <div />
      <div />
      <div v-if="!goodsFiltered.length && !loading" class="info">Товаров не найдено</div>
      <div />
      <div />
    </section>
    <router-link :to="{name: 'adminGoodsCreate'}" class="button-plus"><img src="/static/icons/plus-thin.svg" alt="plus">Добавить</router-link>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import SelectList from '~/components/SelectList.vue';
import InputSearch from '~/components/InputSearch.vue';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import { Goods } from '~/utils/models';
import { costFormatter } from '~/utils/utils';
import InputSwitch from '~/components/InputSwitch.vue';

export default {
  components: { InputSwitch, CircleLinesLoading, SelectList, InputSearch },

  data() {
    return {
      goods: [] as Goods[],

      filters: {
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
        .sort((a, b) => a.title.localeCompare(b));
    },
  },

  mounted() {
    this.updateGoods();
  },

  methods: {
    costFormatter,

    async updateGoods() {
      this.goods = (
        (await this.$request(this, this.$api.getAllAdminGoodsList, [], `Не удалось получить список товаров`)) as {
          goods: Goods[];
        }
      ).goods;
    },

    saveFilters() {
      this.$router.replace({ name: 'admin', query: { categoryId: this.filters.categoryId } });
    },

    async onToggleProductOnSale(goods: Goods) {
      await this.$request(
        this,
        this.$api.updateGoodsIsOnSale,
        [goods.id, !goods.isOnSale],
        `Не удалось обновить состояние товара`,
        () => {goods.isOnSale = !goods.isOnSale},
      );
    },
  },

  watch: {
    '$route.query.categoryId'() {
      this.filters.categoryId = this.$route.query.categoryId;
    },
  },
};
</script>
