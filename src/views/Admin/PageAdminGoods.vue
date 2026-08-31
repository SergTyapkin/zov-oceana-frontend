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
  padding-top 0

  .button-plus
    centered-margin()
    button-emp2()

    width fit-content
    margin-top 30px
    margin-bottom 100px
</style>

<template>
  <div class="root-page-admin-goods">
    <GoodsTable
      :data="goods"
      :clickable="false"
      row-click-redirect-name="adminGoodsEdit"
      :on-toggle-product-on-sale="onToggleProductOnSale"
    />
      
    <router-link :to="{name: 'adminGoodsCreate'}" class="button-plus"><img src="/static/icons/plus-thin.svg" alt="plus">Добавить</router-link>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import { Goods } from '~/utils/models';
import GoodsTable from '~/components/tables/GoodsTable.vue';

export default {
  components: { CircleLinesLoading, GoodsTable },

  data() {
    return {
      goods: [] as Goods[],

      loading: false,
    };
  },

  mounted() {
    this.updateGoods();
  },

  methods: {
    async updateGoods() {
      this.goods = (
        (await this.$request(this, this.$api.getAllAdminGoodsList, [], `Не удалось получить список товаров`)) as {
          goods: Goods[];
        }
      ).goods;
    },

    async onToggleProductOnSale(value: boolean, goods: Goods) {
      await this.$request(
        this,
        this.$api.updateGoodsIsOnSale,
        [goods.id, value],
        `Не удалось обновить состояние товара`,
        () => {goods.isOnSale = value},
      );
    },
  },
};
</script>
