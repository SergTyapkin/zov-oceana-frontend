<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/buttons.styl'
@import '../styles/components.styl'
@import '../styles/scrollbars.styl'

.root-image-fallback
  position relative
  &.is-loading
    min-height 64px
  .image-placeholder
    position absolute
    inset 0
    overflow hidden
    border-radius inherit
    background colorBlockBgLow
    &::after
      content ''
      position absolute
      inset 0
      background linear-gradient(100deg, transparent 20%, alpha(colorBgLight, .7) 50%, transparent 80%)
      transform translateX(-100%)
      @media (prefers-reduced-motion: no-preference)
        animation image-placeholder-shimmer 1.4s ease-in-out infinite
    @keyframes image-placeholder-shimmer
      to
        transform translateX(100%)
  img
    display block
    width 100%
    height 100%
    object-fit cover
    &.is-hidden
      visibility hidden
</style>

<template>
  <section class="root-image-fallback" :class="{ 'is-loading': !isLoaded && !fallbackFailed }" :aria-busy="!isLoaded && !fallbackFailed">
    <div v-if="!isLoaded && !fallbackFailed" class="image-placeholder" role="status" aria-label="Загрузка изображения" />
    <img
      v-if="!fallbackFailed"
      :key="imageKey"
      ref="image"
      :src="isError ? fallbackSrc : src"
      :alt="alt"
      :class="{ 'is-hidden': !isLoaded }"
      @load="onLoad"
      @error="onError"
    >
    <span v-else class="image-unavailable" role="img" :aria-label="alt || 'Изображение недоступно'">Изображение недоступно</span>
  </section>
</template>

<script lang="ts">
import { nextTick } from 'vue';

export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    fallbackSrc: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      isLoaded: false,
      isError: false,
      fallbackFailed: false,
      imageKey: 0,
    };
  },

  mounted() {
    this.checkCachedImage();
  },

  methods: {
    onLoad() {
      this.isLoaded = true;
    },
    async onError() {
      this.isLoaded = false;
      if (this.isError) {
        this.fallbackFailed = true;
      } else {
        this.isError = true;
        this.imageKey++;
        await nextTick();
        this.checkCachedImage();
      }
    },
    checkCachedImage() {
      const image = this.$refs.image as HTMLImageElement | undefined;
      if (image?.complete && image.naturalWidth > 0) this.onLoad();
    },
    async resetImage() {
      this.isLoaded = false;
      this.isError = false;
      this.fallbackFailed = false;
      this.imageKey++;
      await nextTick();
      this.checkCachedImage();
    },
  },

  watch: {
    src() {
      this.resetImage();
    },
    fallbackSrc() {
      if (this.isError) this.resetImage();
    },
  },
};
</script>
