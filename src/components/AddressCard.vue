<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-address-card
  text-align left
  box-shadow 0 0 10px colorShadow

  .header
    font-medium()

    display flex
    align-items center
    justify-content space-between
    padding 20px
    color colorTextInvert1
    background colorBgDark
    img
      img-size(1lh)
    button.delete
      background none
      img
        margin 0
        img-size(20px)
      button-attention()
      button-small()
  .main
    display flex
    justify-content space-between
    padding 20px
    font-small()
    font-thin()
    button.edit
      button-no-styles()
      hover-effect()

      padding 5px 10px
      img
        img-size(20px)
</style>

<template>
  <div class="root-address-card">
    <header class="header">
      <img src="/static/icons/location.svg" alt="location">
      {{ address.title || 'Адрес доставки' }}
      <button @click="$emit('delete')" class="delete"><img src="/static/icons/trashbox.svg" alt="delete"></button>
    </header>

    <main class="main">
      <div class="address">{{ address.address }}</div>

      <button @click="$emit('edit')" class="edit"><img src="/static/icons/edit.svg" alt="edit"></button>
    </main>
  </div>
</template>

<script lang="ts">
import { Address } from '~/utils/models';
import { PropType } from 'vue';

export default {
  emits: ['edit', 'delete'],

  props: {
    address: {
      type: Object as PropType<Address>,
      required: true,
    },
  },

  data() {
    return {
    };
  },
};
</script>
