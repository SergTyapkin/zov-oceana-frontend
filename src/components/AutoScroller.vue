<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

</style>

<template>
  <section class="root-auto-scroller">
    <slot />
  </section>
</template>

<script lang="ts">
export default {
  props: {
    speed: {
      type: Number,
      default: 1,
    },
    offset: {
      type: Number,
      default: 10,
    },

  },

  data() {
    return {
    };
  },

  mounted() {
    const element = (this.$el as HTMLElement).firstElementChild;
    if (!element) {
      return;
    }
    // Медленная автопрокрутка контейнера внутри
    const scrollScroller = (element: Element) => {
      let scrollDir = Number(element.getAttribute('data-scroll-dir')) || this.speed;
      // console.log("Set scroll on", element, element.scrollLeft, scrollDir)
      if (element.scrollLeft + element.clientWidth >= element.scrollWidth - this.offset) {
        scrollDir = -this.speed;
      } else if (element.scrollLeft <= this.offset) {
        scrollDir = this.speed;
      }
      element.setAttribute('data-scroll-dir', String(scrollDir));
      element.scrollLeft = element.scrollLeft + scrollDir;
      requestAnimationFrame(() => scrollScroller(element));
    }
    scrollScroller(element);
  },

  methods: {
  },
};
</script>
