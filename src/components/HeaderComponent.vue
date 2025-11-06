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
    margin-inline auto
    overflow-x auto
    display flex
    gap 7%
    align-items center
    justify-content space-between
    padding-block 15px
    background colorBgLight
    .left-group
      hover-effect()
      white-space nowrap
      font-upper()
      svg-inside(45px)
      font-medium()
      font-bold-extra()

    .center-group
      display flex
      flex 1
      align-items center
      justify-content center
      gap 30px
      font-upper()
      font-medium()

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
        hover-effect()

      .cart
        display block
        position relative
        .goods-number
          centered-flex-container()
          font-size 10px
          position absolute
          right -10px
          top -10px
          width 16px
          height 16px
          background colorEmp2
          border-radius radiusMax
          color colorTextInvert1
</style>

<template>
  <header class="root-header">
    <div class="row-inner">
      <router-link
        :to="{ name: 'default' }"
        class="left-group"
      >
        <img
          class="logo"
          src="/static/images/logo-small.png"
          alt="logo"
        >
        Зов океана
      </router-link>

      <div class="center-group">
        <router-link :to="{ name: 'default' }">Главная</router-link>
        <router-link :to="{ name: 'market' }">Магазин</router-link>
      </div>

      <div class="right-group">
        <router-link :to="{ name: 'cart' }" class="cart">
          <img src="/static/icons/cart-dark.svg" alt="cart">
          <div class="goods-number" v-if="$store.state.cart.length">{{ $store.state.cart.length }}</div>
        </router-link>
        <router-link :to="{ name: 'profile' }" class="profile"><img src="/static/icons/profile.svg" alt="profile"></router-link>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
export default {
  data() {
    return {
    };
  },

  mounted() {},

  methods: {},
};
</script>
