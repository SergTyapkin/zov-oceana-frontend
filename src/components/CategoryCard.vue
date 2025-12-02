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
  position relative
  overflow hidden
  width 100%
  min-width 200px
  height 100%
  min-height 200px
  max-height 300px
  text-align left

  .background
    img-size(100%)

    position absolute
    inset 0
    object-fit cover
    trans()

  .overlay
    position absolute
    right 0
    bottom 0
    left 0
    display flex
    flex-direction column
    gap 10px
    justify-content space-between
    padding 25px 20px
    color colorTextInvert1
    background linear-gradient(to top, black, transparent)

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
  <router-link class="root-category-card" :to="{ name: 'market', query: { categoryId: category.id } }">
    <ImageFallback
      :src="`${IMAGES_URL_BASE_PATH}${category.previewUrl}`"
      :fallback-src="DEFAULT_CATEGORIES_IMAGE"
      alt="preview"
      class="background"
    />

    <section class="overlay">
      <div class="title">{{ category.title }}</div>
      <div v-if="category.description" class="description">{{ category.description }}</div>
      <div v-if="category.goodsCount !== undefined" class="goods-count">{{ category.goodsCount }} товаров</div>
    </section>
  </router-link>
</template>

<script lang="ts">
import { Category } from '~/utils/models';
import { PropType } from 'vue';
import DEFAULT_CATEGORIES_IMAGE from '#/images/ocean-bg.jpg';
import ImageFallback from '~/components/ImageFallback.vue';
import { IMAGES_URL_BASE_PATH } from '~/constants';

export default {
  components: { ImageFallback },
  props: {
    category: {
      type: Object as PropType<Category>,
      required: true,
    },
  },

  data() {
    return {
      IMAGES_URL_BASE_PATH,
      DEFAULT_CATEGORIES_IMAGE,
    };
  },
};
</script>
