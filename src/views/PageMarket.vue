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
    padding 100px pageMinHorizontalPadding
    margin-inline - pageMinHorizontalPadding

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

  section.goods
    padding-block 50px
    display flex
    gap 15px


</style>

<template>
  <div class="root-page">
    <section class="title">
      <header class="header">
        Магазин<br />
        Морепродуктов
      </header>
      <div class="title-desc">Просмотрите наш полный ассортимент премиальных морепродуктов</div>
    </section>

    <section class="filters">
      <div class="top-row">
        <div class="input-group">
          <InputSearch />
          <SelectList :list="[]" />
        </div>

        <SelectList
          :list="categories.map(category => ({

          }))"
        />
      </div>
      <div class="bottom-row">
        <div class="">Найдено {{ goodsFiltered.length }} товаров</div>
      </div>
    </section>

    <section class="goods">
      <GoodsCard :goods="goods" v-for="goods in goodsFiltered" />
    </section>
  </div>
</template>

<script lang="ts">
import GoodsCard from '~/components/GoodsCard.vue';
import { Category, Goods } from '~/utils/models';
import CategoryCard from '~/components/CategoryCard.vue';
import InputSearch from '~/components/InputSearch.vue';
import SelectList from '~/components/SelectList.vue';

export default {
  components: { SelectList, InputSearch, CategoryCard, GoodsCard },

  data() {
    return {
      goods: [] as Goods[],

      categories: [] as Category[],
    };
  },

  computed: {
    goodsFiltered() {
      return this.goods.filter(goods => {
        return true;
      });
    },
  },

  mounted() {},

  methods: {},
};
</script>
