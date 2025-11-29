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
    cursor pointer
    padding-block 40px
    color colorTextInvert1
    background colorBgDark
    svg-inside(1lh)
    font-small()
    img
      trans()
    &:hover
      img
        margin-right 15px
        margin-left 5px

  section.goods
    display flex
    flex-wrap wrap
    gap 30px
    width 100%
    padding-top 50px
    padding-bottom 100px
    .images-container
      flex 1
      display flex
      flex-direction column
      gap 30px
      min-width 200px
      max-width 400px
      > img
        width 100%

        object-fit contain
        object-position top
      .images-small-container
        display flex
        gap 10px
        overflow-x auto
        > img
          width 50%

    .info-container
      flex 1.2
      .categories-container
        list-no-styles()

        display flex
        flex-wrap wrap
        gap 5px
        margin-bottom 10px
        .category
          padding 2px 8px
          color colorTextInvert1
          background colorBgDark
          font-small-extra()
          hover-effect()
      .header
        font-large-extra()
        font-upper()

        margin-bottom 10px
        line-height 1
      .location
        svg-inside(1lh)
        font-upper()
        font-small()
        font-thin()

        margin-bottom 25px
      .info
        font-upper()
        font-small-extra()
        font-thin()
        font-spaced()

        color colorText3
      .cost
        font-large-extra()
        font-bold-extra()
        font-spaced()

        margin-bottom 20px
      .desc
        font-small()
        font-thin()
        margin-bottom 80px

      .info-header
        font-medium()
        font-upper()

        margin-bottom 10px
      .characters
        list-no-styles()

        display flex
        flex-direction column
        margin-bottom 30px
        .character
          display flex
          justify-content space-between
          padding-block 15px
          border-bottom 1px solid colorBorder
          .title
            font-thin()
            font-upper()
            font-small-extra()
            font-spaced()

            color colorText3
          .value
            font-small-extra()
            font-semibold()
            text-align right

      .amount-selector
        display flex
        align-items center
        justify-content space-between
        width 100%
        max-width 300px
        margin-top 5px
        margin-bottom 20px
        font-large()
        font-bold-extra()
        button
          button-no-fill()

          padding-block 5px
          color colorText1
          font-large()

    section.add-to-cart
      padding 20px
      background colorBlockBg
      .top-row
        display flex
        align-items center
        justify-content space-between
        margin-bottom 12px
        .title
          font-medium()
          font-upper()
        .value
          font-large()
          font-spaced()
          font-bold-extra()
      .button-add-to-cart
        button()

        width 100%
        color colorTextInvert1
        background colorBgDark
</style>

<template>
  <div class="root-page">
    <router-link :to="{ name: 'market' }">
      <section class="title">
        <img src="/static/icons/arrow-left.svg" alt="arrow left">
        Назад к каталогу
      </section>
    </router-link>

    <section class="goods">
      <div class="images-container">
<!--        <img :src="`${IMAGES_URL_BASE_PATH}${goods.images?.[0]?.path}` || IMAGE_DEFAULT" alt="preview">-->
        <img :src="IMAGE_DEFAULT" alt="preview">
        <div class="images-small-container">
          <img v-for="image in goods.images?.slice(1)" :src="IMAGE_DEFAULT" alt="preview">
        </div>
      </div>

      <div class="info-container">
        <ul class="categories-container">
          <router-link
            v-for="category in goods.categories"
            :to="{ name: 'market', query: {categoryId: category.id} }"
            :key="category.id"
          >
            <li class="category">{{ category.title }}</li>
          </router-link>
        </ul>
        <header class="header">{{ goods.title }}</header>
        <p class="location"><img src="/static/icons/location-dark.svg" alt="location">{{ goods.fromLocation }}</p>

        <p class="info">Цена за кг</p>
        <p class="cost">₽{{ goods.cost }}</p>

        <p v-if="goods.description" class="desc">{{ goods.description }}</p>

        <header class="info-header">Характеристики</header>
        <ul class="characters">
          <li class="character">
            <p class="title">Наличие</p>
            <p v-if="goods.amountLeft" class="value">В наличии</p>
            <p v-else class="value">Нет на складе</p>
          </li>
          <li class="character" v-for="(characterValue, characterName) in goods.characters">
            <p class="title">{{ characterName }}</p>
            <p class="value">{{ characterValue }}</p>
          </li>
        </ul>

        <header class="info">Количество (кг)</header>
        <section class="amount-selector">
          <button
            @click="currentAmount = Math.round(Math.max(currentAmount - goods.amountStep, goods.amountMin) * 10) / 10"
            class="button-minus"
          >
            -
          </button>
          <div>{{ currentAmount }}</div>
          <button
            @click="currentAmount = Math.round(Math.min(currentAmount + goods.amountStep, goods.amountLeft) * 10) / 10"
            class="button-plus"
          >
            +
          </button>
        </section>

        <section class="add-to-cart">
          <div class="top-row">
            <p class="title">Итого</p>
            <div class="value">₽{{ Math.round(goods.cost * currentAmount * 100) / 100 }}</div>
          </div>

          <button @click="addToCart" v-if="$cart.findIndex(g => g.id === goods.id) === -1" class="button-add-to-cart">
            <img src="/static/icons/cart.svg" alt="cart">
            Добавить в корзину
          </button>
          <button @click="removeFromCart" v-else class="button-add-to-cart">
            <img src="/static/icons/remove.svg" alt="remove">
            Убрать из корзины
          </button>
        </section>
      </div>
    </section>

    <CircleLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import { Goods } from '~/utils/models';
import CircleLoading from '~/components/loaders/CircleLoading.vue';

import IMAGE_DEFAULT from '#/images/ocean-bg.jpg';
import { IMAGES_URL_BASE_PATH } from '~/constants';

export default {
  components: { CircleLoading },

  data() {
    return {
      goodsId: this.$route.params.id as string,

      goods: {} as Goods,

      loading: false,

      currentAmount: 1,

      IMAGE_DEFAULT,
      IMAGES_URL_BASE_PATH,
    };
  },

  computed: {},

  mounted() {
    this.updateGoods();
  },

  methods: {
    async updateGoods() {
      this.goods = (await this.$request(
        this,
        this.$api.getGoods,
        [this.goodsId],
        `Не удалось получить список товаров`,
      )) as Goods;
      console.log(this.goods);
    },

    addToCart() {
      this.$store.dispatch('ADD_TO_CART', {goods: this.goods, amount: this.currentAmount});
      console.log(this.$cart);
      this.$forceUpdate();
    },

    removeFromCart() {
      this.$store.dispatch('REMOVE_FROM_CART', this.goods);
      this.$forceUpdate();
    }
  },
};
</script>
