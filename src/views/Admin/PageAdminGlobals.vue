<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page
  page-root()
  display flex
  flex-direction column
  gap 30px

  .header-info
    font-upper()
    font-medium()
    margin-bottom 10px

  .block
    padding 10px
    border-bottom 1px solid colorBorder
    box-shadow 0 0 10px colorShadow

  .goods-container
    list-no-styles()
    padding 10px

    display flex
    flex-direction column
    gap 5px
    .goods-one-container
      display flex
      justify-content space-between
      align-items center
      gap 10px
      .title
        font-medium()
        flex 1
      .button-add
      .button-delete
        button-no-fill()
        padding 5px
        img
          margin 0

  .button-save
    button-emp2()
    centered-margin()
    width fit-content
</style>

<template>
  <div class="root-page">
    <InputSwitch
      v-model="isOnMaintenance"
      title="Сайт на техобслуживании?"
      description="В режиме техобслуживания на сайт не сможет зайти вообще никто"
      class="block" />

    <ul class="goods-container block">
      <header class="header-info">Товары на главной странице сайта</header>

      <li class="goods-one-container" v-for="(goodsOne, idx) in goodsOnLanding">
        <div class="title">{{ goodsOne.title }}</div>
        <button class="button-delete" @click="goodsOnLanding.splice(idx, 1)">
          <img src="/static/icons/trashbox.svg" alt="delete" />
        </button>
      </li>
      <li class="goods-one-container">
        <SelectList
          v-model="newGoods"
          :list="
            goods?.map?.(goodsOne => ({
              id: goodsOne.id,
              name: goodsOne.title,
              value: goodsOne,
            }))
          " />
        <button
          class="button-add"
          @click="
            () => {
              const existingIdx = goodsOnLanding.findIndex(g => g.id === newGoods?.id);
              if (newGoods === undefined || existingIdx !== -1) {
                newGoods = undefined;
                return;
              }
              goodsOnLanding.push(newGoods);
              newGoods = undefined;
            }
          ">
          <img src="/static/icons/plus-thin.svg" alt="add" />
        </button>
      </li>
    </ul>

    <div class="block">
      <header class="header-info">Категории товаров</header>
      <PageAdminCategories />
    </div>

    <button class="button-save" @click="updateGlobals">Сохранить изменения</button>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import InputSwitch from '~/components/InputSwitch.vue';
import { Goods } from '~/utils/models';
import SelectList from '~/components/SelectList.vue';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import PageAdminCategories from '~/views/Admin/PageAdminCategories.vue';

export default {
  components: { PageAdminCategories, CircleLinesLoading, SelectList, InputSwitch },

  data() {
    return {
      isOnMaintenance: false,
      goodsOnLanding: [] as Goods[],

      goods: [] as Goods[],

      newGoods: undefined as undefined | Goods,

      loading: false,
    };
  },

  mounted() {
    this.isOnMaintenance = this.$globals.isOnMaintenance;
    this.goodsOnLanding = this.$globals.goodsOnLanding;

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

    async updateGlobals() {
      await this.$request(
        this,
        this.$api.updateGlobals,
        [this.isOnMaintenance, this.goodsOnLanding.map(g => g.id)],
        `Не удалось обновить глобальные данные`,
        () => {
          window.onbeforeunload = null;
          this.$popups.success('Обновлено');
        },
      );
    },
  },
};
</script>
