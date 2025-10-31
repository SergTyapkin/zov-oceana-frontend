<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-footer
  margin-top 100px
  color colorText1
  background colorBlockBgEmp1Gradient

  .top-row
    page-root()

    display flex
    gap 10px
    justify-content space-between
    padding-top 40px
    padding-bottom 20px

    .column
      display flex
      flex-direction column

      > *:not(header)
        font-small-extra()
        font-thin()
        hover-effect()

        padding 4px 0

      .logo
        width 150px

        @media ({mobile})
          width 75px

      header
        font-large()

  .bottom-row
    border-top 1px solid colorEmp2
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
        <img class="logo" src="/static/icons/telegram-logo.svg" alt="logo">
        <div class="desc">Премиальное по доступным ценам</div>
      </router-link>

      <section class="column">
        <header>Навигация</header>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
      </section>

      <section class="column">
        <header>Категории</header>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
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
      <div class="bottom-row-bottom">
        <router-link :to="{ name: 'default' }">Политика конфиденциальности</router-link>
        <router-link :to="{ name: 'default' }">Настройка файлов cookie</router-link>
      </div>
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
