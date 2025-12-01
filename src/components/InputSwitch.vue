<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/buttons.styl'
@import '../styles/components.styl'
@import '../styles/scrollbars.styl'

.input-root
  .title
    font-small()

    color colorText1
    trans()

  .description
    font-small-extra()

    font-style italic
    color colorText4
    trans()

  .input-container
    position relative
    overflow hidden
    width 74px
    height 36px
    margin -20px auto 0 auto

    &:before
      content counter(button-counter)
      counter-increment button-counter
      position absolute
      right 0
      bottom 0
      padding 5px
      font-size 12px
      line-height 1
      color #d7e3e3



    .knobs
    .layer
      cursor pointer
      position absolute
      inset 0


    .checkbox
      cursor pointer
      position relative
      z-index 3
      width 100%
      height 100%
      margin 0
      padding 0
      opacity 0


    .knobs
      z-index 2


    .layer
      z-index 1
      width 100%
      background-color #fcebeb
      transition 0.3s ease all

    .knobs:before
      content "NO"
      position absolute
      top 4px
      left 4px
      width 20px
      height 10px
      padding 9px 4px
      border-radius 2px
      font-size 10px
      font-weight bold
      line-height 1
      color #fff
      text-align center
      background-color colorError
      transition 0.3s ease all, left 0.3s cubic-bezier(0.18, 0.89, 0.35, 1.15)


    input:active + .knobs:before
      width 46px


    input:checked:active + .knobs:before
      margin-left -26px


    input:checked + .knobs:before
      content "YES"
      left 42px
      background-color colorEmp2


    input:checked ~ .layer
      background-color #ebf7fc


  .bottom-container
    font-style italic
    color colorText2
    font-small-extra()

    .bottom-description
      min-width 0
</style>

<template>
  <section class="input-root" :class="{error, success}">
    <header class="title" v-if="title">{{ title }}</header>
    <p v-if="description" class="description">{{ description }}</p>

    <div
      class="input-container"
      @input="onInput"
    >
      <input
        v-model="value"
        type="checkbox"
        autocomplete="off"
        :id="`input-${uid}`"
        ref="input"
      >
      <label class="knobs" :for="`input-${uid}`" />
      <div class="layer" />
    </div>

    <div class="bottom-container">
      <p class="bottom-description">{{ bottomDescription }}</p>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  emits: ['update:modelValue', 'input'],

  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    bottomDescription: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
    error: Boolean,
    success: Boolean,
  },

  data() {
    return {
      value: this.modelValue,

      uid: String(Math.random()).slice(2),
    };
  },

  mounted() {
  },

  methods: {
    onInput() {
      this.$emit('update:modelValue', this.$refs.input.checked);
      this.$emit('input');
    },
  },

  watch: {
    modelValue() {
      this.value = this.modelValue;
    },
  },
};
</script>
