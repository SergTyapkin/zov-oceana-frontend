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
      margin-right 5px
    button.delete
      button-attention()
      button-small()

      background none
      img
        margin 0
        img-size(20px)
  .main
    display flex
    justify-content space-between
    gap 20px
    flex-wrap wrap
    padding 20px
    font-small()
    font-thin()
    .row
      flex 1
      display flex
      flex-direction column
      .name
        font-normal()
        white-space nowrap
      .value
        font-small-extra()
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
      {{ addressFormatter(address, 'Адрес') }}
      <button @click="$emit('delete')" class="delete"><img src="/static/icons/trashbox.svg" alt="delete"></button>
    </header>

    <main class="main">
      <div class="row" v-if="address.city">
        <span class="name">Город</span> <span class="value">{{ address.city }}</span>
      </div>
      <div class="row" v-if="address.street">
        <span class="name">Улица</span> <span class="value">{{ address.street }}</span>
      </div>
      <div class="row" v-if="address.house">
        <span class="name">Дом</span> <span class="value">{{ address.house }}</span>
      </div>
      <div class="row" v-if="address.entrance">
        <span class="name">Подъезд</span> <span class="value">{{ address.entrance }}</span>
      </div>
      <div class="row" v-if="address.floor">
        <span class="name">Этаж</span> <span class="value">{{ address.floor }}</span>
      </div>
      <div class="row" v-if="address.apartment">
        <span class="name">Квартира</span> <span class="value">{{ address.apartment }}</span>
      </div>
      <div class="row" v-if="address.code">
        <span class="name">Код домофона</span> <span class="value">{{ address.code }}</span>
      </div>
      <div class="row" v-if="address.comment">
        <span class="name">Комментарий</span> <span class="value">{{ address.comment }}</span>
      </div>

      <button @click="$emit('edit')" class="edit"><img src="/static/icons/edit.svg" alt="edit"></button>
    </main>
  </div>
</template>

<script lang="ts">
import { Address } from '~/utils/models';
import { PropType } from 'vue';
import { addressFormatter } from '~/utils/utils';

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

  methods: { addressFormatter },
};
</script>
