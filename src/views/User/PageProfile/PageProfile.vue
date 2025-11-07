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

  section.title
  nav.navigation
    margin-inline 'min(calc((100vw - %s) / -2), -%s)' % (pageMaxWidth pageMinHorizontalPadding)
    width 100vw

  section.title
    page-root()
    width 100vw
    padding-block 70px
    background linear-gradient(#00000077, #00000077), url("/static/images/ocean-bg.jpg")
    color colorTextInvert1
    display flex
    gap 20px
    .avatar
      centered-flex-container()
      font-large-extra()
      width 100px
      height 100px
      border-radius radiusMax
      overflow hidden
      background colorEmp2
    .username
      font-large-extra-extra()
      font-semibold()
      font-upper()
      margin-bottom 20px
    .info-date
      font-small()
      font-thin()
      color colorTextInvert3

  nav.navigation
    display flex
    color colorTextInvert1
    text-align center
    box-shadow 0 0 10px colorShadow
    > *
      display block
      flex 1
      padding 15px 20px
      background colorBgDark
      trans()
      hover-effect()
      &.router-link-exact-active
        background colorEmp2

  section.profile-main
    margin-top 60px
</style>

<template>
  <div class="root-profile">
    <section class="title">
      <div class="avatar">
        {{ $user.givenName?.slice(0, 1) }}{{ $user.familyName?.slice(0, 1) }}
      </div>

      <div>
        <header class="username">{{ $user.givenName }} {{ $user.familyName }}</header>
        <div class="info-date">Участник с {{ $user.id }}</div>
      </div>
    </section>

    <nav class="navigation">
      <router-link :to="{name: 'profile'}">Профиль</router-link>
      <router-link :to="{name: 'profileOrders'}">Заказы</router-link>
      <router-link :to="{name: 'profileAddresses'}">Адреса</router-link>
      <router-link :to="{name: 'profileSettings'}">Настройки</router-link>
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
