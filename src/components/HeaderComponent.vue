<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-header
  .row-inner
    scrollbars-hidden()
    page-root()
    font-small()

    overflow-x auto
    display flex
    gap 5%
    align-items center
    justify-content space-between
    margin-inline auto
    padding-block 15px
    background colorBgLight

    .left-group
      hover-effect()

      white-space nowrap
      font-upper()
      svg-inside(45px)
      font-medium()
      font-bold-extra()
      .text
        mobile-hidden()

    .center-group
      display flex
      flex 1
      gap 30px
      align-items center
      justify-content center
      font-upper()
      font-medium()
      .button-home
        mobile-hidden()

      > *
        padding 5px 5px
        white-space nowrap
        hover-effect()
        trans()

        &.router-link-active
          color colorEmp2

    .right-group
      display flex
      flex 0
      gap 20px
      align-items center
      .search
        flex 1

      .cart
      .profile
      .menu
        hover-effect()

      .cart
        position relative
        display block
        .goods-number
          centered-flex-container()

          position absolute
          top -10px
          right -10px
          width 16px
          height 16px
          border-radius radiusMax
          font-size 10px
          color colorTextInvert1
          background colorEmp2

      .menu
        img
          img-size(20px)
        button-no-styles()

  .overlay-menu
    position fixed
    z-index 999999
    left 30vw
    inset 0
    padding 40px
    color colorTextInvert1
    background colorBgDark
    trans()
    .bg
      position fixed
      z-index -1
      inset 0
      opacity 0.7
      background colorBgDark
      transition-delay 0.15s
      trans()
    &.hidden
      transform translateX(100%)
      opacity 0
      filter blur(4px)
      .bg
        opacity 0
    a
      display block
      width min-content
      margin-inline auto
      padding 5px 10px
      white-space nowrap
    .header
      font-large()
      font-bold-extra()
      font-upper()
      svg-inside(40px)

      justify-content center
    .nav
      margin-block 20px
      font-medium()
      .header
        font-large()
        font-semibold()

        padding-block 5px
    .button-close
      button-no-fill()
      svg-inside(25px)

      position absolute
      top 30px
      right 0
      &:hover
        background none
</style>

<template>
  <header class="root-header">
    <div class="row-inner">
      <router-link :to="{ name: 'default' }" class="left-group">
        <img class="logo" src="/static/images/logo-small.png" alt="logo">
        <span class="text">Зов океана</span>
      </router-link>

      <div class="center-group">
        <router-link :to="{ name: 'default' }" @click="isOverlayMenuShown = false" class="button-home">Главная</router-link>
        <router-link :to="{ name: 'market' }" @click="isOverlayMenuShown = false">Магазин</router-link>
      </div>

      <div class="right-group">
        <router-link :to="{ name: 'cart' }" class="cart" @click="isOverlayMenuShown = false">
          <img src="/static/icons/cart-dark.svg" alt="cart">
          <div class="goods-number" v-if="$store.state.cart.length">{{ $store.state.cart.length }}</div>
        </router-link>
        <router-link :to="{ name: 'profile' }" class="profile" @click="isOverlayMenuShown = false">
          <img src="/static/icons/profile.svg" alt="profile">
        </router-link>

        <button class="menu" @click="isOverlayMenuShown = true">
          <img src="/static/icons/menu.svg" alt="menu">
        </button>
      </div>
    </div>

    <section class="overlay-menu" :class="{ hidden: !isOverlayMenuShown }">
      <div class="bg" @click="isOverlayMenuShown = false" />

      <header class="header"><img src="/static/images/logo-big.png" alt="logo">Зов океана</header>

      <nav class="nav">
        <header class="header">Навигация</header>
        <router-link :to="{ name: 'default' }" @click="isOverlayMenuShown = false">Главная</router-link>
        <router-link :to="{ name: 'market' }" @click="isOverlayMenuShown = false">Магазин</router-link>
        <router-link :to="{ name: 'profile' }" @click="isOverlayMenuShown = false">Профиль</router-link>
        <router-link :to="{ name: 'cart' }" @click="isOverlayMenuShown = false">Корзина</router-link>
      </nav>

      <nav class="nav">
        <header class="header">Категории</header>
        <router-link
          v-for="category in $categories"
          :to="{ name: 'market', query: { categoryId: category.id } }"
          :key="category.id"
          @click="isOverlayMenuShown = false"
        >
          {{ category.title }}
        </router-link>
      </nav>

      <button class="button-close" @click="isOverlayMenuShown = false">
        <img src="/static/icons/cross.svg" alt="close">
      </button>
    </section>
  </header>
</template>

<script lang="ts">
export default {
  data() {
    return {
      isOverlayMenuShown: false,
    };
  },

  mounted() {},

  methods: {},
};
</script>
