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

  section.page-title
    page-root()
    page-root-disable()

    cursor pointer
    width 100vw
    padding-block 40px
    color colorTextInvert1
    background colorBgDark
    svg-inside(1lh)
    font-small()
    img
      trans()
    &:hover
      img
        margin-right 15px
        margin-left 5px

  section.documents-main
    page-root-disable()
    animation-float()

    margin-top 60px
</style>

<template>
  <div class="root-page">
    <router-link :to="{ name: 'default' }">
      <section class="page-title">
        <img src="/static/icons/arrow-left.svg" alt="arrow left">
        На главную
      </section>
    </router-link>

    <section class="documents-main" style="--animation-index: 1">
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
  components: {},

  data() {
    return {
    };
  },
};
</script>
