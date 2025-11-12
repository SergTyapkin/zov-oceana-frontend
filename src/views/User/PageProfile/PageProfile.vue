<style lang="stylus" scoped>
@import '../../../styles/constants.styl'
@import '../../../styles/components.styl'
@import '../../../styles/buttons.styl'
@import '../../../styles/fonts.styl'
@import '../../../styles/utils.styl'
@import '../../../styles/animations.styl'
@import '../../../styles/scrollbars.styl'

.root-profile
  page-root()

  padding-top 0

  section.title
  nav.navigation
    page-root-disable()

    width 100vw

  section.title
    page-root()

    display flex
    gap 20px
    width 100vw
    padding-block 70px
    color colorTextInvert1
    background linear-gradient(#00000077, #00000077), url("/static/images/ocean-bg.jpg")
    .avatar
      centered-flex-container()
      font-large-extra()
      animation-float()

      overflow hidden
      width 100px
      min-width 100px
      height 100px
      min-height 100px
      border-radius radiusMax
      background colorEmp2

      @media ({mobile})
        width 80px
        min-width 80px
        height 80px
        min-height 80px
    .username
      font-large-extra-extra()
      font-semibold()
      font-upper()
      animation-float(0.5s, -20px, 0, left)

      margin-bottom 20px
    .info-date
      font-small()
      font-thin()
      animation-float()

      color colorTextInvert3

  nav.navigation
    overflow-x auto
    display flex
    color colorTextInvert1
    text-align center
    box-shadow 0 0 10px colorShadow
    background colorBgDark
    scrollable()
    > *
      display block
      flex 1
      padding 15px 20px
      background colorBgDark
      trans()
      hover-effect()
      animation-float()
      &.router-link-exact-active
        background colorEmp2

  section.profile-main
    margin-top 60px
</style>

<template>
  <div class="root-profile">
    <section class="title">
      <div class="avatar" style="--animation-index: 0">
        {{ $user.givenName?.slice(0, 1) }}{{ $user.familyName?.slice(0, 1) }}
      </div>

      <div>
        <header class="username" style="--animation-index: 1">{{ $user.givenName }} {{ $user.familyName }}</header>
        <div class="info-date" style="--animation-index: 2">Участник с {{ $user.id }}</div>
      </div>
    </section>

    <nav class="navigation">
      <router-link :to="{name: 'profile'}" style="--animation-index: 0">Профиль</router-link>
      <router-link :to="{name: 'profileOrders'}" style="--animation-index: 1">Заказы</router-link>
      <router-link :to="{name: 'profileAddresses'}" style="--animation-index: 2">Адреса</router-link>
      <router-link :to="{name: 'profileSettings'}" style="--animation-index: 3">Настройки</router-link>
    </nav>

    <section class="profile-main">
      <router-view #default="{ Component }">
        <transition name="opacity" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </section>
  </div>
</template>

<script lang="ts">
export default {

  data() {
    return {
    };
  },

  async mounted() {},

  methods: {
  },
};
</script>
