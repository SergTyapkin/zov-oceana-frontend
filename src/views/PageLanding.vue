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
    display flex
    flex-direction column
    gap 30px
    align-items center
    padding 100px pageMinHorizontalPadding
    text-align center
    .section-header
      width min-content
      padding 8px 50px
      white-space nowrap
      background colorEmp1
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

    @media ({mobile})
      padding-inline pageMinHorizontalPaddingMobile


  section.title
    page-root-disable()

    gap 20px
    width 100vw
    color colorTextInvert1
    background linear-gradient(#00000077, #00000077), url("/static/images/ocean-bg.jpg")
    .logo
      img-size(200px)
      animation-float(0.5s, 0, 20px, bottom)
    .title-text
      font-large-extra-extra()
      font-semibold()
      font-upper()
      animation-float(0.5s, -20px, 0, left)
      mark
        color colorEmp1
        background none
    .title-desc
      font-medium()
      animation-float(0.5s, -20px, 0, left)
    .buttons
      display flex
      gap 30px
      animation-float()
      .button-market
        button-emp2()
      .button-info
        button-no-fill()

  section.numbers
    animation-float()
    display block
    flex-direction row
    width unset
    margin-inline auto
    .numbers-list
      display flex
      flex-wrap wrap
      gap 20px
      justify-content space-between
      .number-container
        text-align center
        .number
          font-large-extra-extra()
          font-bold()
        .desc
          font-thin()

      @media ({desktop})
        padding-inline 20px

      @media ({mobile})
        gap 40px
        justify-content center
      list-no-styles()

  section.premium
    page-root-disable()

    width 100vw
    color colorTextInvert1
    background colorBgDark
    .section-header
      color colorText1
    .carousel
      list-no-styles()
      scrollable()

      scroll-snap-type x mandatory
      scroll-snap-align start
      scroll-snap-stop normal
      overflow-x auto
      display flex
      gap 20px
      align-items center
      justify-content space-evenly
      width 100vw
      .goods
        flex 1

  section.categories
    page-root-disable()

    padding-inline 0
    .section-header
      color colorTextInvert1
      background colorBgDark
    .categories-container
      list-no-styles()
      // scrollable()
      // overflow-x auto
      // scroll-snap-type x mandatory
      // scroll-snap-align start
      // scroll-snap-stop normal
      display flex
      flex-wrap wrap
      gap 5px
      align-items center
      justify-content center
      width 100%
      .category-card
        display contents
        > *
          flex 1

  section.map
    page-root-disable()

    width 100vw
    color colorTextInvert1
    background colorBgDark
    .section-header
      background colorEmp2
    .map-image-container
      .map-image
        img-size(100%)


  section.contacts
    page-root-disable()

    width 100vw
    color colorTextInvert1
    background colorEmp2
    .links-container
      list-no-styles()

      display flex
      flex-wrap wrap
      gap 15px
      .link
        width 150px
        height 150px
        padding 60px 60px 20px 20px
        background colorBgLight
        img
          width 100%
          height 100%
          filter invert(1)

        @media ({mobile})
          width 100px
          height 100px
          padding 40px 40px 10px 10px
</style>

<template>
  <div class="root-page">
    <section class="title">
      <img src="/static/images/logo-big.png" alt="logo" class="logo" style="--animation-index: 1">
      <div class="title-text" style="--animation-index: 0">
        <mark>Премиальное</mark> по <br>
        доступным ценам
      </div>
      <div class="title-desc" style="--animation-index: 1">
        Экологически чистые, отборные продукты с доставкой прямо к вашей двери
      </div>
      <div class="buttons" style="--animation-index: 3">
        <router-link :to="{ name: 'market' }"><button class="button-market">в магазин</button></router-link>
        <a href="#about"><button class="button-info">узнать больше</button></a>
      </div>
    </section>

    <section class="numbers" id="about" style="--animation-index: 4">
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
      <AutoScroller>
        <ul class="carousel">
          <GoodsCard
            class="goods"
            :goods="{
              id: '123',
              title: 'Лосось',
              fromLocation: 'Норвегия',
              cost: 2450,
              amountLeft: 10,
              characters: {},
            }"
          />
          <GoodsCard
            class="goods"
            :goods="{
              id: '1232',
              title: 'Креветки',
              fromLocation: 'Таиланд',
              cost: 2310,
              amountLeft: 10,
              characters: {},
            }"
          />
          <GoodsCard
            class="goods"
            :goods="{
              id: '1233',
              title: 'Омар',
              fromLocation: 'МЭН. США',
              cost: 6320,
              amountLeft: 10,
              characters: {},
            }"
          />
        </ul>
      </AutoScroller>
    </section>

    <section class="categories">
      <div class="section-header">Категории</div>
      <header class="header">Выбор по категориям</header>
      <div class="section-desc">Найдите именно то, что ищете</div>
      <ul class="categories-container">
        <li v-for="category in $categories" class="category-card">
          <CategoryCard :category="category" />
        </li>
      </ul>
    </section>

    <section class="map">
      <div class="section-header">Глобальная сеть</div>
      <header class="header">Отечественные поставки</header>
      <div class="section-desc">Отслеживание происхождения наших премиальных морепродуктов</div>
      <div class="map-image-container">
        <img class="map-image" src="/static/images/map.svg" alt="map">
      </div>
    </section>

    <section class="contacts">
      <header class="header">Будьте в курсе</header>
      <div class="section-desc">Получайте последние новости о новинках и специальных предложениях</div>
      <ul class="links-container">
        <li class="link">
          <a href="https://vk.com/#" target="_blank">
            <img src="/static/icons/vk-logo.svg" alt="vk">
          </a>
        </li>
        <li class="link">
          <a href="https://t.me/#" target="_blank">
            <img src="/static/icons/telegram-logo.svg" alt="tg">
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
import GoodsCard from '~/components/GoodsCard.vue';
import CategoryCard from '~/components/CategoryCard.vue';
import { setSmoothScrollOnThisPage } from '~/utils/utils';
import AutoScroller from '~/components/AutoScroller.vue';

export default {
  components: { AutoScroller, CategoryCard, GoodsCard },

  data() {
    return {
    };
  },

  mounted() {
    setSmoothScrollOnThisPage();
  },

  methods: {
  },
};
</script>
