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

  padding-block 0

  section.title
    page-root()
    page-root-disable()

    width 100vw
    padding-block 70px
    color colorTextInvert1
    background linear-gradient(#00000077, #00000077), url("/static/images/ocean-bg.jpg")
    .title-button-back
      svg-inside(1lh)
      font-small()
      animation-float(0.5s, -20px, 0, left)

      cursor pointer
      margin-bottom 20px
      img
        trans()
      &:hover
        img
          margin-right 15px
          margin-left 5px
    .header
      font-large-extra-extra()
      font-semibold()
      font-upper()
      animation-float(0.5s, -20px, 0, left)
    .address-info
      animation-float(0.5s, -20px, 0, left)
      font-small()
      margin-bottom 30px
      color colorTextInvert2

  section.main
    padding 50px
    padding-bottom 100px
    centered-flex-container()
    .button-go-back
      button-emp2()

      width fit-content
      margin-top 20px
      padding 40px 80px
</style>

<template>
  <div class="root-page">
    <section class="title">
      <router-link :to="{ name: 'default' }" class="title-button-back" style="--animation-index: 0">
        <img src="/static/icons/arrow-left.svg" alt="arrow left">
        На главную
      </router-link>

      <header class="header" style="--animation-index: 1">Оплата отклонена банком</header>
      <div class="address-info">
        <div>Проверьте соединение и попробуйте ещё раз. Также проверьте возможные блокировки проблемы с картой в приложении банка</div>
        <br>
        <div>Чтобы оплатить заказ заново, перейдите на него из раздела "мои заказы"</div>
      </div>
    </section>

    <!-- Больщшая кнопка -->
    <section class="main">
      <router-link :to="{name: 'profileOrders'}" class="button-go-back">Перейти в "мои заказы"</router-link>
    </section>
  </div>
</template>

<script lang="ts">
export default {
  components: { },
};
</script>
