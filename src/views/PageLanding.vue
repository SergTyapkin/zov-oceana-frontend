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
</style>

<template>
  <div class="root-page">
    <section class="title">
      <img src="" alt="logo"/>
      <div class="title-text">
        <mark>Премиальное</mark> по <br>
        доступным ценам
      </div>
      <div class="title-desc">
        Экологически чистые, отборные продукты с доставкой прямо к вашей двери
      </div>
      <div class="buttons">
        <button class="button-market">в магазин</button>
        <button class="button-info">узнать больше</button>
      </div>
    </section>

    <section class="numbers">
      <ul class="numbers-list">
        <li class="number-container">
          <span class="number">500+</span>
          <span class="desc">товаров</span>
        </li>
        <li class="number-container">
          <span class="number">25+</span>
          <span class="desc">стран</span>
        </li>
        <li class="number-container">
          <span class="number">10К+</span>
          <span class="desc">клиентов</span>
        </li>
        <li class="number-container">
          <span class="number">98%</span>
          <span class="desc">довольны</span>
        </li>
      </ul>
    </section>

    <section class="premium">
      <div class="section-header">Премиум</div>
      <header>Популярные товары</header>
      <div class="desc">Откройте для себя нашу отборную коллекцию премиальных морепродуктов со всего мира</div>
      <ul class="carousel">
        <li class="goods-container">
          <GoodsCard :goods="{
            id: '123',
            title: 'Лосось',
            fromLocation: 'Норвегия',
            cost: 2450,
            amountLeft: 10,
          }"/>
          <GoodsCard :goods="{
            id: '1232',
            title: 'Креветки',
            fromLocation: 'Таиланд',
            cost: 2310,
            amountLeft: 10,
          }"/>
          <GoodsCard :goods="{
            id: '1233',
            title: 'Омар',
            fromLocation: 'МЭН. США',
            cost: 6320,
            amountLeft: 10,
          }"/>
        </li>
      </ul>
    </section>

    <section class="categories">
      <div class="section-header">Категории</div>
      <header>Выбор по категориям</header>
      <div class="desc">Найдите именно то, что ищете</div>
      <ul class="categories-container">
        <li class="category" v-for="category in categories">
          <img :src="category.previewUrl" alt=""/>
          <div class="overlay">
            <header>{{ category.title }}</header>
            <div class="desc">{{ category.goodsCount }} товаров</div>
          </div>
        </li>
      </ul>
    </section>

    <section class="map">
      <div class="section-header">Глобальная сеть</div>
      <header>Отечественные поставки</header>
      <div class="desc">Отслеживание происхождения наших премиальных морепродуктов</div>
      <div class="map-image-container">
        <!-- TODO: map -->
      </div>
    </section>

    <section class="contacts">
      <header>Будьте в курсе</header>
      <div class="desc">Получайте последние новости о новинках и специальных предложениях</div>
      <ul class="links-container">
        <li class="link">
          <a href="https://vk.com/#" target="_blank">
            <img src="/static/icons/vk-logo.svg" alt="vk"/>
          </a>
        </li>
        <li class="link">
          <a href="https://telegram.com/#" target="_blank">
            <img src="/static/icons/telegram-logo.svg" alt="tg"/>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
import GoodsCard from '~/components/GoodsCard.vue';
import { Category } from '~/utils/models';

export default {
  components: { GoodsCard },

  data() {
    return {
      categories: [] as Category[],
    };
  },

  mounted() {},

  methods: {},
};
</script>
