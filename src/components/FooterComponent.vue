<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-footer
  page-root()

  width 100vw
  color colorTextInvert1
  background colorBgDark

  .top-row
    display flex
    gap 20px
    justify-content space-between
    max-width pageMaxWidth
    padding-top 60px
    padding-bottom 20px

    .column
      display flex
      flex-direction column
      color colorTextInvert3
      font-spaced()
      font-upper()

      > *:not(header)
        font-small-extra()
        font-thin()
        hover-effect()

        padding 4px 0

      .logo-container
        font-medium()
        font-upper()

        display flex
        gap 10px
        align-items center
        .logo
          width 50px

      header
        font-medium()

        margin-bottom 20px

    @media ({mobile})
      flex-wrap wrap
      padding-top 0
      .logo-column
        width 100%
        padding-bottom 20px

  .bottom-row
    padding-block 50px
    color colorTextInvert5
    text-align center
    font-upper()
    font-small-extra()
    .bottom-row-inner
      page-root()
      font-small()

      display flex
      gap 40px
      padding-top 10px
      padding-bottom 10px

      > *:not(.languages)
        hover-effect()

      .languages
        button
          button-no-styles()
          hover-effect()

          padding-right 10px
</style>

<template>
  <footer class="root-footer">
    <section class="top-row">
      <router-link :to="{ name: 'default' }" class="column logo-column">
        <div class="logo-container">
          <img class="logo" src="/static/images/logo-small.png" alt="logo">
          {{ COMPANY_TITLE }}
        </div>
        <div class="desc">Премиальное по доступным ценам</div>
      </router-link>

      <section class="column">
        <header>Навигация</header>
        <router-link :to="{ name: 'default' }">Главная</router-link>
        <router-link :to="{ name: 'market' }">Магазин</router-link>
        <router-link :to="{ name: 'profile' }">Профиль</router-link>
        <br>
        <router-link :to="{ name: 'delivery' }">Доставка</router-link>
        <router-link :to="{ name: 'refund' }">Возврат</router-link>
      </section>

      <section class="column">
        <header>Категории</header>
        <router-link
          v-for="category in $globals?.categories"
          :to="{ name: 'market', query: { categoryId: category.id } }"
          :key="category.id"
        >
          {{ category.title }}
        </router-link>
      </section>

      <section class="column">
        <header><router-link :to="{ name: 'contacts' }">Контакты</router-link></header>
        <a href="mailto:support@zov-oceana.ru" target="_blank">{{ COMPANY_EMAIL }}</a>
        <a :href="`tel:${COMPANY_PHONE_RAW}`" target="_blank">{{ COMPANY_PHONE }}</a>
        <span>{{ COMPANY_WORK_PLAN }}</span>
        <router-link :to="{ name: 'contacts' }">О компании</router-link>
        
        <br>
        <br>

        <header>Документы</header>

        <router-link :to="{ name: 'offer' }">Договор оферты</router-link>
        <router-link :to="{ name: 'politics' }">Согласие на обработку ПД</router-link>
      </section>
    </section>

    <section class="bottom-row">
      <div class="info">© {{ COMPANY_DATA_UPDATED_YEAR }} {{ COMPANY_TITLE }}. Все права защищены.</div>
      <!--      <div class="bottom-row-bottom">-->
      <!--        <router-link :to="{ name: 'default' }">Политика конфиденциальности</router-link>-->
      <!--        <router-link :to="{ name: 'default' }">Настройка файлов cookie</router-link>-->
      <!--      </div>-->
    </section>
  </footer>
</template>

<script lang="ts">
import { COMPANY_DATA_UPDATED_YEAR, COMPANY_EMAIL, COMPANY_PHONE, COMPANY_PHONE_RAW, COMPANY_TITLE, COMPANY_WORK_PLAN } from '~/constants';

export default {
  data() {
    return {
      COMPANY_PHONE,
      COMPANY_PHONE_RAW,
      COMPANY_EMAIL,
      COMPANY_WORK_PLAN,
      COMPANY_TITLE,
      COMPANY_DATA_UPDATED_YEAR,
    };
  },

  mounted() { },

  methods: {},
};
</script>
