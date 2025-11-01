<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-category-card
  cursor pointer
  width 100%
  height 100%
  max-height 300px
  min-width 200px
  min-height 200px
  position relative
  text-align left
  overflow hidden

  .background
    img-size(100%)
    position absolute
    inset 0
    object-fit cover
    trans()

  .overlay
    position absolute
    left 0
    right 0
    bottom 0
    background linear-gradient(to top, black, transparent)
    padding 25px 20px
    display flex
    flex-direction column
    gap 10px
    justify-content space-between
    color colorTextInvert1

    .title
      font-medium()
      font-spaced()
      trans()
    .description
      svg-inside()
      font-small-extra()
      font-thin()
    .goods-count
      font-small()
      font-upper()
      font-thin()
      color colorTextInvert4
      trans()

  &:hover
    .background
      transform scale(1.1)
    .overlay
      .title
        margin-bottom 10px
      .goods-count
        margin-bottom 5px
</style>

<template>
  <div class="root-category-card">
    <img class="background" :src="category.previewUrl || IMAGE_DEFAULT" alt="" />

    <section class="overlay">
      <div class="title">{{ category.title }}</div>
      <div v-if="category.description" class="description">{{ category.description }}</div>
      <div v-if="category.goodsCount !== undefined" class="goods-count">{{ category.goodsCount }} товаров</div>
    </section>
  </div>
</template>

<script lang="ts">
import { Category } from '~/utils/models';
import { PropType } from 'vue';
import IMAGE_DEFAULT from '#/images/ocean-bg.jpg';

export default {
  props: {
    category: {
      type: Object as PropType<Category>,
      required: true,
    },
  },

  data() {
    return {
      IMAGE_DEFAULT,
    };
  },
};
</script>
