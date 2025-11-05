<style scoped lang="stylus">
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-page
  page-root()
  padding-block 0

  section.title
    page-root()
    margin-inline 'min(calc((100vw - %s) / -2), -%s)' % (pageMaxWidth pageMinHorizontalPadding)
    width 100vw
    background linear-gradient(#00000077, #00000077), url("/static/images/ocean-bg.jpg")
    color colorTextInvert1
    padding-block 70px
    .title-button-back
      svg-inside(1lh)
      font-small()
      margin-bottom 20px
      cursor pointer
      img
        trans()
      &:hover
        img
          margin-left 5px
          margin-right 15px
    .header
      font-large-extra-extra()
      font-semibold()
      font-upper()
      margin-bottom 20px
    .title-desc
      font-small()
      font-thin()

  section.goods
    margin-inline auto
    padding-block 50px
    display flex
    gap 15px
    flex-wrap wrap
    justify-content space-evenly
    width 100%
    .goods-card
      flex 1
      animation-float()
</style>

<style scoped lang="stylus">
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>

<template>
  <div class="root-page">
    <section class="title">
      <router-link :to="{name: 'market'}" class="title-button-back">
        <img src="/static/icons/arrow-left.svg" alt="arrow left" />
        Назад к каталогу
      </router-link>
      <header class="header">
        Корзина
      </header>
      <div class="title-desc">{{ $cart.length }} товаров в вашей корзине</div>
    </section>

    <section class="cart">
      <ul class="goods-list">
        <li class="goods" v-for="goods in $cart">
          <img :src="goods.previewUrl || DEFAULT_IMAGE" alt="preview">

          <div class="text-container">
            <header class="title">{{ goods.title }}</header>
            <div class="title">
              <img src="/static/icons/location-dark.svg" alt="location"/>
              {{ goods.fromLocation }}
            </div>
            <div class=""></div>
          </div>

          <div class="right-container">
            <button
              @click="
                $store.dispatch(
                  'SET_CART_GOODS_AMOUNT',
                  {
                    goods: goods,
                    amount: Math.round(Math.max((goods.amount || 0) - 0.1, 0.1) * 10) / 10,
                  }
                )
              "
              class="button-minus"
            >
              -
            </button>
            <div>{{ goods.amount }}</div>
            <button
              @click="
                $store.dispatch(
                  'SET_CART_GOODS_AMOUNT',
                  {
                    goods: goods,
                    amount: Math.round(Math.min((goods.amount || 0) + 0.1, goods.amountLeft || 0) * 10) / 10,
                  }
                )
              "
              class="button-plus"
            >
              +
            </button>
          </div>
        </li>
      </ul>

      <section class="order">
        <article class="total-info-container">
          <header class="header">Итого</header>

        </article>
      </section>
    </section>

    <CircleLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLoading from '~/components/loaders/CircleLoading.vue';

import DEFAULT_IMAGE from '#/images/ocean-bg.jpg';

export default {
  components: { CircleLoading },

  data() {
    return {
      DEFAULT_IMAGE,

      loading: false,
    };
  },

  computed: {
  },

  mounted() {
  },

  methods: {
  },
};
</script>
