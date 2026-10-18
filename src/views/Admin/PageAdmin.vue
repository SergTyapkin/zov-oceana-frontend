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

  padding-top 0
  nav.navigation
    overflow-x auto
    display flex
    align-items center
    color colorTextInvert1
    text-align center
    background colorBgDark
    box-shadow 0 0 10px colorShadow
    > *
      display block
      flex 1
      padding 15px 20px
      background colorBgDark
      &.router-link-exact-active
        background colorEmp2

      @media ({mobile})
        font-small()

        padding 10px 10px
      trans()
      hover-effect()
      animation-float()

    @media ({mobile})
      display flex
      flex-wrap wrap
    page-root-disable()
    scrollable()

  section.admin-main
    page-root-disable()
    animation-float()


  button
    button-emp2()
</style>

<template>
  <div class="root-page">
    <nav class="navigation">
      <router-link v-if="$user.canEditGoods" :to="{name: 'adminGoods'}" style="--animation-index: 0">Товары</router-link>
      <router-link v-if="$user.canEditOrders" :to="{name: 'adminOrders'}" style="--animation-index: 1">Заказы</router-link>
      <router-link v-if="$user.canEditUsers" :to="{name: 'adminUsers'}" style="--animation-index: 2">Пользователи</router-link>
      <router-link v-if="$user.canEditGlobals" :to="{name: 'adminGlobals'}" style="--animation-index: 4">Глобальное</router-link>
      <router-link v-if="$user.canExecuteSQL" :to="{name: 'adminSQL'}" style="--animation-index: 5">SQL</router-link>
      <router-link v-if="$user.canEditHistory" :to="{name: 'adminHistory'}" style="--animation-index: 6">История</router-link>
      <!--      <router-link v-if="$user.canEditPartners" :to="{name: 'adminGlobals'}" style="&#45;&#45;animation-index: 4">Партнерство</router-link>-->
    </nav>

    <section class="admin-main" style="--animation-index: 1">
      <router-view #default="{ Component }">
        <transition name="opacity" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </section>
  </div>
</template>

<script lang="ts">
import InputComponent from '~/components/InputComponent.vue';

export default {
  components: { InputComponent },

  data() {
    return {
    };
  },

  mounted() {},

  methods: {
  },
};
</script>
