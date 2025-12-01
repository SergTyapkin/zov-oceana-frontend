<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/buttons.styl'
@import '../styles/components.styl'
@import '../styles/scrollbars.styl'

.root-image-fallback
  img
    display block
    width 100%
    height 100%
    object-fit cover
</style>

<template>
  <section class="root-image-fallback">
    <img v-if="!isLoaded && !isError" :src="src" :alt="alt" @load="isLoaded = true" @error="isError = true">
    <img v-else :src="fallbackSrc" :alt="alt" @load="isLoaded = true">
  </section>
</template>

<script lang="ts">
export default {
  emits: ['update:modelValue', 'input'],

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
    };
  },

  mounted() {
  },

  methods: {
  },

  watch: {
    src() {
      this.isLoaded = false;
      this.isError = false;
    },
  },
};
</script>
