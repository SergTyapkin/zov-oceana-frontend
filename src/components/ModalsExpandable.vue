<style lang="stylus" scoped>
close-btn-size = 20px

.modal
  position fixed
  top 0
  left 0
  width 100%
  height 100vh
  z-index 999
  backdrop-filter blur(10px)
  opacity 1
  transition opacity 0.2s ease

  .modal-background
    position fixed
    left 0
    top 0
    width 100%
    height 100vh
    background-color black
    opacity 0.6
  .form
    position fixed
    top 50%
    left 50%
    transform translate(-50%, -50%)
    max-width calc(100vw - 40px)
    max-height calc(100vh - 40px)
    overflow auto

    .close-btn
      position absolute
      color #ffffffff
      right 10px
      top 10px
      width close-btn-size
      height close-btn-size
      transition all 0.2s ease
      cursor pointer
      &:hover
        opacity 0.5

    .inner-container
      w 1

  &.hidden
    opacity 0
    pointer-events none
</style>

<template>
  <div class="modal" :class="{hidden: !isShowed}">
    <div class="modal-background" @click="hide()" />

    <div class="form" ref="form">
      <span class="close-btn" @click="hide()">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/></svg>
      </span>

      <div class="inner-container">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  emits: ['enter'],

  data() {
    return {
      isShowed: false,
      resolvePromise: null as ((value: any) => unknown) | null,
    };
  },

  mounted() {
    window.addEventListener('keydown', this.onkeypress);
  },

  unmounted() {
    this.isShowed = false;
  },

  methods: {
    onkeypress(evt: KeyboardEvent) {
      console.log(evt.key);
      if (evt.key === 'Enter') {
        this.$emit('enter');
      } else if (evt.key == 'Escape') {
        this.hide();
      }
    },

    async show() {
      if (this.isShowed) {
        return this.promise;
      }
      this.isShowed = true;

      await this.$nextTick();

      if (this.$refs.form) {
        this.$refs.form.scrollTop = 0;
      }

      const promise = new Promise((resolve) => {
        this.resolvePromise = resolve;
      });
      this.promise = promise;

      return promise;
    },
    __resolve(value: false | null | any, noWarnings = false) {
      if (!this.isShowed) {
        if (!noWarnings) {
          console.warn('[Modals]: Modal window not showed but tried to be resolved');
        }
        return;
      }

      this.resolvePromise(value);
      this.isShowed = false;
      this.text = '';
    },
    resolve(value, noWarnings = false) {
      this.__resolve(value, noWarnings);
    },
    close(noWarnings = false) {
      this.__resolve(false, noWarnings);
    },
    hide(noWarnings = false) {
      this.__resolve(null, noWarnings);
    },
  }
}
</script>
