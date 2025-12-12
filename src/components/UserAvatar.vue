<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-user-avatar
  overflow hidden
  border-radius radiusMax
  width var(--size)
  min-width var(--size)
  height var(--size)
  min-height var(--size)
  @media ({mobile})
    width var(--size-mobile)
    min-width var(--size-mobile)
    height var(--size-mobile)
    min-height var(--size-mobile)

  .generated-avatar
    centered-flex-container()
    font-size calc(var(--size) / 2.5)
    width 100%
    height 100%

    background colorEmp2
    color colorTextInvert1
  .images-container
    width 100%
    height 100%
    img
      display block
      width 100%
      height 100%
      object-fit cover

</style>

<template>
  <section class="root-user-avatar" :style="{'--size': size, '--size-mobile': sizeMobile}">
    <div v-if="!isError" class="images-container">
      <img :src="user.avatarUrl || ''" alt="avatar" @load="isLoaded = true" @error="isError = true">
    </div>
    <div v-else class="generated-avatar">
      {{ user.givenName?.slice(0, 1) }}{{ user.familyName?.slice(0, 1) }}
    </div>
  </section>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { User } from '~/utils/models';

export default {
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    size: {
      type: String,
      default: '30px',
    },
    sizeMobile: {
      type: String,
      default: '30px',
    },
  },

  data() {
    return {
      isLoaded: false,
      isError: false,
    };
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
