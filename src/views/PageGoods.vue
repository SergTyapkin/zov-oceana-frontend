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
    background colorBgDark
    color colorTextInvert1
    padding-block 40px
    svg-inside(1lh)
    font-small()
    cursor pointer
    img
      trans()
    &:hover
      img
        margin-left 5px
        margin-right 15px

  section.goods
    padding-top 50px
    padding-bottom 100px
    width 100%
    display flex
    flex-wrap wrap
    gap 30px
    .images-container
      max-width 400px
      min-width 200px
      flex 1
      img
        img-size(100%)
        object-fit contain
        object-position top

    .info-container
      flex 1.2
      .categories-container
        list-no-styles()
        display flex
        flex-wrap wrap
        gap 5px
        margin-bottom 10px
        .category
          background colorBgDark
          color colorTextInvert1
          font-small-extra()
          padding 2px 8px
      .header
        font-large-extra()
        font-upper()
        line-height 1
        margin-bottom 10px
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
        margin-bottom 25px
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
          border-bottom 1px solid colorBorder
          padding-block 15px
          display flex
          justify-content space-between
          .title
            font-thin()
            font-upper()
            font-small-extra()
            font-spaced()
            color colorText3
          .value
            font-small-extra()
            font-semibold()

      .amount-selector
        display flex
        align-items center
        justify-content space-between
        margin-top 5px
        max-width 300px
        width 100%
        margin-bottom 20px
        font-large()
        font-bold-extra()
        button
          button-no-fill()
          padding-block 5px
          color colorText1
          font-large()

    section.add-to-cart
      background colorBlockBg
      padding 20px
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
        background colorBgDark
        color colorTextInvert1
        width 100%
</style>

<template>
  <div class="root-page">
    <router-link :to="{ name: 'market' }">
      <section class="title">
        <img src="/static/icons/arrow-left.svg" alt="arrow left" />
        Назад к каталогу
      </section>
    </router-link>

    <section class="goods">
      <div class="images-container">
        <img :src="goods.previewUrl || IMAGE_DEFAULT" alt="preview" />
      </div>

      <div class="info-container">
        <ul class="categories-container">
          <li v-if="goods.categoryName" class="category">{{ goods.categoryName }}</li>
        </ul>
        <header class="header">{{ goods.title }}</header>
        <p class="location"><img src="/static/icons/location-dark.svg" alt="location" />{{ goods.fromLocation }}</p>

        <p class="info">Цена за кг</p>
        <p class="cost">₽{{ goods.cost }}</p>

        <header v-if="goods.description" class="info-header">Описание</header>
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
            @click="currentAmount = Math.round(Math.max(currentAmount - 0.1, 0.1) * 10) / 10"
            class="button-minus"
          >
            -
          </button>
          <div>{{ currentAmount }}</div>
          <button
            @click="currentAmount = Math.round(Math.min(currentAmount + 0.1, goods.amountLeft) * 10) / 10"
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

          <button @click="addToCart" v-if="!$cart.find(g => g.id === goods.id)" class="button-add-to-cart">
            <img src="/static/icons/cart.svg" alt="cart" />
            Добавить в корзину
          </button>
          <button @click="removeFromCart" v-else class="button-add-to-cart">
            <img src="/static/icons/remove.svg" alt="remove" />
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

export default {
  components: { CircleLoading },

  data() {
    return {
      goodsId: this.$route.params.id as string,

      goods: {} as Goods,

      loading: false,

      currentAmount: 1,

      IMAGE_DEFAULT,
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
    },

    addToCart() {
      this.$store.dispatch('ADD_TO_CART', {goods: this.goods, amount: this.currentAmount});
      console.log(this.$cart);
      this.$forceUpdate();
    },

    removeFromCart() {
      this.$store.dispatch('DELETE_FROM_CART', this.goods);
      this.$forceUpdate();
    }
  },
};
</script>
