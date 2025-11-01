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
  section
    padding 100px pageMinHorizontalPadding
    margin-inline - pageMinHorizontalPadding
    display flex
    flex-direction column
    align-items center
    gap 30px
    text-align center
    .section-header
      width min-content
      background colorEmp1
      padding 8px 50px
      white-space nowrap
      font-upper()
      font-small-extra()
      font-semibold()
      font-spaced()
    header
      font-large-extra()
      font-semibold()
      font-upper()
    .section-desc
      font-thin()
      width 100%
      max-width 600px


  section.title
    background linear-gradient(#00000077, #00000077), url("/static/images/ocean-bg.jpg")
    color colorTextInvert1
    gap 50px
    .logo
      img-size(90px)
    .title-text
      font-large-extra-extra()
      font-semibold()
      font-upper()
      mark
        background none
        color colorEmp1
    .title-desc
      font-medium()
    .buttons
      display flex
      gap 30px
      .button-market
        button-emp2()
      .button-info
        button-no-fill()

  section.numbers
    display block
    .numbers-list
      list-no-styles()
      display flex
      justify-content space-between
      .number-container
        text-align center
        padding-inline 20px
        .number
          font-large-extra-extra()
          font-bold()
        .desc
          font-thin()

  section.premium
    background colorBgDark
    color colorTextInvert1
    .section-header
      color colorText1
    .carousel
      list-no-styles()
      scrollable()
      overflow-x auto
      scroll-snap-type x mandatory
      scroll-snap-align start
      scroll-snap-stop normal
      display flex
      gap 20px
      width 100%
      align-items center
      justify-content space-between

  section.categories
    padding-inline 0
    .section-header
      background colorBgDark
      color colorTextInvert1
    .categories-container
      list-no-styles()
      //scrollable()
      //overflow-x auto
      //scroll-snap-type x mandatory
      //scroll-snap-align start
      //scroll-snap-stop normal
      display flex
      flex-wrap wrap
      gap 5px
      width 100%
      align-items center
      justify-content center
      .category-card
        display contents
        > *
          flex 1

  section.map
    background colorBgDark
    color colorTextInvert1
    .section-header
      background colorEmp2
    .map-image-container
      .map-image
        img-size(100%)


  section.contacts
    background colorEmp2
    color colorTextInvert1
    .links-container
      list-no-styles()
      display flex
      flex-wrap wrap
      gap 15px
      .link
        background colorBgLight
        width 150px
        height 150px
        padding 60px 60px 20px 20px
        img
          width 100%
          height 100%
          filter invert(1)
</style>

<template>
  <div class="root-page">
    <section class="title">
      <img src="/static/images/logo-big.png" alt="logo" class="logo" />
      <div class="title-text">
        <mark>Премиальное</mark> по <br />
        доступным ценам
      </div>
      <div class="title-desc">Экологически чистые, отборные продукты с доставкой прямо к вашей двери</div>
      <div class="buttons">
        <button class="button-market">в магазин</button>
        <button class="button-info">узнать больше</button>
      </div>
    </section>

    <section class="numbers">
      <ul class="numbers-list">
        <li class="number-container">
          <div class="number">500+</div>
          <div class="desc">товаров</div>
        </li>
        <li class="number-container">
          <div class="number">25+</div>
          <div class="desc">стран</div>
        </li>
        <li class="number-container">
          <div class="number">10К+</div>
          <div class="desc">клиентов</div>
        </li>
        <li class="number-container">
          <div class="number">98%</div>
          <div class="desc">довольны</div>
        </li>
      </ul>
    </section>

    <section class="premium">
      <div class="section-header">Премиум</div>
      <header class="header">Популярные товары</header>
      <div class="section-desc">Откройте для себя нашу отборную коллекцию премиальных морепродуктов со всего мира</div>
      <ul class="carousel">
        <li class="goods-container">
          <GoodsCard
            :goods="{
              id: '123',
              title: 'Лосось',
              fromLocation: 'Норвегия',
              cost: 2450,
              amountLeft: 10,
            }" />
        </li>
        <li class="goods-container">
          <GoodsCard
            :goods="{
              id: '1232',
              title: 'Креветки',
              fromLocation: 'Таиланд',
              cost: 2310,
              amountLeft: 10,
            }" />
        </li>
        <li class="goods-container">
          <GoodsCard
            :goods="{
              id: '1233',
              title: 'Омар',
              fromLocation: 'МЭН. США',
              cost: 6320,
              amountLeft: 10,
            }" />
        </li>
      </ul>
    </section>

    <section class="categories">
      <div class="section-header">Категории</div>
      <header class="header">Выбор по категориям</header>
      <div class="section-desc">Найдите именно то, что ищете</div>
      <ul class="categories-container">
        <li class="category-card">
          <CategoryCard
            :category="{
              id: '1233',
              title: 'Свежая рыба',
              goodsCount: 45,
            }" />
        </li>
        <li class="category-card">
          <CategoryCard
            :category="{
              id: '123',
              title: 'Моллюски',
              goodsCount: 32,
            }" />
        </li>
        <li class="category-card">
          <CategoryCard
            :category="{
              id: '12',
              title: 'Премиум',
              goodsCount: 18,
            }" />
        </li>
        <li class="category-card">
          <CategoryCard
            :category="{
              id: '125',
              title: 'Замороженное',
              goodsCount: 28,
            }" />
        </li>
      </ul>
    </section>

    <section class="map">
      <div class="section-header">Глобальная сеть</div>
      <header class="header">Отечественные поставки</header>
      <div class="section-desc">Отслеживание происхождения наших премиальных морепродуктов</div>
      <div class="map-image-container">
        <img class="map-image" src="/static/images/map.svg" alt="map"/>
      </div>
    </section>

    <section class="contacts">
      <header class="header">Будьте в курсе</header>
      <div class="section-desc">Получайте последние новости о новинках и специальных предложениях</div>
      <ul class="links-container">
        <li class="link">
          <a href="https://vk.com/#" target="_blank">
            <img src="/static/icons/vk-logo.svg" alt="vk" />
          </a>
        </li>
        <li class="link">
          <a href="https://t.me/#" target="_blank">
            <img src="/static/icons/telegram-logo.svg" alt="tg" />
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
import GoodsCard from '~/components/GoodsCard.vue';
import { Category } from '~/utils/models';
import CategoryCard from '~/components/CategoryCard.vue';

export default {
  components: { CategoryCard, GoodsCard },

  data() {
    return {
      categories: [] as Category[],
    };
  },

  mounted() {},

  methods: {},
};
</script>
