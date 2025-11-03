<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-footer
  color colorTextInvert1
  background colorBgDark

  .top-row
    margin-inline auto
    max-width pageMaxWidth

    display flex
    gap 20px
    justify-content space-between
    padding-top 60px
    padding-bottom 20px

    .column
      color colorTextInvert3
      display flex
      flex-direction column
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
        align-items center
        gap 10px
        .logo
          width 50px

      header
        font-medium()
        margin-bottom 20px

  .bottom-row
    padding-block 50px
    text-align center
    font-upper()
    font-small-extra()
    color colorTextInvert5
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
      <router-link :to="{ name: 'default' }" class="column">
        <div class="logo-container">
          <img class="logo" src="/static/images/logo-small.png" alt="logo">
          Зов океана
        </div>
        <div class="desc">Премиальное по доступным ценам</div>
      </router-link>

      <section class="column">
        <header>Навигация</header>
        <router-link :to="{ name: 'default' }">Главная</router-link>
        <router-link :to="{ name: 'default' }">Магазин</router-link>
        <router-link :to="{ name: 'default' }">Профиль</router-link>
      </section>

      <section class="column">
        <header>Категории</header>
        <router-link :to="{ name: 'default' }">Свежая рыба</router-link>
        <router-link :to="{ name: 'default' }">Моллюски</router-link>
        <router-link :to="{ name: 'default' }">Премиум</router-link>
        <router-link :to="{ name: 'default' }">Замороженные</router-link>
      </section>

      <section class="column">
        <header>Контакты</header>
        <a href="mailto:support@zov-oceana.ru" target="_blank">support@zov-oceana.ru</a>
        <a href="tel:88001234567" target="_blank">8-800-123-4567</a>
        <span>Пн-Пт 9:00-18:00 МСК</span>
      </section>
    </section>

    <section class="bottom-row">
      <div class="info">© 2025 Зов океана. Все права защищены.</div>
      <!--      <div class="bottom-row-bottom">-->
      <!--        <router-link :to="{ name: 'default' }">Политика конфиденциальности</router-link>-->
      <!--        <router-link :to="{ name: 'default' }">Настройка файлов cookie</router-link>-->
      <!--      </div>-->
    </section>
  </footer>
</template>

<script lang="ts">
export default {
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>
